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

// xmodel-review's tuning for the same models: at a higher effort GLM can
// spend its whole budget thinking and return no JSON. DeepSeek takes none.
const TUNING = { glm: { reasoning_effort: "low" } };

const resolve = (model) =>
	Object.hasOwn(MODELS, model) ? MODELS[model] : model;

/** The /chat/completions body for one QA batch on `model`. */
export const buildDeepinfraRequest = (batch, model) => {
	const req = buildReviewRequest(batch);
	return {
		model: resolve(model),
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
		// Streamed so the headers arrive at once. Unstreamed, a long review
		// sends nothing until it ends, and Node's fetch drops a request whose
		// headers take over 300 s, well before the 15-minute abort below.
		stream: true,
		stream_options: { include_usage: true },
		...(Object.hasOwn(TUNING, model) ? TUNING[model] : {}),
	};
};

/**
 * Reads an OpenAI-style event stream into the shape of an unstreamed reply:
 * the content deltas joined, the last finish_reason, and the usage from the
 * final chunk. A malformed event throws a SyntaxError.
 */
export const readEventStream = async (stream) => {
	let content = "";
	let finish_reason;
	let usage;
	let rest = "";
	const take = (line) => {
		if (!line.startsWith("data:")) return;
		const data = line.slice(5).trim();
		if (data === "[DONE]") return;
		const event = JSON.parse(data);
		// After the 200 headers, a failure arrives as an error event.
		if (event.error)
			throw new StreamError(event.error.message ?? "error in the stream");
		if (event.usage) usage = event.usage;
		const choice = event.choices?.[0];
		if (choice?.delta?.content) content += choice.delta.content;
		if (choice?.finish_reason) finish_reason = choice.finish_reason;
	};
	for await (const chunk of stream.pipeThrough(new TextDecoderStream())) {
		const lines = (rest + chunk).split("\n");
		rest = lines.pop();
		lines.forEach(take);
	}
	take(rest);
	// A clean close before the model finished is a transport fault.
	if (!finish_reason) throw new StreamError("the stream ended early");
	return { choices: [{ message: { content }, finish_reason }], usage };
};

/** A failure the stream itself reports: never a malformed reply. */
class StreamError extends Error {}

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
		model: resolve(model),
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
				throw new Error(`DeepInfra: ${e.message}`, { cause: e });
			}
			if (!res.ok) {
				// Release the connection; the body is not read or echoed.
				await res.body?.cancel();
				// A rejected key, no credit or an unknown model: every batch
				// would fail the same way, so the run stops.
				if ([401, 402, 403, 404].includes(res.status))
					throw new TranslatorError(`DeepInfra: HTTP ${res.status}`);
				throw new Error(`DeepInfra: HTTP ${res.status}`);
			}
			const parse = async (read) => {
				try {
					return await read();
				} catch (e) {
					throw new Error(`DeepInfra (${model}): unparseable reply`, {
						cause: e,
					});
				}
			};
			if (!res.body) throw new Error(`DeepInfra (${model}): empty reply`);
			let body;
			try {
				body = await readEventStream(res.body);
			} catch (e) {
				if (e instanceof SyntaxError)
					throw new Error(`DeepInfra (${model}): unparseable reply`, {
						cause: e,
					});
				// A timeout or a dropped connection mid-reply: this batch only.
				throw new Error(`DeepInfra: ${e.message}`, { cause: e });
			}
			const u = body.usage ?? {};
			usage.calls++;
			usage.prompt += Number(u.prompt_tokens) || 0;
			usage.completion += Number(u.completion_tokens) || 0;
			usage.cost += Number(u.estimated_cost) || 0;
			const choice = body.choices?.[0];
			if (choice?.finish_reason === "length")
				throw new Error("DeepInfra: reply hit max_tokens");
			const { verdicts } = await parse(() =>
				JSON.parse(choice?.message?.content ?? "{}"),
			);
			// A malformed reply fails this batch, never the whole run. A verdict
			// outside the schema would otherwise read as clean in qa.mjs.
			if (
				!Array.isArray(verdicts) ||
				!verdicts.every(
					(v) => v && ["clean", "fixed", "flag"].includes(v.verdict),
				)
			)
				throw new Error("DeepInfra: the reply is not a list of verdicts");
			return verdicts;
		},
	};
};
