import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const packageJsonPath = join(ROOT, "package.json");
const validator = join(ROOT, "tests", "validate-skills.mjs");

test("fails when package.json version drifts from VERSION", () => {
  const original = readFileSync(packageJsonPath, "utf8");
  const mutated = JSON.parse(original);
  mutated.version = "9.9.9";

  try {
    writeFileSync(packageJsonPath, `${JSON.stringify(mutated, null, 2)}\n`);

    assert.throws(
      () => execFileSync("node", [validator], { cwd: ROOT, encoding: "utf8" }),
      (error) => {
        assert.equal(error.status, 1);
        assert.match(error.stdout, /package\.json: version 9\.9\.9 does not match VERSION 0\.1\.4/);
        return true;
      },
    );
  } finally {
    writeFileSync(packageJsonPath, original);
  }
});
