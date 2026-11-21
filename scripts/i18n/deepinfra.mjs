// A second opinion from outside the Anthropic family (PAN-440): the
// `pnpm i18n:qa` review, sent to an open-weights model on DeepInfra's
// OpenAI-compatible API. The prompt, the payload and the verdict schema are
// the Claude reviewer's, so both reviewers answer the same question. The key
// comes from DEEPINFRA_API_KEY (the variable xmodel-review reads); it is sent
// only in the Authorization header and never printed.
import { buildReviewRequest, TranslatorError } from "./claude.mjs";

export const BASE_URL = "https://api.deepinfra.com/v1/openai";

// The labels and models xmodel-review uses for its panel. Any other value of
// --model is taken as a DeepInfra model id.
export const MODELS = {
	deepseek: "deepseek-ai/DeepSeek-V4-Pro",
	glm: "zai-org/GLM-5.2",
};
export const DEFAULT_MODEL = "deepseek";

// GLM spends its whole budget thinking at a higher effort and returns no
// JSON (measured in xmodel-review, 2026-08-14). DeepSeek takes no tuning.
const TUNING = { glm: { reasoning_effort: "low" } };

/** The /chat/completions body for one QA batch on `model`. */
export const buildDeepinfraRequest = (batch, model) => {
	const req = buildReviewRequest(batch);
	return {
		model: MODELS[model] ?? model,
		messages: [{ role: "system", content: req.system }, ...req.messages],
		response_format: {
			type: "json_schema",
			json_schema: {
				name: "verdicts",
				strict: true,
				schema: req.output_config.format.schema,
			},
		},
		max_tokens: 64000,
		temperature: 0.2,
		...TUNING[model],
	};
};

/**
 * The reviewer `pnpm i18n:qa --provider deepinfra` uses. `fetch` is
 * injectable so tests run without a key or a network. `usage` adds up the
 * tokens and DeepInfra's estimated cost of every call.
 */
export const deepinfraReviewer = ({
	model = DEFAULT_MODEL,
	fetch = globalThis.fetch,
	key = process.env.DEEPINFRA_API_KEY,
} = {}) => {
	if (!key) throw new TranslatorError("DEEPINFRA_API_KEY is not set");
	const usage = { calls: 0, prompt: 0, completion: 0, cost: 0 };
	return {
		name: model,
		model: MODELS[model] ?? model,
		usage,
		async review(batch) {
			let res;
			try {
				res = await fetch(`${BASE_URL}/chat/completions`, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${key}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(buildDeepinfraRequest(batch, model)),
					signal: AbortSignal.timeout(15 * 60_000),
				});
			} catch (e) {
				// A timeout or a dropped connection: this batch only.
				throw new Error(`DeepInfra: ${e.message}`);
			}
			// A rejected key, no credit or an unknown model: every batch would
			// fail the same way, so the run stops. The body is not echoed.
			if ([401, 402, 403, 404].includes(res.status))
				throw new TranslatorError(`DeepInfra: HTTP ${res.status}`);
			if (!res.ok) throw new Error(`DeepInfra: HTTP ${res.status}`);
			const body = await res.json();
			const u = body.usage ?? {};
			usage.calls++;
			usage.prompt += u.prompt_tokens ?? 0;
			usage.completion += u.completion_tokens ?? 0;
			usage.cost += u.estimated_cost ?? 0;
			const choice = body.choices?.[0];
			if (choice?.finish_reason === "length")
				throw new Error("DeepInfra: reply hit max_tokens");
			return JSON.parse(choice?.message?.content ?? "{}").verdicts ?? [];
		},
	};
};
