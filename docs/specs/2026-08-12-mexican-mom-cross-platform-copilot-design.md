# mexican-mom — Cross-Platform Packaging with Copilot Support

> [!IMPORTANT]
> **Historical proposal, superseded by
> [`2026-08-12-mexican-mom-design.md`](./2026-08-12-mexican-mom-design.md).**
> The canonical spec defines the shipped roster, one-tree packaging, metadata policy,
> commands, validation, and release process. This document is retained to explain the
> alternatives considered; outcome callouts identify recommendations that were tested
> and rejected.

**Date:** 2026-08-12  
**Status:** Proposed companion to the canonical design  
**Source:** `2026-08-12-mexican-mom-design.md`  
**Targets:** Claude Code, GitHub Copilot CLI, Codex and ChatGPT plugins

## Purpose

This document adds GitHub Copilot CLI support to the canonical cross-platform design
without changing the skill roster or behavioral contracts.

The core `SKILL.md` content is portable. Plugin manifests, marketplace catalogs,
invocation controls, installation commands, update behavior, and release artifacts are
not. This proposal originally concluded that the repository should maintain one canonical
skill source and generate three platform packages.

> **Shipped outcome (v0.1.4):** One `skills/` tree serves Claude Code, Copilot CLI, and
> Codex. Copilot and Codex accept valid shared frontmatter and tolerate the remaining
> Claude-only `disable-model-invocation` field. No `skill-src/`, generated `dist/`,
> per-platform skill copy, or package generator is used.

## Historical corrections proposed for the canonical cross-platform section

The canonical design should change these platform claims:

1. **Codex has a plugin and marketplace system.** Current Codex plugins use
   `.codex-plugin/plugin.json`; repo marketplaces use
   `.agents/plugins/marketplace.json`; the CLI supports
   `codex plugin marketplace add`.
2. **Copilot support does not require restructuring the skill content.** This proposal
   assumed a root `plugin.json` inside a Copilot-specific package. The shipped plugin
   instead uses Copilot's verified `.claude-plugin/plugin.json` fallback plus a
   `.github/plugin/marketplace.json` catalog.
3. ~~**Generate real platform package directories instead of using symlinks.**~~ No
   platform-specific directories are needed. Each client installs or caches real files
   from the shared root tree.
4. ~~**`when_to_use` and `disable-model-invocation` must be stripped from portable
   variants.**~~ The shared tree omits `when_to_use` entirely and retains
   `disable-model-invocation` only on the two direct-only skills. Copilot and Codex
   tolerate that field when the enclosing YAML is valid.
5. **Routing-critical negative triggers belong in `description`.** This survived into
   the canonical design. `when_to_use` did not: v0.1.3 removed it from all 24 skills.
6. ~~**Treat the shared listing budget and `skillListingBudgetFraction` as
   undocumented.**~~ Both are documented Claude Code behavior. Their removal from the
   design would have erased the root cause and remedy for a failure that shipped in three
   releases.

> **Outcome (v0.1.3):**
> - `when_to_use` was removed from all 24 skills and is now banned by
>   `tests/validate-skills.mjs`.
> - Routing-critical and trigger content lives only in `description`.
> - The generator recommendation was rejected after real Copilot and Codex installs
>   accepted the shared tree.
> - The listing-budget behavior and `skillListingBudgetFraction` are documented Claude
>   Code behavior and remain operational guidance.

## Portability contract

### Canonical skill source

Every shipped skill has one `SKILL.md` containing:

- slug;
- portable `description`, including routing-critical exclusions;
- whether Claude should allow automatic model invocation;
- shared Markdown body;
- optional supporting files.

The complete file remains identical across platforms. Small platform manifests and
marketplace catalogs point at the same root `skills/` tree.

### Portable frontmatter

The Copilot and Codex variants use the Agent Skills-compatible subset:

```yaml
---
name: y-si-lo-encuentro-que
description: Use before reporting that a repository artifact is absent or unfindable.
  NOT for an unverified external fact; use cadena-de-whatsapp.
license: MIT
---
```

Do not include tool grants. The pack adds discipline rather than authority.

### Current shared frontmatter

