import { type CollectionEntry, getCollection } from "astro:content";
import { DEFAULT_LOCALE, type LocaleCode } from "~/i18n/locales";
import { regionalFirst } from "~/i18n/regional-order";
import { localizeRecord } from "~/utils/l10n";

export type ProjectEntry = CollectionEntry<"projects">;
export type ProjectData = ProjectEntry["data"];
type HealthState = CollectionEntry<"health">["data"]["state"];

const sanitize = (
	id: string,
	data: ProjectData,
	state: HealthState,
	locale: LocaleCode,
) => {
	const description = data.description
		? localizeRecord(
				{ id, description: data.description },
				"projects",
				["description"],
				locale,
			).description
		: undefined;
	return {
		title: data.title,
		description: description?.text,
		// English shown on a translated page: render it inside lang="en".
		descriptionFallback: description?.fallback ?? false,
		icon: data.icon || undefined,
		url: data.url || undefined,
		verified: data.verified,
		state,
	};
};

// Order within a list: entries placed first, then working projects, then
// unchecked, then stale, then entries placed last. Ties keep id order.
const RANK: Record<HealthState, number> = {
	alive: 0,
	unknown: 1,
	stale: 2,
	dead: 3,
};

const PLACE = { first: -1, default: 0, last: 1 };

// Every resource list on the site comes from the directory. Projects that are
// deprecated, or that failed two health checks in a row, are left out. On a
// translated page the locale's regional picks lead the list
// (src/i18n/regional-order.ts) and descriptions come from its overlay.
export const getProjectsByCategory = async (
	category: ProjectData["categories"][number],
	locale: string = DEFAULT_LOCALE,
): Promise<Array<ReturnType<typeof sanitize>>> => {
	const lc = locale as LocaleCode;
	const lead = regionalFirst(lc, category);
	const leadRank = (id: string) => {
		const i = lead.indexOf(id);
		return i === -1 ? lead.length : i;
	};
	const [all, health] = await Promise.all([
		getCollection("projects"),
		getCollection("health"),
	]);
	const stateOf = new Map(health.map((h) => [h.id, h.data.state]));
	return all
		.filter(
			(e) =>
				e.data.categories.includes(category) && e.data.status !== "deprecated",
		)
		.map((e) => ({
			...sanitize(e.id, e.data, stateOf.get(e.id) ?? "unknown", lc),
			lead: leadRank(e.id),
			place: PLACE[e.data.placement?.[category] ?? "default"],
		}))
		.filter((p) => p.state !== "dead")
		.sort(
			(a, b) =>
				a.lead - b.lead || a.place - b.place || RANK[a.state] - RANK[b.state],
		)
		.map(({ lead: _lead, place: _place, ...p }) => p);
};
