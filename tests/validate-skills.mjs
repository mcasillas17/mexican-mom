#!/usr/bin/env node
// Static validation for the mexican-mom skill pack.
// Checks the Agent Skills spec rules, the pack's own authoring contract, and
// version agreement across every manifest. Exits non-zero on any failure.
//
//   node tests/validate-skills.mjs

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_DIR = join(ROOT, "skills");

// Skills the pack intends to keep out of automatic model invocation.
const DIRECT_ONLY = new Set(["la-chancla", "mexican-mom"]);

// Agent Skills spec caps.
const SPEC_NAME_MAX = 64;
const SPEC_DESC_MAX = 1024;
// Claude Code truncates description + when_to_use together at this length.
const LISTING_CAP = 1536;
// The pack's own authoring target, tighter than the spec cap on purpose.
const DESC_TARGET = 320;

const REQUIRED_SECTIONS = [
  "## Rule",
  "## Procedure",
  "## Evidence",
  "## Boundary",
  "## Exit criteria",
];

// The router selects skills rather than producing findings, so it carries an index
// instead of an Evidence section.
const ROUTER = "mexican-mom";
const ROUTER_SECTIONS = [
  "## Rule",
  "## The roster",
  "## Procedure",
  "## Boundary",
  "## Exit criteria",
];

const failures = [];
const warnings = [];

const fail = (skill, msg) => failures.push(`${skill}: ${msg}`);
const warn = (skill, msg) => warnings.push(`${skill}: ${msg}`);

/** Minimal frontmatter reader. Handles `key: value` and `key: >`/`|` blocks. */
function parseFrontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!match) return null;
  const fields = {};
  let key = null;
  let buffer = [];
  const flush = () => {
    if (key) fields[key] = buffer.join(" ").trim();
    key = null;
    buffer = [];
  };
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (kv && !/^\s/.test(line)) {
      flush();
      key = kv[1];
      const value = kv[2].trim();
      if (value === ">" || value === "|" || value === ">-" || value === "|-") buffer = [];
      else buffer = [value];
    } else if (key) {
      buffer.push(line.trim());
    }
  }
  flush();
  return fields;
}

function readJson(relPath) {
  const abs = join(ROOT, relPath);
  if (!existsSync(abs)) {
    failures.push(`${relPath}: missing`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(abs, "utf8"));
  } catch (err) {
    failures.push(`${relPath}: invalid JSON — ${err.message}`);
    return null;
  }
}

// ---------------------------------------------------------------- skills

if (!existsSync(SKILLS_DIR)) {
  console.error("FAIL  skills/ directory not found");
  process.exit(1);
}

const skillDirs = readdirSync(SKILLS_DIR).filter((d) =>
  statSync(join(SKILLS_DIR, d)).isDirectory(),
);

const seenNames = new Set();

