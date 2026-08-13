# mexican-mom — Cross-Platform Packaging with Copilot Support

**Date:** 2026-08-12  
**Status:** Proposed companion to the canonical design  
**Source:** `2026-08-12-mexican-mom-design.md`  
**Targets:** Claude Code, GitHub Copilot CLI, Codex and ChatGPT plugins

## Purpose

This document adds GitHub Copilot CLI support to the canonical cross-platform design
without changing the skill roster or behavioral contracts.

The core `SKILL.md` content is portable. Plugin manifests, marketplace catalogs,
invocation controls, installation commands, update behavior, and release artifacts are
not. The repository should therefore maintain one canonical skill source and generate
three platform packages.

## Corrections to the canonical cross-platform section

The canonical design should change these platform claims:

1. **Codex has a plugin and marketplace system.** Current Codex plugins use
   `.codex-plugin/plugin.json`; repo marketplaces use
   `.agents/plugins/marketplace.json`; the CLI supports
   `codex plugin marketplace add`.
2. **Copilot support does not require restructuring the skill content.** It requires a
   root `plugin.json` inside the Copilot package and a marketplace catalog at
   `.github/plugin/marketplace.json`. Copilot also recognizes a catalog in
   `.claude-plugin/marketplace.json`, but a dedicated catalog avoids schema coupling.
3. **Do not use a symlink as the distribution strategy.** Claude, Copilot, and Codex
   cache or copy plugin directories differently. Generate real package directories so
   every installed artifact is self-contained.
4. **`when_to_use` and `disable-model-invocation` are Claude Code extensions.** They
   cannot be present in the portable Copilot/Codex `SKILL.md` variants.
5. **Routing-critical negative triggers belong in `description`.** The canonical text
   currently states this correctly, then later says negative triggers belong in
   `when_to_use`. The first statement is the portable rule; `when_to_use` carries only
   optional trigger examples.
6. **Do not rely on undocumented Claude settings in the cross-platform contract.** The
   official Claude skills reference documents the 1,536-character combined
   `description` and `when_to_use` cap. Cross-platform packaging should not require
   `skillListingBudgetFraction`, a fixed total percentage, or an eviction-order claim.

## Portability contract

### Canonical skill source

Every skill has one source definition containing:

- slug;
- portable `description`, including routing-critical exclusions;
- optional Claude-only trigger phrases;
- whether Claude should allow automatic model invocation;
- shared Markdown body;
- optional supporting files.

The body remains identical across platforms. Only frontmatter and packaging differ.

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

### Claude Code frontmatter

The Claude package enriches the same portable fields:

```yaml
---
name: y-si-lo-encuentro-que
description: Use before reporting that a repository artifact is absent or unfindable.
  NOT for an unverified external fact; use cadena-de-whatsapp.
when_to_use: >
  Triggers: "I couldn't find", "there is no", "does not exist".
---
```

Only `la-chancla` and `mexican-mom` add:

```yaml
disable-model-invocation: true
```

If the canonical design continues to make `porque-soy-tu-mama` automatic, that behavior
is preserved in Claude. Copilot and Codex receive its portable description and body.

### Manual-only behavior outside Claude

Copilot and Codex do not expose Claude's `disable-model-invocation` field through the
portable Agent Skills contract. For `la-chancla` and the router:

- begin `description` with `Use only when the user explicitly requests...`;
- repeat the manual-only boundary at the top of the body;
- never claim this is deterministic enforcement outside Claude Code.

This is a documented behavioral difference. It is not a reason to drop those skills.

## Source and generated layout

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

`dist/` is generated but committed so marketplace installations are reproducible from a
tagged repository revision. Generated packages contain real files, not symlinks.

