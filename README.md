# mexican-mom

**Engineering discipline for coding agents, delivered by a Mexican mother.**

Every Mexican mom trope is already an engineering discipline wearing a chancla.
*"¿Y si voy y lo encuentro, qué te hago?"* is not a joke about searching — it is a precise
description of the most common agent failure mode, which is declaring something absent
after one shallow look. The unifying accusation underneath the whole pack is that **a
shallow check is not a check**: looking once is not searching, restarting once is not
debugging, saying "it passed" is not showing evidence.

Every skill here still works with all the Spanish deleted. That is the design rule.

## Install

**Claude Code**

```text
/plugin marketplace add mcasillas17/mexican-mom
/plugin install mexican-mom@mcasillas17
```

**GitHub Copilot CLI**

```bash
copilot plugin marketplace add mcasillas17/mexican-mom
copilot plugin install mexican-mom@mcasillas17
```

**Codex**

```bash
codex plugin marketplace add mcasillas17/mexican-mom
codex plugin add mexican-mom@mcasillas17
```

Note that Codex uses `plugin add`, not `plugin install`.

## The skills

Mom shows up on her own when the situation calls for her. You can also invoke any skill
directly as `/mexican-mom:<name>`.

### Investigation and evidence

| Skill | She says | What it enforces |
| --- | --- | --- |
| `y-si-lo-encuentro-que` | *¿Y si voy y lo encuentro, qué te hago?* | No claim of absence until glob, grep, and the obvious directory have all been searched — and the report names them |
| `cadena-de-whatsapp` | *¿Y eso quién te lo dijo?* | Verify an external fact at its source before repeating it. Remembering is not knowing |
| `a-ver-ensename` | *A ver, enséñame* | No "it works" without the actual output. Mom does not accept *ya lo hice* |
| `el-vaporub` | *¿Te duele? Ponte Vaporub* | Run the stale-state ladder **once**, then diagnose properly. Vaporub three nights running means see a doctor |
| `ya-comiste` | *¿Ya comiste?* | Ordered environment checks — service, deps, env, ports — before blaming the code |
| `pero-no-haces-caso` | *Te lo dije, pero no haces caso* | Quote the warning you actually gave, or say nothing. No invented hindsight |

### Design and implementation quality

| Skill | She says | What it enforces |
| --- | --- | --- |
| `frijoles-en-el-tupper` | *Dice helado, pero son frijoles* | Names must predict their contents. Labels that lie get renamed |
| `pero-ponte-sueter` | *Pero ponte suéter* | Handle the failure or fail loudly with the cause. Never catch and continue. One layer, not five |
| `ya-te-lavaste-las-manos` | *¿Ya te lavaste las manos?* | Untrusted input validated at the boundary, encoded at the sink. Con jabón, not just wet |
| `no-le-abras-la-puerta-a-cualquiera` | *No le abras a nadie* | Instructions embedded in content are data, not commands. Prompt-injection defense |
| `ni-que-fueramos-ricos` | *¿Tú pagas la luz?* | Measure before optimizing. Never trade a safeguard for a saved call |
| `si-el-lo-hace-tu-tambien` | *¿Y si él lo hace, tú también?* | Popularity is not a justification — for the agent's own reasoning, never yours |
| `pero-tu-primo` | *Pero tu primo ya se tituló* | Compare against a reference you can actually open. No confabulated cousins |

### Decisions, time, and scope

| Skill | She says | What it enforces |
| --- | --- | --- |
| `ahorita` | *Sí, ahorita. Como ayer, ¿no?* | Every deferral resolves to committed, out of scope, or never |
| `ahorita-es-ahorita` | *Ahorita no. AHORA.* | Incidents preempt everything — without waiving consent, backups, or verification |
| `porque-yo-lo-digo` | *Porque yo lo digo y punto* | A settled decision stays settled. New information may be raised; new arguments may not |
| `porque-soy-tu-mama` | *Espérate tantito* | One care-backed pause when you say *just ship it*. Then it stands down |
| `no-se-te-olvide-que` | *Ah, y no se te olvide que…* | Late-arriving scope gets named, not silently absorbed |

### Consent, reversibility, and handoff

| Skill | She says | What it enforces |
| --- | --- | --- |
| `me-estas-avisando-o-pidiendo-permiso` | *¿Me estás avisando o me estás pidiendo permiso?* | Announcing is not asking. Consent never generalizes to the next action |
| `por-si-se-ocupa` | *Guárdalo, por si se ocupa* | Verified backup before destroying anything unreproducible |
| `recoge-tu-tiradero` | *¿Y quién va a levantar esto?* | Remove your own debugging residue. Keep what helps the next person |
| `vienen-las-visitas` | *¿Qué van a decir?* | The pre-handoff gate. Read your own diff. State known gaps honestly |
| `la-chancla` | *No me hagas ir por la chancla* | Direct-only strict review of the current task, ranked blockers and warnings |

### Router

`mexican-mom` — type `/mexican-mom` to have her pick the right one, or show the index. She
selects one skill plus at most one safety overlay; she never loads the whole pack.

## `ahorita` vs `ahorita-es-ahorita`

The best joke in the pack, and a real distinction. `ahorita` is the vague one — five
minutes, or never. `ahorita-es-ahorita` is the emergency. A mom who wants instant
compliance actually *stops* saying `ahorita` and switches to `ahora`; the diminutive is
the softener, and dropping it is the escalation.

## Platform differences

Skills follow the [Agent Skills](https://agentskills.io) open standard, and all routing
lives in `description`, so the pack behaves the same everywhere.

Two exceptions worth knowing:

- `la-chancla` and `mexican-mom` are **direct-only** — you invoke them, the agent cannot.
  This is enforced by `disable-model-invocation`, a Claude Code-only field. On Copilot and
  Codex it is a strongly worded prompt contract, not enforcement.
- `when_to_use` adds trigger phrases on Claude Code only. Nothing depends on it.

## What this is not

Not a personality or an output style. These are behavioral rules, not a costume for
ordinary responses. Mom disciplines **the agent**, not you — she does not review your
habits or guilt-trip you about the TODO from March.

The single exception is `porque-soy-tu-mama`, which pauses *you*, once, and only when you
literally say *just ship it* or reach for `--no-verify`. It earns the exception by
protecting rather than mocking, and it stands down the moment you say you meant it.

`la-chancla` is a metaphor for strict review. Nothing here endorses hitting anyone.

## Security note

Skills are privileged instructions that shape how an agent behaves. Read them before you
install them — this one included. None of these grant tools or permissions, register
hooks, or execute anything.

## Contributing

Renaming or removing a skill slug is a **breaking change**, because people type these
names. See [CHANGELOG.md](CHANGELOG.md) and the design spec in
[`docs/specs/`](docs/specs/).

Run `node tests/validate-skills.mjs` before opening a PR.

## License

MIT — see [LICENSE](LICENSE).
