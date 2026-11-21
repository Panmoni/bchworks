// Read-only Google Search Console client for bchworks.com, shared by
// gsc-report.mjs and gsc-check.mjs.
// Auth: a service account key, from the env as GSC_SERVICE_ACCOUNT_JSON (the
// JSON itself) or GSC_KEY_FILE (a path to it).
import { createSign } from "node:crypto";
import { readFile } from "node:fs/promises";

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const API = "https://searchconsole.googleapis.com";
const TIMEOUT = 30_000;

export const day = (d, n) =>
	new Date(Date.parse(d) + n * 864e5).toISOString().slice(0, 10);
// GSC data lags about 3 days.
export const lastDataDay = () => day(new Date().toISOString().slice(0, 10), -3);

export async function connect() {
	const { GSC_SERVICE_ACCOUNT_JSON: inline, GSC_KEY_FILE: file } = process.env;
	if (!inline && !file) {
		console.error(
			"Set GSC_SERVICE_ACCOUNT_JSON (the key JSON) or GSC_KEY_FILE (its path) in .env.",
		);
		process.exit(1);
	}
	const key = JSON.parse(inline || (await readFile(file, "utf8")));

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
		signal: AbortSignal.timeout(TIMEOUT),
		body: new URLSearchParams({
			grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
			assertion: `${body}.${sig.toString("base64url")}`,
		}),
	});
	if (!res.ok) throw new Error(`token: ${res.status} ${await res.text()}`);
	const auth = { authorization: `Bearer ${(await res.json()).access_token}` };

	async function api(path, body) {
		const res = await fetch(`${API}${path}`, {
			method: body ? "POST" : "GET",
			headers: { ...auth, "content-type": "application/json" },
			body: body && JSON.stringify(body),
			signal: AbortSignal.timeout(TIMEOUT),
		});
		if (!res.ok) {
			const err = new Error(`${path}: ${res.status} ${await res.text()}`);
			err.status = res.status;
			throw err;
		}
		return res.json();
	}

	const sites = (await api("/webmasters/v3/sites")).siteEntry ?? [];
	const site = ["sc-domain:bchworks.com", "https://bchworks.com/"].find((u) =>
		sites.some((s) => s.siteUrl === u),
	);
	if (!site) {
		console.error(
			`No bchworks.com property visible to ${key.client_email}. Sites: ${sites.map((s) => s.siteUrl).join(", ") || "none"}`,
		);
		process.exit(1);
	}
	const query = (startDate, endDate, dimensions, rowLimit = 25000) =>
		api(
			`/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`,
			{
				startDate,
				endDate,
				dimensions,
				rowLimit,
			},
		).then((r) => r.rows ?? []);
	const inspect = (url) =>
		api("/v1/urlInspection/index:inspect", {
			inspectionUrl: url,
			siteUrl: site,
		}).then((r) => r.inspectionResult?.indexStatusResult ?? {});

	return { site, query, inspect };
}
