// pnpm i18n:qa: the deterministic checks, one fixture per check, then the
// whole pass against a small site written fresh for each test, with the
// model replaced by a fake reviewer.
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { beforeEach, describe, test } from "node:test";
import { hashSource } from "../../src/utils/localize.mjs";
import { dntPattern } from "./protect.mjs";
import {
	checkSegment,
	collect,
	glossaryMatchers,
	qa,
	summarize,
} from "./qa.mjs";

const TERMS = {
	wallet: { translation: "billetera", note: "Not monedero." },
	transaction: "transacción",
	send: "enviar",
	Support: { translation: "Ayuda", note: "Nav label." },
	satoshi: "satoshi",
};
const ctx = {
	dnt: dntPattern(["Bitcoin Cash", "BCH", "satoshi"]),
	dntWhole: /^(?:Bitcoin Cash|BCH|satoshi)$/u,
	glossary: glossaryMatchers(TERMS),
};
const check = (en, es, extra = {}) => checkSegment({ en, es, ...extra }, ctx);
const kinds = (findings) => findings.map((f) => f.check);
const only = (findings, kind) => findings.filter((f) => f.check === kind);

describe("glossary check", () => {
	test("flags a term whose required rendering is missing", () => {
		const f = only(check("Open your wallet.", "Abre tu monedero."), "glossary");
		assert.equal(f.length, 1);
		assert.match(f[0].message, /"wallet" should be "billetera"/);
	});

	test("accepts inflected and accented forms", () => {
		assert.deepEqual(
			only(check("Two wallets", "Dos billeteras"), "glossary"),
			[],
		);
		assert.deepEqual(
			only(check("Transactions", "Las transacciones"), "glossary"),
			[],
		);
		assert.deepEqual(only(check("Send BCH", "Envía BCH"), "glossary"), []);
	});

	test("reads a label only when the segment is the label", () => {
		assert.equal(only(check("Support", "Soporte"), "glossary").length, 1);
		assert.deepEqual(
			only(check("We support it.", "Lo apoyamos."), "glossary"),
			[],
		);
	});

	test("ignores a term inside code, a URL or a domain", () => {
		assert.deepEqual(
			only(
				check(
					"Run `wallet sync` on consensus.wallet.",
					"Ejecuta `wallet sync`.",
				),
				"glossary",
			),
			[],
		);
	});

	test("finds a rendering that is itself a do-not-translate term", () => {
		assert.deepEqual(
			only(check("Fractional satoshis", "Fracciones de satoshi"), "glossary"),
			[],
		);
	});
});

describe("register check", () => {
	test("flags usted", () => {
		assert.deepEqual(kinds(check("You can", "Usted puede")), ["register"]);
	});

	test("flags su/sus for your when tu/tus is absent", () => {
		assert.deepEqual(kinds(check("Keep your words.", "Guarde sus palabras.")), [
			"register",
			"register",
		]);
		assert.deepEqual(
			check("Your wallet and its key", "Tu billetera y su clave"),
			[],
		);
	});

	test("flags a formal imperative that opens a sentence", () => {
		const f = check("Download it. Make sure.", "Descargue la app. Asegúrese.");
		assert.deepEqual(
			f.map((x) => x.message),
			[
				'formal imperative "Descargue": use the tú form',
				'formal imperative "Asegúrese": use the tú form',
			],
		);
	});

	test("leaves tú forms and a first-person preterite alone", () => {
		assert.deepEqual(check("Download it.", "Descarga la app. Asegúrate."), []);
		assert.deepEqual(check("I chose it.", "Seleccioné eso."), []);
	});
});