```yaml
---
name: y-si-lo-encuentro-que
description: >
  Use before reporting that a repository artifact is absent or unfindable.
  NOT for an unverified external fact; use cadena-de-whatsapp.
---
```

`when_to_use` is not a current optional field in this pack. It was removed in v0.1.3 and
the validator rejects any reintroduction. Only `la-chancla` and `mexican-mom` retain
`disable-model-invocation: true`; Copilot and Codex treat their manual-only boundary as a
prompt contract.

Only `la-chancla` and `mexican-mom` add:

```yaml
disable-model-invocation: true
```

`porque-soy-tu-mama` remains automatic under its narrow literal-pressure trigger.
Copilot and Codex receive the same description and body.

### Manual-only behavior outside Claude

Copilot and Codex do not expose Claude's `disable-model-invocation` field through the
portable Agent Skills contract. For `la-chancla` and the router:

- begin `description` with `Use only when the user explicitly requests...`;
- repeat the manual-only boundary at the top of the body;
- never claim this is deterministic enforcement outside Claude Code.

This is a documented behavioral difference. It is not a reason to drop those skills.

## Rejected proposal: source and generated layout

> **Rejected after installation testing.** This layout existed to strip Claude-only
> fields from portable copies. Copilot CLI and Codex accepted the valid shared tree, so
> the generator added maintenance and drift risk without solving a real compatibility
> problem. The shipped repository keeps `skills/` at the root and points all platform
> manifests/catalogs at it.

```text
mexican-mom/
├── VERSION
├── skill-src/
│   ├── registry.yaml
│   ├── mexican-mom/
│   │   ├── body.md
│   │   └── metadata.yaml
│   ├── y-si-lo-encuentro-que/
│   │   ├── body.md
│   │   └── metadata.yaml
│   └── ... 22 more
├── dist/
│   ├── claude/
│   │   └── mexican-mom/
│   │       ├── .claude-plugin/plugin.json
│   │       └── skills/<slug>/SKILL.md
│   ├── copilot/
│   │   └── mexican-mom/
│   │       ├── plugin.json
│   │       └── skills/<slug>/SKILL.md
│   └── codex/
│       └── mexican-mom/
│           ├── .codex-plugin/plugin.json
│           └── skills/<slug>/SKILL.md
├── .claude-plugin/marketplace.json
├── .github/plugin/marketplace.json
├── .agents/plugins/marketplace.json
├── scripts/build-packages.mjs
├── scripts/validate-packages.mjs
├── tests/fixtures/
├── docs/
├── README.md
├── CHANGELOG.md
└── LICENSE
```

## Historical platform package examples and current lifecycle commands

> **Manifest examples in this section are historical proposals, not shipped files.**
> The current repository uses `.claude-plugin/plugin.json` as Claude's manifest and
> Copilot's verified fallback, `.codex-plugin/plugin.json` for Codex, and one root
> `skills/` tree. The install, update, and uninstall commands below are current.

### Claude Code

Manifest:

```json
{
  "name": "mexican-mom",
  "version": "0.1.0",
  "description": "Mexican mom-inspired engineering discipline for coding agents",
  "author": {
    "name": "mcasillas17"
  },
  "skills": "./skills/"
}
```

Marketplace:

```json
{
  "name": "mcasillas17",
  "owner": {
    "name": "mcasillas17"
  },
  "plugins": [
    {
      "name": "mexican-mom",
      "version": "0.1.0",
      "source": "./"
    }
  ]
}
```

Install:

```text
/plugin marketplace add mcasillas17/mexican-mom
/plugin install mexican-mom@mcasillas17
```

Invoke:

```text
/mexican-mom:mexican-mom
/mexican-mom:la-chancla
```

Update:

```text
/plugin marketplace update
/plugin update mexican-mom@mcasillas17
```

### GitHub Copilot CLI

> **Rejected manifest assumption:** This proposal treated a root `plugin.json` as
> required. The shipped repository has no root `plugin.json`; Copilot reads
> `.claude-plugin/plugin.json` through its verified fallback order.

The following root manifest is retained only as the rejected proposal:

Manifest:

```json
{
  "name": "mexican-mom",
  "description": "Mexican mom-inspired engineering discipline for coding agents",
  "version": "0.1.0",
  "author": {
    "name": "mcasillas17"
  },
  "license": "MIT",
  "repository": "https://github.com/mcasillas17/mexican-mom",
  "skills": "skills/"
}
```

Marketplace:

```json
{
  "name": "mcasillas17",
  "owner": {
    "name": "mcasillas17"
  },
  "metadata": {
    "description": "Plugins maintained by mcasillas17",
    "version": "0.1.0"
  },
  "plugins": [
    {
      "name": "mexican-mom",
      "description": "Mexican mom-inspired engineering discipline for coding agents",
      "version": "0.1.0",
      "source": "./"
    }
  ]
}
```

Install from the terminal:

```bash
copilot plugin marketplace add mcasillas17/mexican-mom
copilot plugin install mexican-mom@mcasillas17
```

The equivalent operations are available through `/plugin` inside an interactive Copilot
CLI session.

Inspect the installed skills:

```text
/skills list
/skills info mexican-mom
```

Invoke a specific skill by naming it in the prompt:

```text
Use the /a-ver-ensename skill before claiming this is fixed.
```

Copilot decides automatic use from the portable `description`.

Update:

```bash
copilot plugin marketplace update mcasillas17
copilot plugin update mexican-mom
```

Uninstall:

```bash
copilot plugin uninstall mexican-mom
```

Standalone skill installation remains available:

```bash
copilot plugins install --skill URL_OR_DIRECTORY
```

That path is useful for testing one skill, but the plugin is the supported way to
install and update the full pack.

### Codex and ChatGPT plugins

Codex plugins require `.codex-plugin/plugin.json`.

Manifest:

```json
{
  "name": "mexican-mom",
  "version": "0.1.0",
  "description": "Mexican mom-inspired engineering discipline for coding agents",
  "author": {
    "name": "mcasillas17",
    "url": "https://github.com/mcasillas17"
  },
  "repository": "https://github.com/mcasillas17/mexican-mom",
  "license": "MIT",
  "keywords": ["engineering", "quality", "verification", "skills"],
  "skills": "./skills/",
  "interface": {
    "displayName": "Mexican Mom",
    "shortDescription": "Engineering discipline with Mexican mom energy",
    "developerName": "mcasillas17",
    "category": "Productivity"
  }
}
```

Repo marketplace:

```json
{
  "name": "mcasillas17",
  "interface": {
    "displayName": "mcasillas17 Plugins"
  },
  "plugins": [
    {
      "name": "mexican-mom",
      "source": {
        "source": "local",
        "path": "./"
      },
      "policy": {
        "installation": "AVAILABLE",
        "authentication": "ON_INSTALL"
      },
      "category": "Productivity"
    }
  ]
}
```

Add, install, update, or remove through the Codex CLI:

```bash
codex plugin marketplace add mcasillas17/mexican-mom
codex plugin add mexican-mom@mcasillas17
codex plugin marketplace upgrade mcasillas17
codex plugin add mexican-mom@mcasillas17
codex plugin remove mexican-mom@mcasillas17
```

Codex uses `plugin add`, not `plugin install`, and requires the qualified
`plugin@marketplace` name for removal. The ChatGPT desktop Plugins Directory remains an
additional installation path. Codex invokes skills with its skill syntax, such as
`$a-ver-ensename`.

For the universal public Plugins Directory, publication is a separate submission from
the repository marketplace. The same `.codex-plugin` package is the publication
artifact.

## Shared behavior differences

| Capability | Claude Code | Copilot CLI | Codex |
| --- | --- | --- | --- |
| Portable `name` and `description` | Yes | Yes | Yes |
| `when_to_use` | Not shipped; validator-banned | Not shipped; validator-banned | Not shipped; validator-banned |
| `disable-model-invocation` | Yes | No portable equivalent | No portable equivalent |
| Plugin manifest | `.claude-plugin/plugin.json` | reads `.claude-plugin/plugin.json` as a verified fallback | `.codex-plugin/plugin.json` |
| Marketplace catalog | `.claude-plugin/marketplace.json` | `.github/plugin/marketplace.json` | `.agents/plugins/marketplace.json` |
| Full-pack install | Claude marketplace | Copilot marketplace | Plugins Directory / Codex marketplace |
| Direct skill syntax | `/plugin:skill` | `/skill-name` in prompts | `$skill-name` |

