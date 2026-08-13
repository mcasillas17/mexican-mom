# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Because users invoke skills by name, **renaming or removing a skill slug is a breaking
change** and requires a MAJOR bump.

## [0.1.1] — 2026-08-13

### Fixed

- Corrected the Codex install command in the README. It is `codex plugin add`, not
  `codex plugin install` — the latter subcommand does not exist.

### Verified

- Clean install confirmed end to end on Claude Code, GitHub Copilot CLI, and Codex.
  All 24 skills install and enable on each.
- Copilot and Codex accept `when_to_use` and `disable-model-invocation` without error.
  Those Claude Code-only fields are tolerated rather than rejected, so one `skills/`
  tree serves all three platforms with no build step.

## [0.1.0] — 2026-08-12

### Added

Initial release. 22 discipline skills plus a router.

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