## Platform packages

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
      "source": "./dist/claude/mexican-mom"
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
/plugin update mexican-mom
```

### GitHub Copilot CLI

Copilot plugins require `plugin.json` at the package root. Skills remain under
`skills/<slug>/SKILL.md`.

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
      "source": "./dist/copilot/mexican-mom"
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
        "path": "./dist/codex/mexican-mom"
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

Add or refresh the marketplace:

```bash
codex plugin marketplace add mcasillas17/mexican-mom
codex plugin marketplace upgrade mcasillas17
```

Install the plugin from the Plugins Directory in the ChatGPT desktop app after selecting
the `mcasillas17` marketplace source. Codex invokes skills with its skill syntax, such as
`$a-ver-ensename`.

For the universal public Plugins Directory, publication is a separate submission from
the repository marketplace. The same `.codex-plugin` package is the publication
artifact.

## Shared behavior differences

| Capability | Claude Code | Copilot CLI | Codex |
| --- | --- | --- | --- |
| Portable `name` and `description` | Yes | Yes | Yes |
| `when_to_use` | Yes | Do not ship | Do not ship |
| `disable-model-invocation` | Yes | No portable equivalent | No portable equivalent |
| Plugin manifest | `.claude-plugin/plugin.json` | `plugin.json` | `.codex-plugin/plugin.json` |
| Marketplace catalog | `.claude-plugin/marketplace.json` | `.github/plugin/marketplace.json` | `.agents/plugins/marketplace.json` |
| Full-pack install | Claude marketplace | Copilot marketplace | Plugins Directory / Codex marketplace |
| Direct skill syntax | `/plugin:skill` | `/skill-name` in prompts | `$skill-name` |

The skill body must never assume one platform's tool names, permission UI, or command
syntax. Platform-specific installation and invocation examples belong in README sections,
not inside the shared behavioral procedure.

## Release and publication

Use `VERSION` as the single source of truth. `scripts/build-packages.mjs` writes the same
version into all three manifests and marketplace entries.

Release types:

- **MAJOR:** remove or rename a skill, change a slug, or break a behavior contract.
- **MINOR:** add a skill or introduce a new capability.
- **PATCH:** fix wording, triggers, routing boundaries, examples, or packaging.

Release procedure:

1. Update canonical skill sources.
2. Update `CHANGELOG.md`.
3. Set the new version in `VERSION`.
4. Generate all three packages.
5. Validate manifests, catalogs, frontmatter, roster parity, and generated-file
   cleanliness.
6. Run shared behavioral fixtures against each platform variant.
7. Perform clean marketplace installations for Claude, Copilot, and Codex.
8. Commit generated packages.
9. Tag `vX.Y.Z` and push the commit and tag.
10. Verify that each marketplace resolves the tagged package and displays the new
    version.

Repository marketplaces publish when the updated commit is pushed. They do not require a
separate upload:

- Claude users refresh and run `/plugin update`.
- Copilot users run `copilot plugin marketplace update` and
  `copilot plugin update`.
- Codex users run `codex plugin marketplace upgrade`, then update from the Plugins
  Directory.

Publishing to Codex's universal Plugins Directory remains a separate release channel.

## Build validation

`scripts/validate-packages.mjs` must check:

- all three manifests contain the same plugin name and version;
- all three packages contain the same roster and supporting files;
- portable packages contain no Claude-only frontmatter;
- Claude direct-only skills contain `disable-model-invocation: true`;
- all routing-critical negative triggers appear in `description`;
- descriptions satisfy the portable 1,024-character limit;
- Claude `description` plus `when_to_use` remains below 1,536 characters;
- no package grants tools or includes hooks, hidden scripts, or runtime state;
- marketplace source paths resolve inside the repository;
- marketplace names and install commands agree;
- generated files exactly match canonical sources;
- no symlinks exist inside generated packages;
- every package passes its platform validator or clean-install smoke test.

## Behavioral validation

Run the same positive, negative, pressure, collision, security, and composition fixtures
against all three generated skill variants.

Expected differences:

- Claude reliably keeps `la-chancla` and the router manual-only.
- Copilot and Codex treat manual-only behavior as a strongly worded prompt contract.
- Trigger phrases in Claude's `when_to_use` may improve routing, but deleting that field
  must not change ownership because the portable `description` is complete.

Release fails if the portable variants:

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

## Recommendation

Support Claude Code, GitHub Copilot CLI, and Codex in v1. The additional maintenance
cost should be handled by generated packages, not by hand-maintaining three skill trees.

The core design already satisfies the hardest portability requirement: routing-critical
information is in `description`, and all behavior is expressed in English inside
`SKILL.md`. Adding Copilot is therefore a packaging and release-engineering task, not a
rewrite of the skills.

The canonical spec should replace its current "Copilot deliberately out of scope" and
"Codex has no marketplace" sections with this three-package model.

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
