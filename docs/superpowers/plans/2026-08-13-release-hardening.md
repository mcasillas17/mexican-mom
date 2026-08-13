# Release Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a `0.1.4` release candidate in which all 24 skills have valid YAML, validation catches future frontmatter defects, safety routing is corrected, and cross-platform documentation matches the supported CLIs.

**Architecture:** Keep the existing single `skills/` tree and add a small reusable frontmatter parser backed by the `yaml` package. The repository validator will consume parsed typed values, while Node's built-in test runner covers parser and behavioral contracts. Documentation and manifests remain hand-maintained but are protected by the existing version synchronization checks.

**Tech Stack:** Node.js ESM, `node:test`, `yaml`, Markdown, Claude Code CLI, GitHub Copilot CLI, Codex CLI, Git, GitHub CLI.

---

## File Map

- Create `package.json` and `package-lock.json`: development dependency and test entrypoint.
- Create `tests/frontmatter.mjs`: strict YAML frontmatter extraction and parsing.
- Create `tests/frontmatter.test.mjs`: parser regression coverage.
- Create `tests/skill-contracts.test.mjs`: behavioral regression coverage for settled decisions and material risks.
- Modify `tests/validate-skills.mjs`: consume typed YAML rather than the permissive custom parser.
- Modify three malformed `skills/*/SKILL.md` files: use folded descriptions.
- Modify `skills/porque-yo-lo-digo/SKILL.md`: add the material-risk exception.
- Modify `README.md`: refine existing platform-specific lifecycle and invocation guidance.
- Modify `CHANGELOG.md`: add `0.1.4` and correct historical claims.
- Modify `docs/specs/2026-08-12-mexican-mom-design.md`: remove unsupported platform assertions and correct lifecycle commands.
- Modify the two companion specs: mark superseded decisions explicitly.
- Modify `VERSION` and four versioned manifests/catalogs: advance the package to `0.1.4`.

### Task 1: Add a Standards-Compliant Frontmatter Parser

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `tests/frontmatter.mjs`
- Create: `tests/frontmatter.test.mjs`

- [ ] **Step 1: Add the package manifest**

```json
{
  "name": "mexican-mom",
  "version": "0.1.4",
  "private": true,
  "scripts": {
    "test": "node --test tests/*.test.mjs && node tests/validate-skills.mjs"
  },
  "devDependencies": {
    "yaml": "^2.8.1"
  }
}
```

- [ ] **Step 2: Install the declared dependency**

Run: `npm install`

Expected: exit 0 and a new `package-lock.json` locking `yaml`.

- [ ] **Step 3: Write parser tests first**

Create `tests/frontmatter.test.mjs`:

```js
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
    /must be a YAML mapping/,
  );
});
```

- [ ] **Step 4: Run the tests and verify they fail**

Run: `node --test tests/frontmatter.test.mjs`

Expected: FAIL because `tests/frontmatter.mjs` does not exist.

- [ ] **Step 5: Implement strict parsing**

Create `tests/frontmatter.mjs`:

```js
import { parseDocument } from "yaml";

export function parseFrontmatter(text, source = "SKILL.md") {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  if (!match) throw new Error(`${source}: missing YAML frontmatter`);

  const document = parseDocument(match[1], {
    prettyErrors: true,
    uniqueKeys: true,
  });
  if (document.errors.length) {
    throw new Error(`${source}: ${document.errors.map((error) => error.message).join("; ")}`);
  }

  const fields = document.toJS();
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    throw new Error(`${source}: frontmatter must be a YAML mapping`);
  }
  return fields;
}
```

- [ ] **Step 6: Run the parser tests**

Run: `node --test tests/frontmatter.test.mjs`

Expected: 4 tests pass.

- [ ] **Step 7: Commit the parser foundation**

```bash
git add package.json package-lock.json tests/frontmatter.mjs tests/frontmatter.test.mjs
git commit -m "test: add strict skill frontmatter parser"
```

### Task 2: Integrate Strict Parsing and Repair the Broken Skills

**Files:**
- Modify: `tests/validate-skills.mjs:8-72`
- Modify: `skills/ahorita/SKILL.md:1-8`
- Modify: `skills/me-estas-avisando-o-pidiendo-permiso/SKILL.md:1-8`
- Modify: `skills/por-si-se-ocupa/SKILL.md:1-8`

