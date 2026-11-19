// The review console (PAN-413): its logic and its HTTP server, started by
// review-ui.mjs. It reads the fresh `machine` units the way QA does, attaches
// each unit's verdict from the QA report, and approves through `review`, the
// function behind `pnpm i18n:review`.
import { createServer } from "node:http";
import {
	PATHS,
	RefusedError,
	readJson,
	review,
	writeJson,
} from "./pipeline.mjs";
import { collect, qaHash, SEVERITIES, apply as writeEdits } from "./qa.mjs";

export const notesPath = (locale) => `i18n-review/${locale}.json`;
export const reportPath = (locale) => `i18n-qa/${locale}.json`;

const rank = (s) => (s ? SEVERITIES.length - SEVERITIES.indexOf(s) : 0);

/** `[path, key?]` of a unit id: `<path>` or `<path> <key>`. */
const splitId = (id) => {
	const i = id.indexOf(" ");
	return i < 0 ? [id] : [id.slice(0, i), id.slice(i + 1)];
};

/** A glob that matches exactly this path. */
const literalGlob = (path) => path.replace(/[*?[\]{}()+@]/g, "[$&]");

/** The field a QA report row and a unit segment share. */
const fieldOf = (unit, seg) => (unit.kind === "overlay" ? "" : seg.field);

/**
 * A unit's QA rating from its report rows: `flag` with the worst severity,
 * `clean`, `fixed`, or `unchecked` when a string has no row for the text the
 * repo holds now (QA never saw it, or it changed since) or carries a fix QA
 * suggested but never wrote. A flag on any string outranks unchecked. Only
 * `clean` and `fixed` units may be approved in bulk.
 */
export const rate = (unit, rows = []) => {
	const byField = new Map(rows.map((r) => [r.field ?? "", r]));
	let verdict = "clean";
	let severity = null;
	const reasons = [];
	const label = (seg, text) => (seg.field ? `${seg.field}: ${text}` : text);
	for (const seg of unit.segments) {
		const row = byField.get(fieldOf(unit, seg));
		const unchecked = !row
			? "QA has not checked this text."
			: row.es !== seg.es
				? "The text changed since QA checked it."
				: row.verdict === "fixed" && !row.applied
					? `QA suggested a fix it did not write: ${row.fix}`
					: null;
		if (unchecked) {
			reasons.push(label(seg, unchecked));
			if (verdict !== "flag") verdict = "unchecked";
			continue;
		}
		if (row.reason) reasons.push(label(seg, row.reason));
		if (row.verdict === "flag") {
			verdict = "flag";
			if (rank(row.severity) > rank(severity)) severity = row.severity;
		} else if (row.verdict === "fixed" && verdict === "clean")
			verdict = "fixed";
	}
	return { verdict, severity, reason: reasons.join("\n") || null };
};

export const bulkApprovable = (rating) =>
	rating.verdict === "clean" || rating.verdict === "fixed";

/** The group a unit is shown under: its page area, the catalog by key prefix. */
const groupOf = (unit) =>
	unit.kind === "catalog" ? `catalog: ${unit.key.split("_")[0]}` : unit.area;

const order = (row) =>
	row.rating.verdict === "flag"
		? 4 + rank(row.rating.severity)
		: row.rating.verdict === "unchecked"
			? 3
			: row.note
				? 2
				: row.rating.verdict === "fixed"
					? 1
					: 0;

/**
 * Every fresh `machine` unit of `locale` as console rows, grouped: `[{ name,
 * rows }]`. A row is `{ id, kind, path, key?, area, segments, viewHash,
 * rating, note? }`. `viewHash` is the unit's qaHash, which covers the English
 * and the draft: an approval names it, so the server approves only the text
 * the reviewer was shown. A note applies to the text it was written about
 * and lapses once the draft or the English changes. Flagged rows come first
 * by severity, then unchecked, sent back, fixed and clean; groups with the
 * worst rows come first.
 */
