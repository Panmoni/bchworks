import { type CollectionEntry, getCollection } from "astro:content";
import { DEFAULT_LOCALE, getLocale, type LocaleCode } from "~/i18n/locales";
import { regionalFirst } from "~/i18n/regional-order";
import { localizeRecord } from "~/utils/l10n";

export type ProjectEntry = CollectionEntry<"projects">;
export type ProjectData = ProjectEntry["data"];
type HealthState = CollectionEntry<"health">["data"]["state"];

/**
 * A project's description in `locale`, from the `projects` overlay, else the
 * English text with `fallback` set (render it inside lang="en"). `null` when
 * the project has none.
 */
export const describeProject = (
	id: string,
	data: ProjectData,
	locale: string | undefined,
) =>
	data.description
		? localizeRecord(
				{ id, description: data.description },
				"projects",
				["description"],
				getLocale(locale).code as LocaleCode,
			).description
		: null;

const sanitize = (
	id: string,
	data: ProjectData,
	state: HealthState,
	locale: string,
) => {
	const description = describeProject(id, data, locale);
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
// unchecked, then stale, then entries placed last. Within each of those, a
// translated page's regional picks lead. Ties keep id order.
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
	const lead = regionalFirst(getLocale(locale).code as LocaleCode, category);
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
			...sanitize(e.id, e.data, stateOf.get(e.id) ?? "unknown", locale),
			lead: leadRank(e.id),
			place: PLACE[e.data.placement?.[category] ?? "default"],
		}))
		.filter((p) => p.state !== "dead")
		.sort(
			(a, b) =>
				a.place - b.place || RANK[a.state] - RANK[b.state] || a.lead - b.lead,
		)
		.map(({ lead: _lead, place: _place, ...p }) => p);
};