- [ ] **Step 1: Replace the custom parser import and implementation**

Add:

```js
import { parseFrontmatter } from "./frontmatter.mjs";
```

Delete the local `parseFrontmatter` function. In the skill loop, replace the nullable
parse with:

```js
  let fm;
  try {
    fm = parseFrontmatter(text, `skills/${dir}/SKILL.md`);
  } catch (error) {
    fail(dir, error.message);
    continue;
  }
```

Validate typed fields before reading `.length`:

```js
  const name = fm.name;
  if (typeof name !== "string" || !name) {
    fail(dir, "frontmatter `name` must be a non-empty string");
  } else {
    if (name !== dir) fail(dir, `name "${name}" does not match directory`);
    if (name.length > SPEC_NAME_MAX) fail(dir, `name exceeds ${SPEC_NAME_MAX} chars`);
    if (!/^[a-z0-9-]+$/.test(name)) fail(dir, "name has characters outside [a-z0-9-]");
    if (/^-|-$/.test(name)) fail(dir, "name starts or ends with a hyphen");
    if (name.includes("--")) fail(dir, "name has consecutive hyphens");
    if (seenNames.has(name)) fail(dir, "duplicate name");
    seenNames.add(name);
  }

  const desc = fm.description;
  if (typeof desc !== "string" || !desc) {
    fail(dir, "frontmatter `description` must be a non-empty string");
  } else {
    if (desc.length > SPEC_DESC_MAX)
      fail(dir, `description ${desc.length} chars exceeds spec cap ${SPEC_DESC_MAX}`);
    if (desc.length > DESC_TARGET)
      warn(dir, `description ${desc.length} chars over the ${DESC_TARGET} target`);
    if (!/\bNOT\b/.test(desc) && !DIRECT_ONLY.has(dir))
      warn(dir, "description has no `NOT for ...` negative trigger");
  }

  const whenToUse = fm.when_to_use;
  if (whenToUse !== undefined && typeof whenToUse !== "string") {
    fail(dir, "frontmatter `when_to_use` must be a string");
  }

  const combined = (typeof desc === "string" ? desc.length : 0)
    + (typeof whenToUse === "string" ? whenToUse.length : 0);
  if (combined > LISTING_CAP)
    fail(dir, `description + when_to_use = ${combined} chars, over ${LISTING_CAP}`);

  if (
    typeof whenToUse === "string"
    && /\bNOT\b/.test(whenToUse)
    && typeof desc === "string"
    && !/\bNOT\b/.test(desc)
  ) {
    fail(dir, "negative trigger is only in when_to_use — it must be in description");
  }

  const directOnly = fm["disable-model-invocation"] === true;
```

- [ ] **Step 2: Run the validator and expose the existing defects**

Run: `node tests/validate-skills.mjs`

Expected: FAIL naming exactly:

```text
skills/ahorita/SKILL.md
skills/me-estas-avisando-o-pidiendo-permiso/SKILL.md
skills/por-si-se-ocupa/SKILL.md
```

- [ ] **Step 3: Convert each malformed description to a folded scalar**

Use these exact frontmatter values:

```yaml
# skills/ahorita/SKILL.md
description: >
  Use when deferring work, writing a TODO, giving a time estimate, or promising a
  follow-up. Every deferral must resolve to one stated outcome: committed with a
  trigger and owner, declared out of scope, or deleted. NOT for urgent work that
  must preempt everything; use ahorita-es-ahorita.

# skills/me-estas-avisando-o-pidiendo-permiso/SKILL.md
description: >
  Use before an action needing the user's explicit consent: force-push, history
  rewrite, dropping a table, deleting a directory, publishing or releasing,
  sending real email, spending money, or anything touching production or a shared
  environment. NOT for creating the rollback path; use por-si-se-ocupa.

# skills/por-si-se-ocupa/SKILL.md
description: >
  Use before an operation that destroys state you cannot reproduce: deleting
  untracked files, overwriting uncommitted work, `git reset --hard` or `git clean`,
  dropping a table, deleting a bucket or volume, discarding an expensive artifact.
  NOT for ordinary edits to clean, committed files — git is already the copy.
```

