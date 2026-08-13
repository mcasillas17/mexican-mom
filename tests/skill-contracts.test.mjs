import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const skillPath = new URL("../skills/porque-yo-lo-digo/SKILL.md", import.meta.url);
const skill = readFileSync(skillPath, "utf8").replace(/\r\n/g, "\n");
const lines = skill.split("\n");

function assertHasLine(line) {
  assert.ok(lines.includes(line), `missing exact line: ${line}`);
}

test("distinguishes ordinary concerns from omitted material risks", () => {
  assertHasLine("| You never voiced the concern at the time | — | Do not raise |");
  assertHasLine(
    "| You never voiced a previously omitted material safety, security, privacy, or irreversible data loss risk at the time | — | Raise once, then proceed or stop only if safe execution is genuinely blocked |",
  );
  assert.match(
    skill,
    /Preferences do not qualify, and\nordinary preference arguments remain `Do not raise`\./,
  );
});

test("keeps preference arguments out of the material-risk exception", () => {
  assert.match(
    skill,
    /Preferences do not qualify, and\nordinary preference arguments remain `Do not raise`\./,
  );
});