describe("protected check", () => {
	test("flags a URL, code or name that changed or went missing", () => {
		const f = check(
			"See https://bch.info and `getblock` on Bitcoin Cash.",
			"Mira https://bch.info/es y `obtenerbloque` en Bitcoin.",
		);
		const p = only(f, "protected");
		assert.deepEqual(
			p.map((x) => x.severity),
			["high", "high", "high", "medium", "medium"],
		);
	});

	test("passes when every protected run is unchanged", () => {
		assert.deepEqual(
			check("Use {count} OP_CAT on BCH.", "Usa {count} OP_CAT en BCH."),
			[],
		);
	});

	test("reads a body's relative links one level deeper", () => {
		assert.deepEqual(
			check("See [it](./a.md).\n", "Mira [esto](../a.md).\n", { body: true }),
			[],
		);
	});

	test("joins a name wrapped across lines in a body", () => {
		assert.deepEqual(
			check("Bitcoin\nCash is cash.\n", "Bitcoin Cash es efectivo.\n", {
				body: true,
			}),
			[],
		);
	});
});

describe("untranslated check", () => {
	test("flags an English sentence left in the draft", () => {
		const f = check(
			"It works. You can do it.",
			"Funciona. You can do it with the other one.",
		);
		assert.deepEqual(kinds(f), ["untranslated"]);
		assert.equal(f[0].severity, "high");
	});

	test("flags a draft identical to its English", () => {
		assert.deepEqual(kinds(check("Read more", "Read more")), ["untranslated"]);
	});

	test("keeps an English document title as it is", () => {
		assert.deepEqual(
			check("Read more", "Read more", { field: "sources.0.title" }),
			[],
		);
		assert.deepEqual(check("BCH", "BCH"), []);
	});
});

describe("format check", () => {
	const fmt = (es) => only(check("x", es), "format").map((f) => f.message);

	test("flags a decimal point and an English thousands comma", () => {
		assert.match(fmt("Cuesta 0.5 BCH")[0], /decimal comma/);
		assert.match(fmt("Hay 21,000,000 BCH")[0], /thousands comma/);
	});

	test("flags a separator in a four-digit number and % without a no-break space", () => {
		assert.match(fmt("Son 2.048 bloques")[0], /four-digit/);
		assert.match(fmt("Sube un 5 %")[0], /no-break space/);
		assert.match(fmt("Sube un 5%")[0], /no-break space/);
	});

	test("flags an English date and a capitalised month", () => {
		assert.match(fmt("El May 15, 2022 salió")[0], /English date/);
		assert.match(fmt("El 15 de Mayo de 2022")[0], /lowercase/);
	});

	test("accepts the style guide's forms", () => {
		assert.deepEqual(
			fmt(
				"Cuesta 0,5 BCH, hay 10.000 BCH, 2048 bloques, 5 % y 15 de mayo de 2022",
			),
			[],
		);
	});
});

// ------------------------------------------------------------- whole pass

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

const EN_POST = "---\ntitle: Get a wallet\n---\nOpen your wallet.\n";
const machine = (sourceHash, extra = {}) => ({
	sourceHash,
	status: "machine",
	translator: "Claude",
	...extra,
});

beforeEach(() => {
	root = mkdtempSync(join(tmpdir(), "i18n-qa-"));
	wr("src/i18n/glossary/es.json", { wallet: "billetera" });
	wr("src/i18n/glossary/dnt.txt", "BCH\n");
	wr("messages/en.json", {
		$schema: "x",
		hello: "Hello",
		bye: "Bye",
		mine: "Mine",
		old: "Old",
	});
	wr("messages/es.json", {
		$schema: "x",
		hello: "Hola",
		bye: "Adiós",
		mine: "Mío",
		old: "Viejo",
	});
	wr("messages/meta/es.json", {
		hello: machine(hashSource(JSON.stringify("Hello"))),
		bye: machine(hashSource(JSON.stringify("Bye"))),
		mine: {
			...machine(hashSource(JSON.stringify("Mine"))),
			status: "reviewed",
			reviewer: "Ana",
		},
		old: machine("0000000000000000"),
	});
	wr("src/content/post/hello.md", EN_POST);
	wr(
		"src/content/post/es/hello.md",
		"---\ntitle: Consigue un monedero\ntranslation:\n" +
			`  sourceHash: ${hashSource(EN_POST)}\n  status: machine\n  translator: Claude\n` +
			"---\nAbre tu monedero.\n",
	);
	wr("src/data/glossary.json", [{ id: "fee", term: "Fee" }]);
	wr("src/data/i18n/es/glossary.json", {
		fee: { term: { text: "Tarifa", ...machine(hashSource("Fee")) } },
	});
});

