import { getCollection } from "astro:content";
import metrics from "~/data/metrics.json";
import { count, formatDate, formatNumber, usd } from "~/i18n/format";
import { m, type msg } from "~/i18n/messages";

export { metrics };
export type ChainId = keyof typeof metrics.chains;

const DAY = 86_400_000;

export type FreshnessLevel = "fresh" | "aging" | "stale";

// Human-checked content: fresh under 90 days, aging under a year, then stale.
// Machine-refreshed data passes tighter windows (e.g. 2 and 7 days).
export const freshness = (
	date: Date | string | null | undefined,
	freshDays = 90,
	agingDays = 365,
	now = Date.now(),
): { level: FreshnessLevel; days: number } | null => {
	if (!date) return null;
	const days = Math.floor((now - new Date(date).getTime()) / DAY);
	const level =
		days <= freshDays ? "fresh" : days <= agingDays ? "aging" : "stale";
	return { level, days };
};

export { count, formatDate, usd };

// metrics.json holds block times as written: "10 min", "12 s", "~0.4 s", "1 h".
// The number and unit display in the page locale.
export const blockTime = (value: string, locale?: string): string => {
	const parts = value.match(/^(~?)(\d+(?:\.\d+)?) (h|min|s)$/);
	if (!parts) return value;
	const [, approx, n, unit] = parts;
	return `${approx}${formatNumber(Number(n), locale, {
		style: "unit",
		unit: { h: "hour", min: "minute", s: "second" }[unit],
		unitDisplay: "short",
	})}`;
};

/** An upgrade's status in the reader's language. */
export const upgradeStatus = (
	status: "activated" | "locked-in" | "proposed",
	l: ReturnType<typeof msg>,
): string =>
	({
		activated: m.ref_upgrade_status_activated,
		"locked-in": m.ref_upgrade_status_locked_in,
		proposed: m.ref_upgrade_status_proposed,
	})[status]({}, l);

type Labels = ReturnType<typeof msg>;

/** A CHIP's status in the reader's language. */
export const chipStatus = (
	status:
		| "draft"
		| "proposed"
		| "locked-in"
		| "activated"
		| "withdrawn"
		| "superseded",
	l: Labels,
): string =>
	({
		draft: m.ref_chip_status_draft,
		proposed: m.ref_chip_status_proposed,
		"locked-in": m.ref_chip_status_locked_in,
		activated: m.ref_chip_status_activated,
		withdrawn: m.ref_chip_status_withdrawn,
		superseded: m.ref_chip_status_superseded,
	})[status]({}, l);

/**
 * A CHIP's code. One with no number has the code "CHIP (unnumbered, <year>)"
 * in its frontmatter; the words around the year are the reader's language.
 */
export const chipCode = (code: string, l: Labels): string => {
	const year = code.match(/^CHIP \(unnumbered, (\d{4})\)$/)?.[1];
	return year ? m.chips_code_unnumbered({ year }, l) : code;
};

/** A CHIP stakeholder's position in the reader's language. */
export const chipPosition = (
	position: "support" | "neutral" | "oppose" | "unknown",
	l: Labels,
): string =>
	({
		support: m.ref_chip_position_support,
		neutral: m.ref_chip_position_neutral,
		oppose: m.ref_chip_position_oppose,
		unknown: m.ref_chip_position_unknown,
	})[position]({}, l);

/** An opcode's status in the reader's language. */
export const opcodeStatus = (
	status: "enabled" | "disabled" | "reserved" | "nop",
	l: Labels,
): string =>
	({
		enabled: m.ref_opcode_status_enabled,
		disabled: m.ref_opcode_status_disabled,
		reserved: m.ref_opcode_status_reserved,
		nop: m.ref_opcode_status_nop,
	})[status]({}, l);

/** An opcode's group in the reader's language. */
export const opcodeGroup = (
	group:
		| "push"
		| "control"
		| "stack"
		| "splice"
		| "bitwise"
		| "arithmetic"
		| "crypto"
		| "locktime"
		| "introspection"
		| "token"
		| "function"
		| "reserved",
	l: Labels,
): string =>
	({
		push: m.ref_opcode_group_push,
		control: m.ref_opcode_group_control,
		stack: m.ref_opcode_group_stack,
		splice: m.ref_opcode_group_splice,
		bitwise: m.ref_opcode_group_bitwise,
		arithmetic: m.ref_opcode_group_arithmetic,
		crypto: m.ref_opcode_group_crypto,
		locktime: m.ref_opcode_group_locktime,
		introspection: m.ref_opcode_group_introspection,
		token: m.ref_opcode_group_token,
		function: m.ref_opcode_group_function,
		reserved: m.ref_opcode_group_reserved,
	})[group]({}, l);

export const isoDate = (date: Date | string) =>
	new Date(date).toISOString().slice(0, 10);

// The next upgrade that has not activated yet, for the countdown.
export const getNextUpgrade = async (now = Date.now()) => {
	const upgrades = await getCollection("upgrades");
	return upgrades
		.filter((u) => u.data.date.getTime() > now)
		.sort((a, b) => a.data.date.getTime() - b.data.date.getTime())[0];
};

export const getHealthMap = async () =>
	new Map((await getCollection("health")).map((h) => [h.id, h.data]));

// Directory sections, in page order; their headings are in the directory page
// copy (src/content/pages/directory.yaml `sections`). A project lands in the first section
// whose prefix matches one of its categories.
export const DIRECTORY_SECTIONS = [
	{ id: "wallet", href: "/wallet" },
	{ id: "buy", href: "/buy" },
	{ id: "spend", href: "/spend" },
	{ id: "earn", href: "/earn" },
	{ id: "accept", href: "/accept" },
	{ id: "cashtokens", href: "/cashtokens" },
	{ id: "build", href: "/build" },
	{ id: "mining", href: "/mining" },
	{ id: "support", href: "/support" },
	{ id: "governance", href: undefined },
] as const;

// JSON-LD FAQPage from a frontmatter faq list.
export const faqJsonLd = (
	faq: Array<{ q: string; a: string }>,
	inLanguage: string,
) =>
	faq.length
		? {
				"@context": "https://schema.org",
				"@type": "FAQPage",
				inLanguage,
				mainEntity: faq.map(({ q, a }) => ({
					"@type": "Question",
					name: q,
					acceptedAnswer: { "@type": "Answer", text: a },
				})),
			}
		: null;
