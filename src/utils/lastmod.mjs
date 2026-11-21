// <lastmod> for every sitemap entry (PAN-424).
//
// A blog post's date is the dateModified its page already writes
// (updateDate, else publishDate). Every other page takes the newest git
// commit date among its sources (pageSources): its page file, its copy, the
// entry it renders and the collections it lists. Never the build time, so
// two builds of the same commit give the same sitemap.
//
// The build fetches full history first (scripts/version.mjs unshallows the
// Cloudflare clone when astro.config.mjs loads). If that fails, pages get
// no lastmod and the build warns, rather than every page getting HEAD's date.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { servedPath, urlPath } from "../i18n/alternates.mjs";

// Routes whose pages are blog posts; they carry their own dates.
const POST_ROUTES = [
	"src/pages/[...blog]/index.astro",
	"src/pages/[locale]/[...blog].astro",
];

/** The dateModified a page's JSON-LD carries, if any. */
export const pageDateModified = (html) =>
	html.match(/"dateModified":"([^"]+)"/)?.[1];

// Files a route file pulls listing data through, one import away: the page
// components (src/components/pages) and the blog helpers.
const HOP_IMPORT = /from "~\/(components\/pages\/[\w-]+\.astro|utils\/blog)"/g;

const read = (root, rel) => {
	const file = path.join(root, rel);
	return existsSync(file) ? readFileSync(file, "utf8") : undefined;
};

/** A collection's English sources: its top-level files, or its data file. */
const collectionSource = (c) => [`src/content/${c}/*`, `src/data/${c}.json`];

/**
 * The repo sources a page is built from: the route's page file; the copy it
 * names (getPageCopy("x"), or the id of a ReferencePage or LegalPage); on a
 * collection route, the entry it renders (getStaticPaths' collection, keyed
 * by the URL's last segment); and the page components or blog helpers it
 * imports, with every collection they list. `dir/*` stands for every file
 * directly in dir. Empty when the page file is not in the repo.
 */
export function pageSources(entrypoint, pagePath, root) {
	const src = typeof entrypoint === "string" && read(root, entrypoint);
	if (!src) return [];
	const exists = (rel) => existsSync(path.join(root, rel));
	const sources = [entrypoint];
	const ids = src.matchAll(
		/(?:getPageCopy\(|<(?:Reference|Legal)Page\b[^>]*\bid=)"([^"]+)"/g,
	);
	for (const [, id] of ids) {
		sources.push(
			...[
				`src/content/pages/${id}.yaml`,
				`src/content/pages/${id}.md`,
				`src/content/reference/${id}.md`,
			].filter(exists),
		);
	}
	const at = src.indexOf("getStaticPaths");
	const entryOf = at >= 0 && src.slice(at).match(/getCollection\("(\w+)"\)/);
	if (entryOf) {
		const slug = pagePath.split("/").pop();
		sources.push(
			...[
				`src/content/${entryOf[1]}/${slug}.md`,
				`src/content/${entryOf[1]}/${slug}.mdx`,
				`src/data/${entryOf[1]}.json`,
			].filter(exists),
		);
	}
	for (const [, mod] of src.matchAll(HOP_IMPORT)) {
		const file = mod.endsWith(".astro") ? `src/${mod}` : `src/${mod}.ts`;
		const hop = read(root, file);
		if (!hop) continue;
		sources.push(file);
		for (const [, c] of hop.matchAll(/getCollection\("(\w+)"/g))
			sources.push(...collectionSource(c));
	}
	return [...new Set(sources)];
}

/**
 * file → newest commit date (ISO 8601), from one pass over the history. A
 * change merged from a branch counts from its merge. Empty when git is
 * unavailable, or when the clone is shallow: its oldest commit would claim
 * every file, so every page would look changed.
 */
export function commitDates(root) {
	const git = (...args) =>
		execFileSync("git", args, {
			cwd: root,
			encoding: "utf8",
			maxBuffer: 256 * 1024 * 1024,
			stdio: ["ignore", "pipe", "ignore"],
		});
	let out;
	try {
		if (git("rev-parse", "--is-shallow-repository").trim() === "true")
			return new Map();
		out = git(
			"log",
			"--diff-merges=first-parent",
			"--format=%x00%cI",
			"--name-only",
			"--",
			"src",
		);
	} catch {
		return new Map();
	}
	const dates = new Map();
	for (const commit of out.split("\0").filter(Boolean)) {
		const [date, ...files] = commit.split("\n").filter(Boolean);
		for (const f of files)
			if (!dates.has(f) || Date.parse(date) > Date.parse(dates.get(f)))
				dates.set(f, date);
	}
	return dates;
}

/** Every date a source has: a file's own, or each file directly in `dir/*`. */
const datesOf = (source, dates) => {
	if (!source.endsWith("/*")) return [dates.get(source)];
	const dir = source.slice(0, -1);
	return [...dates]
		.filter(([f]) => f.startsWith(dir) && !f.slice(dir.length).includes("/"))
		.map(([, d]) => d);
};

/** The newest date among the sources, or undefined when none has one. */
export const newest = (sources, dates) =>
	sources
		.flatMap((s) => datesOf(s, dates))
		.filter(Boolean)
		.sort((a, b) => Date.parse(b) - Date.parse(a))[0];

/**
 * The integration that collects every built page's lastmod, and a
 * `serialize` for @astrojs/sitemap that sets it. List the integration
 * before sitemap(): Astro runs build:done hooks in order.
 */
export function sitemapLastmod() {
	let root;
	const entrypoints = new Map();
	const byPath = new Map();
	return {
		integration: {
			name: "bchworks:sitemap-lastmod",
			hooks: {
				"astro:config:done": ({ config }) => {
					root = fileURLToPath(config.root);
				},
				"astro:routes:resolved": ({ routes }) => {
					for (const r of routes) entrypoints.set(r.pattern, r.entrypoint);
				},
				"astro:build:done": async ({ dir, assets, logger }) => {
					const outDir = fileURLToPath(dir);
					const dates = commitDates(root);
					const missing = [];
					for (const [pattern, urls] of assets) {
						const entrypoint = entrypoints.get(pattern);
						if (!entrypoint) continue;
						for (const url of urls) {
							const file = fileURLToPath(url);
							if (!file.endsWith(".html")) continue;
							const p = servedPath(path.relative(outDir, file));
							const date = POST_ROUTES.includes(entrypoint)
								? pageDateModified(await readFile(file, "utf8"))
								: newest(pageSources(entrypoint, p, root), dates);
							if (date) byPath.set(p, date);
							else missing.push(p);
						}
					}
					logger.info(`lastmod found for ${byPath.size} pages`);
					if (missing.length)
						logger.warn(
							`no lastmod (shallow clone or uncommitted source?) for ${missing.length} pages: ${missing.slice(0, 5).join(", ")}`,
						);
				},
			},
		},
		serialize: (item) => {
			const lastmod = byPath.get(urlPath(item.url));
			return lastmod ? { ...item, lastmod } : item;
		},
	};
}
