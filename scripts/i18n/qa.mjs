// The QA pass over machine drafts (PAN-412, workflow in docs/i18n.md): every
// fresh `machine` unit of a locale gets deterministic checks, then a model
// review that returns `clean`, `fixed` (with the corrected text) or `flag`.
// `fix` writes the fixed text back and stamps a qaHash in the unit's
// provenance, so an unchanged unit is not checked again. The unit stays
// `machine`, and a `reviewed` unit is never read or written: a person's
// review is the only thing that makes a translation `reviewed`.
import { existsSync, readFileSync } from "node:fs";
import { join, matchesGlob } from "node:path";
import { hashSource } from "../../src/utils/localize.mjs";
import {
	catalogMetaPath,
	catalogPath,
	chunk,
	contentSources,
	docLeaves,
	englishCatalog,
	getAt,
	loadDnt,
	loadStyle,
	loadTerminology,
	messageLeaves,
	OVERLAY_FIELDS,
	PATHS,
	parseDoc,
	readJson,
	rebaseRelative,
	renderDoc,
	replaceTranslationBlock,
	setAt,
	write,
	writeJson,
} from "./pipeline.mjs";
import { dntPattern, escape, mask, outline } from "./protect.mjs";

export const SEVERITIES = ["high", "medium", "low"];
const rank = (s) => (s ? SEVERITIES.length - SEVERITIES.indexOf(s) : 0);
const worst = (list) =>
	list.reduce((a, s) => (rank(s) > rank(a) ? s : a), null);

// ------------------------------------------------------------------ collect

const getIn = (obj, path) =>
	path.reduce((o, k) => (o == null ? undefined : o[k]), obj);

/** The QA hash of a unit: what QA saw, so a change to either side re-checks. */
export const qaHash = (unit) =>
	hashSource(JSON.stringify([unit.sourceHash, unit.segments.map((s) => s.es)]));

/**
 * Every fresh `machine` unit of `locale`, as
 * `{ kind, area, path, key?, id, sourceHash, qaHash?, segments }`, where a
 * segment is `{ field, en, es, body? }`: one string the English and the draft
 * both hold. `id` names the unit in the report. Stale units (the English
 * changed since the draft) are counted, not returned: they need a redraft,
 * not a review.
 */
export const collect = ({ root, locale, locales, only }) => {
	const units = [];
	let stale = 0;
	const wanted = (...paths) => !only || paths.some((p) => matchesGlob(p, only));
	const take = (meta, hash, unit) => {
		if (meta?.status !== "machine") return;
		if (meta.sourceHash !== hash) return void stale++;
		const segments = unit.segments.filter(
			(s) => typeof s.en === "string" && typeof s.es === "string",
		);
		if (segments.length)
			units.push({ ...unit, sourceHash: hash, qaHash: meta.qaHash, segments });
	};

	// Catalog: one unit per message, one segment per string leaf.
	const path = catalogPath(locale);
	if (wanted(catalogPath("en"), path)) {
		const en = englishCatalog(root);
		const tr = readJson(root, path, {});
		const meta = readJson(root, catalogMetaPath(locale), {});
		for (const [key, value] of Object.entries(en)) {
			if (!(key in tr)) continue;
			const segments = messageLeaves(value).map((p) => ({
				field: p.join("."),
				en: p.length ? getIn(value, p) : value,
				es: p.length ? getIn(tr[key], p) : tr[key],
			}));
			take(meta[key], hashSource(JSON.stringify(value)), {
				kind: "catalog",
				area: "catalog",
				path,
				key,
				id: `${path} ${key}`,
				segments,
			});
		}
	}

	// Content: one unit per file, one segment per translated leaf plus the body.
	for (const { collection, source, target, text } of contentSources({
		root,
		locale,
		locales,
	})) {
		if (!wanted(source, target) || !existsSync(join(root, target))) continue;
		const en = parseDoc(text, source);
		const es = parseDoc(readFileSync(join(root, target), "utf8"), target);
		const segments = docLeaves(en.data, collection).map((p) => ({
			field: p.join("."),
			en: getAt(en.data, p),
			es: getIn(es.data, p),
		}));
		// A draft can come from an original in another language.
		const from = en.data.lang ?? "en";
		for (const s of segments) s.from = from;
		if (en.body !== null)
			segments.push({
				field: "body",
				en: en.body,
				es: es.body,
				body: true,
				from,
			});
		take(es.data.translation, hashSource(text), {
			kind: "content",
			from,
			area: collection,
			path: target,
			id: target,
			segments,
		});
	}

	// Overlays: one unit per record field.
	for (const [file, fields] of Object.entries(OVERLAY_FIELDS)) {
		const source = `${PATHS.data}/${file}.json`;
		const target = `${PATHS.overlays}/${locale}/${file}.json`;
		if (!wanted(source, target) || !existsSync(join(root, target))) continue;
		const overlay = readJson(root, target, {});
		for (const record of readJson(root, source, []))
			for (const field of fields) {
				const value = record[field];
				const t = overlay[record.id]?.[field];
				if (typeof value !== "string" || !t) continue;
				const key = `${record.id}.${field}`;
				take(t, hashSource(value), {
					kind: "overlay",
					area: file,
					path: target,
					key,
					record: record.id,
					id: `${target} ${key}`,
					segments: [{ field, en: value, es: t.text }],
				});
			}
	}
	return { units, stale };
};

