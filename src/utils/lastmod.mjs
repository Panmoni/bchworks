// <lastmod> for every sitemap entry (PAN-424).
//
// A blog post's date is the dateModified its page already writes
// (updateDate, else publishDate). Every other page takes the newest git
// commit date among its source files: the route's page file, the copy file
// it names, and, on a collection route, the entry it renders. Never the
// build time, so two builds of the same commit give the same sitemap.
//
// The build fetches full history first (scripts/version.mjs unshallows the
// Cloudflare clone when astro.config.mjs loads), so commit dates are real.
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

/**
 * The repo files a page is built from, besides the page file itself: the copy
 * its page file names (getPageCopy("x") or id="x"), and the entry a
 * collection route renders (getStaticPaths' collection, keyed by the URL's
 * last segment). Paths are repo-relative and exist.
 */
export function pageSources(entrypoint, pagePath, root) {
	const exists = (rel) => existsSync(path.join(root, rel));
	const src = readFileSync(path.join(root, entrypoint), "utf8");
	const files = [entrypoint];
	for (const [, id] of src.matchAll(/(?:getPageCopy\(|\bid=)"([^"]+)"/g)) {
		files.push(
			...[
				`src/content/pages/${id}.yaml`,
				`src/content/pages/${id}.md`,
				`src/content/reference/${id}.md`,
			].filter(exists),
		);
	}
	const collection = src
		.slice(src.indexOf("getStaticPaths"))
		.match(/getCollection\("([^"]+)"\)/)?.[1];
	if (src.includes("getStaticPaths") && collection) {
		const slug = pagePath.split("/").pop();
		files.push(
			...[
				`src/content/${collection}/${slug}.md`,
				`src/content/${collection}/${slug}.mdx`,
				`src/data/${collection}.json`,
			].filter(exists),
		);
	}
	return files;
}

/**
 * file → newest commit date (ISO 8601), from one pass over the history.
 * Empty when git is unavailable.
 */
export function commitDates(root) {
	let out;
	try {
		out = execFileSync(
			"git",
			["log", "--format=%x00%cI", "--name-only", "--", "src"],
			{
				cwd: root,
				encoding: "utf8",
				maxBuffer: 256 * 1024 * 1024,
				stdio: ["ignore", "pipe", "ignore"],
			},
		);
	} catch {
		return new Map();
	}
	const dates = new Map();
	for (const commit of out.split("\0").filter(Boolean)) {
		const [date, ...files] = commit.split("\n").filter(Boolean);
		// git log runs newest first: keep the first date seen per file.
		for (const f of files) if (!dates.has(f)) dates.set(f, date);
	}
	return dates;
}

/** The newest of the files' dates, or undefined when none has one. */
export const newest = (files, dates) =>
	files
		.map((f) => dates.get(f))
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
							`no lastmod (uncommitted source?) for ${missing.length} pages: ${missing.slice(0, 5).join(", ")}`,
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
