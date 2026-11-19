#!/usr/bin/env node
// pnpm i18n:review <locale> <path> --reviewer "<name>" [--rechecked]
// pnpm i18n:review <locale> --only <glob> --reviewer "<name>"
//
// Marks a translation reviewed and credits the reviewer. Refuses when the
// English changed since the draft; --rechecked says you compared it with
// the current English. --only reviews every translation file matching the
// glob, reporting the refused ones. Workflow: docs/i18n.md.
import { parseArgs } from "node:util";
import {
	DEFAULT_LOCALE,
	LOCALES,
	PSEUDO_CODES,
} from "../../src/i18n/locales.ts";
import { RefusedError, review, reviewMatching } from "./pipeline.mjs";

const { values, positionals } = parseArgs({
	allowPositionals: true,
	options: {
		reviewer: { type: "string" },
		only: { type: "string" },
		rechecked: { type: "boolean", default: false },
	},
});

const others = LOCALES.map((l) => l.code).filter((c) => c !== DEFAULT_LOCALE);
const [locale, path] = positionals;
if (
	!others.includes(locale) ||
	// Exactly one of <path> and --only.
	!path === !values.only ||
	!values.reviewer?.trim()
) {
	console.error(
		`usage: pnpm i18n:review <${others.join("|")}> <path | --only <glob>> --reviewer "<name>" [--rechecked]`,
	);
	process.exit(2);
}
// --rechecked vouches that one person compared one file with its new English.
if (values.only && values.rechecked) {
	console.error("--rechecked takes one path, never --only");
	process.exit(2);
}

const root = new URL("../..", import.meta.url).pathname;
const { reviewer, rechecked } = values;

if (values.only) {
	const { reviewed, refused } = reviewMatching({
		root,
		locale,
		locales: [...new Set([...others, ...PSEUDO_CODES])],
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
