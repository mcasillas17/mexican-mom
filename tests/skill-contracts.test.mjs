import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { parseFrontmatter } from "./frontmatter.mjs";

const skillPath = new URL("../skills/porque-yo-lo-digo/SKILL.md", import.meta.url);
const skill = readFileSync(skillPath, "utf8").replace(/\r\n/g, "\n");
const frontmatter = parseFrontmatter(skill, "skills/porque-yo-lo-digo/SKILL.md");

test("routes settled decisions through frontmatter description boundaries", () => {
  assert.equal(
    frontmatter.description,
    "Use after the user has settled a decision and you are about to relitigate it; NOT for user pressure or ordinary unraised concerns — route explicit pressure to porque-soy-tu-mama — but a previously omitted material safety, security, privacy, or irreversible-data-loss risk may be raised once.",
  );
  assert.match(frontmatter.description, /explicit pressure to porque-soy-tu-mama/);
  assert.match(
    frontmatter.description,
    /previously omitted material safety, security, privacy, or irreversible-data-loss risk may be raised once/,
  );
  assert.match(
    skill,
    /Preferences do not qualify, and\nordinary preference arguments remain `Do not raise`\./,
  );
});