// ------------------------------------------------------------------- checks

// Accents and case folded away, so "transacción" finds "transacciones".
const fold = (s) =>
	s.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("es");
// Whole words, and not the tail of a domain ("consensus.cash").
const word = (re) => `(?<![\\p{L}\\p{N}])(?<!\\p{L}\\.)${re}(?![\\p{L}\\p{N}])`;

// A word's stem: an infinitive drops -ar/-er/-ir ("enviar" finds "envía",
// "enviado"), and a word of five letters or more its final vowel
// ("billetera" finds "billeteras").
const stem = (w) => {
	if (w.length >= 4 && /[aei]r$/.test(w)) return w.slice(0, -2);
	return w.length >= 5 && /[aeo]$/.test(w) ? w.slice(0, -1) : w;
};

/**
 * The glossary as matchers. An English term matches whole words, any case,
 * with an English plural. Its translation matches as word stems, accent- and
 * case-blind, each free to take an ending ("transacción" finds
 * "transacciones"), so an inflected form passes. A label (a translation in
 * title case for a term that is not kept as is: "Support" → "Ayuda") applies
 * only to a segment that is the label alone; in prose the word is translated
 * by its meaning: a label's rendering opens with a capitalised word that is
 * not in the English term ("Ayuda"), unlike a term kept in its rendering
 * ("NFT inmutable"). With `dnt`, a term that holds a do-not-translate name
 * ("Buy BCH") is marked, so it is read in English with the names left in.
 */
export const glossaryMatchers = (terminology, dnt) =>
	Object.entries(terminology).map(([term, entry]) => {
		const translation =
			typeof entry === "string" ? entry : (entry?.translation ?? "");
		const stems = fold(translation)
			.split(/\s+/)
			.filter(Boolean)
			.map((w) => `${escape(stem(w))}\\p{L}*`);
		const lead = translation.split(/\s+/)[0] ?? "";
		const label = /^\p{Lu}/u.test(lead) && !term.split(/\s+/).includes(lead);
		const en = `${escape(term)}(?:s|es)?`;
		return {
			term,
			translation,
			holdsDnt: Boolean(dnt && new RegExp(dnt.source, "u").test(term)),
			en: new RegExp(label ? `^\\s*${en}\\s*$` : word(en), "iu"),
			es: new RegExp(`(?<![\\p{L}\\p{N}])${stems.join("\\s+")}`, "u"),
		};
	});

// Formal (usted) imperatives that open a sentence. The tú forms differ:
// descarga, elige, asegúrate.
// Compared with accents kept: "seleccione" is usted, "seleccioné" is "I chose".
const USTED_IMPERATIVES = new Set(
	`abra active agregue añada aprenda apoye busque cambie comience compare
	compre comuníquese configure confirme conecte conozca considere consulte
	contacte copie cree deposite descargue descubra elija empiece envíe
	escriba espere evite explore guarde haga ingrese instale intercambie
	introduzca lea lleve mantenga mire obtenga pague pegue presione pruebe
	pulse recuerde retire revise seleccione siga tenga toque únase utilice
	vaya verifique visite`.split(/\s+/),
);
// An accented stem with an -ese/-ase enclitic: asegúrese, regístrese.
const USTED_ENCLITIC = /^\p{L}*[áéíóú]\p{L}*[ae]se$/u;
const SENTENCE_START =
	/(?:^|[.!?:;]\s+|\n\s*(?:[-*+]|\d+[.)])?\s*|\*\*|\s(?=[¡¿]))[¡¿]?(\p{Lu}\p{L}*)/gu;

