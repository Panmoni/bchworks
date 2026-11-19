// The reading copy (reading.mjs) against a small site written fresh for each
// test, with a QA report from a fake model.
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { beforeEach, describe, test } from "node:test";
import { hashSource } from "../../src/utils/localize.mjs";
import { reportPath } from "./console.mjs";
import { parseDoc, RefusedError } from "./pipeline.mjs";
import { collect, qa, qaHash } from "./qa.mjs";
import {
	applyNotes,
	blocks,
	buildReading,
	notesExport,
	parseNotes,
} from "./reading.mjs";

const LOCALES = ["es"];
let root;
const wr = (p, data) => {
	mkdirSync(dirname(join(root, p)), { recursive: true });
	writeFileSync(
		join(root, p),
		typeof data === "string" ? data : `${JSON.stringify(data, null, "\t")}\n`,
	);
};
const rd = (p) => readFileSync(join(root, p), "utf8");
const json = (p) => JSON.parse(rd(p));
const machine = (sourceHash) => ({
	sourceHash,
	status: "machine",
	translator: "Claude",
});
const h = (v) => hashSource(JSON.stringify(v));
const EN_POST =
	"---\ntitle: Get a wallet\n---\n## Pick one\n\nOpen your wallet.\n\n- one\n- two\n";
const POST = "src/content/post/es/hello.md";
const ctx = { locale: "es", locales: LOCALES };

// Flags "Adiós" high, passes the rest.
const fakeReviewer = {
	async review(batch) {
		return batch.items.map(({ id, draft }) =>
			draft === "Adiós"
				? { id, verdict: "flag", severity: "high", reason: "too curt" }
				: { id, verdict: "clean" },
		);
	},
};

beforeEach(async () => {
	root = mkdtempSync(join(tmpdir(), "i18n-reading-"));
	wr("src/i18n/glossary/es.json", {});
	wr("src/i18n/glossary/dnt.txt", "");
	wr("messages/en.json", {
		$schema: "x",
		nav_hello: "Hello",
		nav_bye: "Bye",
		nav_done: "Done",
	});
	wr("messages/es.json", {
		$schema: "x",
		nav_hello: "Hola",
		nav_bye: "Adiós",
		nav_done: "Hecho",
	});
	wr("messages/meta/es.json", {
		nav_hello: machine(h("Hello")),
		nav_bye: machine(h("Bye")),
		nav_done: { sourceHash: h("Done"), status: "reviewed", reviewer: "Ana" },
	});
	wr("src/content/post/hello.md", EN_POST);
	wr(
		POST,
		"---\ntitle: Consigue una billetera\ntranslation:\n" +
			`  sourceHash: ${hashSource(EN_POST)}\n  status: machine\n  translator: Claude\n` +
			"---\n## Elige una\n\nAbre tu billetera.\n\n- uno\n- dos\n",
	);
	wr("src/data/glossary.json", [{ id: "fee", term: "Fee" }]);
	wr("src/data/i18n/es/glossary.json", {
		fee: { term: { text: "Comisión", ...machine(hashSource("Fee")) } },
	});
	const { rows } = await qa({
		root,
		locale: "es",
		units: collect({ root, ...ctx }).units,
		reviewer: fakeReviewer,
		fix: false,
	});
	wr(reportPath("es"), { locale: "es", generatedAt: "2026-11-19", rows });
});

const build = (extra) =>
	buildReading({
		root,
		...ctx,
		nonce: "TESTNONCE",
		now: new Date("2026-11-19T00:00:00Z"),
		...extra,
	});

/** The `<article>` of one unit in the page. */
const article = (html, id) => {
	const start = html.indexOf(`data-id="${id}"`);
	assert.ok(start > 0, `no article for ${id}`);
	return html.slice(
		html.lastIndexOf("<article", start),
		html.indexOf("</article>", start),
	);
};

describe("blocks", () => {
	test("splits on blank lines, keeping a code fence and a list continuation whole", () => {
		const md =
			"# Title\n\nPara one\nstill one.\n\n```js\na\n\nb\n```\n\n- item\n\n  more of item\n\nLast.";
		assert.deepEqual(blocks(md), [
			"# Title",
			"Para one\nstill one.",
			"```js\na\n\nb\n```",
			"- item\n\n  more of item",
			"Last.",
		]);
	});
});

