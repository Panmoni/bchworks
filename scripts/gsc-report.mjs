#!/usr/bin/env node
// Read-only Google Search Console report for bchworks.com: weekly totals,
// then the top queries and pages for two periods side by side.
// Auth: see gsc-client.mjs.
// Usage: node --env-file-if-exists=.env scripts/gsc-report.mjs [splitDate] [startDate]
//   splitDate (default 2026-09-26) starts the "after" period; startDate
//   (default 2026-07-01) starts the "before" one. GSC lags about 3 days.
import { connect, day, lastDataDay } from "./gsc-client.mjs";

const split = process.argv[2] ?? "2026-09-26";
const start = process.argv[3] ?? "2026-07-01";
const end = lastDataDay();
const { site, query } = await connect();

const pos = (n) => n.toFixed(1);
const ctr = (c, i) => (i ? `${((100 * c) / i).toFixed(1)}%` : "-");

console.log(`Property ${site}, ${start} → ${end}, split at ${split}\n`);

// Weekly totals (Monday-start weeks), impression-weighted position.
const weeks = new Map();
for (const r of await query(start, end, ["date"])) {
	const d = new Date(`${r.keys[0]}T00:00:00Z`);
	d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
	const k = d.toISOString().slice(0, 10);
	const w = weeks.get(k) ?? { clicks: 0, impressions: 0, posSum: 0 };
	w.clicks += r.clicks;
	w.impressions += r.impressions;
	w.posSum += r.position * r.impressions;
	weeks.set(k, w);
}
console.log("week        clicks  impr     ctr    avg pos");
for (const [k, w] of [...weeks].sort()) {
	console.log(
		`${k}  ${String(w.clicks).padStart(6)}  ${String(w.impressions).padStart(7)}  ${ctr(w.clicks, w.impressions).padStart(5)}  ${w.impressions ? pos(w.posSum / w.impressions) : "-"}`,
	);
}

// Top rows per period, keyed so the before figures line up with the after ones.
const before = [start, day(split, -1)];
const after = [split, end];
async function compare(dim, top = 25) {
	const [b, a] = await Promise.all([
		query(...before, [dim]),
		query(...after, [dim]),
	]);
	const bMap = new Map(b.map((r) => [r.keys[0], r]));
	const perDay = (r, [s, e]) =>
		r
			? (r.impressions / ((Date.parse(e) - Date.parse(s)) / 864e5 + 1)).toFixed(
					1,
				)
			: "0";
	console.log(
		`\nTop ${top} ${dim}s after ${split} (impr/day after vs before; position after vs before)`,
	);
	for (const r of a
		.sort((x, y) => y.impressions - x.impressions)
		.slice(0, top)) {
		const p = bMap.get(r.keys[0]);
		console.log(
			`${r.keys[0].replace("https://bchworks.com", "").slice(0, 60).padEnd(60)}  clicks ${String(r.clicks).padStart(4)}  impr/day ${perDay(r, after).padStart(6)} vs ${perDay(p, before).padStart(6)}  pos ${pos(r.position).padStart(5)} vs ${p ? pos(p.position) : "  new"}`,
		);
	}
	console.log(
		`(${dim}s with impressions: ${b.length} before, ${a.length} after)`,
	);
}
await compare("query");
await compare("page");
