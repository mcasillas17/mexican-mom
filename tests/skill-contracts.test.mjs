import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const skillPath = new URL("../skills/porque-yo-lo-digo/SKILL.md", import.meta.url);
const skill = readFileSync(skillPath, "utf8");

test("distinguishes ordinary concerns from omitted material risks", () => {
  assert.match(skill, /You never voiced the concern at the time\s*\|\s*—\s*\|\s*Do not raise/);
  for (const category of ["safety", "security", "privacy", "irreversible data loss"]) {
    assert.match(skill, new RegExp(category, "i"));
  }
  assert.match(skill, /material.*risk/i);
  assert.match(skill, /raise once/i);
  assert.match(skill, /raise it once/i);
});

test("keeps preference arguments out of the material-risk exception", () => {
  assert.match(skill, /preferences do not qualify/i);
  assert.match(skill, /ordinary preference arguments remain\s+`Do not raise`/i);
});