Apply it to the complete existing description in each of the three files.

- [ ] **Step 4: Run the full test command**

Run: `npm test`

Expected: parser tests pass; validator reports 24 checked skills and `All checks passed.`

- [ ] **Step 5: Commit strict validation and YAML repairs**

```bash
git add tests/validate-skills.mjs skills/ahorita/SKILL.md \
  skills/me-estas-avisando-o-pidiendo-permiso/SKILL.md \
  skills/por-si-se-ocupa/SKILL.md
git commit -m "fix: validate and repair skill frontmatter"
```

### Task 3: Protect Material Risks Without Reopening Ordinary Decisions

**Files:**
- Create: `tests/skill-contracts.test.mjs`
- Modify: `skills/porque-yo-lo-digo/SKILL.md:35-62`

- [ ] **Step 1: Write the failing behavioral contract test**

Create `tests/skill-contracts.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const skill = await readFile(
  new URL("../skills/porque-yo-lo-digo/SKILL.md", import.meta.url),
  "utf8",
);

test("allows one correction for a previously omitted material risk", () => {
  for (const category of ["safety", "security", "privacy", "irreversible data loss"]) {
    assert.match(skill, new RegExp(category, "i"));
  }
  assert.match(skill, /raise it once/i);
  assert.match(skill, /never voiced/i);
});

test("does not turn preferences into material-risk exceptions", () => {
  assert.match(skill, /preference/i);
  assert.match(skill, /do not raise/i);
});
```

- [ ] **Step 2: Run the contract test and verify it fails**

Run: `node --test tests/skill-contracts.test.mjs`

Expected: FAIL because the current skill has no privacy, irreversible-data-loss, or
preference boundary.

- [ ] **Step 3: Amend the availability test**

Replace the unconditional table row with:

```markdown
| You never voiced an ordinary concern at the time | — | Do not raise |
| You failed to voice a material safety, security, privacy, or irreversible data-loss risk | Raise it once, then proceed or stop if it truly blocks safe execution | — |
```

Add after the table:

```markdown
This exception corrects a material omission; it does not reopen preferences, style
arguments, popularity claims, or a merely stronger version of an earlier argument.
```

- [ ] **Step 4: Run all tests**

Run: `npm test`

Expected: all Node tests and the 24-skill validator pass.

- [ ] **Step 5: Commit the safety correction**

```bash
git add tests/skill-contracts.test.mjs skills/porque-yo-lo-digo/SKILL.md
git commit -m "fix: preserve material risk escalation"
```

### Task 4: Correct User-Facing Documentation

**Files:**
- Modify: `README.md:12-101`
- Modify: `CHANGELOG.md:1-35`

Keep the newly merged v0.1.2 update/uninstall documentation as the baseline; refine it for this release instead of duplicating it.

- [ ] **Step 1: Add platform lifecycle commands to the README**

Document these exact operations:

```text
Claude Code
Update:    claude plugin update mexican-mom@mcasillas17
Uninstall: claude plugin uninstall mexican-mom@mcasillas17

Copilot CLI
Refresh:   copilot plugin marketplace update mcasillas17
Update:    copilot plugin update mexican-mom@mcasillas17
Uninstall: copilot plugin uninstall mexican-mom@mcasillas17

Codex
Refresh:   codex plugin marketplace upgrade mcasillas17
Update:    codex plugin add mexican-mom@mcasillas17
Uninstall: codex plugin remove mexican-mom@mcasillas17
```

- [ ] **Step 2: Replace universal invocation claims**

Add a compact table:

```markdown
| Platform | Direct skill | Router |
| --- | --- | --- |
| Claude Code | `/mexican-mom:<name>` | `/mexican-mom` |
| GitHub Copilot CLI | `/<name>` | `/mexican-mom` |
| Codex | `$<name>` | `$mexican-mom` |
```

Keep automatic routing language separate from direct syntax.

- [ ] **Step 3: Add and correct changelog entries**

Add `0.1.4` with the YAML, validator, safety, and documentation fixes. Change the
`0.1.0` roster to `23 discipline skills plus a router`. Amend the `0.1.1` verification
claim to record that marketplace installation succeeded but a later audit found three
frontmatter parse failures.

