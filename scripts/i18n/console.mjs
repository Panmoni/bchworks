// The review console's logic (PAN-413), kept apart from its HTTP server
// (review-ui.mjs) so it can be tested. It reads the fresh `machine` units the
// way QA does, attaches each unit's verdict from the QA report, and approves
// through `review`, the function behind `pnpm i18n:review`.
import {
	PATHS,
	RefusedError,
	readJson,
	review,
	writeJson,
} from "./pipeline.mjs";
import { collect, SEVERITIES, apply as writeEdits } from "./qa.mjs";

export const notesPath = (locale) => `i18n-review/${locale}.json`;
export const reportPath = (locale) => `i18n-qa/${locale}.json`;

const rank = (s) => (s ? SEVERITIES.length - SEVERITIES.indexOf(s) : 0);

/** The field a QA report row and a unit segment share. */
const fieldOf = (unit, seg) => (unit.kind === "overlay" ? "" : seg.field);

/**
 * A unit's QA rating from its report rows: `flag` with the worst severity,
 * `clean`, `fixed`, or `unchecked` when a string has no row for the text the
 * repo holds now (QA never saw it, or it changed since) or carries a fix QA
 * suggested but never wrote. Only `clean` and `fixed` units may be approved
 * in bulk.
 */
export const rate = (unit, rows = []) => {
	const byField = new Map(rows.map((r) => [r.field ?? "", r]));
	let verdict = "clean";
	let severity = null;
	const reasons = [];
	for (const seg of unit.segments) {
		const row = byField.get(fieldOf(unit, seg));
		if (!row || row.es !== seg.es || (row.verdict === "fixed" && !row.applied))
			return {
				verdict: "unchecked",
				severity: null,
				reason: !row
					? "QA has not checked this text."
					: row.es !== seg.es
						? "The text changed since QA checked it."
						: `QA suggested a fix it did not write: ${row.fix}`,
			};
		if (row.reason)
			reasons.push(seg.field ? `${seg.field}: ${row.reason}` : row.reason);
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
 * rows }]`. A row is `{ id, kind, path, key?, area, segments, rating, note? }`.
 * Flagged rows come first by severity, then unchecked, sent back, fixed and
 * clean; groups with the worst rows come first.
 */
export const loadGroups = ({ root, locale, locales }) => {
	const report = readJson(root, reportPath(locale), { rows: [] });
	const notes = readJson(root, notesPath(locale), {});
	const byUnit = Map.groupBy(report.rows, (r) => r.unit);
	const { units, stale } = collect({ root, locale, locales });
	const rows = units.map((u) => ({
		id: u.id,
		kind: u.kind,
		path: u.path,
		...(u.key ? { key: u.key } : {}),
		area: u.area,
		segments: u.segments.map((s) => ({ field: s.field, en: s.en, es: s.es })),
		rating: rate(u, byUnit.get(u.id)),
		...(notes[u.id] ? { note: notes[u.id] } : {}),
	}));
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
const findUnit = (root, locale, locales, id) => {
	const path = id.split(" ")[0];
	return collect({ root, locale, locales, only: path }).units.find(
		(u) => u.id === id,
	);
};

/** `review` arguments for these units of one file. */
const reviewArgs = (path, keys) =>
	path.startsWith(`${PATHS.content}/`) ? { path } : { path, keys };

/**
 * Approves one unit through `review`, after writing `edits` (field → text)
 * into its draft. A unit no longer a fresh machine draft gets no edits, and
 * `review` refuses it if the English changed. Returns the units stamped.
 */
export const approve = ({ root, locale, locales, id, reviewer, edits }) => {
	const unit = findUnit(root, locale, locales, id);
	const changed = new Map(
		Object.entries(edits ?? {}).filter(([field, text]) => {
			const seg = unit?.segments.find((s) => s.field === field);
			return seg && typeof text === "string" && text !== seg.es;
		}),
	);
	if (edits && Object.keys(edits).length && !unit)
		throw new RefusedError(`${id} is no longer a fresh machine draft`);
	const [path, key] = id.split(" ");
	const args = reviewArgs(path, key ? [key] : undefined);
	// Refuse before writing anything: a stale unit keeps its draft as it was.
	if (!unit) return review({ root, locale, reviewer, ...args });
	if (changed.size) writeEdits(root, locale, unit, changed, false);
	const n = review({ root, locale, reviewer, ...args });
	clearNotes(root, locale, [id]);
	return n;
};

/**
 * "Approve all clean": approves each id that QA rated `clean` or `fixed`
 * against the text the repo holds now and that was not sent back. The
 * console sends only the rows the reviewer opened on screen. Returns
 * `{ approved: [id], skipped: [{ id, why }] }`.
 */
export const approveClean = ({ root, locale, locales, ids, reviewer }) => {
	const { groups } = loadGroups({ root, locale, locales });
	const rows = new Map(groups.flatMap((g) => g.rows).map((r) => [r.id, r]));
	const skipped = [];
	const ok = [];
	for (const id of new Set(ids)) {
		const row = rows.get(id);
		if (!row) skipped.push({ id, why: "not a fresh machine draft" });
		else if (row.note) skipped.push({ id, why: "sent back" });
		else if (!bulkApprovable(row.rating))
			skipped.push({ id, why: `QA rated it ${row.rating.verdict}` });
		else ok.push(row);
	}
	const approved = [];
	for (const [path, list] of Map.groupBy(ok, (r) => r.path)) {
		const keys = list.map((r) => r.key).filter(Boolean);
		try {
			review({ root, locale, reviewer, ...reviewArgs(path, keys) });
			approved.push(...list.map((r) => r.id));
		} catch (e) {
			if (!(e instanceof RefusedError)) throw e;
			for (const r of list) skipped.push({ id: r.id, why: e.message });
		}
	}
	return { approved, skipped };
};

/** Sends a unit back with a note for the next draft; an empty note clears it. */
export const sendBack = ({ root, locale, locales, id, note, reviewer }) => {
	const notes = readJson(root, notesPath(locale), {});
	if (note?.trim()) {
		if (!findUnit(root, locale, locales, id))
			throw new RefusedError(`${id} is not a fresh machine draft`);
		notes[id] = { note: note.trim(), reviewer, at: new Date().toISOString() };
	} else delete notes[id];
	writeJson(root, notesPath(locale), notes);
	return notes[id] ?? null;
};
