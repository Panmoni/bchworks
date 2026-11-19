// The reading copy (PAN-414): every translation of a locale as one static
// page, English beside the translation, for a reviewer to read through on any
// device. The reviewer marks units "looks good" or writes a note; the page
// keeps those in the browser and exports them as `<locale>-reading-notes.json`,
// which `pnpm i18n:review <locale> --from <file>` turns into approvals through
// the console's `approve`. Workflow: docs/i18n.md.
import { randomBytes } from "node:crypto";
import { basename, extname } from "node:path";
import { createSatteriMarkdownProcessor } from "@astrojs/markdown-satteri";
import { approve, rate, reportPath } from "./console.mjs";
import { RefusedError, readJson } from "./pipeline.mjs";
import { collect, qaHash } from "./qa.mjs";

export const outDir = (locale) => `i18n-qa/${locale}-reading`;
export const notesFile = (locale) => `${locale}-reading-notes.json`;

const COLLECTIONS = {
	catalog: "UI strings",
	post: "Blog posts",
	guides: "Guides",
	compare: "Comparisons",
	reference: "Reference",
	reports: "Reports",
	chips: "CHIPs",
	upgrades: "Upgrades",
	glossary: "Glossary",
	opcodes: "Opcodes",
	projects: "Directory",
};

/** `{ key, label, rank }` of the area a unit is read in: each page is one. */
const areaOf = (unit) => {
	if (unit.area === "pages") {
		const name = basename(unit.path, extname(unit.path));
		return { key: `pages-${name}`, label: `Page: ${name}`, rank: 1 };
	}
	const known = Object.keys(COLLECTIONS).indexOf(unit.area);
	return {
		key: unit.area,
		label: COLLECTIONS[unit.area] ?? unit.area,
		rank: known === 0 ? 0 : 2 + (known < 0 ? 99 : known),
	};
};

/**
 * The paragraphs of a Markdown body: blocks split on blank lines, keeping a
 * fenced code block whole and an indented continuation (a loose list item)
 * with the block before it.
 */