- [ ] **Step 4: Check documentation claims**

Run:

```bash
rg -n '22 discipline|directly as `/mexican-mom:<name>`|All 24 skills install and enable' README.md CHANGELOG.md
```

Expected: no matches.

- [ ] **Step 5: Commit user-facing documentation**

```bash
git add README.md CHANGELOG.md
git commit -m "docs: correct cross-platform usage guidance"
```

### Task 5: Reconcile Design History and Release Metadata

**Files:**
- Modify: `docs/specs/2026-08-12-mexican-mom-design.md:149-165,600-716,793`
- Modify: `docs/specs/2026-08-12-mexican-mom-copilot-synthesis-v2-design.md:1-14`
- Modify: `docs/specs/2026-08-12-mexican-mom-cross-platform-copilot-design.md:1-16`
- Modify: `VERSION`
- Modify: `.claude-plugin/plugin.json`
- Modify: `.claude-plugin/marketplace.json`
- Modify: `.codex-plugin/plugin.json`
- Modify: `.github/plugin/marketplace.json`

- [ ] **Step 1: Remove unsupported listing-budget assertions**

Replace the canonical section with the supported rule:

```markdown
### Keep routing metadata concise

Short descriptions reduce routing ambiguity and leave room for other installed skills.
The pack keeps its own conservative authoring targets, but does not rely on undocumented
listing-budget percentages, eviction order, or configuration keys. Verify discovery in
each supported client after installation.
```

Remove the corresponding contested-decision row that claims the 1% budget,
least-used eviction, and `skillListingBudgetFraction` are documented.

- [ ] **Step 2: Correct platform lifecycle and verification wording**

Use explicit plugin identifiers in update commands. State that the clients tolerate the
Claude-only keys only when the containing frontmatter is valid YAML. Replace the stale
open-question language with the verified one-tree decision.

- [ ] **Step 3: Mark proposal documents as superseded**

Add after each title:

```markdown
> **Historical proposal:** Superseded by
> `2026-08-12-mexican-mom-design.md` for the shipped roster, one-tree packaging, and
> current platform commands. Retained for design history only.
```

- [ ] **Step 4: Bump all release metadata to `0.1.4`**

Set `VERSION`, both plugin manifests, and both versioned marketplace entries to `0.1.4`.
Do not create a tag; the pull request is a release candidate.

- [ ] **Step 5: Run consistency searches and tests**

Run:

```bash
rg -n 'skillListingBudgetFraction|least-used eviction|22 discipline skills plus one direct router' docs/specs
npm test
```

Expected: the obsolete assertions have no active canonical match; all tests pass and all
manifests agree with `VERSION`.

- [ ] **Step 6: Commit spec and release metadata corrections**

```bash
git add VERSION .claude-plugin .codex-plugin .github/plugin \
  docs/specs/2026-08-12-mexican-mom-design.md \
  docs/specs/2026-08-12-mexican-mom-copilot-synthesis-v2-design.md \
  docs/specs/2026-08-12-mexican-mom-cross-platform-copilot-design.md
git commit -m "chore: prepare release hardening patch"
```

### Task 6: Verify the Complete Package Locally

**Files:**
- No repository changes expected.

- [ ] **Step 1: Run repository validation**

Run:

```bash
npm test
git diff --check origin/main...HEAD
```

Expected: all tests pass; no whitespace errors.

- [ ] **Step 2: Validate manifests**

Run:

```bash
claude plugin validate .
node tests/validate-skills.mjs
```

Expected: manifest validation succeeds; 24 skills checked with no failures.

- [ ] **Step 3: Test clean local marketplace installs**

Run from the worktree:

