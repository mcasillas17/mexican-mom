#!/usr/bin/env node
// Static validation for the mexican-mom skill pack.
// Checks the Agent Skills spec rules, the pack's own authoring contract, and
// version agreement across every manifest. Exits non-zero on any failure.
//
//   node tests/validate-skills.mjs

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseFrontmatter } from "./frontmatter.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_DIR = join(ROOT, "skills");

// Skills the pack intends to keep out of automatic model invocation.
const DIRECT_ONLY = new Set(["la-chancla", "mexican-mom"]);

// Agent Skills spec caps.
const SPEC_NAME_MAX = 64;
const SPEC_DESC_MAX = 1024;
// Claude Code truncates a single entry's listing text at this length.
const LISTING_CAP = 1536;
// The pack's own authoring target, tighter than the spec cap on purpose.
const DESC_TARGET = 320;

// The whole listing shares a budget that scales with the context window, and on
// overflow Claude Code drops descriptions SILENTLY — skills still list by name, but
// nothing auto-invokes. v0.1.0-v0.1.2 shipped in exactly that state at 11,621 chars.
// This ceiling is the regression guard. Raising it is a product decision, not a
// formality: measure with /context and /doctor before you do.
const TOTAL_LISTING_CEILING = 8000;

// Fields outside the six-field Agent Skills spec. `when_to_use` is deliberately absent
// from this pack — it was pure enrichment that cost 42% of the listing budget.
const BANNED_FIELDS = ["when_to_use"];

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
let totalListing = 0;

for (const dir of skillDirs) {
  const skillPath = join(SKILLS_DIR, dir, "SKILL.md");
  if (!existsSync(skillPath)) {
    fail(dir, "no SKILL.md");
    continue;
  }
  const text = readFileSync(skillPath, "utf8");
  let fm;
  try {
    fm = parseFrontmatter(text, skillPath);
  } catch (err) {
    fail(skillPath, `frontmatter parse error: ${err.message}`);
    continue;
  }

  const isNonEmptyString = (value) => typeof value === "string" && value.length > 0;

  // --- name: spec rules
  const name = fm.name;
  if (!isNonEmptyString(name)) fail(dir, "frontmatter missing `name`");
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
  if (!isNonEmptyString(desc)) fail(dir, "frontmatter missing `description`");
  else {
    if (desc.length > SPEC_DESC_MAX)
      fail(dir, `description ${desc.length} chars exceeds spec cap ${SPEC_DESC_MAX}`);
    if (desc.length > DESC_TARGET)
      warn(dir, `description ${desc.length} chars over the ${DESC_TARGET} target`);
    // Negative triggers must be portable: they belong in description, not when_to_use.
    if (!/\bNOT\b/.test(desc) && !DIRECT_ONLY.has(dir))
      warn(dir, "description has no `NOT for ...` negative trigger");
  }

  // --- per-entry listing cap
  if ((desc || "").length > LISTING_CAP)
    fail(dir, `listing text ${desc.length} chars, over the ${LISTING_CAP} cap`);

  // --- running total against the shared listing budget
  totalListing += (desc || "").length;

  // --- banned frontmatter
  for (const field of BANNED_FIELDS) {
    if (fm[field] !== undefined)
      fail(
        dir,
        `declares \`${field}\`. It is not in the Agent Skills spec and its cost pushed ` +
          `the listing over budget in v0.1.0-v0.1.2, which silently disabled ` +
          `auto-invocation. Put the content in \`description\` or drop it.`,
      );
  }

  // --- invocation policy
  const directOnly = fm["disable-model-invocation"] === true;
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

const packageManifest = readJson("package.json");
const claudePlugin = readJson(".claude-plugin/plugin.json");
const claudeMarket = readJson(".claude-plugin/marketplace.json");
const codexPlugin = readJson(".codex-plugin/plugin.json");
const copilotMarket = readJson(".github/plugin/marketplace.json");
const codexMarket = readJson(".agents/plugins/marketplace.json");

const versioned = [
  ["package.json", "version", packageManifest?.version],
  [".claude-plugin/plugin.json", "version", claudePlugin?.version],
  [".codex-plugin/plugin.json", "version", codexPlugin?.version],
  [".claude-plugin/marketplace.json", "top-level version", claudeMarket?.version],
  [".claude-plugin/marketplace.json", "metadata.version", claudeMarket?.metadata?.version],
  [".claude-plugin/marketplace.json", "plugins[0].version", claudeMarket?.plugins?.[0]?.version],
  [".github/plugin/marketplace.json", "top-level version", copilotMarket?.version],
  [".github/plugin/marketplace.json", "metadata.version", copilotMarket?.metadata?.version],
  [".github/plugin/marketplace.json", "plugins[0].version", copilotMarket?.plugins?.[0]?.version],
];
for (const [file, field, v] of versioned) {
  if (v !== undefined && version && v !== version)
    failures.push(`${file}: ${field} ${v} does not match VERSION ${version}`);
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

// --- the regression guard for the bug that shipped in v0.1.0-v0.1.2
if (totalListing > TOTAL_LISTING_CEILING) {
  failures.push(
    `LISTING BUDGET: ${totalListing.toLocaleString()} chars across ${skillDirs.length} ` +
      `skills, over the ${TOTAL_LISTING_CEILING.toLocaleString()} ceiling. Claude Code ` +
      `drops descriptions SILENTLY on overflow — skills still list by name but stop ` +
      `auto-invoking. Trim descriptions or cut a skill.`,
  );
}

console.log(
  `Checked ${skillDirs.length} skills at version ${version ?? "?"}\n` +
    `Listing footprint: ${totalListing.toLocaleString()} / ` +
    `${TOTAL_LISTING_CEILING.toLocaleString()} chars ` +
    `(${Math.round((totalListing / TOTAL_LISTING_CEILING) * 100)}% of ceiling)\n`,
);

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