The skill body must never assume one platform's tool names, permission UI, or command
syntax. Platform-specific installation and invocation examples belong in README sections,
not inside the shared behavioral procedure.

## Release and publication

Use `VERSION` as the single source of truth. Repository validation requires every
manifest, marketplace entry, and `package.json` to agree with it.

Release types:

- **MAJOR:** remove or rename a skill, change a slug, or break a behavior contract.
- **MINOR:** add a skill or introduce a new capability.
- **PATCH:** fix wording, triggers, routing boundaries, examples, or packaging.

Release procedure:

1. Update canonical files in the root repository.
2. Update release notes and `VERSION` when publishing a release.
3. Run `npm install && npm test`.
4. Validate the three manifests/catalogs and their shared `skills/` tree.
5. Perform clean marketplace installations for Claude Code, Copilot CLI, and Codex.
6. Tag and publish only after all three clients discover the same roster.

Repository marketplaces publish when the updated commit is pushed. They do not require a
separate upload:

- Claude users refresh and run `/plugin update mexican-mom@mcasillas17`.
- Copilot users run `copilot plugin marketplace update mcasillas17` and
  `copilot plugin update mexican-mom`.
- Codex users run `codex plugin marketplace upgrade mcasillas17`, then
  `codex plugin add mexican-mom@mcasillas17`.

Publishing to Codex's universal Plugins Directory remains a separate release channel.

## Build validation

`npm test` must check:

- all three manifests contain the same plugin name and version;
- all three manifests/catalogs point at the same root `skills/` tree;
- every frontmatter block is valid YAML;
- no skill declares `when_to_use`;
- Claude direct-only skills contain `disable-model-invocation: true`;
- all routing-critical negative triggers appear in `description`;
- descriptions satisfy the portable 1,024-character limit;
- each listing entry remains below 1,536 characters;
- the total listing remains below the 8,000-character regression ceiling;
- no package grants tools or includes hooks, hidden scripts, or runtime state;
- marketplace source paths resolve inside the repository;
- marketplace names and install commands agree;
- every platform passes its validator or clean-install smoke test.

## Behavioral validation

Run the same positive, negative, pressure, collision, security, and composition fixtures
against the shared skill tree through all three clients.

Expected differences:

- Claude reliably keeps `la-chancla` and the router manual-only.
- Copilot and Codex treat manual-only behavior as a strongly worded prompt contract.
- Automatic routing comes from each skill's portable `description`; no platform receives
  a `when_to_use` variant.

Release fails if the shared tree:

- route a negative-trigger case to the wrong skill;
- auto-select `la-chancla` or the router in common smoke tests;
- require Claude-specific commands to perform their procedure;
- omit any discipline, boundary, evidence requirement, or exit criterion.

## README structure

The README should include:

1. premise and cultural contract;
2. complete skill table;
3. platform support matrix;
4. Claude installation, invocation, and update commands;
5. Copilot installation, invocation, and update commands;
6. Codex marketplace and Plugins Directory instructions;
7. portability differences for direct-only skills;
8. security warning: skills are privileged instructions and must be reviewed;
9. versioning and changelog policy;
10. uninstall instructions for each platform.

## Shipped recommendation

Support Claude Code, GitHub Copilot CLI, and Codex from one root `skills/` tree. Keep
platform differences in the small manifests/catalogs and in user-facing invocation
documentation. Do not introduce generated packages unless a supported client begins
rejecting valid shared frontmatter and a reproducible install test demonstrates the need.

## Official references

- GitHub Copilot CLI skills:
  <https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills>
- GitHub Copilot CLI plugins:
  <https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference>
- GitHub Copilot CLI marketplaces:
  <https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-marketplace>
- Claude Code skills:
  <https://code.claude.com/docs/en/skills>
- Claude Code marketplaces:
  <https://code.claude.com/docs/en/plugin-marketplaces>
- Codex and ChatGPT plugin packaging:
  <https://developers.openai.com/plugins/build/plugins>