```bash
ROOT="$PWD"
AUDIT_ROOT="$(mktemp -d /tmp/mexican-mom-release-hardening.XXXXXX)"
printf '%s\n' "$AUDIT_ROOT"

CLAUDE_CONFIG_DIR="$AUDIT_ROOT/claude" claude plugin marketplace add "$ROOT"
CLAUDE_CONFIG_DIR="$AUDIT_ROOT/claude" claude plugin install mexican-mom@mcasillas17
CLAUDE_CONFIG_DIR="$AUDIT_ROOT/claude" claude plugin details mexican-mom@mcasillas17

COPILOT_HOME="$AUDIT_ROOT/copilot" copilot plugin marketplace add "$ROOT"
COPILOT_HOME="$AUDIT_ROOT/copilot" copilot plugin install mexican-mom@mcasillas17
COPILOT_HOME="$AUDIT_ROOT/copilot" copilot plugin list

CODEX_HOME="$AUDIT_ROOT/codex" codex plugin marketplace add "$ROOT" --json
CODEX_HOME="$AUDIT_ROOT/codex" codex plugin add mexican-mom@mcasillas17 --json
```

Expected:

- Claude lists `mexican-mom@mcasillas17` version `0.1.4` as enabled.
- Copilot reports 24 installed skills and `/skills` shows no parse failures.
- Codex returns version `0.1.4` and 24 installed skills.

- [ ] **Step 4: Remove only the named temporary configuration directories**

Confirm `AUDIT_ROOT` begins with `/tmp/mexican-mom-release-hardening.` and then remove
that exact printed directory:

```bash
printf 'Removing %s\n' "$AUDIT_ROOT"
rm -rf -- "$AUDIT_ROOT"
```

Do not use a wildcard and do not remove any normal user configuration.

### Task 7: Obtain and Address GPT-5.6 Luna Review

**Files:**
- Modify only files implicated by valid review findings.

- [ ] **Step 1: Request review of the complete branch diff**

Invoke a `code-review` agent with model `gpt-5.6-luna`. Give it the approved design,
implementation plan, `origin/main...HEAD` diff, and verification expectations. Ask for
high-confidence correctness, regression, documentation, and cross-platform findings
only.

- [ ] **Step 2: Evaluate every finding**

For each finding, reproduce or confirm it against the repository and current client
behavior. Reject unsupported suggestions with evidence; do not make speculative changes.

- [ ] **Step 3: Write a failing regression test for each accepted code or behavior bug**

Run the targeted test and confirm it fails for the reported reason.

- [ ] **Step 4: Implement accepted fixes and rerun targeted tests**

Expected: each new regression test passes.

- [ ] **Step 5: Run the complete verification suite again**

Run:

```bash
npm test
claude plugin validate .
git diff --check origin/main...HEAD
git status --short
```

Expected: all commands succeed; status contains only intentional reviewed changes.

- [ ] **Step 6: Commit review fixes when necessary**

```bash
git status --short
git add -u
git add tests/*.test.mjs
git commit -m "fix: address release hardening review"
```

Skip this commit if the reviewer reports no valid findings.

### Task 8: Push and Open the Pull Request

**Files:**
- No additional repository changes expected.

- [ ] **Step 1: Inspect the final commit series and diff**

Run:

```bash
git status --short --branch
git log --oneline origin/main..HEAD
git diff --stat origin/main...HEAD
```

Expected: clean worktree and only release-hardening commits.

- [ ] **Step 2: Push the branch**

Run:

```bash
git push -u origin fix/release-hardening-v0.1.4
```

Expected: branch created on `origin`.

- [ ] **Step 3: Create the pull request**

Run:

```bash
gh pr create \
  --base main \
  --head fix/release-hardening-v0.1.4 \
  --title "Fix cross-platform skill loading and validation" \
  --body $'## Summary\n- parse every skill frontmatter block with a standards-compliant YAML parser\n- repair three malformed skills and preserve escalation for material risks\n- correct cross-platform usage docs and prepare version 0.1.4\n\n## Verification\n- `npm test`\n- `claude plugin validate .`\n- clean local marketplace installs on Claude Code, Copilot CLI, and Codex\n- GPT-5.6 Luna diff review addressed'
```

The body must include:

- the three malformed skills and strict-parser root cause;
- the settled-decision material-risk exception;
- corrected invocation and lifecycle documentation;
- the `0.1.4` version bump;
- exact test and client-install evidence;
- the GPT-5.6 Luna review outcome.

- [ ] **Step 4: Confirm the PR**

Run: `gh pr view --json number,url,title,state,baseRefName,headRefName`

Expected: an open pull request targeting `main` from
`fix/release-hardening-v0.1.4`.
