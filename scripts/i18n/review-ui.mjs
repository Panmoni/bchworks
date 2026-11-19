#!/usr/bin/env node
// pnpm i18n:review-ui [locale] [--port <n>]
//
// The review console (PAN-413): a local page that shows each fresh machine
// draft beside its English with its QA verdict, and approves, edits or sends
// it back. Local only: it binds to 127.0.0.1, is not part of the site build
// and is never deployed. The reviewer comes from I18N_REVIEWER or is asked
// once. Logic in console.mjs; workflow in docs/i18n.md.
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { createInterface } from "node:readline/promises";
import { parseArgs } from "node:util";
import {
	DEFAULT_LOCALE,
	LOCALES,
	PSEUDO_CODES,
} from "../../src/i18n/locales.ts";
import { approve, approveClean, loadGroups, sendBack } from "./console.mjs";
import { RefusedError } from "./pipeline.mjs";

const DEFAULT_REVIEWER = { es: "George Donnelly" };
const HOST = "127.0.0.1";
const MAX_BODY = 4 * 1024 * 1024;

const { values, positionals } = parseArgs({
	allowPositionals: true,
	options: { port: { type: "string", default: "4330" } },
});

const others = LOCALES.map((l) => l.code).filter((c) => c !== DEFAULT_LOCALE);
const locale = positionals[0] ?? (others.length === 1 ? others[0] : undefined);
const port = Number(values.port);
if (!others.includes(locale) || !Number.isInteger(port) || port < 1) {
	console.error(
		`usage: pnpm i18n:review-ui [${others.join("|")}] [--port <n>]`,
	);
	process.exit(2);
}

const askReviewer = async () => {
	const fallback = DEFAULT_REVIEWER[locale];
	if (!process.stdin.isTTY) return fallback;
	const rl = createInterface({ input: process.stdin, output: process.stdout });
	const answer = await rl.question(
		`Reviewer name${fallback ? ` [${fallback}]` : ""}: `,
	);
	rl.close();
	return answer.trim() || fallback;
};
const reviewer = process.env.I18N_REVIEWER?.trim() || (await askReviewer());
if (!reviewer) {
	console.error("a review names its reviewer: set I18N_REVIEWER");
	process.exit(2);
}

const root = new URL("../..", import.meta.url).pathname;
const locales = [...new Set([...others, ...PSEUDO_CODES])];
const page = readFileSync(new URL("./review-ui.html", import.meta.url), "utf8");
const origins = new Set([`http://${HOST}:${port}`, `http://localhost:${port}`]);

const send = (res, status, body, type = "application/json; charset=utf-8") => {
	res.writeHead(status, {
		"content-type": type,
		"cache-control": "no-store",
		"x-content-type-options": "nosniff",
		"x-frame-options": "DENY",
	});
	res.end(type.startsWith("application/json") ? JSON.stringify(body) : body);
};

const readBody = (req) =>
	new Promise((resolve, reject) => {
		let size = 0;
		const chunks = [];
		req.on("data", (c) => {
			size += c.length;
			if (size > MAX_BODY) {
				reject(new RefusedError("request too large"));
				req.destroy();
			} else chunks.push(c);
		});
		req.on("end", () => {
			try {
				resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
			} catch {
				reject(new RefusedError("the request is not JSON"));
			}
		});
		req.on("error", reject);
	});

const actions = {
	"/api/approve": ({ id, edits }) => ({
		n: approve({ root, locale, locales, id, reviewer, edits }),
	}),
	"/api/approve-clean": ({ ids }) =>
		approveClean({ root, locale, locales, ids, reviewer }),
	"/api/send-back": ({ id, note }) => ({
		note: sendBack({ root, locale, locales, id, note, reviewer }),
	}),
};

const server = createServer(async (req, res) => {
	// A page on another site can reach 127.0.0.1 too: answer only requests
	// addressed to this console, and only same-origin JSON writes.
	if (!origins.has(`http://${req.headers.host}`))
		return send(res, 403, { error: "wrong host" });
	const url = new URL(req.url, `http://${req.headers.host}`);
	try {
		if (req.method === "GET" && url.pathname === "/")
			return send(res, 200, page, "text/html; charset=utf-8");
		if (req.method === "GET" && url.pathname === "/api/units")
			return send(res, 200, {
				locale,
				reviewer,
				...loadGroups({ root, locale, locales }),
			});
		const action = actions[url.pathname];
		if (req.method !== "POST" || !action)
			return send(res, 404, { error: "not found" });
		if (
			!origins.has(req.headers.origin) ||
			!req.headers["content-type"]?.startsWith("application/json")
		)
			return send(res, 403, { error: "same-origin JSON only" });
		const body = await readBody(req);
		const named =
			url.pathname === "/api/approve-clean"
				? Array.isArray(body.ids) &&
					body.ids.every((i) => typeof i === "string")
				: typeof body.id === "string";
		if (!named) throw new RefusedError("the request names no unit");
		return send(res, 200, action(body));
	} catch (e) {
		if (e instanceof RefusedError) return send(res, 409, { error: e.message });
		console.error(e);
		return send(res, 500, { error: String(e?.message ?? e) });
	}
});

server.on("error", (e) => {
	console.error(
		e.code === "EADDRINUSE"
			? `port ${port} is in use: pass --port <n>`
			: e.message,
	);
	process.exit(1);
});
server.listen(port, HOST, () => {
	console.log(
		`review console for ${locale}, reviewer ${reviewer}: http://${HOST}:${port}/`,
	);
});
