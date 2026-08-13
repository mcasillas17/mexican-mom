# Copilot Design History Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct two superseded Copilot design documents so their historical reasoning remains readable but all current architecture, metadata, commands, and listing-budget guidance defer accurately to canonical v0.1.4 behavior.

**Architecture:** Edit only the two historical design documents, using prominent outcome callouts and explicit rejected-proposal labels rather than erasing design history. Validate the resulting guidance against the canonical spec and current repository, then obtain independent Claude Opus 5 and GPT-5.6 Luna reviews before opening a documentation-only pull request.

**Tech Stack:** Markdown, npm, Node.js repository validator, Git, GitHub CLI.

---

## File Map

- Modify `docs/specs/2026-08-12-mexican-mom-cross-platform-copilot-design.md`: reconcile packaging, metadata, lifecycle commands, validation, and final recommendation.
- Modify `docs/specs/2026-08-12-mexican-mom-copilot-synthesis-v2-design.md`: reconcile routing metadata, listing-budget facts, roster outcomes, static checks, and recommendation.
- Do not modify `.github/workflows/`, `skills/`, `tests/`, `CHANGELOG.md`, manifests, or `VERSION`.

### Task 1: Correct the Cross-Platform Packaging History

**Files:**
- Modify: `docs/specs/2026-08-12-mexican-mom-cross-platform-copilot-design.md`

- [ ] **Step 1: Strengthen the superseded header**

Replace the existing one-line header with:

```markdown
> [!IMPORTANT]
> **Historical proposal, superseded by
> [`2026-08-12-mexican-mom-design.md`](./2026-08-12-mexican-mom-design.md).**
> The canonical spec defines the shipped roster, one-tree packaging, metadata policy,
> commands, validation, and release process. This document is retained to explain the
> alternatives considered; outcome callouts identify recommendations that were tested
> and rejected.
```

- [ ] **Step 2: Add the shipped outcome after Purpose**

Add:

```markdown
> **Shipped outcome (v0.1.4):** One `skills/` tree serves Claude Code, Copilot CLI, and
> Codex. Copilot and Codex accept valid shared frontmatter and tolerate the remaining
> Claude-only `disable-model-invocation` field. No `skill-src/`, generated `dist/`,
> per-platform skill copy, or package generator is used.
```

- [ ] **Step 3: Reconcile the canonical-corrections list**

Keep the historical recommendations visible, but add a dated outcome callout that states:

```markdown
> **Outcome (v0.1.3):**
> - `when_to_use` was removed from all 24 skills and is now banned by
>   `tests/validate-skills.mjs`.
> - Routing-critical and trigger content lives only in `description`.
> - The generator recommendation was rejected after real Copilot and Codex installs
>   accepted the shared tree.
> - The listing-budget behavior and `skillListingBudgetFraction` are documented Claude
>   Code behavior and remain operational guidance.
```

Strike the obsolete claims that portable packages require stripping
`when_to_use`, that generated packages are required, and that the listing-budget remedy
is undocumented.

- [ ] **Step 4: Replace the current frontmatter contract**

The current example must contain:

```yaml
---
name: y-si-lo-encuentro-que
description: >
  Use before reporting that a repository artifact is absent or unfindable.
  NOT for an unverified external fact; use cadena-de-whatsapp.
---
```

Follow it with:

```markdown
`when_to_use` is not a current optional field in this pack. It was removed in v0.1.3 and
the validator rejects any reintroduction. Only `la-chancla` and `mexican-mom` retain
`disable-model-invocation: true`; Copilot and Codex treat their manual-only boundary as a
prompt contract.
```

- [ ] **Step 5: Mark the generated layout as rejected**

Rename `## Source and generated layout` to:

```markdown
## Rejected proposal: source and generated layout
```

Precede the retained tree with:

```markdown
> **Rejected after installation testing.** This layout existed to strip Claude-only
> fields from portable copies. Copilot CLI and Codex accepted the valid shared tree, so
> the generator added maintenance and drift risk without solving a real compatibility
> problem. The shipped repository keeps `skills/` at the root and points all platform
> manifests/catalogs at it.
```

- [ ] **Step 6: Correct copyable marketplace and lifecycle examples**

Use root sources instead of `./dist/...` in current examples. Keep verified Copilot
commands unchanged. Replace Claude update guidance with:

```text
/plugin marketplace update
/plugin update mexican-mom@mcasillas17
```

Add complete Codex CLI guidance:

```bash
codex plugin marketplace add mcasillas17/mexican-mom
codex plugin add mexican-mom@mcasillas17
codex plugin marketplace upgrade mcasillas17
codex plugin add mexican-mom@mcasillas17
codex plugin remove mexican-mom@mcasillas17
```

