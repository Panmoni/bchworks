#!/usr/bin/env node
// pnpm i18n:qa <locale> [--only <path-glob>] [--fix] [--dry-run]
//
// Checks every fresh machine draft of <locale>, then has the model review it.
// --fix writes the fixed text back; --dry-run runs only the deterministic
// checks, calls no API and writes nothing. The report goes to
// i18n-qa/<locale>.json. Workflow: docs/i18n.md.
import { existsSync, readFileSync } from "node:fs";
import { join, matchesGlob } from "node:path";
import { parseArgs } from "node:util";
import {
	DEFAULT_LOCALE,
	LOCALES,
	PSEUDO_CODES,
} from "../../src/i18n/locales.ts";
import { claudeReviewer, MODEL } from "./claude.mjs";
import { writeJson } from "./pipeline.mjs";
import { collect, qa, SEVERITIES, summarize } from "./qa.mjs";

const { values, positionals } = parseArgs({
	allowPositionals: true,
	options: {
		only: { type: "string" },
		fix: { type: "boolean", default: false },
		"dry-run": { type: "boolean", default: false },
	},
});

const others = LOCALES.map((l) => l.code).filter((c) => c !== DEFAULT_LOCALE);
const [locale] = positionals;
if (!others.includes(locale) || (values.fix && values["dry-run"])) {
	console.error(
		`usage: pnpm i18n:qa <${others.join("|")}> [--only <glob>] [--fix | --dry-run]`,
	);
	process.exit(2);
}

const root = new URL("../..", import.meta.url).pathname;
const reportPath = `i18n-qa/${locale}.json`;
const previous = existsSync(join(root, reportPath))
	? JSON.parse(readFileSync(join(root, reportPath), "utf8")).rows
	: [];

const { units, stale } = collect({
	root,
	locale,
	locales: [...new Set([...others, ...PSEUDO_CODES])],
	only: values.only,
});
console.log(
	`${units.length} machine units to check` +
		(stale ? `, ${stale} stale skipped (redraft them first)` : ""),
);

const print = (rows) => {
	const table = summarize(rows);
	const cols = ["rows", "clean", "fixed", ...SEVERITIES];
	console.log(["area".padEnd(12), ...cols.map((c) => c.padStart(7))].join(""));
	for (const [area, n] of Object.entries(table))
		console.log(
			[area.padEnd(12), ...cols.map((c) => String(n[c]).padStart(7))].join(""),
		);
};

const save = (rows) => {
	// Keep a last-report row this run did not replace: its file is outside
	// --only, or a failure stopped the run before its unit. A row whose unit
	// left QA (reviewed or stale since) is dropped.
	const inScope = new Set(units.map((u) => u.id));
	const replaced = new Set(rows.map((r) => r.unit));
	const outside = (r) => values.only && !matchesGlob(r.path, values.only);
	const kept = previous.filter(
		(r) => !replaced.has(r.unit) && (inScope.has(r.unit) || outside(r)),
	);
	writeJson(root, reportPath, {
		locale,
		model: MODEL,
		generatedAt: new Date().toISOString(),
		rows: [...kept, ...rows],
	});
	console.log(`report: ${reportPath}`);
};

if (values["dry-run"]) {
	const { rows } = await qa({ root, locale, units });
	for (const r of rows.filter((r) => r.verdict === "flag"))
		console.log(
			`${r.severity.padEnd(6)} ${r.unit}${r.field ? `#${r.field}` : ""}: ${r.reason}`,
		);
	print(rows);
	process.exit(0);
}

let done = 0;
try {
	const { rows, checked, skipped, failed } = await qa({
		root,
		locale,
		units,
		previous,
		fix: values.fix,
		reviewer: claudeReviewer(),
		onUnit: () => {
			done++;
			if (done % 25 === 0) console.log(`… ${done} reviewed`);
		},
	});
	save(rows);
	for (const f of failed) console.error(`FAILED  ${f}`);
	print(rows);
	console.log(
		`${checked} checked, ${skipped} unchanged since the last QA, ${failed.length} failed` +
			(values.fix ? "; fixes written" : "; nothing written (use --fix)"),
	);
	process.exit(failed.length ? 1 : 0);
} catch (e) {
	if (e.rows) save(e.rows);
	console.error(e.message);
	process.exit(1);
}
