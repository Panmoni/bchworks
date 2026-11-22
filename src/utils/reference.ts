import { getCollection } from "astro:content";
import metrics from "~/data/metrics.json";
import { count, formatDate, formatNumber, usd } from "~/i18n/format";

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

// metrics.json holds block times as written: "10 min", "12 s", "~0.4 s".
// The number and unit display in the page locale.
export const blockTime = (value: string, locale?: string): string => {
	const parts = value.match(/^(~?)(\d+(?:\.\d+)?) (min|s)$/);
	if (!parts) return value;
	const [, approx, n, unit] = parts;
	return `${approx}${formatNumber(Number(n), locale, {
		style: "unit",
		unit: unit === "min" ? "minute" : "second",
		unitDisplay: "short",
	})}`;
};

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
