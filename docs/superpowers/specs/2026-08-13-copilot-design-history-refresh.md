# Copilot Design History Refresh

**Status:** Approved

## Goal

Correct two historical Copilot design documents so they defer unambiguously to the
canonical v0.1.4 design and cannot be mistaken for current implementation guidance,
while preserving the reasoning and rejected alternatives as project history.

## Scope

Primary files:

- `docs/specs/2026-08-12-mexican-mom-cross-platform-copilot-design.md`
- `docs/specs/2026-08-12-mexican-mom-copilot-synthesis-v2-design.md`

The canonical authority is
`docs/specs/2026-08-12-mexican-mom-design.md`.

No workflows, skills, tests, changelog entries, manifests, or version files will change.

## Historical Correction Pattern

Each document receives a prominent superseded-by-canonical header. Stale sections retain
their historical reasoning but gain dated outcome callouts immediately before copyable
guidance. Short obsolete recommendations are struck and followed by the shipped result.
Large rejected designs remain intact under an explicit rejected-proposal heading.

Readers must be able to distinguish current commands and architecture without consulting
Git history.

## Required Corrections

### `when_to_use`

Record that v0.1.3 removed `when_to_use` from all 24 skills and the validator now bans it.
Explain the shipped failure: the listing was 11,621 characters, overflow silently
removed descriptions, and automatic invocation did not work in v0.1.0 through v0.1.2.
Removing 4,834 characters of non-critical `when_to_use` text reduced the listing by 42%
to 6,787 characters and restored automatic routing. Record the controlled experiment
and current 6,815 / 8,000 validator footprint.

Examples, tables, authoring rules, and validation checklists must no longer recommend or
show `when_to_use` as current pack metadata.

### Packaging

Mark the `skill-src/` plus generated `dist/` architecture as tested and rejected.
Copilot CLI and Codex accept the shared tree's valid YAML and tolerate the remaining
Claude-only `disable-model-invocation` field. The shipped architecture uses one
`skills/` tree, three small manifests/catalogs, no generator, and no generated packages.

The historical layout remains visible as a rejected proposal, but marketplace examples,
release steps, validation rules, and final recommendations must describe the one-tree
implementation.

### Commands

Use the qualified Claude update command:

```text
/plugin update mexican-mom@mcasillas17
```

Document the Codex CLI lifecycle:

```bash
codex plugin marketplace add mcasillas17/mexican-mom
codex plugin add mexican-mom@mcasillas17
codex plugin marketplace upgrade mcasillas17
codex plugin add mexican-mom@mcasillas17
codex plugin remove mexican-mom@mcasillas17
```

Keep verified Copilot commands and `.claude-plugin/plugin.json` fallback claims intact.

### Listing Budget

Correct the synthesis document's classification of listing-budget behavior as
unverified. Preserve the documented shared budget behavior, silent description dropping,
`skillListingBudgetFraction`, the controlled experiment, and the reason this correction
matters: removing that guidance would erase the root cause of the failure shipped for
three releases.

## Verification and Review

Run `npm install && npm test`; the existing 13 tests and validator must pass without
source changes. Review the two-document diff independently with Claude Opus 5 and
GPT-5.6 Luna. Evaluate each finding against the canonical spec and shipped v0.1.4
repository, apply valid feedback, rerun verification, push the branch, and open a pull
request against `main`.
