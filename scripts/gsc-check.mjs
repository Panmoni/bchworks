#!/usr/bin/env node
// Weekly Search Console alerts for bchworks.com. Exits 1 when either fires, so
// the scheduled workflow goes red and GitHub emails the failure.
//
// Index alert: inspects every sitemap URL, plus every URL indexed last run,
// with the URL Inspection API, and writes the indexed ones to
// src/data/gsc-indexed.json. Fires when a URL in the old file is no longer
// indexed. The file is rewritten either way, so one drop alerts once.
//
// Impressions alert: fires when the last 7 days' impressions fall more than
// GSC_IMPR_DROP (default 0.5) below the weekly average of the 4 weeks before,
// and only when that average is at least GSC_IMPR_FLOOR (default 100).
//
// Auth: see gsc-client.mjs.
// Usage: node --env-file-if-exists=.env scripts/gsc-check.mjs
import { readFile, writeFile } from "node:fs/promises";
import { connect, day, lastDataDay } from "./gsc-client.mjs";

const SITEMAP = "https://bchworks.com/sitemap-index.xml";
const FILE = new URL("../src/data/gsc-indexed.json", import.meta.url);
const floor = Number(process.env.GSC_IMPR_FLOOR || 100);
const drop = Number(process.env.GSC_IMPR_DROP || 0.5);
// drop >= 1 could never fire; a negative drop forces the alert (for testing).
if (!(floor >= 0) || !(drop < 1)) {
	console.error(
		`GSC_IMPR_FLOOR and GSC_IMPR_DROP must be a number >= 0 and a number < 1 (got "${process.env.GSC_IMPR_FLOOR}", "${process.env.GSC_IMPR_DROP}").`,
	);
	process.exit(1);
}

const { query, inspect } = await connect();
let failed = false;

// --- Impressions ---------------------------------------------------------
const end = lastDataDay();
const sum = async (s, e) =>
	(await query(s, e, ["date"])).reduce((n, r) => n + r.impressions, 0);
const [last7, prior28] = await Promise.all([
	sum(day(end, -6), end),
	sum(day(end, -34), day(end, -7)),
]);
const avg = prior28 / 4;
const limit = avg * (1 - drop);
console.log(
	`Impressions: ${last7} in the 7 days to ${end}; prior 4-week weekly average ${avg.toFixed(1)} (floor ${floor}, alert below ${limit.toFixed(1)}).`,
);
if (avg < floor) {
	console.log(
		"::warning title=GSC alert off::The 4-week average is under the floor, so only the index alert applies.",
	);
} else if (last7 < limit) {
	console.error(
		`::error title=GSC alert::Impressions dropped: ${last7} this week vs a ${avg.toFixed(1)} weekly average.`,
	);
	failed = true;
}

// --- Index -------------------------------------------------------------
// The index lists child sitemaps; the children list the pages. Only this
// site's URLs count.
const ORIGIN = "https://bchworks.com/";
async function locs(url) {
	const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
	if (!res.ok) throw new Error(`${url}: ${res.status}`);
	return [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
		m[1].trim(),
	);
}
const children = (await locs(SITEMAP)).filter((u) => u.startsWith(ORIGIN));
const pages = (await Promise.all(children.map(locs)))
	.flat()
	.filter((u) => u.startsWith(ORIGIN));
if (!pages.length) throw new Error(`No URLs in ${SITEMAP}`);

let previous = [];
try {
	previous = JSON.parse(await readFile(FILE, "utf8"));
} catch (e) {
	if (e.code !== "ENOENT") throw e;
	console.log("No gsc-indexed.json yet: this run only records the baseline.");
}

// PASS (and the older PARTIAL) mean indexed; FAIL and NEUTRAL mean not.
// Anything else, or an inspection that keeps failing, is unknown: the URL
// keeps last run's state and the run goes red, so a flaky API can neither
// fire a false drop nor quietly remove a URL from the baseline.
const INDEXED = new Set(["PASS", "PARTIAL"]);
const NOT_INDEXED = new Set(["FAIL", "NEUTRAL"]);
const retryable = (e) => !e.status || e.status === 429 || e.status >= 500;
async function verdict(url) {
	for (let attempt = 1; ; attempt++) {
		try {
			return (await inspect(url)).verdict;
		} catch (e) {
			if (attempt === 3 || !retryable(e)) {
				console.error(`::error::Inspection failed for ${url}: ${e.message}`);
				return undefined;
			}
			console.log(
				`::warning::Inspect ${url}, attempt ${attempt}: ${e.message}`,
			);
			await new Promise((r) => setTimeout(r, 5000 * attempt));
		}
	}
}
const urls = [...new Set([...pages, ...previous])];
const was = new Set(previous);
const indexed = [];
let unknown = 0;
for (let i = 0; i < urls.length; i += 5) {
	const batch = urls.slice(i, i + 5);
	const verdicts = await Promise.all(batch.map(verdict));
	batch.forEach((u, j) => {
		const v = verdicts[j];
		const known = INDEXED.has(v) || NOT_INDEXED.has(v);
		if (INDEXED.has(v) || (!known && was.has(u))) indexed.push(u);
		if (!known) {
			unknown++;
			if (v !== undefined)
				console.error(`::error::Unknown verdict ${v} for ${u}`);
		}
	});
}
indexed.sort();
await writeFile(FILE, `${JSON.stringify(indexed, null, "\t")}\n`);

const now = new Set(indexed);
const lost = previous.filter((u) => !now.has(u));
console.log(
	`Index: ${indexed.length} of ${urls.length} inspected URLs indexed (${previous.length} last run).`,
);
for (const u of lost)
	console.error(`::error title=GSC alert::No longer indexed: ${u}`);
if (lost.length) failed = true;
if (unknown) {
	console.error(
		`::error::${unknown} URL(s) had no clear verdict; they kept last run's state.`,
	);
	failed = true;
}

process.exit(failed ? 1 : 0);