const LOCALES = ["es"];

// Fixes every "monedero" and "Tarifa", flags "Adiós", passes the rest.
const fakeReviewer = () => {
	const calls = [];
	return {
		calls,
		async review(batch) {
			calls.push(batch);
			return batch.items.map(({ id, draft }) => {
				if (/monedero|Tarifa/.test(draft))
					return {
						id,
						verdict: "fixed",
						text: draft
							.replaceAll("monedero", "billetera")
							.replace("Consigue un", "Consigue una")
							.replace("Tarifa", "Comisión"),
						reason: "terminology",
					};
				if (draft === "Adiós")
					return { id, verdict: "flag", severity: "low", reason: "tone" };
				return { id, verdict: "clean" };
			});
		},
	};
};

describe("collect", () => {
	test("returns fresh machine units only, and counts stale ones", () => {
		const { units, stale } = collect({ root, locale: "es", locales: LOCALES });
		assert.deepEqual(units.map((u) => u.id).sort(), [
			"messages/es.json bye",
			"messages/es.json hello",
			"src/content/post/es/hello.md",
			"src/data/i18n/es/glossary.json fee.term",
		]);
		assert.equal(stale, 1);
		const post = units.find((u) => u.kind === "content");
		assert.deepEqual(
			post.segments.map((s) => s.field),
			["title", "body"],
		);
	});

	test("--only narrows by path", () => {
		const { units } = collect({
			root,
			locale: "es",
			locales: LOCALES,
			only: "src/content/**",
		});
		assert.deepEqual(
			units.map((u) => u.kind),
			["content"],
		);
	});
});

const run = (opts = {}) =>
	qa({
		root,
		locale: "es",
		units: collect({ root, locale: "es", locales: LOCALES }).units,
		...opts,
	});

