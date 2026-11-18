import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { REGIONAL_FIRST, regionalFirst } from "./regional-order.ts";

const projects = JSON.parse(
	readFileSync(new URL("../data/projects.json", import.meta.url), "utf8"),
);
const byId = new Map(projects.map((p) => [p.id, p]));

// A renamed or retired project would silently drop out of the lead.
test("every regional lead is a listed project in that category", () => {
	for (const [locale, categories] of Object.entries(REGIONAL_FIRST))
		for (const [category, ids] of Object.entries(categories))
			for (const id of ids) {
				const p = byId.get(id);
				assert.ok(p, `${locale} ${category}: no project "${id}"`);
				assert.ok(
					p.categories.includes(category),
					`${locale} ${category}: "${id}" is not in that category`,
				);
				assert.notEqual(p.status, "deprecated", `${id} is deprecated`);
			}
});

test("regionalFirst returns the locale's lead, else nothing", () => {
	assert.deepEqual(regionalFirst("es", "buy"), REGIONAL_FIRST.es.buy);
	assert.deepEqual(regionalFirst("es", "mining"), []);
	assert.deepEqual(regionalFirst("en", "buy"), []);
});