// Common English words that are not also Spanish words ("has", "a", "no",
// "me" are both, so they are left out).
const ENGLISH = new Set(
	`the and of to is are you your with for this that it its on be can will
	not or from by an as at have which what how more than about into if they
	their there we our was were been but all any each when where who why
	would should could do does also only just these those them then out up`.split(
		/\s+/,
	),
);

const UNIT = String.raw`(?:%|BCH|BTC|sats?|MB|GB|KB|kB|TB|bytes?|US\$|USD|€|x|segundos|minutos|horas|días|meses|años|veces|millones|mil)(?![\p{L}])`;
const NUMBER_RULES = [
	[
		// Three digits after the point is a thousands point (10.000 BCH).
		new RegExp(
			String.raw`(?<![\p{L}\d.,])(?:0\.\d+|\d+\.(?:\d{1,2}|\d{4,}))(?=\s?${UNIT})`,
			"u",
		),
		"medium",
		"decimal point: Spanish uses a decimal comma (0,5 BCH)",
	],
	[
		/(?<![\d.,])[1-9]\d{0,2}(?:,\d{3})+(?![\d]|,\d)/,
		"medium",
		"English thousands comma: use a point from five digits up (12.345) and none below",
	],
	[
		/(?<![\d.,])[1-9]\.\d{3}(?![\d,]|\.\d)/,
		"low",
		"a four-digit number takes no thousands separator (2048)",
	],
	[/\d(?:%| %)/, "low", "a no-break space (U+00A0) goes before %"],
];
const EN_MONTH = String.raw`(?:January|February|March|April|May|June|July|August|September|October|November|December)`;
const ES_MONTH =
	"(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)";
const ES_MONTHS_CAPITALISED = ES_MONTH.slice(3, -1)
	.split("|")
	.map((m) => m[0].toUpperCase() + m.slice(1))
	.join("|");
const DATE_RULES = [
	[
		new RegExp(
			String.raw`${EN_MONTH}\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}|\d{1,2}\s+${EN_MONTH}\s+\d{4}`,
		),
		"medium",
		"English date: write 18 de noviembre de 2026",
	],
	[
		new RegExp(String.raw`${ES_MONTH}\s+\d{1,2},\s*\d{4}`, "iu"),
		"medium",
		"English date order: write 18 de noviembre de 2026",
	],
	[
		new RegExp(String.raw`\d{1,2} de (?:${ES_MONTHS_CAPITALISED})`, "u"),
		"low",
		"months are lowercase in Spanish",
	],
];

const clip = (s, n = 80) => {
	const t = s.replace(/\s+/g, " ").trim();
	return t.length > n ? `${t.slice(0, n - 1)}…` : t;
};

const counts = (list) =>
	list.reduce((m, x) => m.set(x, (m.get(x) ?? 0) + 1), new Map());

/**
 * The deterministic findings for one segment, `{ check, severity, message }[]`.
 * `ctx`: `{ glossary: glossaryMatchers(...), dnt: dntPattern(...) }`.
 */
