#!/usr/bin/env node
// pnpm i18n:qa <locale> [--only <path-glob>] [--units <file>] [--fix] [--dry-run]
// pnpm i18n:qa <locale> --provider deepinfra [--model <label|id>] [--only …] [--units …]
//
// Checks every fresh machine draft of <locale>, then has the model review it.
// --fix writes the fixed text back; --dry-run runs only the deterministic
// checks, calls no API and writes nothing. --units narrows the run to the
// unit ids listed in <file>, one per line. The report goes to
// i18n-qa/<locale>.json. --provider deepinfra asks a model outside the
// Anthropic family instead (PAN-440): advisory only, so it never takes --fix,
// and its report goes to i18n-qa/<locale>.<model>.json. Workflow: docs/i18n.md.
import { existsSync, readFileSync } from "node:fs";
import { join, matchesGlob } from "node:path";
import { parseArgs } from "node:util";
import {
	DEFAULT_LOCALE,
	LOCALES,
	PSEUDO_CODES,
} from "../../src/i18n/locales.ts";
import { claudeReviewer, MODEL } from "./claude.mjs";
import { DEFAULT_MODEL, deepinfraReviewer } from "./deepinfra.mjs";
import { writeJson } from "./pipeline.mjs";
import { collect, qa, SEVERITIES, summarize } from "./qa.mjs";

const { values, positionals } = parseArgs({
	allowPositionals: true,
	options: {
		only: { type: "string" },
		units: { type: "string" },
		provider: { type: "string", default: "claude" },
		model: { type: "string" },
		fix: { type: "boolean", default: false },
		"dry-run": { type: "boolean", default: false },
	},
});

const others = LOCALES.map((l) => l.code).filter((c) => c !== DEFAULT_LOCALE);
const [locale] = positionals;
const deepinfra = values.provider === "deepinfra";
if (
	!others.includes(locale) ||
	(values.fix && values["dry-run"]) ||
	!["claude", "deepinfra"].includes(values.provider) ||
	(values.model && !deepinfra) ||
	(values.fix && deepinfra)
) {
	const l = `<${others.join("|")}>`;
	console.error(
		`usage: pnpm i18n:qa ${l} [--only <glob>] [--units <file>] [--fix | --dry-run]\n` +
			`       pnpm i18n:qa ${l} --provider deepinfra [--model <label|id>] [--only <glob>] [--units <file>] [--dry-run]`,
	);
	process.exit(2);
}

const root = new URL("../..", import.meta.url).pathname;
const model = values.model ?? DEFAULT_MODEL;
const reportPath = deepinfra
	? `i18n-qa/${locale}.${model.replace(/[^\w.-]+/g, "_")}.json`
	: `i18n-qa/${locale}.json`;
const last = existsSync(join(root, reportPath))
	? JSON.parse(readFileSync(join(root, reportPath), "utf8"))
	: { rows: [] };
const ids = values.units
	? new Set(
			readFileSync(values.units, "utf8")
				.split("\n")
				.map((l) => l.trim())
				.filter(Boolean),
		)
	: null;

const collected = collect({
	root,
	locale,
	locales: [...new Set([...others, ...PSEUDO_CODES])],
	only: values.only,
});
const { stale } = collected;
const units = ids
	? collected.units.filter((u) => ids.has(u.id))
	: collected.units;
const fresh = new Set(collected.units.map((u) => u.id));

// A last-report row about text its unit no longer holds is out of date:
// drop all of that unit's rows so it is reviewed again, even when a qaHash
// another run stamped still matches.
const textOf = new Map(
	collected.units.flatMap((u) =>
		u.segments.map((s) => [
			`${u.id}\0${u.kind === "overlay" ? "" : (s.field ?? "")}`,
			s.es,
		]),
	),
);
const outdated = new Set(
	last.rows
		.filter((r) => {
			const text = textOf.get(`${r.unit}\0${r.field ?? ""}`);
			return text !== undefined && text !== r.es;
		})
		.map((r) => r.unit),
);
const previous = last.rows.filter((r) => !outdated.has(r.unit));
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

let reviewer;

const addUsage = (a = {}, b) =>
	Object.fromEntries(
		Object.keys(b).map((k) => [k, (Number(a[k]) || 0) + b[k]]),
	);

const save = (rows) => {
	// Keep a last-report row this run did not replace: its file is outside
	// --only, its still-fresh unit outside --units, or a failure stopped the
	// run before its unit. A row whose unit left QA (reviewed or stale since)
	// is dropped.
	const inScope = new Set(units.map((u) => u.id));
	const replaced = new Set(rows.map((r) => r.unit));
	const outside = (r) =>
		(values.only && !matchesGlob(r.path, values.only)) ||
		(ids && !ids.has(r.unit) && fresh.has(r.unit));
	const kept = previous.filter(
		(r) => !replaced.has(r.unit) && (inScope.has(r.unit) || outside(r)),
	);
	writeJson(root, reportPath, {
		locale,
		model: reviewer?.model ?? MODEL,
		// Usage adds up every run that wrote this report, so a resumed or
		// --units run does not lose the cost of the runs before it.
		...(reviewer?.usage ? { usage: addUsage(last.usage, reviewer.usage) } : {}),
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
	reviewer = deepinfra ? deepinfraReviewer({ model }) : claudeReviewer();
	const { rows, checked, skipped, failed } = await qa({
		root,
		locale,
		units,
		previous,
		fix: values.fix,
		reviewer,
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
			(values.fix
				? "; fixes written"
				: deepinfra
					? "; advisory, nothing written"
					: "; nothing written (use --fix)"),
	);
	if (reviewer.usage) {
		const u = reviewer.usage;
		console.log(
			`${reviewer.model}: ${u.calls} calls, ${u.prompt} prompt + ${u.completion} completion tokens, ~$${u.cost.toFixed(2)}`,
		);
	}
	process.exit(failed.length ? 1 : 0);
} catch (e) {
	if (e.rows) save(e.rows);
	console.error(e.message);
	process.exit(1);
}
