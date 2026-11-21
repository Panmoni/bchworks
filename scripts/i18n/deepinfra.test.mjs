// The DeepInfra QA reviewer (PAN-440), run against a fake fetch: no key and
// no network.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { describe, test } from "node:test";
import { buildReviewRequest, TranslatorError } from "./claude.mjs";
import {
	BASE_URL,
	buildDeepinfraRequest,
	deepinfraReviewer,
	MODELS,
} from "./deepinfra.mjs";

const batch = {
	locale: "es",
	from: "en",
	items: [
		{ id: "a", english: "Get a wallet", draft: "Ten billetera", checks: [] },
	],
	terminology: { wallet: "billetera" },
	style: "Usa tú.",
};

const fakeFetch = (reply, { status = 200 } = {}) => {
	const sent = [];
	const cancelled = [];
	const fetch = async (url, init) => {
		sent.push({ url, init, body: JSON.parse(init.body) });
		return {
			ok: status < 400,
			status,
			json: async () => reply,
			body: { cancel: async () => cancelled.push(status) },
		};
	};
	return { fetch, sent, cancelled };
};

const reply = (verdicts, usage = {}, finish_reason = "stop") => ({
	choices: [
		{ message: { content: JSON.stringify({ verdicts }) }, finish_reason },
	],
	usage,
});

describe("buildDeepinfraRequest", () => {
	test("asks the Claude reviewer's question, byte for byte", () => {
		const claude = buildReviewRequest(batch);
		const req = buildDeepinfraRequest(batch, "deepseek");
		assert.equal(req.messages[0].role, "system");
		assert.equal(req.messages[0].content, claude.system);
		assert.deepEqual(req.messages.slice(1), claude.messages);
		assert.deepEqual(
			req.response_format.json_schema.schema,
			claude.output_config.format.schema,
		);
	});

	test("maps the labels to xmodel-review's models; takes any other id as is", () => {
		assert.equal(
			buildDeepinfraRequest(batch, "deepseek").model,
			MODELS.deepseek,
		);
		assert.equal(buildDeepinfraRequest(batch, "glm").model, "zai-org/GLM-5.2");
		assert.equal(buildDeepinfraRequest(batch, "org/x").model, "org/x");
	});

	test("bounds GLM's thinking and leaves DeepSeek untuned", () => {
		assert.equal(buildDeepinfraRequest(batch, "glm").reasoning_effort, "low");
		assert.equal(
			"reasoning_effort" in buildDeepinfraRequest(batch, "deepseek"),
			false,
		);
	});
});

describe("deepinfraReviewer", () => {
	test("a missing key fails closed before any call", () => {
		const { fetch, sent } = fakeFetch(reply([]));
		assert.throws(
			() => deepinfraReviewer({ fetch, key: "" }),
			(e) =>
				e instanceof TranslatorError && /DEEPINFRA_API_KEY/.test(e.message),
		);
		assert.equal(sent.length, 0);
	});

	test("posts to DeepInfra with the key as a bearer token and returns the verdicts", async () => {
		const verdicts = [
			{
				id: "a",
				verdict: "fixed",
				text: "Consigue una billetera",
				reason: "x",
			},
		];
		const { fetch, sent } = fakeFetch(reply(verdicts));
		const r = deepinfraReviewer({ fetch, key: "k-123", model: "glm" });
		assert.deepEqual(await r.review(batch), verdicts);
		assert.equal(sent[0].url, `${BASE_URL}/chat/completions`);
		assert.equal(sent[0].init.headers.Authorization, "Bearer k-123");
		assert.equal(sent[0].body.model, MODELS.glm);
		assert.equal(r.model, MODELS.glm);
	});

	test("adds up tokens and estimated cost across calls", async () => {
		const { fetch } = fakeFetch(
			reply([], {
				prompt_tokens: 10,
				completion_tokens: 4,
				estimated_cost: 0.5,
			}),
		);
		const r = deepinfraReviewer({ fetch, key: "k" });
		await r.review(batch);
		await r.review(batch);
		assert.deepEqual(r.usage, { calls: 2, prompt: 20, completion: 8, cost: 1 });
	});

	test("a rejected key stops the run without echoing the body or the key", async () => {
		const { fetch, cancelled } = fakeFetch(
			{ error: "bad key k-secret" },
			{ status: 401 },
		);
		const r = deepinfraReviewer({ fetch, key: "k-secret" });
		await assert.rejects(r.review(batch), (e) => {
			assert.ok(e instanceof TranslatorError);
			assert.equal(e.message, "DeepInfra: HTTP 401");
			return true;
		});
		assert.deepEqual(cancelled, [401]);
	});

	test("a server error or a truncated reply fails the batch only", async () => {
		for (const [res, status, message] of [
			[{}, 503, "DeepInfra: HTTP 503"],
			[reply([], {}, "length"), 200, "DeepInfra: reply hit max_tokens"],
		]) {
			const { fetch } = fakeFetch(res, { status });
			const r = deepinfraReviewer({ fetch, key: "k" });
			await assert.rejects(r.review(batch), (e) => {
				assert.equal(e instanceof TranslatorError, false);
				assert.equal(e.message, message);
				return true;
			});
		}
	});

	test("a malformed reply fails the batch only, never the run", async () => {
		const content = (c) => ({ choices: [{ message: { content: c } }] });
		for (const res of [
			content('{"verdicts":{"id":"a"}}'),
			content('{"verdicts":[null]}'),
			content('{"verdicts":[{"id":"a","verdict":"Flag"}]}'),
			content("{}"),
			content("not json"),
			{},
		]) {
			const { fetch } = fakeFetch(res);
			const r = deepinfraReviewer({ fetch, key: "k" });
			await assert.rejects(r.review(batch), (e) => {
				assert.equal(e instanceof TranslatorError, false);
				return true;
			});
		}
	});

	test("an unknown model or no credit stops the run", async () => {
		for (const status of [402, 403, 404]) {
			const { fetch } = fakeFetch({}, { status });
			const r = deepinfraReviewer({ fetch, key: "k" });
			await assert.rejects(r.review(batch), TranslatorError);
		}
	});

	test("counts usage as numbers whatever type the API sends", async () => {
		const { fetch } = fakeFetch(
			reply([], { prompt_tokens: "7", estimated_cost: "0.25" }),
		);
		const r = deepinfraReviewer({ fetch, key: "k" });
		await r.review(batch);
		assert.deepEqual(r.usage, {
			calls: 1,
			prompt: 7,
			completion: 0,
			cost: 0.25,
		});
	});

	test("a model id never resolves through an inherited property", () => {
		assert.equal(
			buildDeepinfraRequest(batch, "constructor").model,
			"constructor",
		);
	});
});

// The CLI's guards (qa-cli.mjs), run as a process with no key: neither path
// may reach the network.
describe("pnpm i18n:qa --provider deepinfra", () => {
	const cli = new URL("./qa-cli.mjs", import.meta.url).pathname;
	const run = (...args) => {
		const { DEEPINFRA_API_KEY: _, ...env } = process.env;
		return spawnSync(process.execPath, [cli, "es", ...args], {
			env,
			encoding: "utf8",
		});
	};

	test("refuses --fix: its findings are advisory", () => {
		const r = run("--provider", "deepinfra", "--fix");
		assert.equal(r.status, 2);
		assert.match(r.stderr, /usage:/);
	});

	test("a missing key stops before any call", () => {
		const r = run("--provider", "deepinfra", "--units", "/dev/null");
		assert.equal(r.status, 1);
		assert.match(r.stderr, /DEEPINFRA_API_KEY is not set/);
	});
});
