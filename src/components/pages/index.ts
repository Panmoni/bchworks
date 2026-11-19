// Page bodies that build at /<locale>/<path> once src/content/pages/<locale>/<id>
// exists (PAN-386, PAN-387). The English route src/pages/<path>.astro renders
// the same component. Add a page here when its body moves into
// src/components/pages/.
import AboutPage from "./AboutPage.astro";
import AcceptPage from "./AcceptPage.astro";
import BitcoinCashPage from "./BitcoinCashPage.astro";
import BuildPage from "./BuildPage.astro";
import BuyPage from "./BuyPage.astro";
import CashTokensPage from "./CashTokensPage.astro";
import ChipsIndexPage from "./ChipsIndexPage.astro";
import CompareIndexPage from "./CompareIndexPage.astro";
import ContactPage from "./ContactPage.astro";
import DirectoryPage from "./DirectoryPage.astro";
import EarnPage from "./EarnPage.astro";
import GlossaryPage from "./GlossaryPage.astro";
import GuidesIndexPage from "./GuidesIndexPage.astro";
import MiningPage from "./MiningPage.astro";
import OnboardPage from "./OnboardPage.astro";
import OpcodesIndexPage from "./OpcodesIndexPage.astro";
import ReferenceIndexPage from "./ReferenceIndexPage.astro";
import SpendPage from "./SpendPage.astro";
import StateOfBchIndexPage from "./StateOfBchIndexPage.astro";
import SupportPage from "./SupportPage.astro";
import UpgradesIndexPage from "./UpgradesIndexPage.astro";
import WalletPage from "./WalletPage.astro";
import WhatIsAUtxoPage from "./WhatIsAUtxoPage.astro";

/** Keyed by the URL path under /<locale>/; the copy id is the same unless PAGE_COPY_IDS says otherwise. */
export const LOCALIZED_PAGES = {
	about: AboutPage,
	accept: AcceptPage,
	"bitcoin-cash": BitcoinCashPage,
	build: BuildPage,
	buy: BuyPage,
	cashtokens: CashTokensPage,
	chips: ChipsIndexPage,
	compare: CompareIndexPage,
	contact: ContactPage,
	directory: DirectoryPage,
	earn: EarnPage,
	glossary: GlossaryPage,
	guides: GuidesIndexPage,
	mining: MiningPage,
	onboard: OnboardPage,
	opcodes: OpcodesIndexPage,
	reference: ReferenceIndexPage,
	spend: SpendPage,
	"state-of-bch": StateOfBchIndexPage,
	support: SupportPage,
	upgrades: UpgradesIndexPage,
	wallet: WalletPage,
	"what-is-a-utxo": WhatIsAUtxoPage,
};

export type LocalizedPageSlug = keyof typeof LOCALIZED_PAGES;

/** The src/content/pages id of a section index, whose file is <path>/index.astro. */
const PAGE_COPY_IDS: Partial<Record<LocalizedPageSlug, string>> = {
	chips: "chips-index",
	compare: "compare-index",
	guides: "guides-index",
	opcodes: "opcodes-index",
	"state-of-bch": "state-of-bch-index",
	upgrades: "upgrades-index",
};

export const pageCopyId = (slug: LocalizedPageSlug): string =>
	PAGE_COPY_IDS[slug] ?? slug;

/** `reference` collection entries that build at /<locale>/<slug> once translated. */
export const LOCALIZED_REFERENCE = ["is-bitcoin-cash-dead", "risks"] as const;

/** Markdown `pages` entries (legal text) that build at /<locale>/<slug> once translated. */
export const LOCALIZED_LEGAL = ["privacy-policy", "terms-conditions"] as const;
