#!/usr/bin/env node
// pnpm i18n:reading-copy <locale> [--only <path-glob>]
//
// Writes the reading copy (PAN-414): one static page with every fresh machine
// and reviewed translation of <locale> beside its English, grouped by area,
// with QA flags from i18n-qa/<locale>.json. Output goes to
// i18n-qa/<locale>-reading/index.html (gitignored). Logic in reading.mjs;
// workflow in docs/i18n.md.
import { parseArgs } from "node:util";
import {
	DEFAULT_LOCALE,
	LOCALES,
	PSEUDO_CODES,
} from "../../src/i18n/locales.ts";
import { write } from "./pipeline.mjs";
import { buildReading, outDir } from "./reading.mjs";

const { values, positionals } = parseArgs({
	allowPositionals: true,
	options: { only: { type: "string" } },
});

const others = LOCALES.map((l) => l.code).filter((c) => c !== DEFAULT_LOCALE);
const [locale] = positionals;
if (!others.includes(locale) || positionals.length > 1) {
	console.error(
		`usage: pnpm i18n:reading-copy <${others.join("|")}> [--only <path-glob>]`,
	);
	process.exit(2);
}

const root = new URL("../..", import.meta.url).pathname;
const { html, areas, stale } = await buildReading({
	root,
	locale,
	locales: [...new Set([...others, ...PSEUDO_CODES])],
	only: values.only,
});
if (!areas.length) {
	console.error(
		`no ${locale} translation matches${values.only ? ` ${values.only}` : ""}`,
	);
	process.exit(1);
}
const file = `${outDir(locale)}/index.html`;
write(root, file, html);
const sum = (k) => areas.reduce((n, a) => n + a[k], 0);
for (const a of areas)
	console.log(
		`${a.label}: ${a.units} units (${a.machine} machine, ${a.reviewed} reviewed)${a.flags ? `, ${a.flags} QA flags` : ""}`,
	);
console.log(
	`${sum("units")} units in ${areas.length} areas: ${sum("machine")} machine, ${sum("reviewed")} reviewed, ${sum("flags")} QA flags` +
		(stale ? `; ${stale} stale machine drafts left out` : ""),
);
console.log(`wrote ${file}`);