Explain that Codex uses `plugin add`, not `plugin install`, and requires the qualified
name for removal.

- [ ] **Step 7: Reconcile matrices, release steps, and validation**

Set the `when_to_use` capability row to `Not shipped; validator-banned` for all three
platforms. Replace generated-package release steps with:

```markdown
1. Update canonical files in the root repository.
2. Update release notes and `VERSION` when publishing a release.
3. Run `npm install && npm test`.
4. Validate the three manifests/catalogs and their shared `skills/` tree.
5. Perform clean marketplace installations for Claude Code, Copilot CLI, and Codex.
6. Tag and publish only after all three clients discover the same roster.
```

Build validation must check one shared roster, strict YAML, no `when_to_use`, portable
negative triggers in `description`, the 1,024-character description cap, the
1,536-character per-entry cap, and the 8,000-character pack ceiling. Remove requirements
for generated-file parity, generated variants, and symlink checks.

- [ ] **Step 8: Replace the final recommendation**

Use:

```markdown
## Shipped recommendation

Support Claude Code, GitHub Copilot CLI, and Codex from one root `skills/` tree. Keep
platform differences in the small manifests/catalogs and in user-facing invocation
documentation. Do not introduce generated packages unless a supported client begins
rejecting valid shared frontmatter and a reproducible install test demonstrates the need.
```

- [ ] **Step 9: Check the cross-platform document**

Run:

```bash
rg -n '/plugin update mexican-mom$|source": "./dist|Generate all three packages|Commit generated packages' \
  docs/specs/2026-08-12-mexican-mom-cross-platform-copilot-design.md
```

Expected: no active copyable guidance matches. Historical `skill-src/`, `dist/`, and
`when_to_use` references occur only inside rejected-proposal text or outcome explanations.

- [ ] **Step 10: Commit the cross-platform correction**

```bash
git add docs/specs/2026-08-12-mexican-mom-cross-platform-copilot-design.md
git commit -m "docs: reconcile cross-platform design history"
```

### Task 2: Correct the Copilot Synthesis History

**Files:**
- Modify: `docs/specs/2026-08-12-mexican-mom-copilot-synthesis-v2-design.md`

- [ ] **Step 1: Strengthen the superseded header**

Use the same `> [!IMPORTANT]` historical-proposal header from Task 1, pointing at the
canonical spec and stating that outcome callouts identify rejected recommendations.

- [ ] **Step 2: Add a current-outcome summary after Purpose**

Add:

```markdown
> **Shipped outcome (v0.1.4):** The current pack has 23 discipline skills plus one
> manual router. All routing metadata lives in `description`; `when_to_use` is banned.
> The pack uses one shared `skills/` tree and currently measures 6,815 / 8,000 listing
> characters.
```

- [ ] **Step 3: Correct the comparison and verified-facts sections**

Preserve the historical model positions in the comparison table, then add:

```markdown
> **Post-release correction:** The synthesis was wrong to recommend keeping
> `when_to_use` and wrong to classify the shared listing budget and
> `skillListingBudgetFraction` as unverified. v0.1.0 through v0.1.2 shipped with an
> 11,621-character listing that silently lost descriptions and did not auto-invoke.
> Removing 4,834 characters of `when_to_use` text cut the listing by 42% to 6,787 and
> restored automatic routing.
```

Record the controlled experiment exactly:

```text
11,621 chars, default budget  -> four planted scope items silently absorbed
11,621 chars, budget raised   -> no-se-te-olvide-que and ahorita both fired
 6,787 chars, default budget  -> both fired
```

State that the current footprint is 6,815 / 8,000 and the per-entry cap remains 1,536.

- [ ] **Step 4: Replace the frontmatter example and authoring rules**

Remove `when_to_use` from the copyable example. State:

```markdown
- Put primary triggers and collision exclusions in `description`.
- Keep `description` below the 1,024-character Agent Skills cap and the pack's tighter
  authoring target.
- Never declare `when_to_use`; repository validation rejects it.
- Measure the total listing and keep it below the 8,000-character regression ceiling.
```

- [ ] **Step 5: Annotate roster and policy outcomes**

Keep historical roster reasoning, but add callouts that the shipped roster is 23
discipline skills plus one manual router, `porque-soy-tu-mama` remains automatic under
its narrow literal-pressure trigger, and only `la-chancla` plus `mexican-mom` declare
`disable-model-invocation: true`.

- [ ] **Step 6: Correct verification and final recommendation**

Static checks must require no `when_to_use`, strict YAML, the current two direct-only
skills, per-entry and total listing ceilings, and one shared tree. Replace the final
recommendation's stale metadata sentence with:

```markdown
Keep `a-ver-ensename`, `ya-te-lavaste-las-manos`, the 1,536-character per-entry cap, the
shared listing-budget guidance, and `skillListingBudgetFraction`. Do not reintroduce
`when_to_use`: it consumed 42% of the listing while adding no routing-critical content.
```

- [ ] **Step 7: Check the synthesis document**

Run:

```bash
rg -n 'Keep; it is officially supported|supported `when_to_use`|Remove only the unverified listing-budget remedy' \
  docs/specs/2026-08-12-mexican-mom-copilot-synthesis-v2-design.md
```

Expected: no active recommendation matches. Remaining `when_to_use` references describe
the historical mistake, removal, ban, or controlled outcome.

- [ ] **Step 8: Commit the synthesis correction**

```bash
git add docs/specs/2026-08-12-mexican-mom-copilot-synthesis-v2-design.md
git commit -m "docs: reconcile Copilot synthesis history"
```

### Task 3: Verify and Obtain Independent Reviews

**Files:**
- Modify only the two historical design documents when addressing valid feedback.

- [ ] **Step 1: Run repository verification**

Run:

```bash
npm install
npm test
git diff --check origin/main...HEAD
git status --short --branch
```

Expected: 13 tests pass; validator checks 24 skills at v0.1.4 and reports a listing
footprint at or below 8,000; no whitespace errors; only intentional documentation
changes and committed process documents exist.

- [ ] **Step 2: Review stale-reference searches**

Run:

```bash
rg -n 'when_to_use|skill-src|dist/|skillListingBudgetFraction|plugin update mexican-mom|codex plugin' \
  docs/specs/2026-08-12-mexican-mom-cross-platform-copilot-design.md \
  docs/specs/2026-08-12-mexican-mom-copilot-synthesis-v2-design.md
```

Classify every match as current guidance, explicit historical mistake, rejected proposal,
or corrected outcome. No ambiguous copyable stale instruction may remain.

- [ ] **Step 3: Dispatch Claude Opus 5 review**

Use a read-only code-review agent with model `claude-opus-5`. Give it the canonical spec,
the two historical documents, `origin/main...HEAD`, the five correction categories, and
the do-not-touch list. Request only high-confidence contradictions, stale copyable
instructions, erased historical reasoning, or missing required commands.

- [ ] **Step 4: Dispatch GPT-5.6 Luna review**

Use a separate read-only code-review agent with model `gpt-5.6-luna` and the same scope.
The two reviews may run in parallel because both are read-only.

- [ ] **Step 5: Evaluate and apply review feedback**

Verify each finding against canonical v0.1.4 behavior. Apply valid corrections only to
the two historical documents. Push back on findings that would alter verified Copilot
commands, remove the `.claude-plugin/plugin.json` fallback claim, erase historical
reasoning, or touch prohibited files.

- [ ] **Step 6: Rerun verification after feedback**

Run:

```bash
npm test
git diff --check origin/main...HEAD
git status --short --branch
```

Expected: all tests pass and the worktree is clean after committing review fixes.

- [ ] **Step 7: Commit review corrections when needed**

```bash
git add docs/specs/2026-08-12-mexican-mom-cross-platform-copilot-design.md \
  docs/specs/2026-08-12-mexican-mom-copilot-synthesis-v2-design.md
git commit -m "docs: address design history review"
```

Skip this commit if both reviewers report no valid findings.

### Task 4: Push and Open the Pull Request

**Files:**
- No additional repository changes expected.

- [ ] **Step 1: Inspect the final branch**

Run:

```bash
git status --short --branch
git log --oneline origin/main..HEAD
git diff --stat origin/main...HEAD
```

Expected: a clean `docs/refresh-copilot-design-history` branch containing only the
approved documentation changes and process documents.

- [ ] **Step 2: Push the branch**

Run:

```bash
git push -u origin docs/refresh-copilot-design-history
```

- [ ] **Step 3: Create the pull request**

Run:

```bash
gh pr create \
  --base main \
  --head docs/refresh-copilot-design-history \
  --title "Reconcile historical Copilot design documents" \
  --body $'## Summary\n- mark both Copilot design documents as historical and superseded by the canonical v0.1.4 spec\n- record why `when_to_use` and generated platform packages were rejected\n- correct Claude and Codex lifecycle commands while preserving verified Copilot guidance\n- restore the documented listing-budget incident and mitigation\n\n## Verification\n- `npm install && npm test`\n- stale-reference classification against the canonical spec\n- independent Claude Opus 5 and GPT-5.6 Luna reviews addressed\n\n## Scope\nDocumentation only; no version bump.'
```

- [ ] **Step 4: Confirm the pull request**

Run:

```bash
gh pr view --json number,url,title,state,baseRefName,headRefName
```

Expected: an open PR targeting `main` from
`docs/refresh-copilot-design-history`.
