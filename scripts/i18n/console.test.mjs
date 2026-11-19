// The review console's logic (console.mjs) against a small site written
// fresh for each test, with a QA report from a fake model.
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { beforeEach, describe, test } from "node:test";
import { hashSource } from "../../src/utils/localize.mjs";
import {
	approve,
	approveClean,
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
	test("no report row is unchecked", () => {
		assert.equal(rate(unit, []).verdict, "unchecked");
	});
});

describe("approve", () => {
	test("approves one message through review, crediting the reviewer", () => {
		assert.equal(approve(args({ id: "messages/es.json nav_hello" })), 1);
		const meta = json("messages/meta/es.json");
		assert.equal(meta.nav_hello.status, "reviewed");
		assert.equal(meta.nav_hello.reviewer, "George");
		assert.equal(meta.nav_hello.sourceHash, h("Hello"));
		assert.equal(meta.nav_bye.status, "machine", "the rest untouched");
	});

	test("writes the reviewer's edit, then approves", () => {
		approve(args({ id: POST, edits: { title: "Consigue una billetera" } }));
		const doc = parseDoc(rd(POST), POST);
		assert.equal(doc.data.title, "Consigue una billetera");
		assert.equal(doc.data.translation.status, "reviewed");
		assert.equal(doc.data.translation.reviewer, "George");
		assert.equal(doc.body, "Abre tu billetera.\n");
	});

	test("refuses a stale unit and leaves its draft alone", () => {
		const before = [rd("messages/es.json"), rd("messages/meta/es.json")];
		assert.throws(
			() => approve(args({ id: "messages/es.json utxo_old" })),
			(e) => e instanceof RefusedError && /English changed/.test(e.message),
		);
		assert.throws(
			() =>
				approve(args({ id: "messages/es.json utxo_old", edits: { "": "x" } })),
			RefusedError,
		);
		assert.deepEqual(
			[rd("messages/es.json"), rd("messages/meta/es.json")],
			before,
		);
	});

	test("clears the unit's send-back note", () => {
		sendBack(args({ id: "messages/es.json nav_hello", note: "too stiff" }));
		approve(args({ id: "messages/es.json nav_hello" }));
		assert.deepEqual(json(notesPath("es")), {});
	});
});

describe("approveClean", () => {
	test("approves only clean or fixed rows, never flagged or sent back", () => {
		sendBack(
			args({ id: "src/data/i18n/es/glossary.json fee.term", note: "x" }),
		);
		const { approved, skipped } = approveClean(
			args({
				ids: [
					"messages/es.json nav_hello",
					"messages/es.json nav_bye",
					"messages/es.json utxo_old",
					"src/data/i18n/es/glossary.json fee.term",
					POST,
				],
			}),
		);
		assert.deepEqual(approved.sort(), ["messages/es.json nav_hello", POST]);
		assert.deepEqual(Object.fromEntries(skipped.map((s) => [s.id, s.why])), {
			"messages/es.json nav_bye": "QA rated it flag",
			"messages/es.json utxo_old": "not a fresh machine draft",
			"src/data/i18n/es/glossary.json fee.term": "sent back",
		});
		const meta = json("messages/meta/es.json");
		assert.equal(meta.nav_hello.status, "reviewed");
		assert.equal(meta.nav_bye.status, "machine");
		assert.equal(parseDoc(rd(POST), POST).data.translation.reviewer, "George");
	});

	test("approves nothing it was not sent", () => {
		assert.deepEqual(approveClean(args({ ids: [] })), {
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
});