export const loadGroups = ({ root, locale, locales }) => {
	const report = readJson(root, reportPath(locale), { rows: [] });
	const notes = readJson(root, notesPath(locale), {});
	const byUnit = Map.groupBy(report.rows, (r) => r.unit);
	const { units, stale } = collect({ root, locale, locales });
	const rows = units.map((u) => {
		const viewHash = qaHash(u);
		const note = notes[u.id]?.viewHash === viewHash ? notes[u.id] : null;
		return {
			id: u.id,
			kind: u.kind,
			path: u.path,
			...(u.key ? { key: u.key } : {}),
			area: u.area,
			segments: u.segments.map((s) => ({ field: s.field, en: s.en, es: s.es })),
			viewHash,
			rating: rate(u, byUnit.get(u.id)),
			...(note ? { note } : {}),
		};
	});
	const groups = [...Map.groupBy(rows, groupOf)].map(([name, list]) => ({
		name,
		rows: list.sort((a, b) => order(b) - order(a) || a.id.localeCompare(b.id)),
	}));
	groups.sort(
		(a, b) =>
			order(b.rows[0]) - order(a.rows[0]) || a.name.localeCompare(b.name),
	);
	return { groups, stale, reportAt: report.generatedAt ?? null };
};

const clearNotes = (root, locale, ids) => {
	const notes = readJson(root, notesPath(locale), {});
	if (!ids.some((id) => id in notes)) return;
	for (const id of ids) delete notes[id];
	writeJson(root, notesPath(locale), notes);
};

/** The fresh machine unit with this id, or undefined (reviewed or stale). */
const findUnit = (root, locale, locales, id) =>
	collect({
		root,
		locale,
		locales,
		only: literalGlob(splitId(id)[0]),
	}).units.find((u) => u.id === id);

/** `review` arguments for these units of one file. */
const reviewArgs = (path, keys) =>
	path.startsWith(`${PATHS.content}/`) ? { path } : { path, keys };

const changedSinceLoad = (id) =>
	new RefusedError(`${id} changed since the console loaded it: reload`);

/**
 * Approves one unit through `review`, after writing `edits` (field → text)
 * into its draft. `viewHash` is the one the console showed: a unit whose
 * draft or English changed since is refused, so only text the reviewer saw is
 * approved, and edits never overwrite a newer draft. A unit that is no longer
 * a fresh machine draft goes to `review` as it is, which refuses it when the
 * English changed and skips it when it is already reviewed. Returns the
 * units stamped.
 */
export const approve = ({
	root,
	locale,
	locales,
	id,
	viewHash,
	reviewer,
	edits = {},
}) => {
	const [path, key] = splitId(id);
	const isContent = path.startsWith(`${PATHS.content}/`);
	const unit = findUnit(root, locale, locales, id);
	if (!unit) {
		// Never let an id without a key review a whole catalog or overlay.
		if (Object.keys(edits).length || (!isContent && !key))
			throw new RefusedError(`${id} is not a fresh machine draft`);
		return review({ root, locale, reviewer, ...reviewArgs(path, [key]) });
	}
	if (viewHash !== qaHash(unit)) throw changedSinceLoad(id);
	const changed = new Map();
	for (const [field, text] of Object.entries(edits)) {
		const seg = unit.segments.find((s) => s.field === field);
		if (!seg || typeof text !== "string")
			throw new RefusedError(`${id} has no string ${field}`);
		if (text !== seg.es) changed.set(field, text);
	}
	if (changed.size) writeEdits(root, locale, unit, changed, false);
	const n = review({ root, locale, reviewer, ...reviewArgs(path, [key]) });
	clearNotes(root, locale, [id]);
	return n;
};

/**
 * "Approve all clean": approves each `{ id, viewHash }` that QA rated `clean`
 * or `fixed` against the text the repo holds now, that is unchanged since the
 * console showed it and that was not sent back. The console sends only the
 * rows the reviewer opened on screen. Returns `{ approved: [id], skipped:
 * [{ id, why }] }`.
 */
export const approveClean = ({ root, locale, locales, items, reviewer }) => {
	const { groups } = loadGroups({ root, locale, locales });
	const rows = new Map(groups.flatMap((g) => g.rows).map((r) => [r.id, r]));
	const skipped = [];
	const ok = new Map();
	for (const { id, viewHash } of items) {
		const row = rows.get(id);
		if (!row) skipped.push({ id, why: "not a fresh machine draft" });
		else if (row.viewHash !== viewHash)
			skipped.push({ id, why: "changed since the console loaded it" });
		else if (row.note) skipped.push({ id, why: "sent back" });
		else if (!bulkApprovable(row.rating))
			skipped.push({ id, why: `QA rated it ${row.rating.verdict}` });
		else ok.set(id, row);
	}
	const approved = [];
	for (const [path, list] of Map.groupBy(ok.values(), (r) => r.path)) {
		const keys = list.map((r) => r.key).filter(Boolean);
		try {
			review({ root, locale, reviewer, ...reviewArgs(path, keys) });
			approved.push(...list.map((r) => r.id));
		} catch (e) {
			if (!(e instanceof RefusedError)) throw e;
			for (const r of list) skipped.push({ id: r.id, why: e.message });
		}
	}
	clearNotes(root, locale, approved);
	return { approved, skipped };
};

