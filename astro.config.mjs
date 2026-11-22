import { satteri } from "@astrojs/markdown-satteri";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import icon from "astro-icon";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { resolveVersion } from "./scripts/version.mjs";
import { i18nAlternates } from "./src/i18n/alternates.mjs";
import { splitLocale } from "./src/i18n/links.mjs";
import localizeLinks from "./src/i18n/links-integration.mjs";
import { astroI18n, draftLocaleCodes } from "./src/i18n/locales.ts";
import { paraglideOptions } from "./src/i18n/paraglide.mjs";
import { SITE } from "./src/utils/config.ts";
import {
	lazyImagesPlugin,
	readingTimePlugin,
	responsiveTablesPlugin,
} from "./src/utils/frontmatter.mjs";
import { sitemapLastmod } from "./src/utils/lastmod.mjs";
import { isNoindexOpcode } from "./src/utils/opcodes.mjs";
import tasks from "./src/utils/tasks.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Pages in a draft locale are noindex; keep them out of the sitemap too.
// Matches the locale's index (/es) as well as pages under it (/es/...).
const draftLocales = draftLocaleCodes();
const inDraftLocale = (pathname) =>
	draftLocales.includes(splitLocale(pathname).locale);

// Noindex opcode pages (PAN-425) leave the sitemap too.
const noindexOpcodes = new Set(
	JSON.parse(
		readFileSync(path.join(__dirname, "src/data/opcodes.json"), "utf8"),
	)
		.filter(isNoindexOpcode)
		.map((o) => `/opcodes/${o.id}`),
);

// hreflang for translated pages, written after the build; the sitemap
// reuses the same links as xhtml:link alternates.
const alternates = i18nAlternates();
// <lastmod> per sitemap entry: a post's own date, else its sources' last commit.
const lastmod = sitemapLastmod();

// The footer shows the site version and build commit (scripts/version.mjs).
const build = resolveVersion();

export default defineConfig({
	site: SITE.site || "https://bchworks.com",
	base: SITE.base,
	trailingSlash: SITE.trailingSlash ? "always" : "never",

	// Generated from src/i18n/locales.ts: English unprefixed, others under /<code>/.
	i18n: astroI18n(),

	output: "static",
	// Emit /page.html, not /page/index.html: the host then serves /page with no
	// redirect to /page/, so canonicals and sitemap URLs resolve directly.
	build: { format: "file" },
	// Astro 7 defaults to "jsx", which strips spaces between inline elements.
	compressHTML: true,

	// Static output: Astro writes this as a <meta> CSP with hashes for every
	// script it renders. Inline scripts go through common/InlineScript.astro.
	security: {
		csp: {
			directives: [
				"default-src 'self'",
				// Any HTTPS image: the directory hotlinks project logos from its daily data.
				"img-src 'self' data: https:",
				// The wss:// hosts are the UTXO Machine's Fulcrum servers; keep them in
				// step with SERVERS in src/components/utxo/electrum.ts.
				// cloudflareinsights.com receives Cloudflare Web Analytics beacons.
				"connect-src 'self' https://cloudflareinsights.com wss://bch.imaginary.cash:50004 wss://electrum.imaginary.cash:50004 wss://bch.loping.net:50004 wss://fulcrum.jettscythe.xyz:50004 wss://blackie.c3-soft.com:50004",
				"frame-src https://www.youtube.com https://www.youtube-nocookie.com",
				"object-src 'none'",
				"base-uri 'self'",
				"form-action 'self'",
			],
			// Google Analytics runs through Cloudflare Zaraz, which adds its own
			// nonce to script-src at the edge. 'inline-speculation-rules' lets the
			// client prerender below add its <script type="speculationrules">.
			// static.cloudflareinsights.com serves the Web Analytics beacon that
			// Cloudflare injects at the edge; without it the RUM data goes dark.
			scriptDirective: {
				resources: [
					"'self'",
					"'inline-speculation-rules'",
					"https://static.cloudflareinsights.com",
				],
			},
			styleDirective: {
				// Shiki code blocks and a few components set style="" attributes.
				resources: [
					"'self'",
					{ resource: "'unsafe-inline'", kind: "attribute" },
				],
			},
		},
	},

	prefetch: {
		prefetchAll: true,
		defaultStrategy: "hover",
	},
	// Chromium prerenders a hovered link in full; other browsers keep the prefetch.
	experimental: { clientPrerender: true },

	fonts: [
		{
			provider: fontProviders.google(),
			name: "Bricolage Grotesque",
			cssVariable: "--aw-font-sans",
			weights: ["200 800"],
			styles: ["normal"],
			subsets: ["latin", "latin-ext", "vietnamese"],
			fallbacks: ["sans-serif"],
		},
		{
			provider: fontProviders.google(),
			name: "JetBrains Mono",
			cssVariable: "--aw-font-mono",
			weights: ["100 800"],
			styles: ["normal"],
			subsets: [
				"latin",
				"latin-ext",
				"cyrillic",
				"cyrillic-ext",
				"greek",
				"vietnamese",
			],
			fallbacks: ["monospace"],
		},
	],

	integrations: [
		// Before sitemap(): it fills the links that sitemap's serialize reads.
		alternates.integration,
		lastmod.integration,
		...(SITE.site
			? [
					sitemap({
						serialize: (item) => lastmod.serialize(alternates.serialize(item)),
						// Tag, category and paged blog archives are noindex; keep them out.
						// So are the legal, contact and support pages in every locale (PAN-426).
						filter: (page) =>
							!/\/(tag|category)\/|\/blog\/\d+$/.test(page) &&
							!/\/(privacy-policy|terms-conditions|contact|support)$/.test(
								new URL(page).pathname,
							) &&
							!noindexOpcodes.has(new URL(page).pathname) &&
							// The Spanish i18n test pages are noindex.
							!/^\/es\/prueba-(i18n|traduccion)(\/|$)/.test(
								new URL(page).pathname,
							) &&
							!inDraftLocale(new URL(page).pathname),
					}),
				]
			: []),
		mdx(),
		icon({
			include: {
				tabler: ["*"],
				"flat-color-icons": [
					"template",
					"gallery",
					"approval",
					"document",
					"advertising",
					"currency-exchange",
					"voice-presentation",
					"business-contact",
					"database",
				],
			},
		}),

		tasks(),
		// Last: rewrites <a href> in dist so links keep the page's locale.
		localizeLinks(),
	],

	image: {
		// Directory logos: fetched and resized at build. Other hosts pass through.
		remotePatterns: [
			{
				protocol: "https",
				hostname: "static.panmoni.com",
				pathname: "/bitcoincashsite/**",
			},
		],
		layout: "constrained",
		responsiveStyles: true,
	},

	markdown: {
		processor: satteri({
			mdastPlugins: [readingTimePlugin],
			hastPlugins: [responsiveTablesPlugin, lazyImagesPlugin],
		}),
	},

	vite: {
		define: {
			__APP_VERSION__: JSON.stringify(build.version),
			__GIT_COMMIT__: JSON.stringify(build.commit),
		},
		// Recompiles messages/*.json into src/paraglide/ on change in dev. The
		// locale list itself comes from scripts/i18n-compile.mjs (run first).
		plugins: [tailwindcss(), paraglideVitePlugin(paraglideOptions)],
		resolve: {
			alias: {
				"~": path.resolve(__dirname, "./src"),
			},
		},
	},
});