export const checkSegment = (
	{ en, es, field, body = false, from = "en" },
	ctx,
) => {
	const out = [];
	const add = (check, severity, message) =>
		out.push({ check, severity, message });
	// Code, URLs, tags and do-not-translate names out of the way, so no check
	// reads inside them. A body's soft line breaks become spaces first, so a
	// name wrapped across two lines ("Bitcoin\nCash") is still one name.
	const soft = (s) => (body ? s.replace(/([^\n])\n(?=[^\n])/g, "$1 ") : s);
	const enSource = soft(body ? rebaseRelative(en) : en);
	const enMasked = mask(enSource, ctx.dnt);
	const esMasked = mask(soft(es), ctx.dnt);
	const enText = enMasked.text;
	const esText = esMasked.text;
	const esPlain = esText.replace(/⟦\d+⟧/g, " ");

	// An English document title stays English (docs/i18n/es-style.md).
	const identical = esText.trim() === enText.trim();
	const sourceTitle = /(?:^|\.)sources\.\d+\.title$/.test(field ?? "");

	// Glossary adherence. The draft is read unmasked: a required rendering
	// may itself be a do-not-translate term ("satoshi").
	// The glossary and the English-word checks read English only.
	const english = from === "en";
	const esFolded = fold(es);
	const enNames = mask(enSource).text;
	if (english && !identical)
		for (const g of ctx.glossary)
			if (g.en.test(g.holdsDnt ? enNames : enText) && !g.es.test(esFolded))
				add("glossary", "low", `"${g.term}" should be "${g.translation}"`);

	// Register: tú, never usted.
	if (/(?<!\p{L})usted(?!\p{L})/iu.test(esPlain))
		add("register", "medium", "usted: address the reader as tú");
	if (
		english &&
		/\byour\b/i.test(enText) &&
		/(?<!\p{L})sus?(?!\p{L})/iu.test(esPlain) &&
		!/(?<!\p{L})tus?(?!\p{L})/iu.test(esPlain)
	)
		add("register", "medium", "su/sus for the English your: use tu/tus");
	for (const [, w] of esPlain.matchAll(SENTENCE_START))
		if (
			USTED_IMPERATIVES.has(w.toLowerCase()) ||
			USTED_ENCLITIC.test(w.toLowerCase())
		)
			add("register", "medium", `formal imperative "${w}": use the tú form`);

	// Protected runs: every one in the English comes back unchanged.
	const isDnt = (t) => ctx.dntWhole?.test(t);
	const want = counts(enMasked.tokens);
	const have = counts(esMasked.tokens);
	for (const [t, n] of want)
		if ((have.get(t) ?? 0) < n)
			add("protected", "high", `missing or changed: ${clip(t, 60)}`);
	for (const [t, n] of have)
		if ((want.get(t) ?? 0) < n && !isDnt(t))
			add("protected", "medium", `not in the English: ${clip(t, 60)}`);

	// Untranslated runs: English sentences left in the draft.
	const words = (s) => s.match(/\p{L}+/gu) ?? [];
	if (identical) {
		const prose = /\p{L}/u.test(enText.replace(/⟦\d+⟧/g, ""));
		if (prose && !sourceTitle && words(esPlain).length >= 2)
			add("untranslated", "medium", "identical to the English");
	}
	// Line by line as written: a list keeps one item to a line.
	else if (english)
		for (const s of (body ? mask(es, ctx.dnt).text : esText)
			.replace(/⟦\d+⟧/g, " ")
			.split(/(?<=[.!?:])\s+|\n+/)) {
			const w = words(s);
			const english = w.filter((x) => ENGLISH.has(x.toLowerCase())).length;
			if (w.length >= 4 && english >= 3 && english / w.length >= 0.3)
				add("untranslated", "high", `English left: "${clip(s)}"`);
		}

	// Number and date formats (docs/i18n/es-style.md), read with names such
	// as BCH left in, since a unit follows its number.
	const esNumbers = mask(es).text.replace(/⟦\d+⟧/g, " ");
	for (const [re, severity, message] of [...NUMBER_RULES, ...DATE_RULES]) {
		const m = esNumbers.match(re);
		if (m) add("format", severity, `${message}: "${m[0]}"`);
	}
	return out;
};

// ---------------------------------------------------------------------- run

const BATCH = 40;

/** Runs `jobs` (async functions) `n` at a time. */
const pool = async (jobs, n) => {
	const queue = [...jobs];
	const worker = async () => {
		while (queue.length) await queue.shift()();
	};
	await Promise.all(Array.from({ length: Math.min(n, jobs.length) }, worker));
};

const segmentId = (unit, seg) =>
	seg.field ? `${unit.id}#${seg.field}` : unit.id;

/**
 * One report row per segment: the unit it belongs to, the verdict and the
 * text on both sides. `review` is the model's verdict, or undefined on a dry
 * run; `fix` the corrected text when it is usable.
 */
const toRow = (unit, seg, findings, review, fix, applied) => {
	const flagged = review?.verdict === "flag";
	const verdict =
		flagged || findings.length ? "flag" : fix !== undefined ? "fixed" : "clean";
	const severity =
		verdict === "flag"
			? (worst([
					flagged ? (review.severity ?? "medium") : null,
					...findings.map((f) => f.severity),
				]) ?? "medium")
			: verdict === "fixed"
				? "low"
				: null;
	const reasons = [
		review?.reason,
		...findings.map((f) => `${f.check}: ${f.message}`),
	].filter(Boolean);
	return {
		unit: unit.id,
		path: unit.path,
		...(unit.key ? { key: unit.key } : {}),
		...(seg.field && unit.kind !== "overlay" ? { field: seg.field } : {}),
		kind: unit.kind,
		area: unit.area,
		verdict,
		severity,
		reason: reasons.join("; ") || null,
		checks: findings,
		en: seg.en,
		es: applied ? fix : seg.es,
		...(fix !== undefined ? { fix, applied } : {}),
	};
};

