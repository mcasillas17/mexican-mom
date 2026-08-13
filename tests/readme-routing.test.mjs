import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = new URL("..", import.meta.url);
const README_PATH = fileURLToPath(new URL("README.md", ROOT));
const LA_CHANCLA_PATH = fileURLToPath(
  new URL("skills/la-chancla/SKILL.md", ROOT),
);
const MEXICAN_MOM_PATH = fileURLToPath(
  new URL("skills/mexican-mom/SKILL.md", ROOT),
);

const readText = (path) => readFileSync(path, "utf8").replace(/\r\n/g, "\n");

test("README explains automatic routing as description-driven and the router as manual", () => {
  const readme = readText(README_PATH);

  assert.match(readme, /each individual skill's `description`/i);
  assert.match(readme, /router\/index is manually invoked/i);
  assert.match(readme, /\|\s*Manual router\s*\|/);
  assert.doesNotMatch(readme, /Automatic routing uses the router entry point/);
});

test("shared la-chancla bodies avoid hard-coded Claude command syntax", () => {
  const laChancla = readText(LA_CHANCLA_PATH);
  const mexicanMom = readText(MEXICAN_MOM_PATH);

  assert.doesNotMatch(laChancla, /\/mexican-mom:la-chancla/);
  assert.doesNotMatch(mexicanMom, /\/mexican-mom:la-chancla/);
});
