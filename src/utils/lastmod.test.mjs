import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { newest, pageDateModified, pageSources } from "./lastmod.mjs";

const fixture = (files) => {
	const root = mkdtempSync(path.join(tmpdir(), "lastmod-"));
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

test("a collection route adds the entry it renders", () => {
	const page = `export const getStaticPaths = async () =>
	(await getCollection("chips")).map((e) => ({ params: { slug: e.id } }));
const copy = await getPageCopy("chips-entry");
const up = (await getCollection("upgrades")).find(() => true);`;
	const root = fixture({
		"src/pages/chips/[slug].astro": page,
		"src/content/pages/chips-entry.yaml": "x: 1",
		"src/content/chips/chip-a.md": "# A",
		"src/content/upgrades/chip-a.md": "# not this one",
	});
	assert.deepEqual(
		pageSources("src/pages/chips/[slug].astro", "/chips/chip-a", root),
		[
			"src/pages/chips/[slug].astro",
			"src/content/pages/chips-entry.yaml",
			"src/content/chips/chip-a.md",
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
