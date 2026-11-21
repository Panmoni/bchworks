import assert from "node:assert/strict";
import { test } from "node:test";
import { bump, formatVersion, levelFor, parseVersion } from "./version.mjs";

const c = (subject, body = "") => ({ subject, body });

test("parseVersion reads a tag or a bare VERSION line", () => {
	assert.deepEqual(parseVersion("v3.1.2"), [3, 1, 2]);
	assert.deepEqual(parseVersion("3.1.2\n"), [3, 1, 2]);
	assert.throws(() => parseVersion("3.1"));
	assert.equal(formatVersion([3, 2, 0]), "v3.2.0");
});

test("levelFor: highest signal wins", () => {
	assert.equal(levelFor([]), null);
	assert.equal(levelFor([c("PAN-414: Add a reading copy")]), "patch");
	assert.equal(
		levelFor([c("fix(csp): allow x"), c("feat(seo): add y")]),
		"minor",
	);
	assert.equal(levelFor([c("feat: add y")]), "minor");
	assert.equal(levelFor([c("feat(seo)!: drop old urls")]), "major");
	assert.equal(
		levelFor([c("refactor: x", "BREAKING CHANGE: urls moved")]),
		"major",
	);
});

test("levelFor: daily data refreshes never bump", () => {
	assert.equal(levelFor([c("chore(data): refresh directory health")]), null);
	assert.equal(
		levelFor([c("chore(data): refresh"), c("chore(deps): bump astro")]),
		"patch",
	);
});

test("bump resets lower parts", () => {
	assert.deepEqual(bump([3, 1, 2], "patch"), [3, 1, 3]);
	assert.deepEqual(bump([3, 1, 2], "minor"), [3, 2, 0]);
	assert.deepEqual(bump([3, 1, 2], "major"), [4, 0, 0]);
});
