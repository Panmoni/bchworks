// Projects that lead a resource list on a translated page (PAN-386). The
// English lists start with US-first exchanges and merchants; a Spanish
// reader is more likely in Latin America, so on /es the options usable there
// come first. Ids are `src/data/projects.json` ids; the rest of each list
// keeps its usual order (src/utils/projects.ts). Adapting order only: adding
// new LatAm projects belongs in the directory data.
import type { LocaleCode } from "./locales";

export const REGIONAL_FIRST: Partial<
	Record<LocaleCode, Record<string, string[]>>
> = {
	es: {
		// Buda is a Latin American exchange; CoinCola is peer-to-peer, so a
		// buyer pays in local currency wherever they are.
		buy: ["buda", "coincola"],
		// Phone top-ups and merchant maps work anywhere; most of the English
		// list (AT&T, Dish, Newegg, Overstock) only ships in the US.
		spend: ["alfatop", "bitcoin-com-map", "cryptwerk", "travala"],
	},
};

/** Project ids that lead `category` in `locale`, in order; `[]` when none. */
export const regionalFirst = (locale: LocaleCode, category: string): string[] =>
	REGIONAL_FIRST[locale]?.[category] ?? [];