/**
 * Sends a unit back with a note for whoever redrafts it; an empty note clears
 * it. The note records the viewHash it was written about.
 */
export const sendBack = ({ root, locale, locales, id, note, reviewer }) => {
	const notes = readJson(root, notesPath(locale), {});
	if (note?.trim()) {
		const unit = findUnit(root, locale, locales, id);
		if (!unit) throw new RefusedError(`${id} is not a fresh machine draft`);
		notes[id] = {
			note: note.trim(),
			reviewer,
			at: new Date().toISOString(),
			viewHash: qaHash(unit),
		};
	} else delete notes[id];
	writeJson(root, notesPath(locale), notes);
	return notes[id] ?? null;
};

// ------------------------------------------------------------------ server

const MAX_BODY = 4 * 1024 * 1024;

const isObject = (v) =>
	v !== null && typeof v === "object" && !Array.isArray(v);
const isString = (v) => typeof v === "string";

/** Each action: a check of its request body, and what it does with it. */
const ACTIONS = {
	"/api/approve": {
		valid: (b) =>
			isString(b.id) &&
			isString(b.viewHash) &&
			(b.edits === undefined ||
				(isObject(b.edits) && Object.values(b.edits).every(isString))),
		run: (ctx, b) => ({ n: approve({ ...ctx, ...b }) }),
	},
	"/api/approve-clean": {
		valid: (b) =>
			Array.isArray(b.items) &&
			b.items.every(
				(i) => isObject(i) && isString(i.id) && isString(i.viewHash),
			),
		run: (ctx, b) => approveClean({ ...ctx, items: b.items }),
	},
	"/api/send-back": {
		valid: (b) => isString(b.id) && (b.note === undefined || isString(b.note)),
		run: (ctx, b) => ({ note: sendBack({ ...ctx, id: b.id, note: b.note }) }),
	},
};

const readBody = (req) =>
	new Promise((resolve, reject) => {
		let size = 0;
		const chunks = [];
		req.on("data", (c) => {
			size += c.length;
			if (size > MAX_BODY) {
				reject(new RefusedError("request too large"));
				req.destroy();
			} else chunks.push(c);
		});
		req.on("end", () => {
			try {
				resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
			} catch {
				reject(new RefusedError("the request is not JSON"));
			}
		});
		req.on("error", reject);
	});

/**
 * The console's HTTP server, not yet listening. `port` is the one it will
 * listen on: a page on another site can reach 127.0.0.1 too, so it answers
 * only requests addressed to 127.0.0.1 or localhost on that port, and takes
 * writes only as same-origin JSON.
 */
export const consoleServer = ({
	root,
	locale,
	locales,
	reviewer,
	port,
	page,
}) => {
	const ctx = { root, locale, locales, reviewer };
	const origins = new Set([
		`http://127.0.0.1:${port}`,
		`http://localhost:${port}`,
	]);
	const send = (
		res,
		status,
		body,
		type = "application/json; charset=utf-8",
	) => {
		res.writeHead(status, {
			"content-type": type,
			"cache-control": "no-store",
			"x-content-type-options": "nosniff",
			"x-frame-options": "DENY",
		});
		res.end(type.startsWith("application/json") ? JSON.stringify(body) : body);
	};
	return createServer(async (req, res) => {
		if (!origins.has(`http://${req.headers.host}`))
			return send(res, 403, { error: "wrong host" });
		const path = new URL(req.url, "http://x").pathname;
		try {
			if (req.method === "GET" && path === "/")
				return send(res, 200, page, "text/html; charset=utf-8");
			if (req.method === "GET" && path === "/api/units")
				return send(res, 200, { locale, reviewer, ...loadGroups(ctx) });
			const action = ACTIONS[path];
			if (req.method !== "POST" || !action)
				return send(res, 404, { error: "not found" });
			if (
				!origins.has(req.headers.origin) ||
				!req.headers["content-type"]?.startsWith("application/json")
			)
				return send(res, 403, { error: "same-origin JSON only" });
			const body = await readBody(req);
			if (!isObject(body) || !action.valid(body))
				throw new RefusedError("malformed request");
			return send(res, 200, action.run(ctx, body));
		} catch (e) {
			if (e instanceof RefusedError)
				return send(res, 409, { error: e.message });
			console.error(e);
			return send(res, 500, { error: String(e?.message ?? e) });
		}
	});
};