export const blocks = (md) => {
	const out = [];
	let cur = [];
	let fence = null;
	let blank = false;
	for (const line of md.split(/\r?\n/)) {
		const open = line.match(/^\s*(`{3,}|~{3,})/);
		if (fence) {
			cur.push(line);
			if (open && open[1][0] === fence[0] && open[1].length >= fence.length)
				fence = null;
			continue;
		}
		if (!line.trim()) {
			if (cur.length) out.push(cur.join("\n"));
			cur = [];
			blank = true;
			continue;
		}
		if (blank && !cur.length && /^\s/.test(line) && out.length)
			cur = [out.pop(), ""];
		blank = false;
		if (open) fence = open[1];
		cur.push(line);
	}
	if (cur.length) out.push(cur.join("\n"));
	return out;
};

const ESCAPES = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;",
};
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ESCAPES[c]);

/**
 * The exported notes: one `{ unit, viewHash, verdict, note }` per unit of
 * this copy the reviewer marked good (`verdict: "good"`) or wrote a note on
 * (`verdict: "fix"`), sorted by unit. `store` maps a unit id to what the page
 * saved, `{ viewHash, good, note }`; `current` maps each unit id of this copy
 * to its viewHash, so marks made on text that has since changed are dropped.
 * The page runs this function's own source, so it uses no imports.
 */
export const notesExport = (store, current) =>
	Object.entries(store)
		.filter(
			([id, m]) =>
				m &&
				current[id] !== undefined &&
				m.viewHash === current[id] &&
				(m.good === true ||
					(typeof m.note === "string" && m.note.trim() !== "")),
		)
		.map(([id, m]) => ({
			unit: id,
			viewHash: m.viewHash,
			verdict: m.good === true ? "good" : "fix",
			note: typeof m.note === "string" ? m.note.trim() : "",
		}))
		.sort((a, b) => (a.unit < b.unit ? -1 : a.unit > b.unit ? 1 : 0));

/** The notes in an export file, checked; throws RefusedError when malformed. */
export const parseNotes = (text) => {
	let list;
	try {
		list = JSON.parse(text);
	} catch {
		throw new RefusedError("the notes file is not JSON");
	}
	const ok = (n) =>
		n !== null &&
		typeof n === "object" &&
		typeof n.unit === "string" &&
		typeof n.viewHash === "string" &&
		(n.verdict === "good" || n.verdict === "fix") &&
		typeof n.note === "string";
	if (!Array.isArray(list) || !list.every(ok))
		throw new RefusedError(
			"the notes file is not a list of { unit, viewHash, verdict, note }",
		);
	return list;
};

/**
 * Approves every "good" unit of `notes` through `approve`, which refuses a
 * unit whose draft or English changed since the reading copy showed it.
 * Returns `{ approved: [{ unit, n }], refused: [{ unit, why }], toFix }`,
 * where `toFix` lists every note to act on: the "fix" units, and the notes
 * written on units approved anyway.
 */
export const applyNotes = ({ root, locale, locales, notes, reviewer }) => {
	const approved = [];
	const refused = [];
	for (const { unit, viewHash } of notes.filter((n) => n.verdict === "good"))
		try {
			approved.push({
				unit,
				n: approve({ root, locale, locales, id: unit, viewHash, reviewer }),
			});
		} catch (e) {
			if (!(e instanceof RefusedError)) throw e;
			refused.push({ unit, why: e.message });
		}
	const toFix = notes.filter((n) => n.verdict === "fix" || n.note);
	return { approved, refused, toFix };
};

// ------------------------------------------------------------------ build

/**
 * The QA flag on one string of a unit, `{ severity, reason }`, when the
 * report flags the text the repo holds now. Overlay rows carry no field.
 */
const flagOf = (unit, seg, rows = []) => {
	const field = unit.kind === "overlay" ? "" : seg.field;
	const row = rows.find((r) => (r.field ?? "") === field);
	return row?.verdict === "flag" && row.es === seg.es
		? { severity: row.severity ?? null, reason: row.reason ?? "" }
		: null;
};

const unitRows = async (unit, md, report) => {
	const rows = [];
	for (const seg of unit.segments) {
		const flag = unit.status === "machine" ? flagOf(unit, seg, report) : null;
		if (!seg.body) {
			rows.push({ label: seg.field, flag, en: esc(seg.en), es: esc(seg.es) });
			continue;
		}
		if (unit.segments.length > 1 || flag) rows.push({ label: "body", flag });
		const en = blocks(seg.en);
		const es = blocks(seg.es);
		const pairs =
			en.length === es.length
				? en.map((e, i) => [e, es[i]])
				: [[seg.en, seg.es]];
		for (const [e, s] of pairs)
			rows.push({
				md: true,
				en: (await md.render(e)).code,
				es: (await md.render(s)).code,
			});
		if (en.length !== es.length)
			rows.at(-1).warn =
				`The paragraphs do not line up (English ${en.length}, translation ${es.length}), so the body is shown whole.`;
	}
	return rows;
};

/**
 * The reading copy of `locale`: every fresh `machine` and `reviewed` unit,
 * grouped into areas, with its QA rating from the report. Returns `{ html,
 * areas, stale }`, where `areas` is `[{ key, label, units, machine,
 * reviewed, flags }]` and `stale` counts the machine drafts left out because
 * their English changed. `nonce` is for tests; a real build draws one.
 */
export const buildReading = async ({
	root,
	locale,
	locales,
	only,
	now = new Date(),
	nonce = randomBytes(16).toString("base64"),
}) => {
	const report = readJson(root, reportPath(locale), { rows: [] });
	const byUnit = Map.groupBy(report.rows, (r) => r.unit);
	const { units, stale } = collect({
		root,
		locale,
		locales,
		only,
		statuses: ["machine", "reviewed"],
	});
	const md = await createSatteriMarkdownProcessor({});
	const areas = new Map();
	for (const unit of units) {
		const a = areaOf(unit);
		if (!areas.has(a.key)) areas.set(a.key, { ...a, list: [] });
		const rating =
			unit.status === "machine" ? rate(unit, byUnit.get(unit.id)) : null;
		areas.get(a.key).list.push({
			id: unit.id,
			status: unit.status,
			viewHash: qaHash(unit),
			rating,
			rows: await unitRows(unit, md, byUnit.get(unit.id)),
		});
	}
	const sorted = [...areas.values()].sort(
		(a, b) => a.rank - b.rank || a.label.localeCompare(b.label),
	);
	for (const a of sorted) a.list.sort((x, y) => x.id.localeCompare(y.id));
	const summary = sorted.map((a) => ({
		key: a.key,
		label: a.label,
		units: a.list.length,
		machine: a.list.filter((u) => u.status === "machine").length,
		reviewed: a.list.filter((u) => u.status === "reviewed").length,
		flags: a.list.filter((u) => u.rating?.verdict === "flag").length,
	}));
	const html = page({
		locale,
		areas: sorted,
		summary,
		stale,
		nonce,
		reportAt: report.generatedAt ?? null,
		now,
	});
	return { html, areas: summary, stale };
};

const unitHtml = (u) => {
	const flag = u.rating?.verdict === "flag";
	const cls = [
		"unit",
		u.status,
		flag ? `flag flag-${u.rating.severity ?? "low"}` : "",
	]
		.filter(Boolean)
		.join(" ");
	const tag =
		u.status === "reviewed"
			? '<span class="tag">reviewed</span>'
			: flag
				? `<span class="tag sev">QA flag: ${esc(u.rating.severity ?? "unrated")}</span>`
				: u.rating?.verdict === "unchecked"
					? '<span class="tag">QA unchecked</span>'
					: "";
	const rows = u.rows
		.map(
			(r) =>
				(r.label || r.flag
					? `<div class="label${r.flag ? ` flagged sev-${r.flag.severity ?? "low"}` : ""}">${esc(r.label)}${r.flag ? `<span class="why">QA ${esc(r.flag.severity ?? "flag")}: ${esc(r.flag.reason)}</span>` : ""}</div>`
					: "") +
				(r.en === undefined
					? ""
					: `<div class="pair${r.md ? " md" : ""}"><div class="en" lang="en">${r.en}</div><div class="tr">${r.es}</div></div>`) +
				(r.warn ? `<p class="warn">${esc(r.warn)}</p>` : ""),
		)
		.join("");
	const controls =
		u.status === "machine"
			? `<div class="mark"><label><input type="checkbox" class="good"> Looks good</label><textarea class="note" rows="2" placeholder="Note: what to fix"></textarea></div>`
			: "";
	return `<article class="${cls}" data-id="${esc(u.id)}" data-hash="${esc(u.viewHash)}"><header><code>${esc(u.id)}</code>${tag}</header>${rows}${controls}</article>`;
};

const page = ({ locale, areas, summary, stale, nonce, reportAt, now }) => {
	const total = (k) => summary.reduce((n, a) => n + a[k], 0);
	const index = summary
		.map(
			(a) =>
				`<tr><td><a href="#${esc(a.key)}">${esc(a.label)}</a></td><td>${a.units}</td><td>${a.machine}</td><td>${a.reviewed}</td><td>${a.flags || ""}</td></tr>`,
		)
		.join("");
	const sections = areas
		.map(
			(a) =>
				`<section id="area-${esc(a.key)}" hidden><h2>${esc(a.label)}</h2><p class="meta">${a.list.length} units</p>${a.list.map(unitHtml).join("")}</section>`,
		)
		.join("");
	const current = Object.fromEntries(
		areas.flatMap((a) =>
			a.list
				.filter((u) => u.status === "machine")
				.map((u) => [u.id, u.viewHash]),
		),
	);
	const config = JSON.stringify({
		locale,
		file: notesFile(locale),
		current,
	}).replace(/</g, "\\u003c");
	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: https:; style-src 'unsafe-inline'; script-src 'nonce-${nonce}'">
<title>Reading copy: ${esc(locale)}</title>
<style>${CSS}</style>
</head>
<body>
<header class="bar"><a href="#">Index</a><span id="tally"></span><button type="button" id="export">Export notes</button></header>
<main>
<section id="index"><h1>Reading copy: ${esc(locale)}</h1>
<p class="meta">Generated ${esc(now.toISOString())}. QA report: ${esc(reportAt ?? "none")}.</p>
<table><thead><tr><th>Area</th><th>Units</th><th>Machine</th><th>Reviewed</th><th>QA flags</th></tr></thead>
<tbody>${index}</tbody>
<tfoot><tr><td>Total</td><td>${total("units")}</td><td>${total("machine")}</td><td>${total("reviewed")}</td><td>${total("flags")}</td></tr></tfoot></table>
${stale ? `<p class="warn">Left out: ${stale} machine drafts whose English changed since the draft. Redraft them first.</p>` : ""}
<p class="meta">Mark a unit "Looks good" or write a note. Marks stay in this browser. "Export notes" saves ${esc(notesFile(locale))} for <code>pnpm i18n:review ${esc(locale)} --from ${esc(notesFile(locale))} --reviewer "&lt;name&gt;"</code>.</p>
</section>
${sections}
</main>
<script nonce="${nonce}">
const CONFIG = ${config};
const notesExport = ${notesExport.toString()};
${SCRIPT}
</script>
</body>
</html>
`;
};

const CSS = `
:root{--bg:#fff;--fg:#1d1d1f;--muted:#6b6b70;--line:#e3e3e8;--panel:#f6f6f8;--high:#c62828;--medium:#e08600;--low:#5c6bc0;--accent:#0a7c4a}
@media (prefers-color-scheme:dark){:root{--bg:#141416;--fg:#ececf0;--muted:#9a9aa2;--line:#2c2c31;--panel:#1d1d21;--accent:#4cc38a}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.55 system-ui,-apple-system,sans-serif}
main{max-width:1200px;margin:0 auto;padding:16px}
.bar{position:sticky;top:0;z-index:1;display:flex;gap:16px;align-items:center;padding:8px 16px;background:var(--panel);border-bottom:1px solid var(--line)}
.bar #tally{flex:1;color:var(--muted);font-size:14px}
button{font:inherit;padding:4px 12px;border:1px solid var(--line);border-radius:6px;background:var(--bg);color:var(--fg);cursor:pointer}
a{color:var(--accent)}
table{border-collapse:collapse;width:100%}
th,td{text-align:left;padding:4px 8px;border-bottom:1px solid var(--line)}
td:not(:first-child),th:not(:first-child){text-align:right}
tfoot td{font-weight:600}
.meta{color:var(--muted);font-size:14px}
.unit{border:1px solid var(--line);border-radius:8px;padding:12px;margin:16px 0}
.unit>header{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:8px}
.unit>header code{font-size:13px;color:var(--muted);word-break:break-all}
.tag{font-size:12px;padding:1px 8px;border-radius:10px;background:var(--panel);border:1px solid var(--line)}
.reviewed{opacity:.5}
.flag{border-left:6px solid var(--low)}
.flag-high{border-left-color:var(--high)}
.flag-medium{border-left-color:var(--medium)}
.flag .sev{color:#fff;background:var(--low);border:0}
.flag-high .sev{background:var(--high)}
.flag-medium .sev{background:var(--medium)}
.label.flagged{color:var(--fg)}
.label .why{display:block;font-weight:400;white-space:pre-wrap}
.sev-high .why{color:var(--high)}
.sev-medium .why{color:var(--medium)}
.sev-low .why{color:var(--low)}
.warn{color:var(--medium);font-size:14px}
.label{font-size:12px;font-weight:600;color:var(--muted);margin-top:8px}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:4px 0;border-top:1px dashed var(--line)}
.pair>div{min-width:0;overflow-wrap:anywhere}
.pair:not(.md)>div{white-space:pre-wrap}
.pair .en{color:var(--muted)}
.md :first-child{margin-top:0}
.md :last-child{margin-bottom:0}
.md pre{overflow-x:auto;padding:8px;border-radius:6px;font-size:13px}
.md img{max-width:100%}
.mark{display:flex;flex-wrap:wrap;gap:8px;align-items:flex-start;margin-top:8px;padding-top:8px;border-top:1px solid var(--line)}
.mark textarea{flex:1;min-width:200px;font:inherit;font-size:14px;padding:4px 8px;border:1px solid var(--line);border-radius:6px;background:var(--bg);color:var(--fg)}
.unit.good{border-color:var(--accent)}
@media (max-width:700px){.pair{grid-template-columns:1fr;gap:4px}.pair .en{border-bottom:1px dotted var(--line);padding-bottom:4px}}
`;

// The page script. Marks live in localStorage under one key per locale,
// keyed by unit id, each with the viewHash of the text it is about.
const SCRIPT = `
const KEY = "i18n-reading:" + CONFIG.locale;
let store = {};
try { store = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch { store = {}; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch {} tally(); };
const tally = () => {
	const list = notesExport(store, CONFIG.current);
	const good = list.filter((n) => n.verdict === "good").length;
	document.getElementById("tally").textContent = good + " good, " + (list.length - good) + " to fix";
};
for (const el of document.querySelectorAll("article.machine")) {
	const id = el.dataset.id;
	const hash = el.dataset.hash;
	const good = el.querySelector(".good");
	const note = el.querySelector(".note");
	const mark = store[id] && store[id].viewHash === hash ? store[id] : null;
	if (mark) { good.checked = !!mark.good; note.value = mark.note || ""; el.classList.toggle("good", !!mark.good); }
	const update = () => {
		if (good.checked || note.value.trim()) store[id] = { viewHash: hash, good: good.checked, note: note.value };
		else delete store[id];
		el.classList.toggle("good", good.checked);
		save();
	};
	good.addEventListener("change", update);
	note.addEventListener("input", update);
}
document.getElementById("export").addEventListener("click", () => {
	const list = notesExport(store, CONFIG.current);
	const url = URL.createObjectURL(new Blob([JSON.stringify(list, null, 2) + "\\n"], { type: "application/json" }));
	const a = document.createElement("a");
	a.href = url;
	a.download = CONFIG.file;
	document.body.append(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
});
const show = () => {
	const id = decodeURIComponent(location.hash.slice(1));
	const target = id && document.getElementById("area-" + id);
	const area = target && target.tagName === "SECTION" ? target : document.getElementById("index");
	for (const s of document.querySelectorAll("main>section")) s.hidden = s !== area;
	window.scrollTo(0, 0);
};
addEventListener("hashchange", show);
show();
tally();
`;
