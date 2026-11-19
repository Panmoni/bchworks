// The review console's logic (console.mjs) against a small site written
// fresh for each test, with a QA report from a fake model.
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { request } from "node:http";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, test } from "node:test";
import { hashSource } from "../../src/utils/localize.mjs";
import {
	approve,
	approveClean,
	consoleServer,
	loadGroups,
	notesPath,
	rate,
	reportPath,
	sendBack,
} from "./console.mjs";
import { parseDoc, RefusedError } from "./pipeline.mjs";
import { collect, qa } from "./qa.mjs";

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
const EN_POST = "---\ntitle: Get a wallet\n---\nOpen your wallet.\n";
const POST = "src/content/post/es/hello.md";
const args = (extra) => ({
	root,
	locale: "es",
	locales: LOCALES,
	reviewer: "George",
	...extra,
});

// Fixes "monedero", flags "Adiós" high, passes the rest.
const fakeReviewer = {
	async review(batch) {
		return batch.items.map(({ id, draft }) =>
			/monedero/.test(draft)
				? {
						id,
						verdict: "fixed",
						text: draft.replaceAll("monedero", "billetera"),
						reason: "terminology",
					}
				: draft === "Adiós"
					? { id, verdict: "flag", severity: "high", reason: "tone" }
					: { id, verdict: "clean" },
		);
	},
};

beforeEach(async () => {
	root = mkdtempSync(join(tmpdir(), "i18n-console-"));
	wr("src/i18n/glossary/es.json", {});
	wr("src/i18n/glossary/dnt.txt", "");
	wr("messages/en.json", {
		$schema: "x",
		nav_hello: "Hello",
		nav_bye: "Bye",
		utxo_old: "Old",
	});
	wr("messages/es.json", {
		$schema: "x",
		nav_hello: "Hola",
		nav_bye: "Adiós",
		utxo_old: "Viejo",
	});
	wr("messages/meta/es.json", {
		nav_hello: machine(h("Hello")),
		nav_bye: machine(h("Bye")),
		utxo_old: machine("0000000000000000"),
	});
	wr("src/content/post/hello.md", EN_POST);
	wr(
		POST,
		"---\ntitle: Consigue un monedero\ntranslation:\n" +
			`  sourceHash: ${hashSource(EN_POST)}\n  status: machine\n  translator: Claude\n` +
			"---\nAbre tu monedero.\n",
	);
	wr("src/data/glossary.json", [{ id: "fee", term: "Fee" }]);
	wr("src/data/i18n/es/glossary.json", {
		fee: { term: { text: "Comisión", ...machine(hashSource("Fee")) } },
	});
	const { rows } = await qa({
		root,
		locale: "es",
		units: collect({ root, locale: "es", locales: LOCALES }).units,
		reviewer: fakeReviewer,
		fix: true,
	});
	wr(reportPath("es"), { locale: "es", generatedAt: "2026-11-19", rows });
});

const rowsById = () =>
	new Map(
		loadGroups(args())
			.groups.flatMap((g) => g.rows)
			.map((r) => [r.id, r]),
	);

describe("loadGroups", () => {
	test("one row per fresh machine unit, with its QA verdict", () => {
		const rows = rowsById();
		assert.deepEqual([...rows.keys()].sort(), [
			"messages/es.json nav_bye",
			"messages/es.json nav_hello",
			POST,
			"src/data/i18n/es/glossary.json fee.term",
		]);
		assert.deepEqual(rows.get("messages/es.json nav_bye").rating, {
			verdict: "flag",
			severity: "high",
			reason: "tone",
		});
		assert.equal(rows.get(POST).rating.verdict, "fixed");
		assert.equal(rows.get(POST).segments[0].es, "Consigue un billetera");
	});

	test("groups by area, the catalog by key prefix, flagged first", () => {
		const { groups, stale } = loadGroups(args());
		assert.equal(stale, 1);
		assert.equal(groups[0].name, "catalog: nav");
		assert.deepEqual(
			groups[0].rows.map((r) => r.key),
			["nav_bye", "nav_hello"],
		);
		assert.deepEqual(
			groups
				.map((g) => g.name)
				.slice(1)
				.sort(),
			["glossary", "post"],
		);
	});

	test("a draft edited since QA is unchecked, so never bulk-approved", () => {
		wr("messages/es.json", {
			...json("messages/es.json"),
			nav_hello: "Buenas",
		});
		assert.equal(
			rowsById().get("messages/es.json nav_hello").rating.verdict,
			"unchecked",
		);
	});
});

describe("loadGroups: notes and order", () => {
	test("a sent-back row sorts after flags and above clean rows", () => {
		sendBack(args({ id: "messages/es.json nav_hello", note: "x" }));
		const nav = loadGroups(args()).groups[0];
		assert.deepEqual(
			nav.rows.map((r) => [r.key, r.note?.note ?? null]),
			[
				["nav_bye", null],
				["nav_hello", "x"],
			],
		);
	});

	test("a note lapses once the draft changes", () => {
		const id = "messages/es.json nav_hello";
		sendBack(args({ id, note: "too stiff" }));
		wr("messages/es.json", {
			...json("messages/es.json"),
			nav_hello: "Buenas",
		});
		assert.equal(rowsById().get(id).note, undefined);
	});
});

