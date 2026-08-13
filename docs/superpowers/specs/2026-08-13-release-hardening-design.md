# Release Hardening Design

**Status:** Approved

## Goal

Make the published skill pack load reliably on Claude Code, GitHub Copilot CLI, and
Codex; prevent malformed skill frontmatter from passing repository validation; correct
confirmed behavioral and documentation defects; and verify the complete marketplace
workflow before publishing the next patch release.

## Scope

This is a focused release-hardening change. It fixes confirmed defects in the existing
single-tree architecture without introducing generated per-platform packages.

Included:

- strict YAML parsing for every `SKILL.md` frontmatter block;
- regression coverage for malformed frontmatter and the material-risk exception;
- valid folded descriptions for the three malformed skills;
- a safety exception in `porque-yo-lo-digo`;
- accurate platform-specific invocation, update, and uninstall documentation;
- correction of false changelog claims and stale canonical-spec assertions;
- explicit superseded notices on proposal documents that conflict with the shipped
  architecture;
- clean marketplace install and skill-discovery verification on all three platforms.

Excluded:

- generated platform-specific skill trees;
- new skills or renamed skill slugs;
- unrelated cultural, stylistic, or architectural changes;
- implementing every aspirational document listed in the original design.

## Repository Isolation

All changes are made on branch `fix/release-hardening-v0.1.2` in a worktree created
directly from `origin/main`. The existing checkout remains untouched.

## Validation Architecture

Add the `yaml` package as a development dependency and define the repository test command
through `package.json`. The validator will:

1. extract each frontmatter block;
2. parse it with a standards-compliant YAML parser;
3. reject syntax errors, duplicate keys, non-mapping documents, and unsupported value
   shapes;
4. run the existing pack-specific naming, length, section, routing, and version checks on
   the parsed values.

The validator must report the skill path and parser error and exit non-zero. It must not
continue with a success-shaped representation of invalid frontmatter.

Regression fixtures will prove that an unquoted `: ` in a plain scalar fails validation
while folded and quoted descriptions pass.

## Skill Changes

Convert the descriptions in `ahorita`,
`me-estas-avisando-o-pidiendo-permiso`, and `por-si-se-ocupa` to folded YAML scalars
without changing their routing meaning.

Amend `porque-yo-lo-digo` so the settled-decision rule still blocks ordinary relitigation
but permits one concise correction when the agent previously failed to raise a material
safety, security, privacy, or irreversible-data-loss concern. The exception does not
permit reviving preferences, style arguments, or merely stronger versions of an earlier
argument.

## Documentation Changes

The README will separate invocation syntax by platform:

- Claude Code: `/mexican-mom:<skill>`;
- GitHub Copilot CLI: `/<skill>`;
- Codex: `$<skill>`.

It will also document marketplace refresh, plugin update or reinstall, and uninstall
commands using the currently supported CLI forms.

The changelog will state the correct roster of 23 discipline skills plus one router and
will no longer claim that malformed skills enabled successfully.

The canonical design will remove unsupported claims about a 1% listing budget,
least-used eviction, and `skillListingBudgetFraction`; correct any conflicting placement
guidance for negative triggers; and use explicit platform update commands.

The two companion proposals will receive prominent superseded notices wherever their
roster or generated-package architecture conflicts with the canonical shipped design.
They remain as design history rather than being silently rewritten.

## Verification

The change is complete only after:

1. the regression test fails against the original malformed fixtures and passes against
   corrected fixtures;
2. all 24 repository skills parse as valid YAML;
3. the repository validator and package test command pass;
4. names, versions, required sections, and direct-only metadata remain consistent;
5. clean Claude Code, Copilot CLI, and Codex marketplace installs succeed;
6. each client discovers all 24 skills without parse errors;
7. a GPT-5.6 Luna agent reviews the complete diff;
8. valid review findings are addressed and the verification suite is rerun.

## Delivery

Commit the approved specification first, implement the plan in the isolated worktree,
push the branch, and open a pull request against `main`. The pull request will summarize
the release blockers, behavioral correction, documentation changes, and cross-platform
verification evidence.