describe("buildReading", () => {
	test("one area per page, collection and overlay, with unit and flag counts", async () => {
		const { areas, stale } = await build();
		assert.equal(stale, 0);
		assert.deepEqual(areas, [
			{
				key: "catalog",
				label: "UI strings",
				units: 3,
				machine: 2,
				reviewed: 1,
				flags: 1,
			},
			{
				key: "post",
				label: "Blog posts",
				units: 1,
				machine: 1,
				reviewed: 0,
				flags: 0,
			},
			{
				key: "glossary",
				label: "Glossary",
				units: 1,
				machine: 1,
				reviewed: 0,
				flags: 0,
			},
		]);
	});

	test("the machine count matches the fresh machine units collect finds", async () => {
		const { areas } = await build();
		const machineTotal = areas.reduce((n, a) => n + a.machine, 0);
		assert.equal(machineTotal, collect({ root, ...ctx }).units.length);
	});

	test("renders the Markdown body paragraph by paragraph, frontmatter as labelled rows", async () => {
		const { html } = await build();
		const post = article(html, POST);
		assert.match(post, /<div class="label">title<\/div>/);
		assert.match(
			post,
			/Get a wallet<\/div><div class="tr">Consigue una billetera/,
		);
		assert.match(
			post,
			/<h2[^>]*>Pick one<\/h2>\s*<\/div><div class="tr"><h2[^>]*>Elige una<\/h2>/,
		);
		assert.match(post, /<li>one<\/li>/);
		assert.equal(post.match(/class="pair md"/g).length, 3);
	});

	test("highlights a flagged unit with its severity and reason, dims a reviewed one", async () => {
		const { html } = await build();
		const bye = article(html, "messages/es.json nav_bye");
		assert.match(bye, /class="unit machine flag flag-high"/);
		assert.match(bye, /QA flag: high/);
		assert.match(bye, /QA high: too curt/);
		const done = article(html, "messages/es.json nav_done");
		assert.match(done, /class="unit reviewed"/);
		assert.doesNotMatch(done, /class="good"/);
		assert.match(article(html, "messages/es.json nav_hello"), /class="good"/);
	});

	test("escapes the text and runs only its own nonced script", async () => {
		wr("messages/es.json", {
			$schema: "x",
			nav_hello: "<script>alert(1)</script>",
			nav_bye: "Adiós",
			nav_done: "Hecho",
		});
		const { html } = await build();
		assert.doesNotMatch(html, /<script>alert/);
		assert.match(html, /script-src 'nonce-TESTNONCE'/);
		assert.equal(html.match(/<script/g).length, 1);
		assert.match(html, /<script nonce="TESTNONCE">/);
	});

	test("raw HTML in a Markdown body cannot redirect or load from the network", async () => {
		const { html } = await build();
		assert.match(html, /base-uri 'none'; form-action 'none'/);
		assert.match(html, /img-src data:;/);
	});

	test("a paragraph keeps the body's reference links", async () => {
		const en =
			"---\ntitle: Get a wallet\n---\nSee [the docs][1].\n\nMore.\n\n[1]: https://example.com/\n";
		wr("src/content/post/hello.md", en);
		wr(
			POST,
			"---\ntitle: Consigue una billetera\ntranslation:\n" +
				`  sourceHash: ${hashSource(en)}\n  status: machine\n  translator: Claude\n` +
				"---\nMira [la documentación][1].\n\nMás.\n\n[1]: https://example.com/\n",
		);
		const post = article((await build()).html, POST);
		assert.match(post, /<a href="https:\/\/example.com\/">the docs<\/a>/);
		assert.match(
			post,
			/<a href="https:\/\/example.com\/">la documentación<\/a>/,
		);
	});

	test("--only narrows the copy", async () => {
		const { areas } = await build({ only: "src/content/**" });
		assert.deepEqual(
			areas.map((a) => a.key),
			["post"],
		);
	});
});

