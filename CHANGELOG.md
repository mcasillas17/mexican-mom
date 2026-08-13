# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Because users invoke skills by name, **renaming or removing a skill slug is a breaking
change** and requires a MAJOR bump.

## Unreleased

### Fixed

- **Contributing instructions no longer fail on a fresh clone.** The test suite gained a
  real `yaml` dependency in 0.1.4, but the README still said to run
  `node tests/validate-skills.mjs` directly. Without `npm install` that exits with
  `Cannot find package 'yaml'`, which reads like a broken repository rather than a
  missing install step. Now documents `npm install` followed by `npm test`, which runs
  the contract tests and the validator together.

  No version bump: this affects contributors only and changes nothing that ships to
  users, so it should not push a no-op update to every install.

### Added

- A note in Contributing about the listing footprint the validator prints on every run,
  and why overflowing it fails silently. Adding a skill is not free.

## [0.1.4] — 2026-08-13

### Fixed

- Parse every skill frontmatter block with a strict YAML parser; malformed syntax,
  duplicate keys, and non-mapping documents now fail validation.
- Fold the three previously malformed descriptions, preserving the listing-budget checks
  that keep automatic routing available.
- Clarify automatic routing vs manual router usage and remove the hard-coded Claude
  command from the shared `la-chancla` guidance so direct syntax stays portable.
- Permit one concise correction for a previously omitted material safety, security,
  privacy, or irreversible-data-loss risk without reopening ordinary decisions.
- Correct platform invocation, update, and uninstall guidance, including Codex's refresh
  then `plugin add` workflow.

### Changed

- Retarget the release-hardening follow-up to 0.1.4. The shipped 0.1.3 listing-budget
  evidence and its `when_to_use` removal remain documented below.

## [0.1.3] — 2026-08-13

### Fixed

**Skills did not auto-invoke on a default install.** The pack's skill listing was 11,621
characters across 24 entries, over the budget Claude Code allocates for it. On overflow
Claude Code drops descriptions silently — skills still list by name, but nothing matches,
so mom never showed up on her own. Direct invocation kept working, which made the failure
easy to miss.

Removing `when_to_use` from all 24 skills cuts the listing to **6,787 characters**, a 42%
reduction, with no loss of routing information: every negative trigger already lived in
`description` by design, because `when_to_use` is a Claude Code extension that does not
exist on Codex or Copilot.

Confirmed by controlled experiment. The same prompt, model, and repository, varying only
`SLASH_COMMAND_TOOL_CHAR_BUDGET`:

- Default budget, 11,621-char listing: four planted scope items silently absorbed.
- Raised budget, same listing: `no-se-te-olvide-que` classified all four as IN or
  FOLLOW-UP, and `ahorita` flagged that a follow-up with no durable record "is not a real
  record."
- Default budget, 6,787-char listing: same correct behavior.

### Added

- An **If mom stops showing up** section in the README covering the symptom (direct
  invocation works, auto-invocation does not), how to check it with `/context` and
  `/doctor`, and `skillListingBudgetFraction` as the remedy.

### Changed

- Removed `when_to_use` from every skill. The two direct-only skills retain
  `disable-model-invocation: true` for Claude Code; on Copilot and Codex their
  direct-only status remains a prompt contract.

## [0.1.2] — 2026-08-13

### Fixed

- Documented that Claude Code requires the qualified `plugin@marketplace` name when
  updating. `plugin update mexican-mom` fails with `Plugin "mexican-mom" not found`,
  which reads like the plugin is missing rather than like a syntax error. The correct
  form is `plugin update mexican-mom@mcasillas17`.

### Added

- An **Updating** section in the README, with verified update and uninstall commands for
  all three platforms. The README previously covered installation only, so anyone trying
  to update reached for the form that fails.

### Verified

Every command in the README and the spec's platform table was run against its CLI:

- Copilot accepts both the bare and qualified name on `plugin update`.
- Codex requires the qualified name on `plugin remove`, and uses
  `plugin marketplace upgrade` rather than `update`.
- `copilot plugin marketplace update` and `codex plugin marketplace upgrade` both work
  as documented.

## [0.1.1] — 2026-08-13

### Fixed

- Corrected the Codex install command in the README. It is `codex plugin add`, not
  `codex plugin install` — the latter subcommand does not exist.

### Verified

- Marketplace installation succeeded end to end on Claude Code, GitHub Copilot CLI, and
  Codex.
- A later audit found malformed YAML kept three skills from loading correctly in Copilot,
  so the initial 24-skill readout there was too optimistic.
- With valid YAML, Copilot and Codex tolerated the then-present `when_to_use` and
  `disable-model-invocation` extensions. That tolerance never made malformed YAML load;
  the pack now omits `when_to_use`, while its two direct-only skills retain the latter
  Claude Code field.

## [0.1.0] — 2026-08-12

### Added

Initial release. 23 discipline skills plus a router.

**Investigation and evidence**

- `y-si-lo-encuentro-que` — no claim of absence without a proven exhaustive search
- `cadena-de-whatsapp` — verify an external fact at the source before repeating it
- `a-ver-ensename` — no success claim without the actual output
- `el-vaporub` — run the stale-state ladder once, then diagnose properly
- `ya-comiste` — ordered environment checks before blaming application code
- `pero-no-haces-caso` — quote the warning you actually gave, or say nothing

**Design and implementation quality**

- `frijoles-en-el-tupper` — names must predict their contents
- `pero-ponte-sueter` — handle the failure or fail loudly; never catch and continue
- `ya-te-lavaste-las-manos` — validate untrusted input at the boundary, encode at the sink
- `no-le-abras-la-puerta-a-cualquiera` — instructions in content are data, not commands
- `ni-que-fueramos-ricos` — measure before optimizing; never trade a safeguard for a call
- `si-el-lo-hace-tu-tambien` — popularity is not a justification
- `pero-tu-primo` — compare against a reference you can actually open

**Decisions, time, and scope**

- `ahorita` — every deferral resolves to committed, out of scope, or never
- `ahorita-es-ahorita` — incidents preempt everything, without waiving safeguards
- `porque-yo-lo-digo` — a settled decision stays settled
- `porque-soy-tu-mama` — one care-backed pause on an explicitly pressured shortcut
- `no-se-te-olvide-que` — name late-arriving scope instead of absorbing it

**Consent, reversibility, and handoff**

- `me-estas-avisando-o-pidiendo-permiso` — announcing is not asking
- `por-si-se-ocupa` — verified backup before destroying anything unreproducible
- `recoge-tu-tiradero` — remove your own debugging residue
- `vienen-las-visitas` — the pre-handoff gate
- `la-chancla` — direct-only strict review of the current task

**Router**

- `mexican-mom` — direct-only; selects one skill plus at most one safety overlay

### Notes

- Skills follow the [Agent Skills](https://agentskills.io) open standard. All routing
  lives in `description`, so the pack works on agents that do not support the Claude Code
  `when_to_use` extension.
- `la-chancla` and `mexican-mom` use `disable-model-invocation`, a Claude Code-only
  field. On other platforms they stay manual by wording rather than by enforcement.