describe("rate", () => {
	const unit = { kind: "catalog", segments: [{ field: "", es: "Hola" }] };
	test("a fix QA suggested but did not write is unchecked", () => {
		const row = {
			verdict: "fixed",
			es: "Hola",
			fix: "Buenas",
			applied: false,
		};
		const r = rate(unit, [row]);
		assert.equal(r.verdict, "unchecked");
		assert.match(r.reason, /Buenas/);
	});
	test("no report row, or a row for other text, is unchecked", () => {
		assert.equal(rate(unit, []).verdict, "unchecked");
		const r = rate(unit, [{ verdict: "clean", es: "Buenas" }]);
		assert.equal(r.verdict, "unchecked");
		assert.match(r.reason, /changed since QA/);
	});
	test("a flag on one string outranks an unchecked one, and both show", () => {
		const two = {
			kind: "content",
			segments: [
				{ field: "title", es: "Nuevo" },
				{ field: "body", es: "Cuerpo" },
			],
		};
		const r = rate(two, [
			{ field: "title", verdict: "clean", es: "Viejo" },
			{
				field: "body",
				verdict: "flag",
				severity: "high",
				reason: "drift",
				es: "Cuerpo",
			},
		]);
		assert.equal(r.verdict, "flag");
		assert.equal(r.severity, "high");
		assert.match(r.reason, /title: The text changed/);
		assert.match(r.reason, /body: drift/);
	});
});

const view = (id) => rowsById().get(id).viewHash;

describe("approve", () => {
	const HELLO = "messages/es.json nav_hello";

	test("approves one message through review, crediting the reviewer", () => {
		assert.equal(approve(args({ id: HELLO, viewHash: view(HELLO) })), 1);
		const meta = json("messages/meta/es.json");
		assert.equal(meta.nav_hello.status, "reviewed");
		assert.equal(meta.nav_hello.reviewer, "George");
		assert.equal(meta.nav_hello.sourceHash, h("Hello"));
		assert.equal(meta.nav_bye.status, "machine", "the rest untouched");
	});

	test("writes the reviewer's edit, then approves", () => {
		approve(
			args({
				id: POST,
				viewHash: view(POST),
				edits: { title: "Consigue una billetera" },
			}),
		);
		const doc = parseDoc(rd(POST), POST);
		assert.equal(doc.data.title, "Consigue una billetera");
		assert.equal(doc.data.translation.status, "reviewed");
		assert.equal(doc.data.translation.reviewer, "George");
		assert.equal(doc.body, "Abre tu billetera.\n");
	});

	test("refuses text changed since the console showed it, writing nothing", () => {
		const shown = view(POST);
		wr(POST, rd(POST).replace("Abre tu", "Abre ya tu"));
		const before = rd(POST);
		assert.throws(
			() =>
				approve(args({ id: POST, viewHash: shown, edits: { title: "Otro" } })),
			(e) => e instanceof RefusedError && /changed since/.test(e.message),
		);
		assert.equal(rd(POST), before);
	});

	test("refuses a stale unit and leaves its draft alone", () => {
		const id = "messages/es.json utxo_old";
		const before = [rd("messages/es.json"), rd("messages/meta/es.json")];
		assert.throws(
			() => approve(args({ id, viewHash: "x" })),
			(e) => e instanceof RefusedError && /English changed/.test(e.message),
		);
		assert.throws(
			() => approve(args({ id, viewHash: "x", edits: { "": "x" } })),
			RefusedError,
		);
		assert.deepEqual(
			[rd("messages/es.json"), rd("messages/meta/es.json")],
			before,
		);
	});

	test("an id without a key never reviews a whole catalog", () => {
		assert.throws(
			() => approve(args({ id: "messages/es.json", viewHash: "x" })),
			RefusedError,
		);
		assert.equal(json("messages/meta/es.json").nav_bye.status, "machine");
	});

	test("an already reviewed unit keeps its reviewer and takes no edit", () => {
		approve(args({ id: HELLO, viewHash: view(HELLO), reviewer: "Ana" }));
		assert.equal(approve(args({ id: HELLO, viewHash: "x" })), 0);
		assert.equal(json("messages/meta/es.json").nav_hello.reviewer, "Ana");
		const before = rd("messages/es.json");
		assert.throws(
			() => approve(args({ id: HELLO, viewHash: "x", edits: { "": "Hey" } })),
			RefusedError,
		);
		assert.equal(rd("messages/es.json"), before);
	});

	test("clears the unit's send-back note", () => {
		sendBack(args({ id: HELLO, note: "too stiff" }));
		approve(args({ id: HELLO, viewHash: view(HELLO) }));
		assert.deepEqual(json(notesPath("es")), {});
	});
});

