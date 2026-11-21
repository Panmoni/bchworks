#!/usr/bin/env node
// Read-only Google Search Console report for bchworks.com: weekly totals,
// then the top queries and pages for two periods side by side.
// Auth: a service account key, from .env as GSC_SERVICE_ACCOUNT_JSON (the JSON
// itself) or GSC_KEY_FILE (a path to it).
// Usage: node --env-file-if-exists=.env scripts/gsc-report.mjs [splitDate] [startDate]
//   splitDate (default 2026-09-26) starts the "after" period; startDate
//   (default 2026-07-01) starts the "before" one. GSC lags about 3 days.
import { createSign } from "node:crypto";
import { readFile } from "node:fs/promises";

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const API = "https://searchconsole.googleapis.com/webmasters/v3";

const split = process.argv[2] ?? "2026-09-26";
const start = process.argv[3] ?? "2026-07-01";
const day = (d, n) =>
	new Date(Date.parse(d) + n * 864e5).toISOString().slice(0, 10);
const end = day(new Date().toISOString().slice(0, 10), -3);

const { GSC_SERVICE_ACCOUNT_JSON: inline, GSC_KEY_FILE: file } = process.env;
if (!inline && !file) {
	console.error(
		"Set GSC_SERVICE_ACCOUNT_JSON (the key JSON) or GSC_KEY_FILE (its path) in .env.",
	);
	process.exit(1);
}
const key = JSON.parse(inline ?? (await readFile(file, "utf8")));

async function token() {
	const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
	const now = Math.floor(Date.now() / 1000);
	const body = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
		iss: key.client_email,
		scope: SCOPE,
		aud: key.token_uri,
		iat: now,
		exp: now + 3600,
	})}`;
	const sig = createSign("RSA-SHA256").update(body).sign(key.private_key);
	const res = await fetch(key.token_uri, {
		method: "POST",
		body: new URLSearchParams({
			grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
			assertion: `${body}.${sig.toString("base64url")}`,
		}),
	});
	if (!res.ok) throw new Error(`token: ${res.status} ${await res.text()}`);
	return (await res.json()).access_token;
}

const auth = { authorization: `Bearer ${await token()}` };
async function api(path, body) {
	const res = await fetch(`${API}${path}`, {
		method: body ? "POST" : "GET",
		headers: { ...auth, "content-type": "application/json" },
		body: body && JSON.stringify(body),
	});
	if (!res.ok) throw new Error(`${path}: ${res.status} ${await res.text()}`);
	return res.json();
}

const sites = (await api("/sites")).siteEntry ?? [];
const site = sites.find((s) => /bchworks\.com/.test(s.siteUrl))?.siteUrl;
if (!site) {
	console.error(
		`No bchworks.com property visible to ${key.client_email}. Sites: ${sites.map((s) => s.siteUrl).join(", ") || "none"}`,
	);
	process.exit(1);
}
const query = (startDate, endDate, dimensions, rowLimit = 25000) =>
	api(`/sites/${encodeURIComponent(site)}/searchAnalytics/query`, {
		startDate,
		endDate,
		dimensions,
		rowLimit,
	}).then((r) => r.rows ?? []);

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
