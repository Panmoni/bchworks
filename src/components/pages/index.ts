// Page bodies that build at /<locale>/<slug> once src/content/pages/<locale>/<slug>
// exists (PAN-386). The English route src/pages/<slug>.astro renders the same
// component. Add a page here when its body moves into src/components/pages/.
import AcceptPage from "./AcceptPage.astro";
import BitcoinCashPage from "./BitcoinCashPage.astro";
import BuyPage from "./BuyPage.astro";
import CashTokensPage from "./CashTokensPage.astro";
import DirectoryPage from "./DirectoryPage.astro";
import EarnPage from "./EarnPage.astro";
import OnboardPage from "./OnboardPage.astro";
import SpendPage from "./SpendPage.astro";
import WalletPage from "./WalletPage.astro";
import WhatIsAUtxoPage from "./WhatIsAUtxoPage.astro";

export const LOCALIZED_PAGES = {
	accept: AcceptPage,
	"bitcoin-cash": BitcoinCashPage,
	buy: BuyPage,
	cashtokens: CashTokensPage,
	directory: DirectoryPage,
	earn: EarnPage,
	onboard: OnboardPage,
	spend: SpendPage,
	wallet: WalletPage,
	"what-is-a-utxo": WhatIsAUtxoPage,
};

export type LocalizedPageSlug = keyof typeof LOCALIZED_PAGES;

/** `reference` collection entries that build at /<locale>/<slug> once translated. */
export const LOCALIZED_REFERENCE = ["is-bitcoin-cash-dead"] as const;
