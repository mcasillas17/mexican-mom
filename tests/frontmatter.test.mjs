import assert from "node:assert/strict";
import test from "node:test";

import { parseFrontmatter } from "./frontmatter.mjs";

test("parses folded descriptions and typed booleans", () => {
  const fields = parseFrontmatter(`---
name: example
description: >
  Use before reporting success: show the output.
disable-model-invocation: true
---
# Example
`, "example/SKILL.md");

  assert.equal(fields.description, "Use before reporting success: show the output.\n");
  assert.equal(fields["disable-model-invocation"], true);
});

test("rejects an unquoted colon-space in a plain scalar", () => {
  assert.throws(
    () =>
      parseFrontmatter(`---
name: example
description: Use before reporting success: show the output.
---
`, "example/SKILL.md"),
    /example\/SKILL\.md/,
  );
});

test("rejects duplicate keys", () => {
  assert.throws(
    () =>
      parseFrontmatter(`---
name: first
name: second
description: Example
---
`, "example/SKILL.md"),
    /example\/SKILL\.md/,
  );
});

test("rejects a non-mapping frontmatter document", () => {
  assert.throws(
    () => parseFrontmatter("---\n- one\n- two\n---\n", "example/SKILL.md"),
    /example\/SKILL\.md.*must be a YAML mapping/,
  );
});
