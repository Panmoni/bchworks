#!/usr/bin/env node
// pnpm i18n:review-ui [locale] [--port <n>]
//
// The review console (PAN-413): a local page that shows each fresh machine
// draft beside its English with its QA verdict, and approves, edits or sends
// it back. Local only: it binds to 127.0.0.1, is not part of the site build
// and is never deployed. The reviewer comes from I18N_REVIEWER or is asked
// once. Server and logic in console.mjs; workflow in docs/i18n.md.
import { readFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { parseArgs } from "node:util";
import {
	DEFAULT_LOCALE,
	LOCALES,
	PSEUDO_CODES,
} from "../../src/i18n/locales.ts";
import { consoleServer } from "./console.mjs";

const DEFAULT_REVIEWER = { es: "George Donnelly" };

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

// Asked, never assumed: without a terminal to ask on, I18N_REVIEWER is
// required, so nobody approves under the default name by accident.
const askReviewer = async () => {
	if (!process.stdin.isTTY) return undefined;
	const fallback = DEFAULT_REVIEWER[locale];
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

const server = consoleServer({
	root: new URL("../..", import.meta.url).pathname,
	locale,
	locales: [...new Set([...others, ...PSEUDO_CODES])],
	reviewer,
	port,
	page: readFileSync(new URL("./review-ui.html", import.meta.url), "utf8"),
});
server.on("error", (e) => {
	console.error(
		e.code === "EADDRINUSE"
			? `port ${port} is in use: pass --port <n>`
			: e.message,
	);
	process.exit(1);
});
server.listen(port, "127.0.0.1", () => {
	console.log(
		`review console for ${locale}, reviewer ${reviewer}: http://127.0.0.1:${port}/`,
	);
});