for (const dir of skillDirs) {
  const skillPath = join(SKILLS_DIR, dir, "SKILL.md");
  if (!existsSync(skillPath)) {
    fail(dir, "no SKILL.md");
    continue;
  }
  const text = readFileSync(skillPath, "utf8");
  const fm = parseFrontmatter(text);
  if (!fm) {
    fail(dir, "no YAML frontmatter");
    continue;
  }

  // --- name: spec rules
  const name = fm.name;
  if (!name) fail(dir, "frontmatter missing `name`");
  else {
    if (name !== dir) fail(dir, `name "${name}" does not match directory`);
    if (name.length > SPEC_NAME_MAX) fail(dir, `name exceeds ${SPEC_NAME_MAX} chars`);
    if (!/^[a-z0-9-]+$/.test(name)) fail(dir, "name has characters outside [a-z0-9-]");
    if (/^-|-$/.test(name)) fail(dir, "name starts or ends with a hyphen");
    if (name.includes("--")) fail(dir, "name has consecutive hyphens");
    if (seenNames.has(name)) fail(dir, "duplicate name");
    seenNames.add(name);
  }

  // --- description: the routing infrastructure
  const desc = fm.description;
  if (!desc) fail(dir, "frontmatter missing `description`");
  else {
    if (desc.length > SPEC_DESC_MAX)
      fail(dir, `description ${desc.length} chars exceeds spec cap ${SPEC_DESC_MAX}`);
    if (desc.length > DESC_TARGET)
      warn(dir, `description ${desc.length} chars over the ${DESC_TARGET} target`);
    // Negative triggers must be portable: they belong in description, not when_to_use.
    if (!/\bNOT\b/.test(desc) && !DIRECT_ONLY.has(dir))
      warn(dir, "description has no `NOT for ...` negative trigger");
  }

  // --- combined listing budget
  const combined = (desc || "").length + (fm.when_to_use || "").length;
  if (combined > LISTING_CAP)
    fail(dir, `description + when_to_use = ${combined} chars, over ${LISTING_CAP}`);

  // Negative triggers in when_to_use are invisible off Claude Code.
  if (fm.when_to_use && /\bNOT\b/.test(fm.when_to_use) && desc && !/\bNOT\b/.test(desc))
    fail(dir, "negative trigger is only in when_to_use — it must be in description");

  // --- invocation policy
  const directOnly = fm["disable-model-invocation"] === "true";
  if (DIRECT_ONLY.has(dir) && !directOnly)
    fail(dir, "must set disable-model-invocation: true");
  if (!DIRECT_ONLY.has(dir) && directOnly)
    fail(dir, "unexpectedly sets disable-model-invocation");
  // Off Claude Code that field does not exist, so the wording has to carry it.
  if (DIRECT_ONLY.has(dir) && desc && !/^Use only when/i.test(desc))
    fail(dir, 'description must begin "Use only when..." (portable manual-only)');

  // --- the pack grants no authority
  if (fm["allowed-tools"]) fail(dir, "must not declare allowed-tools");

  // --- body shape
  const required = dir === ROUTER ? ROUTER_SECTIONS : REQUIRED_SECTIONS;
  for (const section of required) {
    if (!text.includes(`\n${section}`)) fail(dir, `missing section \`${section}\``);
  }
  if (!/\n## Cómo te regaña/.test(text)) warn(dir, "no `## Cómo te regaña` section");

  // --- placeholders
  // Several skills legitimately discuss TODO markers as subject matter (`ahorita`
  // is entirely about them), so only flag an unfinished note: a bare marker at the
  // start of a line, outside code spans and quoted examples.
  const prose = text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`\n]*`/g, "")
    .replace(/^>.*$/gm, "");
  const placeholder = /^\s*(TODO|TBD|FIXME|XXX)\b[\s:]|<placeholder>/m.exec(prose);
  if (placeholder) fail(dir, `unfinished placeholder: ${placeholder[0].trim()}`);

  // --- the acid test, mechanically: strip Spanish blockquotes and the regaña
  // section; what remains must still carry the rules.
  const stripped = text
    .replace(/\n## Cómo te regaña[\s\S]*?(?=\n## |$)/g, "\n")
    .replace(/^>.*$/gm, "");
  for (const section of required) {
    if (!stripped.includes(`\n${section}`))
      fail(dir, `\`${section}\` does not survive removal of the Spanish`);
  }
}

// ---------------------------------------------------------------- manifests

const versionFile = join(ROOT, "VERSION");
let version = null;
if (!existsSync(versionFile)) failures.push("VERSION: missing");
else version = readFileSync(versionFile, "utf8").trim();

const claudePlugin = readJson(".claude-plugin/plugin.json");
const claudeMarket = readJson(".claude-plugin/marketplace.json");
const codexPlugin = readJson(".codex-plugin/plugin.json");
const copilotMarket = readJson(".github/plugin/marketplace.json");
const codexMarket = readJson(".agents/plugins/marketplace.json");

const versioned = [
  [".claude-plugin/plugin.json", claudePlugin?.version],
  [".codex-plugin/plugin.json", codexPlugin?.version],
  [".claude-plugin/marketplace.json", claudeMarket?.plugins?.[0]?.version],
  [".github/plugin/marketplace.json", copilotMarket?.plugins?.[0]?.version],
];
for (const [file, v] of versioned) {
  if (v && version && v !== version)
    failures.push(`${file}: version ${v} does not match VERSION ${version}`);
}

for (const [file, manifest] of [
  [".claude-plugin/plugin.json", claudePlugin],
  [".codex-plugin/plugin.json", codexPlugin],
]) {
  if (manifest && manifest.name !== "mexican-mom")
    failures.push(`${file}: plugin name is not "mexican-mom"`);
}

for (const [file, market] of [
  [".claude-plugin/marketplace.json", claudeMarket],
  [".github/plugin/marketplace.json", copilotMarket],
  [".agents/plugins/marketplace.json", codexMarket],
]) {
  if (!market) continue;
  if (!Array.isArray(market.plugins) || market.plugins.length === 0)
    failures.push(`${file}: no plugins array`);
  if (market.name !== "mcasillas17")
    failures.push(`${file}: marketplace name is not "mcasillas17"`);
}

// ---------------------------------------------------------------- report

console.log(`Checked ${skillDirs.length} skills at version ${version ?? "?"}\n`);

if (warnings.length) {
  console.log(`Warnings (${warnings.length}):`);
  for (const w of warnings) console.log(`  ~ ${w}`);
  console.log("");
}

if (failures.length) {
  console.log(`FAILURES (${failures.length}):`);
  for (const f of failures) console.log(`  x ${f}`);
  console.log("");
  process.exit(1);
}

console.log("All checks passed.");