describe("qa", () => {
	test("a dry run checks without a reviewer and writes nothing", async () => {
		const before = rd("src/content/post/es/hello.md");
		const { rows } = await run();
		assert.equal(rd("src/content/post/es/hello.md"), before);
		const title = rows.find((r) => r.field === "title");
		assert.equal(title.verdict, "flag");
		assert.match(title.reason, /glossary: "wallet" should be "billetera"/);
	});

	test("rows carry the verdict, severity, reason and both texts", async () => {
		const { rows } = await run({ reviewer: fakeReviewer() });
		const bye = rows.find((r) => r.key === "bye");
		assert.deepEqual(
			{ ...bye, checks: undefined },
			{
				unit: "messages/es.json bye",
				path: "messages/es.json",
				key: "bye",
				kind: "catalog",
				area: "catalog",
				verdict: "flag",
				severity: "low",
				reason: "tone",
				checks: undefined,
				en: "Bye",
				es: "Adiós",
			},
		);
		const hello = rows.find((r) => r.key === "hello");
		assert.equal(hello.verdict, "clean");
		assert.equal(hello.severity, null);
		const fee = rows.find((r) => r.area === "glossary");
		assert.equal(fee.verdict, "fixed");
		assert.equal(fee.fix, "Comisión");
		assert.equal(fee.applied, false);
		assert.equal(fee.es, "Tarifa");
		assert.deepEqual(summarize(rows).catalog, {
			rows: 2,
			clean: 1,
			fixed: 0,
			high: 0,
			medium: 0,
			low: 1,
		});
	});

	test("without --fix nothing is written", async () => {
		const before = [
			rd("messages/meta/es.json"),
			rd("src/content/post/es/hello.md"),
			rd("src/data/i18n/es/glossary.json"),
		];
		await run({ reviewer: fakeReviewer() });
		assert.deepEqual(
			[
				rd("messages/meta/es.json"),
				rd("src/content/post/es/hello.md"),
				rd("src/data/i18n/es/glossary.json"),
			],
			before,
		);
	});

	test("--fix writes fixed text, stamps a qaHash and keeps status machine", async () => {
		const { rows } = await run({ reviewer: fakeReviewer(), fix: true });
		const post = rd("src/content/post/es/hello.md");
		assert.match(post, /title: Consigue una billetera/);
		assert.match(post, /\nAbre tu billetera\.\n$/);
		assert.match(post, /status: machine/);
		assert.match(post, /qaHash: [0-9a-f]{16}/);
		const term = json("src/data/i18n/es/glossary.json").fee.term;
		assert.equal(term.text, "Comisión");
		assert.equal(term.status, "machine");
		assert.match(term.qaHash, /^[0-9a-f]{16}$/);
		const meta = json("messages/meta/es.json");
		assert.match(meta.hello.qaHash, /^[0-9a-f]{16}$/);
		assert.equal(meta.hello.status, "machine");
		const fee = rows.find((r) => r.area === "glossary");
		assert.equal(fee.applied, true);
		assert.equal(fee.es, "Comisión");
		assert.equal(rows.find((r) => r.field === "title").verdict, "fixed");
	});

	test("--fix never touches a reviewed or a stale unit", async () => {
		await run({ reviewer: fakeReviewer(), fix: true });
		const meta = json("messages/meta/es.json");
		assert.equal(meta.mine.qaHash, undefined);
		assert.equal(meta.mine.reviewer, "Ana");
		assert.equal(meta.old.qaHash, undefined);
		assert.equal(json("messages/es.json").mine, "Mío");
	});

	test("an unchanged unit is not sent again; a changed one is", async () => {
		const first = await run({ reviewer: fakeReviewer(), fix: true });
		const again = fakeReviewer();
		const second = await run({ reviewer: again, previous: first.rows });
		assert.equal(second.skipped, 4);
		assert.equal(again.calls.length, 0);
		assert.equal(second.rows.length, first.rows.length);

		const es = json("messages/es.json");
		wr("messages/es.json", { ...es, hello: "Buenas" });
		const third = fakeReviewer();
		const r = await run({ reviewer: third, previous: first.rows });
		assert.equal(r.skipped, 3);
		assert.deepEqual(
			third.calls.flatMap((c) => c.items.map((i) => i.id)),
			["messages/es.json hello"],
		);
	});

	test("a fix that breaks protected text is flagged, not written", async () => {
		const reviewer = {
			async review({ items }) {
				return items.map(({ id, draft }) => ({
					id,
					verdict: "fixed",
					text: draft.replace("tu", "tu BCH"),
					reason: "x",
				}));
			},
		};
		const before = rd("src/content/post/es/hello.md");
		const { rows } = await run({ reviewer, fix: true });
		const body = rows.find((r) => r.field === "body");
		assert.equal(body.verdict, "flag");
		assert.match(body.reason, /not applied: the fix changed protected text/);
		// The title fix was usable and the qaHash is stamped; the body is not.
		assert.match(rd("src/content/post/es/hello.md"), /\nAbre tu monedero\.\n$/);
		assert.notEqual(rd("src/content/post/es/hello.md"), before);
	});

	test("an API failure stops the run and carries the rows so far", async () => {
		const reviewer = {
			async review() {
				throw Object.assign(new Error("quota"), { name: "TranslatorError" });
			},
		};
		await assert.rejects(run({ reviewer, concurrency: 1 }), (e) => {
			assert.equal(e.message, "quota");
			assert.ok(Array.isArray(e.rows));
			return true;
		});
	});
});
