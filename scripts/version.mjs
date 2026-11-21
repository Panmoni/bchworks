#!/usr/bin/env node
// The site version is the newest vX.Y.Z git tag; a bump is a tag, never a
// commit, so parallel lanes never conflict on a version line.
//
// The next version comes from the commits since the last tag (rules, highest
// wins): major on `type!:` or a BREAKING CHANGE footer, minor on a `feat`
// commit, patch on anything else. The daily `chore(data):` refresh commits
// never bump. With no tag yet, the baseline is the VERSION file and the range
// starts at the commit that last changed it.
//
// The build and the tagging workflow call the same resolveVersion(), so a
// deploy that builds before its tag exists still shows the number the tag
// workflow is about to push.
//
// Usage:
//   node scripts/version.mjs          print the version HEAD has or will get
//   node scripts/version.mjs --tag    tag HEAD with it (annotated, local)
//   node scripts/version.mjs --push   tag HEAD and push the tag to origin

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const TAG_RE = /^v(\d+)\.(\d+)\.(\d+)$/;
const SKIP_RE = /^chore\(data\):/;
const BREAKING_RE = /^\w+(\([^)]*\))?!:/;
const BREAKING_FOOTER_RE = /^BREAKING[ -]CHANGE:/m;
const FEAT_RE = /^feat(\([^)]*\))?:/;
const LEVELS = ["patch", "minor", "major"];

export const DEV_VERSION = "dev";

export function parseVersion(text) {
	const m = TAG_RE.exec(`v${text.trim().replace(/^v/, "")}`);
	if (!m) throw new Error(`not a version: ${JSON.stringify(text)}`);
	return m.slice(1).map(Number);
}

export function formatVersion(v) {
	return `v${v.join(".")}`;
}

/** The bump level for a list of { subject, body }, or null when none counts. */
export function levelFor(commits) {
	let level = null;
	for (const { subject, body } of commits) {
		if (SKIP_RE.test(subject)) continue;
		let l = "patch";
		if (BREAKING_RE.test(subject) || BREAKING_FOOTER_RE.test(body)) l = "major";
		else if (FEAT_RE.test(subject)) l = "minor";
		if (level === null || LEVELS.indexOf(l) > LEVELS.indexOf(level)) level = l;
	}
	return level;
}

export function bump([major, minor, patch], level) {
	if (level === "major") return [major + 1, 0, 0];
	if (level === "minor") return [major, minor + 1, 0];
	return [major, minor, patch + 1];
}

function git(...args) {
	return execFileSync("git", args, {
		cwd: ROOT,
		encoding: "utf8",
		stdio: ["ignore", "pipe", "ignore"],
	}).trim();
}

function tryGit(...args) {
	try {
		return git(...args);
	} catch {
		return null;
	}
}

// Cloudflare Pages builds from a shallow clone with no tags, where the last
// tag and the commit range are both invisible. Fetch the rest first. A full
// clone (local, or the tag workflow's checkout) already has both.
function unshallow() {
	if (tryGit("rev-parse", "--is-shallow-repository") === "true") {
		tryGit("fetch", "--quiet", "--unshallow", "--tags", "origin");
	}
}

function commitsIn(range) {
	const out = git("log", "--format=%s%x1f%b%x1e", range);
	return out
		.split("\x1e")
		.map((c) => c.trim())
		.filter(Boolean)
		.map((c) => {
			const [subject, body = ""] = c.split("\x1f");
			return { subject, body };
		});
}

/**
 * { version, commit, level, tagged }: the version HEAD has (tagged) or will
 * get from the tag workflow. version is DEV_VERSION when git is unavailable.
 */
export function resolveVersion() {
	const commit =
		tryGit("rev-parse", "--short", "HEAD") ??
		process.env.CF_PAGES_COMMIT_SHA?.slice(0, 7) ??
		"unknown";
	try {
		unshallow();
		const lastTag = tryGit(
			"describe",
			"--tags",
			"--abbrev=0",
			"--match",
			"v[0-9]*",
			"HEAD",
		);
		let current;
		let base;
		if (lastTag) {
			current = parseVersion(lastTag);
			base = lastTag;
		} else {
			current = parseVersion(
				readFileSync(new URL("../VERSION", import.meta.url), "utf8"),
			);
			base = git("log", "-1", "--format=%H", "--", "VERSION");
		}
		const level = levelFor(commitsIn(`${base}..HEAD`));
		const version = formatVersion(level ? bump(current, level) : current);
		return {
			version,
			commit,
			level,
			tagged: level === null && Boolean(lastTag),
		};
	} catch (err) {
		console.warn(
			`[version] cannot resolve a version, using "${DEV_VERSION}": ${err.message}`,
		);
		return { version: DEV_VERSION, commit, level: null, tagged: false };
	}
}

function main(argv) {
	const push = argv.includes("--push");
	const tag = push || argv.includes("--tag");
	const info = resolveVersion();
	if (info.version === DEV_VERSION) process.exit(1);
	if (!tag) {
		console.log(
			`${info.version} (${info.level ?? "no bump"}) at ${info.commit}`,
		);
		return;
	}
	if (info.tagged || info.level === null) {
		console.log(`version: none (nothing to tag since ${info.version})`);
		return;
	}
	git("tag", "-a", info.version, "HEAD", "-m", `version: ${info.level}`);
	if (push) git("push", "--quiet", "origin", `refs/tags/${info.version}`);
	console.log(
		`version: ${info.version} (${info.level})${push ? ", pushed" : ""}`,
	);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
	main(process.argv.slice(2));
}