/**
 * A fix the model returned, if it may be written: it must change something,
 * keep every protected run of the draft and keep the heading outline.
 * Returns `{ fix }` or `{ reject: <why> }`.
 */
const vet = (seg, review, dnt) => {
	if (review?.verdict !== "fixed") return {};
	if (typeof review.text !== "string")
		return { reject: "the fix carried no text" };
	const text = review.text;
	if (text.trim() === seg.es.trim()) return {};
	const before = [...counts(mask(seg.es, dnt).tokens)].sort().join("\n");
	const after = [...counts(mask(text, dnt).tokens)].sort().join("\n");
	if (before !== after) return { reject: "the fix changed protected text" };
	if (outline(text) !== outline(seg.es))
		return { reject: "the fix changed the heading outline" };
	// Keep the draft's surrounding whitespace: a body ends with its newline.
	const [, lead, , trail] = seg.es.match(/^(\s*)([\s\S]*?)(\s*)$/);
	return { fix: lead + text.trim() + trail };
};

/**
 * Writes a unit's fixes (`fixes` maps a field to its text) and, when `stamp`,
 * its qaHash. A unit the model did not fully review is not stamped, so the
 * next run sends it again. The review console writes a reviewer's edits
 * through it too, unstamped.
 */
export const apply = (root, locale, unit, fixes, stamp) => {
	if (!fixes.size && !stamp) return;
	const segments = unit.segments.map((s) =>
		fixes.has(s.field) ? { ...s, es: fixes.get(s.field) } : s,
	);
	const qa = stamp ? { qaHash: qaHash({ ...unit, segments }) } : {};
	if (unit.kind === "catalog") {
		const tr = readJson(root, unit.path, {});
		for (const s of segments)
			if (fixes.has(s.field)) {
				if (s.field) setAt(tr[unit.key], s.field.split("."), s.es);
				else tr[unit.key] = s.es;
			}
		if (fixes.size) writeJson(root, unit.path, tr);
		const metaPath = catalogMetaPath(locale);
		const meta = readJson(root, metaPath, {});
		if (stamp) {
			meta[unit.key] = { ...meta[unit.key], ...qa };
			writeJson(root, metaPath, meta);
		}
	} else if (unit.kind === "overlay") {
		const overlay = readJson(root, unit.path, {});
		const id = unit.record;
		const field = unit.segments[0].field;
		overlay[id][field] = {
			...overlay[id][field],
			...(fixes.has(field) ? { text: fixes.get(field) } : {}),
			...qa,
		};
		writeJson(root, unit.path, overlay);
	} else {
		const text = readFileSync(join(root, unit.path), "utf8");
		const doc = parseDoc(text, unit.path);
		const translation = { ...doc.data.translation, ...qa };
		const leafFixed = [...fixes.keys()].some((f) => f !== "body");
		if (leafFixed) {
			// A frontmatter value changed: write the whole file again.
			const data = structuredClone(doc.data);
			for (const [f, v] of fixes)
				if (f !== "body") setAt(data, f.split("."), v);
			data.translation = translation;
			const body = fixes.get("body") ?? doc.body;
			write(root, unit.path, renderDoc({ ...doc, data, body }));
		} else {
			// Only the body or nothing: keep the frontmatter as it is written.
			let next = replaceTranslationBlock(text, unit.path, translation);
			if (fixes.has("body"))
				next = next.slice(0, next.length - doc.body.length) + fixes.get("body");
			write(root, unit.path, next);
		}
	}
};

/**
 * Checks and reviews every unit. `reviewer` is
 * `{ review({ locale, from, items, terminology, style }) → verdict[] }`; without
 * one (a dry run) only the deterministic checks run and nothing is written.
 * `previous` is the last report's rows: a unit whose qaHash still matches
 * keeps its rows and is not sent again. With `fix`, fixed text is written
 * back and every reviewed unit gets its qaHash.
 *
 * Returns `{ rows, checked, skipped, failed }`. An API failure
 * (TranslatorError) stops the run; the rows so far ride on the error as
 * `e.rows`.
 */
