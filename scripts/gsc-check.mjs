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
	console.log("  Average is under the floor: impressions alert off.");
} else if (last7 < limit) {
	console.error(
		`::error::Impressions dropped: ${last7} this week vs a ${avg.toFixed(1)} weekly average.`,
	);
	failed = true;
}

// --- Index -------------------------------------------------------------
// The index lists child sitemaps; the children list the pages.
async function locs(url) {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`${url}: ${res.status}`);
	return [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
		m[1].trim(),
	);
}
const pages = (await Promise.all((await locs(SITEMAP)).map(locs))).flat();
if (!pages.length) throw new Error(`No URLs in ${SITEMAP}`);

let previous = [];
try {
	previous = JSON.parse(await readFile(FILE, "utf8"));
} catch (e) {
	if (e.code !== "ENOENT") throw e;
	console.log("No gsc-indexed.json yet: this run only records the baseline.");
}

async function verdict(url) {
	for (let attempt = 1; ; attempt++) {
		try {
			return (await inspect(url)).verdict;
		} catch (e) {
			if (attempt === 3) throw e;
			await new Promise((r) => setTimeout(r, 2000 * attempt));
		}
	}
}
const urls = [...new Set([...pages, ...previous])];
const indexed = [];
for (let i = 0; i < urls.length; i += 5) {
	const batch = urls.slice(i, i + 5);
	const verdicts = await Promise.all(batch.map(verdict));
	batch.forEach((u, j) => verdicts[j] === "PASS" && indexed.push(u));
}
indexed.sort();
await writeFile(FILE, `${JSON.stringify(indexed, null, "\t")}\n`);

const now = new Set(indexed);
const lost = previous.filter((u) => !now.has(u));
console.log(
	`Index: ${indexed.length} of ${urls.length} inspected URLs indexed (${previous.length} last run).`,
);
for (const u of lost) console.error(`::error::No longer indexed: ${u}`);
if (lost.length) failed = true;

process.exit(failed ? 1 : 0);