describe("approveClean", () => {
	const item = (id) => ({ id, viewHash: view(id) });

	test("approves only clean or fixed rows, never flagged or sent back", () => {
		const FEE = "src/data/i18n/es/glossary.json fee.term";
		sendBack(args({ id: FEE, note: "x" }));
		const items = [
			item("messages/es.json nav_hello"),
			item("messages/es.json nav_bye"),
			{ id: "messages/es.json utxo_old", viewHash: "x" },
			item(FEE),
			item(POST),
		];
		const { approved, skipped } = approveClean(args({ items }));
		assert.deepEqual(approved.sort(), ["messages/es.json nav_hello", POST]);
		assert.deepEqual(Object.fromEntries(skipped.map((s) => [s.id, s.why])), {
			"messages/es.json nav_bye": "QA rated it flag",
			"messages/es.json utxo_old": "not a fresh machine draft",
			[FEE]: "sent back",
		});
		const meta = json("messages/meta/es.json");
		assert.equal(meta.nav_hello.status, "reviewed");
		assert.equal(meta.nav_bye.status, "machine");
		assert.equal(parseDoc(rd(POST), POST).data.translation.reviewer, "George");
	});

	test("skips a row changed since the console showed it", () => {
		const { approved, skipped } = approveClean(
			args({ items: [{ id: POST, viewHash: "old" }] }),
		);
		assert.deepEqual(approved, []);
		assert.match(skipped[0].why, /changed since/);
	});

	test("approves nothing it was not sent", () => {
		assert.deepEqual(approveClean(args({ items: [] })), {
			approved: [],
			skipped: [],
		});
		assert.equal(json("messages/meta/es.json").nav_hello.status, "machine");
	});
});

describe("sendBack", () => {
	test("keeps a note per unit, and an empty note clears it", () => {
		const id = "messages/es.json nav_bye";
		const saved = sendBack(args({ id, note: " Too formal. " }));
		assert.equal(saved.note, "Too formal.");
		assert.equal(json(notesPath("es"))[id].reviewer, "George");
		assert.equal(rowsById().get(id).note.note, "Too formal.");
		assert.equal(sendBack(args({ id, note: "" })), null);
		assert.deepEqual(json(notesPath("es")), {});
	});

	test("refuses a note on something that is not a unit", () => {
		assert.throws(
			() => sendBack(args({ id: "messages/es.json nope", note: "x" })),
			RefusedError,
		);
	});
});

describe("consoleServer", () => {
	let server;
	let base;
	beforeEach(async () => {
		server = consoleServer({ ...args(), port: 0, page: "<p>page</p>" });
		await new Promise((r) => server.listen(0, "127.0.0.1", r));
		const { port } = server.address();
		server.close();
		// Listen again with the port it will be addressed on.
		server = consoleServer({ ...args(), port, page: "<p>page</p>" });
		await new Promise((r) => server.listen(port, "127.0.0.1", r));
		base = `http://127.0.0.1:${port}`;
	});
	afterEach(() => server.close());

	// node:http, so Host and Origin can be set freely.
	const call = (path, { method = "GET", headers = {}, body } = {}) =>
		new Promise((resolve, reject) => {
			const req = request(`${base}${path}`, { method, headers }, (res) => {
				let text = "";
				res.on("data", (c) => {
					text += c;
				});
				res.on("end", () => resolve({ status: res.statusCode, text }));
			});
			req.on("error", reject);
			req.end(body);
		});
	const post = (path, body, headers = {}) =>
		call(path, {
			method: "POST",
			headers: {
				origin: base,
				"content-type": "application/json",
				...headers,
			},
			body: typeof body === "string" ? body : JSON.stringify(body),
		});

	test("serves the page and the units on its own host", async () => {
		assert.equal((await call("/")).text, "<p>page</p>");
		const units = JSON.parse((await call("/api/units")).text);
		assert.equal(units.reviewer, "George");
		assert.equal(units.groups.length, 3);
	});

	test("refuses another host, another origin and a non-JSON write", async () => {
		const evil = { host: "evil.example:80" };
		assert.equal((await call("/", { headers: evil })).status, 403);
		const id = { id: "messages/es.json nav_hello", viewHash: "x" };
		assert.equal(
			(await post("/api/approve", id, { origin: "http://evil.example" }))
				.status,
			403,
		);
		assert.equal(
			(await post("/api/approve", id, { "content-type": "text/plain" })).status,
			403,
		);
		assert.equal(json("messages/meta/es.json").nav_hello.status, "machine");
	});

	test("refuses a malformed body with 409, never a crash", async () => {
		for (const [path, body] of [
			["/api/approve", "null"],
			["/api/approve", "not json"],
			["/api/approve", { id: 42, viewHash: "x" }],
			["/api/approve-clean", { ids: ["a"] }],
			["/api/send-back", { id: "x", note: 5 }],
		])
			assert.equal((await post(path, body)).status, 409, `${path} ${body}`);
	});

	test("approves through the server", async () => {
		const id = "messages/es.json nav_hello";
		const res = await post("/api/approve", { id, viewHash: view(id) });
		assert.deepEqual(JSON.parse(res.text), { n: 1 });
		assert.equal(json("messages/meta/es.json").nav_hello.reviewer, "George");
	});
});
