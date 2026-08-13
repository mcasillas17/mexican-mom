import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { withFixture, runValidator } from "./fixture.mjs";

// Every test here runs the validator against a throwaway copy of the repository.
// Nothing writes inside the working tree, so an interrupted run cannot leave a
// corrupted package.json, VERSION, or SKILL.md behind.
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const VERSION = readFileSync(join(ROOT, "VERSION"), "utf8").trim();

const read = (dir, ...parts) => readFileSync(join(dir, ...parts), "utf8");
const write = (dir, parts, contents) => writeFileSync(join(dir, ...parts), contents);

/** Mutate a fixture, run the validator, assert it fails with a matching message. */
function expectFailure(mutate, pattern) {
  const { status, stdout } = withFixture(ROOT, mutate, runValidator);
  assert.equal(status, 1, `expected the validator to fail\n${stdout}`);
  assert.match(stdout, pattern);
}

test("passes against an unmodified copy of the repository", () => {
  const { status, stdout } = withFixture(
    ROOT,
    () => {},
    runValidator,
  );
  // Guards the fixture itself. If copying the tree broke something, every other
  // test in this file would "pass" for the wrong reason.
  assert.equal(status, 0, `fixture should be valid as copied\n${stdout}`);
  assert.match(stdout, /All checks passed/);
});

test("fails when package.json version drifts from VERSION", () => {
  expectFailure(
    (dir) => {
      const pkg = JSON.parse(read(dir, "package.json"));
      pkg.version = "9.9.9";
      write(dir, ["package.json"], `${JSON.stringify(pkg, null, 2)}\n`);
    },
    new RegExp(`package\\.json: version 9\\.9\\.9 does not match VERSION ${VERSION.replace(/\./g, "\\.")}`),
  );
});

test("fails when VERSION is blank", () => {
  expectFailure((dir) => write(dir, ["VERSION"], "   \n"), /VERSION: missing or empty/);
});

test("fails when an expected version field is missing", () => {
  expectFailure((dir) => {
    const pkg = JSON.parse(read(dir, "package.json"));
    delete pkg.version;
    write(dir, ["package.json"], `${JSON.stringify(pkg, null, 2)}\n`);
  }, /package\.json: version missing or empty/);
});

test("fails when a direct-only skill quotes disable-model-invocation", () => {
  expectFailure(
    (dir) => {
      const parts = ["skills", "la-chancla", "SKILL.md"];
      const original = read(dir, ...parts);
      write(
        dir,
        parts,
        original.replace("disable-model-invocation: true", 'disable-model-invocation: "true"'),
      );
    },
    /la-chancla: disable-model-invocation must be a YAML boolean true/,
  );
});

test("fails when a normal skill declares disable-model-invocation false", () => {
  expectFailure(
    (dir) => {
      const parts = ["skills", "ya-comiste", "SKILL.md"];
      const original = read(dir, ...parts);
      write(
        dir,
        parts,
        original.replace(/(^description: .*$)/m, "$1\ndisable-model-invocation: false"),
      );
    },
    /ya-comiste: must not declare disable-model-invocation/,
  );
});
