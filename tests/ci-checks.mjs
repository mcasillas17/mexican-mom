#!/usr/bin/env node
// Checks that guard how the pack REACHES users, as opposed to what it contains.
// tests/validate-skills.mjs covers content; this covers packaging and portability.
//
// Emits GitHub Actions `::error file=...::` annotations so failures land inline on
// the diff rather than buried in a log. Runs fine locally too — the annotations are
// just readable lines.
//
//   node tests/ci-checks.mjs

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseFrontmatter } from "./frontmatter.mjs";

const ROOT = resolve(import.meta.dirname, "..");
const skillsDir = join(ROOT, "skills");

// The only frontmatter keys read on every target platform. Anything else routes
// correctly on Claude Code and silently misroutes on Copilot CLI and Codex.
const SPEC_FIELDS = new Set([
  "name",
  "description",
  "license",
  "compatibility",
  "metadata",
  "allowed-tools",
]);
const DIRECT_ONLY = new Set(["la-chancla", "mexican-mom"]);

let failed = 0;
const err = (file, msg) => {
  console.log(`::error file=${file}::${msg}`);
  failed = 1;
};
const ok = (msg) => console.log(`ok  ${msg}`);

const rel = (abs) => abs.slice(ROOT.length + 1);
const readJson = (p) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));

const skills = readdirSync(skillsDir)
  .filter((d) => statSync(join(skillsDir, d)).isDirectory())
  .sort();
const known = new Set(skills);

// ---------------------------------------------------------------- frontmatter

// Parsed with the real YAML parser, not a regex. A hand-rolled matcher silently
// misreads CRLF, a BOM, quoted keys, and a missing closing fence — in the BOM case
// it reports body prose as frontmatter while missing the actual keys.
const descriptions = new Map();

for (const dir of skills) {
  const file = `skills/${dir}/SKILL.md`;
  let fm;
  try {
    fm = parseFrontmatter(readFileSync(join(ROOT, file), "utf8"), file);
  } catch (e) {
    err(file, e.message);
    continue;
  }

  for (const key of Object.keys(fm)) {
    if (SPEC_FIELDS.has(key)) continue;
    if (key === "disable-model-invocation" && DIRECT_ONLY.has(dir)) continue;
    if (key === "disable-model-invocation") {
      err(file, `disable-model-invocation outside the two direct-only skills`);
      continue;
    }
    err(
      file,
      `non-portable frontmatter key '${key}' — only the six Agent Skills spec fields ` +
        `are read on Copilot CLI and Codex`,
    );
  }

  if (typeof fm.description === "string") descriptions.set(dir, fm.description);
}
if (!failed) ok(`${skills.length} skills carry only portable frontmatter`);

// ---------------------------------------------------------------- cross-references

// Descriptions route by naming sibling skills ("NOT for X; use cadena-de-whatsapp").
// Rename or delete a skill and the pointer becomes an instruction to load something
// that does not exist. There is no error on the user's machine — just a routing dead
// end, which is the same silent shape as the listing-budget bug.
let refs = 0;
for (const [dir, desc] of descriptions) {
  for (const m of desc.matchAll(/\buse ([a-z][a-z0-9-]*)\b/g)) {
    const target = m[1];
    // Only treat it as a reference if it actually names a skill, or looks like a
    // slug that used to. Ordinary prose ("use the smallest artifact") is not.
    if (known.has(target)) {
      refs++;
      continue;
    }
    if (target.includes("-") && target.split("-").length >= 3) {
      err(
        `skills/${dir}/SKILL.md`,
        `description routes to "${target}", which is not a directory in skills/`,
      );
    }
  }
}
ok(`${refs} cross-references between skill descriptions all resolve`);

// The router indexes the pack. A skill added without registering it there is
// unreachable through /mexican-mom.
const roster = readFileSync(join(skillsDir, "mexican-mom", "SKILL.md"), "utf8");
const listed = new Set(
  [...roster.matchAll(/`([a-z][a-z0-9-]+)`/g)].map((m) => m[1]).filter((n) => known.has(n)),
);
for (const dir of skills) {
  if (dir === "mexican-mom" || listed.has(dir)) continue;
  err("skills/mexican-mom/SKILL.md", `roster does not list "${dir}"`);
}
if (listed.size === skills.length - 1) ok(`router roster lists all ${listed.size} skills`);

// ---------------------------------------------------------------- manifests

// The validator confirms every manifest agrees with VERSION. It does not confirm
// that the paths those manifests DECLARE actually resolve. A wrong path fails at
// install time, on a user's machine, with nothing failing here.
const checkPath = (file, field, value) => {
  if (typeof value !== "string" || !value) {
    err(file, `${field} is missing or not a string`);
    return;
  }
  if (!existsSync(resolve(ROOT, value))) {
    err(file, `${field} -> "${value}" does not resolve`);
    return;
  }
  ok(`${file}  ${field} -> ${value}`);
};

try {
  checkPath(".codex-plugin/plugin.json", "skills", readJson(".codex-plugin/plugin.json").skills);

  for (const f of [".claude-plugin/marketplace.json", ".github/plugin/marketplace.json"]) {
    const plugins = readJson(f).plugins;
    if (!Array.isArray(plugins) || plugins.length === 0) err(f, "plugins[] is empty or missing");
    else plugins.forEach((p, i) => checkPath(f, `plugins[${i}].source`, p.source));
  }

  const agents = ".agents/plugins/marketplace.json";
  const agentPlugins = readJson(agents).plugins;
  if (!Array.isArray(agentPlugins) || agentPlugins.length === 0)
    err(agents, "plugins[] is empty or missing");
  else agentPlugins.forEach((p, i) => checkPath(agents, `plugins[${i}].source.path`, p.source?.path));
} catch (e) {
  err("manifests", `could not read a manifest: ${e.message}`);
}

// A manifest that parses is not a manifest that works. `{}` is valid JSON.
const REQUIRED = {
  ".claude-plugin/plugin.json": ["name", "version", "description"],
  ".codex-plugin/plugin.json": ["name", "version", "description", "skills"],
};
for (const [file, keys] of Object.entries(REQUIRED)) {
  try {
    const json = readJson(file);
    for (const k of keys) if (!json[k]) err(file, `missing required field "${k}"`);
  } catch (e) {
    err(file, e.message);
  }
}

// Every skill directory holds a SKILL.md, and every SKILL.md sits in one.
const files = skills.filter((d) => existsSync(join(skillsDir, d, "SKILL.md")));
if (files.length !== skills.length) {
  for (const d of skills) if (!files.includes(d)) err(`skills/${d}`, "directory has no SKILL.md");
} else ok(`${skills.length} skill directories each contain a SKILL.md`);

// ---------------------------------------------------------------- encoding

// The pack is Spanish-heavy and the validator matches on "## Cómo te regaña". A BOM
// or CRLF degrades those matches, and would defeat any regex-based frontmatter
// reader. Catch it at the byte level instead of hoping.
for (const dir of skills) {
  const file = `skills/${dir}/SKILL.md`;
  const buf = readFileSync(join(ROOT, file));
  if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) err(file, "starts with a UTF-8 BOM");
  if (buf.includes(0x0d)) err(file, "contains CRLF line endings");
  if (!buf.equals(Buffer.from(buf.toString("utf8"), "utf8"))) err(file, "is not valid UTF-8");
}

console.log(
  failed ? "\nFAILED — see the annotations above." : `\nAll packaging checks passed.`,
);
process.exit(failed);
