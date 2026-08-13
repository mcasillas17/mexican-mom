import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const VERSION_PATH = join(ROOT, "VERSION");
const packageJsonPath = join(ROOT, "package.json");
const directOnlySkillPath = join(ROOT, "skills", "la-chancla", "SKILL.md");
const normalSkillPath = join(ROOT, "skills", "ya-comiste", "SKILL.md");
const validator = join(ROOT, "tests", "validate-skills.mjs");

function expectValidatorFailure(pattern) {
  assert.throws(
    () => execFileSync("node", [validator], { cwd: ROOT, encoding: "utf8" }),
    (error) => {
      assert.equal(error.status, 1);
      assert.match(error.stdout, pattern);
      return true;
    },
  );
}

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

test("fails when VERSION is blank", () => {
    const original = readFileSync(VERSION_PATH, "utf8");

    try {
      writeFileSync(VERSION_PATH, "   \n");
      expectValidatorFailure(/VERSION: missing or empty/);
    } finally {
      writeFileSync(VERSION_PATH, original);
    }
});

test("fails when an expected version field is missing", () => {
    const original = readFileSync(packageJsonPath, "utf8");
    const mutated = JSON.parse(original);
    delete mutated.version;

    try {
      writeFileSync(packageJsonPath, `${JSON.stringify(mutated, null, 2)}\n`);
      expectValidatorFailure(/package\.json: version missing or empty/);
    } finally {
      writeFileSync(packageJsonPath, original);
    }
});

test("fails when a direct-only skill quotes disable-model-invocation", () => {
    const original = readFileSync(directOnlySkillPath, "utf8");

    try {
      writeFileSync(
        directOnlySkillPath,
        original.replace(
          "disable-model-invocation: true",
          'disable-model-invocation: "true"',
        ),
      );
      expectValidatorFailure(
        /la-chancla: disable-model-invocation must be a YAML boolean true/,
      );
    } finally {
      writeFileSync(directOnlySkillPath, original);
    }
});

test("fails when a normal skill declares disable-model-invocation false", () => {
    const original = readFileSync(normalSkillPath, "utf8");

    try {
      writeFileSync(
        normalSkillPath,
        original.replace(
          /(^description: .*$)/m,
          "$1\ndisable-model-invocation: false",
        ),
      );
      expectValidatorFailure(/ya-comiste: must not declare disable-model-invocation/);
    } finally {
      writeFileSync(normalSkillPath, original);
    }
});
