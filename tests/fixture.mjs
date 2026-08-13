import {
  cpSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  existsSync,
  readdirSync,
  chmodSync,
  statSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, relative, sep } from "node:path";

/**
 * A throwaway copy of the repository for tests that need the validator to see
 * broken input.
 *
 * The validator resolves its root from its own module path, not from `cwd`, so
 * pointing it at another directory is not enough — `tests/` has to travel with
 * the copy. That is why this clones the tree rather than just the data files.
 *
 * The alternative, mutating tracked files in place and restoring them in a
 * `finally`, loses on any interruption: Ctrl-C, an OOM kill, or a cancelled CI
 * job between the write and the restore leaves a corrupted `package.json`,
 * `VERSION`, or `SKILL.md` in the working tree with nothing explaining it.
 * Nothing here writes inside the repository at all.
 */

// Directories that must not be copied. `.claude` matters most: it holds git
// worktrees, so copying it recurses into other checkouts of this same repo.
const SKIP = new Set([".git", "node_modules", ".claude"]);

export function withFixture(root, mutate, run) {
  const dir = mkdtempSync(join(tmpdir(), "mexican-mom-fixture-"));
  try {
    cpSync(root, dir, {
      recursive: true,
      filter: (src) => {
        const rel = relative(root, src);
        return rel === "" || !SKIP.has(rel.split(sep)[0]);
      },
    });

    // cpSync preserves modes, so a read-only file in the working tree would
    // produce a fixture the mutation cannot write. The copy should depend on the
    // repository's contents, never on its permissions.
    for (const entry of readdirSync(dir, { recursive: true, withFileTypes: true })) {
      const path = join(entry.parentPath ?? entry.path, entry.name);
      if (entry.isFile()) chmodSync(path, statSync(path).mode | 0o200);
    }

    // The validator loads tests/frontmatter.mjs, which imports `yaml`. Symlink
    // rather than copy so the fixture stays cheap.
    const modules = join(root, "node_modules");
    if (existsSync(modules)) symlinkSync(modules, join(dir, "node_modules"), "junction");

    mutate(dir);
    return run(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** Run the validator inside a fixture and return { status, stdout }. */
export function runValidator(dir) {
  try {
    const stdout = execFileSync("node", [join(dir, "tests", "validate-skills.mjs")], {
      cwd: dir,
      encoding: "utf8",
    });
    return { status: 0, stdout };
  } catch (error) {
    return { status: error.status, stdout: error.stdout ?? "" };
  }
}