export const qa = async ({
	root,
	locale,
	units,
	reviewer,
	fix = false,
	previous = [],
	concurrency = 4,
	onUnit = () => {},
}) => {
	const dnt = dntPattern(loadDnt(root));
	const terminology = loadTerminology(root, locale);
	const style = loadStyle(root, locale);
	const ctx = {
		dnt,
		dntWhole: dnt && new RegExp(`^(?:${dnt.source})$`, "u"),
		glossary: glossaryMatchers(terminology, dnt),
	};
	const prior = Map.groupBy(previous, (r) => r.unit);
	const rows = [];
	const failed = [];
	let skipped = 0;

	const todo = [];
	for (const unit of units) {
		const kept = prior.get(unit.id);
		if (reviewer && kept && unit.qaHash && unit.qaHash === qaHash(unit)) {
			rows.push(...kept);
			skipped++;
		} else todo.push(unit);
	}

	const findingsOf = (unit) =>
		new Map(unit.segments.map((s) => [s, checkSegment(s, ctx)]));

	if (!reviewer) {
		for (const unit of todo) {
			const f = findingsOf(unit);
			for (const s of unit.segments) rows.push(toRow(unit, s, f.get(s)));
		}
		return { rows, checked: todo.length, skipped, failed };
	}

	// Catalog and overlay units are short: many to a request. A content file
	// is a request of its own.
	const batches = [
		...chunk(
			todo.filter((u) => u.kind !== "content"),
			BATCH,
		),
		...todo.filter((u) => u.kind === "content").map((u) => [u]),
	];
	const run = async (batch) => {
		const found = new Map(batch.map((u) => [u, findingsOf(u)]));
		const items = batch.flatMap((u) =>
			u.segments.map((s) => ({
				id: segmentId(u, s),
				english: s.en,
				draft: s.es,
				checks: found
					.get(u)
					.get(s)
					.map((f) => `${f.check}: ${f.message}`),
			})),
		);
		let verdicts;
		try {
			verdicts = await reviewer.review({
				locale,
				from: batch[0].from ?? "en",
				items,
				terminology,
				style,
			});
		} catch (e) {
			if (e.name === "TranslatorError") throw e;
			for (const u of batch) failed.push(`${u.id}: ${e.message}`);
			return;
		}
		const byId = new Map(verdicts.map((v) => [v.id, v]));
		for (const unit of batch) {
			const fixes = new Map();
			let complete = true;
			const unitRows = unit.segments.map((s) => {
				let review = byId.get(segmentId(unit, s));
				if (!review) complete = false;
				if (!review)
					review = {
						verdict: "flag",
						severity: "low",
						reason: "the QA pass returned no verdict",
					};
				const { fix: text, reject } = vet(s, review, dnt);
				if (reject)
					review = {
						verdict: "flag",
						severity: "medium",
						reason: `${review.reason ?? "fixed"} (not applied: ${reject})`,
					};
				// The checks judge what the repo holds after the run: a written
				// fix is checked again, and what it leaves is still flagged.
				const applied = fix && text !== undefined;
				if (applied) fixes.set(s.field, text);
				const after = applied
					? checkSegment({ ...s, es: text }, ctx)
					: found.get(unit).get(s);
				return toRow(unit, s, after, review, text, applied);
			});
			if (fix) apply(root, locale, unit, fixes, complete);
			rows.push(...unitRows);
			onUnit(unit, unitRows);
		}
	};

	try {
		await pool(
			batches.map((b) => () => run(b)),
			concurrency,
		);
	} catch (e) {
		e.rows = rows;
		throw e;
	}
	return { rows, checked: todo.length, skipped, failed };
};

/** Row counts by area and severity (`clean` and `fixed` rows have none). */
export const summarize = (rows) => {
	const areas = new Map();
	for (const r of rows) {
		const a = areas.get(r.area) ?? {
			rows: 0,
			clean: 0,
			fixed: 0,
			high: 0,
			medium: 0,
			low: 0,
		};
		a.rows++;
		if (r.verdict === "flag") a[r.severity]++;
		else a[r.verdict]++;
		areas.set(r.area, a);
	}
	return Object.fromEntries([...areas].sort(([a], [b]) => a.localeCompare(b)));
};
