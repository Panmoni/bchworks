// The request `pnpm i18n:draft` sends to Claude. Built here without a key or a
// network call.
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
	buildRequest,
	buildReviewRequest,
	claudeReviewer,
	MODEL,
} from "./claude.mjs";

const payload = (req) => JSON.parse(req.messages[0].content);
const base = {
	locale: "es",
	from: "en",
	segments: ["Get a wallet"],
	terminology: { wallet: "billetera" },
};

describe("buildRequest", () => {
	test("carries the locale style brief when there is one", () => {
		const req = buildRequest({ ...base, style: "Usa tú, nunca usted." });
		assert.equal(payload(req).style, "Usa tú, nunca usted.");
		assert.match(req.system, /"style" brief/);
	});

	test("leaves the style key out when there is none", () => {
		assert.equal("style" in payload(buildRequest(base)), false);
	});

	test("names the languages and sends terminology and segments", () => {
		const p = payload(buildRequest(base));
		assert.equal(p.source, "English");
		assert.equal(p.target, "Spanish");
		assert.deepEqual(p.terminology, { wallet: "billetera" });
		assert.deepEqual(p.segments, ["Get a wallet"]);
	});

	test("keeps the system prompt byte-stable across locales", () => {
		const es = buildRequest({ ...base, style: "a" });
		const pt = buildRequest({ ...base, locale: "pt", style: "b" });
		assert.equal(es.system, pt.system);
	});
});

// The QA reviewer (PAN-412): same model and settings as a draft, its own
// prompt and schema. The client is a fake that records the request.
const fakeClient = (reply) => {
	const sent = [];
	return {
		sent,
		beta: {
			messages: {
				stream(req) {
					sent.push(req);
					return { finalMessage: async () => reply };
				},
			},
		},
	};
};
const item = {
	id: "a",
	english: "Get a wallet",
	draft: "Consigue un monedero",
	checks: [],
};

describe("claudeReviewer", () => {
	test("sends the draft model and settings with a reviewer prompt", async () => {
		const client = fakeClient({
			stop_reason: "end_turn",
			content: [
				{
					type: "text",
					text: JSON.stringify({
						verdicts: [
							{
								id: "a",
								verdict: "fixed",
								text: "Consigue una billetera",
								reason: "term",
							},
						],
					}),
				},
			],
		});
		const verdicts = await claudeReviewer({ client }).review({
			locale: "es",
			items: [item],
			terminology: { wallet: "billetera" },
			style: "Tú.",
		});
		assert.deepEqual(verdicts, [
			{
				id: "a",
				verdict: "fixed",
				text: "Consigue una billetera",
				reason: "term",
			},
		]);
		const [req] = client.sent;
		const draft = buildRequest({ ...base, style: "Tú." });
		assert.equal(req.model, MODEL);
		assert.equal(req.model, draft.model);
		assert.deepEqual(req.fallbacks, draft.fallbacks);
		assert.notEqual(req.system, draft.system);
		assert.match(req.system, /review/);
		const schema = req.output_config.format.schema;
		assert.deepEqual(schema.properties.verdicts.items.properties.verdict.enum, [
			"clean",
			"fixed",
			"flag",
		]);
		const p = payload(req);
		assert.deepEqual(p.items, [item]);
		assert.equal(p.style, "Tú.");
		assert.equal(p.target, "Spanish");
	});

	test("a refusal stops the run as a TranslatorError", async () => {
		const client = fakeClient({ stop_reason: "refusal", content: [] });
		await assert.rejects(
			claudeReviewer({ client }).review({
				locale: "es",
				items: [item],
				terminology: {},
			}),
			{ name: "TranslatorError" },
		);
	});

	test("keeps its system prompt byte-stable across locales", () => {
		const es = buildReviewRequest({ locale: "es", items: [], terminology: {} });
		const pt = buildReviewRequest({ locale: "pt", items: [], terminology: {} });
		assert.equal(es.system, pt.system);
	});
});
