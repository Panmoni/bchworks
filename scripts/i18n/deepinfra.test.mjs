// The DeepInfra QA reviewer (PAN-440), run against a fake fetch: no key and
// no network.
import assert from "node:assert/strict";
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
	const fetch = async (url, init) => {
		sent.push({ url, init, body: JSON.parse(init.body) });
		return { ok: status < 400, status, json: async () => reply };
	};
	return { fetch, sent };
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
		const { fetch } = fakeFetch({ error: "bad key k-secret" }, { status: 401 });
		const r = deepinfraReviewer({ fetch, key: "k-secret" });
		await assert.rejects(r.review(batch), (e) => {
			assert.ok(e instanceof TranslatorError);
			assert.doesNotMatch(e.message, /k-secret/);
			return true;
		});
	});

	test("a server error or a truncated reply fails the batch only", async () => {
		for (const [res, status] of [
			[{}, 503],
			[reply([], {}, "length"), 200],
		]) {
			const { fetch } = fakeFetch(res, { status });
			const r = deepinfraReviewer({ fetch, key: "k" });
			await assert.rejects(r.review(batch), (e) => {
				assert.equal(e instanceof TranslatorError, false);
				return true;
			});
		}
	});
});