describe("notes export", () => {
	const current = { a: "h1", b: "h2", c: "h3", d: "h4" };

	test("lists marked units of this copy as { unit, viewHash, verdict, note }", () => {
		const store = {
			b: { viewHash: "h2", good: false, note: "  wrong term  " },
			a: { viewHash: "h1", good: true, note: "" },
			c: { viewHash: "old", good: true, note: "" }, // text changed since
			d: { viewHash: "h4", good: false, note: "   " }, // nothing marked
			gone: { viewHash: "h9", good: true, note: "" }, // not in this copy
		};
		assert.deepEqual(notesExport(store, current), [
			{ unit: "a", viewHash: "h1", verdict: "good", note: "" },
			{ unit: "b", viewHash: "h2", verdict: "fix", note: "wrong term" },
		]);
	});

	test("the page runs the same export function", async () => {
		const { html } = await build();
		assert.ok(html.includes(`const notesExport = ${notesExport.toString()};`));
	});

	test("parseNotes takes an export and refuses anything else", () => {
		const list = [{ unit: "a", viewHash: "h", verdict: "good", note: "" }];
		assert.deepEqual(parseNotes(JSON.stringify(list)), list);
		for (const bad of [
			"not json",
			"{}",
			JSON.stringify([{ unit: "a", viewHash: "h", verdict: "ok", note: "" }]),
			JSON.stringify([{ unit: "a", verdict: "good", note: "" }]),
		])
			assert.throws(() => parseNotes(bad), RefusedError);
	});
});

describe("applyNotes", () => {
	/** The notes the page would export for these marks, as a reviewer saves them. */
	const exportFor = async (marks) => {
		const { html } = await build();
		const current = JSON.parse(html.match(/const CONFIG = (.*);/)[1]).current;
		const store = {};
		for (const [id, m] of Object.entries(marks))
			store[id] = { viewHash: current[id], ...m };
		return parseNotes(JSON.stringify(notesExport(store, current)));
	};

	test("approves the good units and lists the noted ones to fix", async () => {
		const notes = await exportFor({
			"messages/es.json nav_hello": { good: true, note: "" },
			[POST]: { good: true, note: "check the list" },
			"src/data/i18n/es/glossary.json fee.term": {
				good: false,
				note: "use tarifa",
			},
		});
		const { approved, refused, toFix } = applyNotes({
			root,
			...ctx,
			notes,
			reviewer: "George",
		});
		assert.deepEqual(refused, []);
		assert.deepEqual(
			approved.map((a) => a.unit),
			["messages/es.json nav_hello", POST],
		);
		assert.equal(json("messages/meta/es.json").nav_hello.status, "reviewed");
		assert.equal(json("messages/meta/es.json").nav_bye.status, "machine");
		const post = parseDoc(rd(POST), POST).data.translation;
		assert.equal(post.status, "reviewed");
		assert.equal(post.reviewer, "George");
		assert.equal(
			json("src/data/i18n/es/glossary.json").fee.term.status,
			"machine",
		);
		assert.deepEqual(
			toFix.map((t) => [t.unit, t.verdict, t.note]),
			[
				[POST, "good", "check the list"],
				["src/data/i18n/es/glossary.json fee.term", "fix", "use tarifa"],
			],
		);
	});

	test("refuses a unit whose draft changed since the reading copy", async () => {
		const notes = await exportFor({
			"messages/es.json nav_hello": { good: true, note: "" },
		});
		wr("messages/es.json", {
			$schema: "x",
			nav_hello: "Buenas",
			nav_bye: "Adiós",
			nav_done: "Hecho",
		});
		const { approved, refused } = applyNotes({
			root,
			...ctx,
			notes,
			reviewer: "George",
		});
		assert.deepEqual(approved, []);
		assert.equal(refused.length, 1);
		assert.match(refused[0].why, /changed since/);
		assert.equal(json("messages/meta/es.json").nav_hello.status, "machine");
	});

	test("refuses a unit whose English changed (stale)", async () => {
		const notes = await exportFor({
			"messages/es.json nav_hello": { good: true, note: "" },
		});
		wr("messages/en.json", {
			$schema: "x",
			nav_hello: "Hello there",
			nav_bye: "Bye",
			nav_done: "Done",
		});
		const { approved, refused } = applyNotes({
			root,
			...ctx,
			notes,
			reviewer: "George",
		});
		assert.deepEqual(approved, []);
		assert.equal(refused.length, 1);
		assert.equal(json("messages/meta/es.json").nav_hello.status, "machine");
	});

	test("a forged hash is refused", () => {
		const id = "messages/es.json nav_hello";
		const unit = collect({ root, ...ctx }).units.find((u) => u.id === id);
		assert.notEqual(qaHash(unit), "forged");
		const { refused } = applyNotes({
			root,
			...ctx,
			notes: [{ unit: id, viewHash: "forged", verdict: "good", note: "" }],
			reviewer: "George",
		});
		assert.equal(refused.length, 1);
	});
});
