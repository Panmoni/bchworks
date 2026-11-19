// The translator `pnpm i18n:draft` uses: the Claude API, key from
// ANTHROPIC_API_KEY. Tests pass their own translator instead, so nothing
// here runs under `pnpm test`.
import Anthropic from "@anthropic-ai/sdk";

export const MODEL = "claude-opus-5-5";

// Kept byte-stable across requests so the API can cache it.
const SYSTEM = `You translate copy for bchworks.com, a website about Bitcoin Cash for a general audience.

You receive JSON: the source and target language, a terminology list, and a list of segments. Return one translation per segment, in the same order, in the "translations" array.

Rules:
- Tokens such as ⟦3⟧ stand for code, URLs, HTML tags, placeholders and names that must not change. Copy every token exactly once, unchanged, and put it where it belongs in the translated sentence.
- Keep the Markdown structure: the same headings and heading levels, lists, tables, emphasis and blank lines.
- When a terminology entry's source term appears, use its given translation. An entry may be an object: use its "translation", and follow its "note". A note may ask for a short gloss on first use: add it once, at the term's first occurrence in the page body (a multi-paragraph Markdown segment), never in a title, description, heading or short label. If no segment is a page body, add no gloss. That gloss is the only addition allowed.
- When the JSON carries a "style" brief for the target language, follow it: register, vocabulary, punctuation, number format and capitalisation.
- Translate the meaning in a clear, natural register. Add nothing, drop nothing, and add no notes.
- A short label stays a short label.`;

const SCHEMA = {
	type: "object",
	properties: { translations: { type: "array", items: { type: "string" } } },
	required: ["translations"],
	additionalProperties: false,
};

// A failure of the API itself (auth, quota, refusal): stops the whole run,
// unlike a reply that fails a check, which skips one unit.
export class TranslatorError extends Error {
	name = "TranslatorError";
}

const languageName = (code) =>
	new Intl.DisplayNames(["en"], { type: "language" }).of(code) ?? code;

/**
 * The Messages API request for one batch. The system prompt is the same for
 * every locale; the locale's terminology and style brief ride in the user turn.
 */
export const buildRequest = ({
	locale,
	from,
	segments,
	terminology,
	style,
}) => ({
	model: MODEL,
	// The model's ceiling: thinking counts against it, and the longest post
	// (CashTokens tutorial 3, ~100 KB) overran 64000 (PAN-388).
	max_tokens: 128000,
	betas: ["server-side-fallback-2026-07-01"],
	// Fallbacks: if this model declines, the API re-runs the request on
	// another one instead of failing.
	fallbacks: "default",
	output_config: {
		effort: "medium",
		format: { type: "json_schema", schema: SCHEMA },
	},
	system: SYSTEM,
	messages: [
		{
			role: "user",
			content: JSON.stringify({
				source: languageName(from),
				target: languageName(locale),
				terminology,
				...(style ? { style } : {}),
				segments,
			}),
		},
	],
});

/** Sends one request and returns the final message, or throws. */
const send = async (client, request) => {
	let message;
	try {
		message = await client.beta.messages.stream(request).finalMessage();
	} catch (e) {
		throw new TranslatorError(`Claude API: ${e.message}`);
	}
	if (message.stop_reason === "refusal")
		throw new TranslatorError(
			`Claude declined (${message.stop_details?.category ?? "no category"})`,
		);
	if (message.stop_reason === "max_tokens")
		// Not a TranslatorError: one oversized unit, the rest can go on.
		// A resend would hit the same limit, so it is not retried.
		throw Object.assign(
			new Error("reply hit max_tokens; split the source file"),
			{ noRetry: true },
		);
	return message;
};

export const claudeTranslator = () => {
	if (!process.env.ANTHROPIC_API_KEY)
		throw new TranslatorError("ANTHROPIC_API_KEY is not set");
	const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
	return {
		// Not the model id: a server-side fallback may serve the reply.
		name: "Claude",
		async translate(batch) {
			const message = await send(client, buildRequest(batch));
			const text = message.content.find((b) => b.type === "text")?.text;
			return JSON.parse(text ?? "{}").translations ?? [];
		},
	};
};

