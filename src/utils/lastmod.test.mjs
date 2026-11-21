import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, test } from "node:test";
import {
	commitDates,
	newest,
	pageDateModified,
	pageSources,
} from "./lastmod.mjs";

const roots = [];
after(() => {
	for (const r of roots) rmSync(r, { recursive: true, force: true });
});

const fixture = (files) => {
	const root = mkdtempSync(path.join(tmpdir(), "lastmod-"));
	roots.push(root);
	for (const [rel, body] of Object.entries(files)) {
		mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
		writeFileSync(path.join(root, rel), body);
	}
	return root;
};

test("pageDateModified reads the JSON-LD date", () => {
	const html = `<script type="application/ld+json">{"datePublished":"2024-01-01T00:00:00.000Z","dateModified":"2024-02-15T00:00:00.000Z"}</script>`;
	assert.equal(pageDateModified(html), "2024-02-15T00:00:00.000Z");
	assert.equal(pageDateModified("<html></html>"), undefined);
});

test("newest picks the latest date and skips files with none", () => {
	const dates = new Map([
		["a", "2026-01-01T10:00:00+00:00"],
		["b", "2026-03-01T10:00:00-05:00"],
	]);
	assert.equal(newest(["a", "b", "c"], dates), "2026-03-01T10:00:00-05:00");
	assert.equal(newest(["c"], dates), undefined);
});

test("newest reads dir/* as the files directly in dir", () => {
	const dates = new Map([
		["src/content/post/a.md", "2026-01-01T00:00:00Z"],
		["src/content/post/b.md", "2026-02-01T00:00:00Z"],
		["src/content/post/es/b.md", "2026-09-01T00:00:00Z"],
	]);
	assert.equal(newest(["src/content/post/*"], dates), "2026-02-01T00:00:00Z");
});

test("a static page's sources are its page file and the copy it names", () => {
	const root = fixture({
		"src/pages/about.astro": `const copy = await getPageCopy("about");`,
		"src/content/pages/about.yaml": "title: About",
	});
	assert.deepEqual(pageSources("src/pages/about.astro", "/about", root), [
		"src/pages/about.astro",
		"src/content/pages/about.yaml",
	]);
});

test("a reference page's copy is found through its id prop", () => {
	const root = fixture({
		"src/pages/risks.astro": `<ReferencePage id="risks" />`,
		"src/content/reference/risks.md": "# Risks",
	});
	assert.deepEqual(pageSources("src/pages/risks.astro", "/risks", root), [
		"src/pages/risks.astro",
		"src/content/reference/risks.md",
	]);
});

test("a collection route adds its entry and the other collections it reads", () => {
	const page = `export const getStaticPaths = async () =>
	(await getCollection("chips")).map((e) => ({ params: { slug: e.id } }));
const copy = await getPageCopy("chips-entry");
const up = (await getCollection("upgrades")).find(() => true);`;
	const root = fixture({
		"src/pages/chips/[slug].astro": page,
		"src/content/pages/chips-entry.yaml": "x: 1",
		"src/content/chips/chip-a.md": "# A",
	});
	assert.deepEqual(
		pageSources("src/pages/chips/[slug].astro", "/chips/chip-a", root),
		[
			"src/pages/chips/[slug].astro",
			"src/content/pages/chips-entry.yaml",
			"src/content/chips/chip-a.md",
			"src/content/upgrades/*",
			"src/data/upgrades.json",
		],
	);
});

test("a file-loaded collection route adds its data file", () => {
	const root = fixture({
		"src/pages/opcodes/[slug].astro": `export const getStaticPaths = async () => (await getCollection("opcodes"));`,
		"src/data/opcodes.json": "[]",
	});
	assert.deepEqual(
		pageSources("src/pages/opcodes/[slug].astro", "/opcodes/op_add", root),
		["src/pages/opcodes/[slug].astro", "src/data/opcodes.json"],
	);
});

test("a listing page adds its page component and every entry it lists", () => {
	const root = fixture({
		"src/pages/chips/index.astro": `import ChipsIndexPage from "~/components/pages/ChipsIndexPage.astro";`,
		"src/components/pages/ChipsIndexPage.astro": `const all = await getCollection("chips");`,
	});
	assert.deepEqual(pageSources("src/pages/chips/index.astro", "/chips", root), [
		"src/pages/chips/index.astro",
		"src/components/pages/ChipsIndexPage.astro",
		"src/content/chips/*",
		"src/data/chips.json",
	]);
});

test("an element id is not read as a copy id", () => {
	const root = fixture({
		"src/pages/x.astro": `<section id="build"></section>`,
		"src/content/pages/build.yaml": "x: 1",
	});
	assert.deepEqual(pageSources("src/pages/x.astro", "/x", root), [
		"src/pages/x.astro",
	]);
});

test("a route file outside the repo has no sources", () => {
	const root = fixture({});
	assert.deepEqual(pageSources("node_modules/x/page.astro", "/x", root), []);
	assert.deepEqual(pageSources(new URL("file:///x.astro"), "/x", root), []);
});

const git = (root, env, ...args) =>
	execFileSync("git", args, {
		cwd: root,
		stdio: "ignore",
		// The developer's own git config (signing, hooks) stays out of it.
		env: {
			...process.env,
			GIT_CONFIG_GLOBAL: "/dev/null",
			GIT_CONFIG_NOSYSTEM: "1",
			...env,
		},
	});

const commit = (root, file, date) => {
	writeFileSync(path.join(root, file), date);
	const env = { GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date };
	git(root, env, "add", ".");
	git(
		root,
		env,
		"-c",
		"user.name=t",
		"-c",
		"user.email=t@example.invalid",
		"commit",
		"-qm",
		file,
	);
};

test("commitDates gives each file its newest commit date", () => {
	const root = fixture({});
	git(root, {}, "init", "-q");
	mkdirSync(path.join(root, "src"));
	commit(root, "src/a.md", "2026-01-01T00:00:00Z");
	commit(root, "src/b.md", "2026-02-01T00:00:00Z");
	commit(root, "src/a.md", "2026-03-01T00:00:00Z");
	const dates = commitDates(root);
	assert.equal(Date.parse(dates.get("src/a.md")), Date.parse("2026-03-01"));
	assert.equal(Date.parse(dates.get("src/b.md")), Date.parse("2026-02-01"));
});

test("commitDates is empty when git cannot run", () => {
	assert.equal(commitDates(path.join(fixture({}), "missing")).size, 0);
});
