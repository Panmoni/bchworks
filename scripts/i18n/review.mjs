#!/usr/bin/env node
// pnpm i18n:review <locale> <path> --reviewer "<name>" [--rechecked]
// pnpm i18n:review <locale> --only <glob> --reviewer "<name>"
// pnpm i18n:review <locale> --from <notes.json> --reviewer "<name>"
//
// Marks a translation reviewed and credits the reviewer. Refuses when the
// English changed since the draft; --rechecked says you compared it with
// the current English. --only reviews every translation file matching the
// glob, reporting the refused ones. --from approves every "looks good" unit
// of a reading-copy notes export (PAN-414) and prints the noted units as a
// to-fix list. Workflow: docs/i18n.md.
import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";
import {
	DEFAULT_LOCALE,
	LOCALES,
	PSEUDO_CODES,
} from "../../src/i18n/locales.ts";
import { RefusedError, review, reviewMatching } from "./pipeline.mjs";
import { applyNotes, parseNotes } from "./reading.mjs";

const { values, positionals } = parseArgs({
	allowPositionals: true,
	options: {
		reviewer: { type: "string" },
		only: { type: "string" },
		from: { type: "string" },
		rechecked: { type: "boolean", default: false },
	},
});

const others = LOCALES.map((l) => l.code).filter((c) => c !== DEFAULT_LOCALE);
const [locale, path] = positionals;
if (
	!others.includes(locale) ||
	// Exactly one of <path>, --only and --from.
	[path, values.only, values.from].filter(Boolean).length !== 1 ||
	!values.reviewer?.trim()
) {
	console.error(
		`usage: pnpm i18n:review <${others.join("|")}> <path | --only <glob> | --from <notes.json>> --reviewer "<name>" [--rechecked]`,
	);
	process.exit(2);
}
// --rechecked vouches that one person compared one file with its new English.
if (!path && values.rechecked) {
	console.error("--rechecked takes one path, never --only or --from");
	process.exit(2);
}

const root = new URL("../..", import.meta.url).pathname;
const { reviewer, rechecked } = values;
const locales = [...new Set([...others, ...PSEUDO_CODES])];

if (values.from) {
	let notes;
	try {
		notes = parseNotes(readFileSync(values.from, "utf8"));
	} catch (e) {
		if (!(e instanceof RefusedError) && e.code !== "ENOENT") throw e;
		console.error(`refused: ${e.message}`);
		process.exit(1);
	}
	const { approved, refused, toFix } = applyNotes({
		root,
		locale,
		locales,
		notes,
		reviewer,
	});
	for (const a of approved) console.log(`reviewed ${a.n} in ${a.unit}`);
	for (const r of refused) console.error(`refused ${r.unit}: ${r.why}`);
	const n = approved.reduce((sum, a) => sum + a.n, 0);
	console.log(
		`${n} units credited to ${reviewer}` +
			(refused.length ? `; ${refused.length} refused` : ""),
	);
	if (toFix.length) {
		console.log(`\nTo fix (${toFix.length}):`);
		for (const t of toFix)
			console.log(
				`- ${t.unit}${t.verdict === "good" ? " (approved)" : ""}: ${t.note || "(no note)"}`,
			);
	}
	process.exit(refused.length ? 1 : 0);
}

if (values.only) {
	const { reviewed, refused } = reviewMatching({
		root,
		locale,
		locales,
		only: values.only,
		reviewer,
		rechecked,
	});
	for (const r of reviewed) console.log(`reviewed ${r.n} in ${r.path}`);
	for (const r of refused) console.error(`refused ${r.path}: ${r.message}`);
	const n = reviewed.reduce((sum, r) => sum + r.n, 0);
	console.log(
		`${n} units in ${reviewed.length} files credited to ${reviewer}` +
			(refused.length ? `; ${refused.length} files refused` : ""),
	);
	if (!reviewed.length && !refused.length)
		console.error(`no ${locale} translation file matches ${values.only}`);
	process.exit(refused.length || !reviewed.length ? 1 : 0);
}

try {
	const n = review({ root, locale, path, reviewer, rechecked });
	console.log(`reviewed ${n} in ${path}, credited to ${reviewer}`);
} catch (e) {
	if (!(e instanceof RefusedError)) throw e;
	console.error(`refused: ${e.message}`);
	process.exit(1);
}