// ------------------------------------------------------------------ review

// `pnpm i18n:qa` (PAN-412): the same model, asked to review a draft rather
// than write one. Kept byte-stable across requests so the API can cache it.
const REVIEW_SYSTEM = `You review machine translations of copy for bchworks.com, a website about Bitcoin Cash for a general audience. You are a careful native-speaker editor of the target language.

You receive JSON: the source and target language, a terminology list, an optional "style" brief, and a list of items. Each item has an "id", the "english" source, the "draft" translation, and "checks": problems an automated check already found in the draft (it can be wrong).

Return one verdict per item, in the "verdicts" array, with the item's "id":
- "clean": the draft is accurate and natural. Leave "text" out.
- "fixed": the draft had a problem you can fix with confidence. Put the whole corrected translation in "text", and say in one short sentence in "reason" what you changed.
- "flag": the draft has a problem a person must judge (a meaning you cannot settle, a source error, a term with no good rendering). Say what and why in "reason", and set "severity": "high" when a reader would be misled or lose meaning, "medium" when it is wrong but the meaning survives, "low" for style.

What to look for: meaning drift, omissions, additions, awkward literal phrasing, terminology the list fixes, the register and formats the style brief sets, and every problem in "checks".

Rules for "text":
- Change only what is wrong. Keep every correct word.
- Keep code, URLs, HTML tags, Markdown link targets, placeholders such as {count}, opcode names (OP_CHECKSIG) and product and project names exactly as they are in the draft, each exactly once.
- Keep the Markdown structure: the same headings and heading levels, lists, tables, emphasis and blank lines.
- When a terminology entry's note asks for a short gloss on first use, that gloss is allowed in a page body only; it is not an addition.
- A short label stays a short label.`;

const REVIEW_SCHEMA = {
	type: "object",
	properties: {
		verdicts: {
			type: "array",
			items: {
				type: "object",
				properties: {
					id: { type: "string" },
					verdict: { type: "string", enum: ["clean", "fixed", "flag"] },
					text: { type: "string" },
					reason: { type: "string" },
					severity: { type: "string", enum: ["high", "medium", "low"] },
				},
				required: ["id", "verdict"],
				additionalProperties: false,
			},
		},
	},
	required: ["verdicts"],
	additionalProperties: false,
};

/**
 * The Messages API request for one QA batch: the same model and settings as
 * a draft, a reviewer's system prompt and the review schema.
 * `items`: `{ id, english, draft, checks: string[] }[]`.
 */
export const buildReviewRequest = ({
	locale,
	from = "en",
	items,
	terminology,
	style,
}) => ({
	...buildRequest({ locale, from, segments: [], terminology, style }),
	output_config: {
		effort: "medium",
		format: { type: "json_schema", schema: REVIEW_SCHEMA },
	},
	system: REVIEW_SYSTEM,
	messages: [
		{
			role: "user",
			content: JSON.stringify({
				source: languageName(from),
				target: languageName(locale),
				terminology,
				...(style ? { style } : {}),
				items,
			}),
		},
	],
});

/**
 * The reviewer `pnpm i18n:qa` uses. `client` is an Anthropic client; tests
 * pass a fake one. `review(batch)` returns the parsed verdicts.
 */
export const claudeReviewer = ({ client } = {}) => {
	if (!client) {
		if (!process.env.ANTHROPIC_API_KEY)
			throw new TranslatorError("ANTHROPIC_API_KEY is not set");
		client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
	}
	return {
		name: "Claude",
		async review(batch) {
			const message = await send(client, buildReviewRequest(batch));
			const text = message.content.find((b) => b.type === "text")?.text;
			return JSON.parse(text ?? "{}").verdicts ?? [];
		},
	};
};
