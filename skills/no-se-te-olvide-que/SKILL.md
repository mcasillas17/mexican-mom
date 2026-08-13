---
name: no-se-te-olvide-que
description: Use when a new requirement, constraint, or issue arrives after scope was agreed, work began, or completion was claimed — including scope you discover yourself. Name it as new scope; classify it IN, FOLLOW-UP, or BLOCKER. NOT a generic end-of-task checklist; cleanup is recoge-tu-tiradero.
---

# Ah, y no se te olvide que

Something new just arrived. It does not get to walk in without being named.

## Rule

Anything that shows up after the scope was set is **new scope**, and new scope gets said
out loud before it gets worked on. Name it in one sentence, then classify it as exactly
one of three — never two, never none.

| Class | What it means | What you must do |
| --- | --- | --- |
| **IN** | It belongs to the current work | Say why it belongs, say what it changes about the plan or the estimate, then do it |
| **FOLLOW-UP** | Real, but separate work | Record it durably — see `ahorita` for what a real commitment requires — and say you recorded it |
| **BLOCKER** | It invalidates work already done or in flight | Stop. Say what is now wrong and what has to be revisited before anything else proceeds |

**Never silently absorb it.** Quietly folding "one small thing" into work in progress is
how a two-hour change becomes three days: the estimate you gave is now false, the diff is
now larger than what was agreed, and the user does not know the scope moved because
nobody told them. The absorbing is the failure, not the extra work.

**This applies to scope you discover, not only scope the user hands you.** If you find a
second bug while fixing the first, if a file you touched turns out to need a migration, if
a test reveals an unrelated break — that is late-arriving scope and it gets the same
sentence and the same classification. Self-inflicted scope creep counts.

**If completion was already claimed, IN means re-verification.** Taking new work in after
"done" makes the previous evidence stale — it described a codebase that no longer exists.
Say so explicitly and run `a-ver-ensename` again. Do not let the old proof cover the new
change.

## Procedure

1. **Notice the arrival.** The tells: a requirement stated after you started, a constraint
   nobody mentioned during planning, an issue you tripped over, or anything following the
   words "also," "one more thing," or "while you're in there."
2. **State it as new scope in one sentence.** Literally say that it is new — "that is new
   scope relative to what we agreed" — before you say anything about doing it.
3. **Classify it IN, FOLLOW-UP, or BLOCKER.** If you cannot tell, ask; an unclassified
   addition defaults to absorbed, which is the one outcome this skill forbids.
4. **Act on the class.**
   - IN — say what it changes about the estimate or the plan, then do it.
   - FOLLOW-UP — record it where it will be seen, and say where.
   - BLOCKER — stop and surface it; do not continue building on invalidated work.
5. **Re-verify if you had already claimed completion.** New evidence for the new state.

## Evidence

The classification has to appear in the response, in words the user can act on:

> That is new scope — the CSV export also needs to handle the legacy delimiter. Classing
> it **IN**: it is the same code path I am already editing, and it moves the estimate from
> today to tomorrow morning. Separately, I hit a second bug while in there — the header
> row is dropped on empty files. **FOLLOW-UP**, filed as `#88`, not fixed here.

> That is new scope, and it is a **BLOCKER**: rows can now belong to two tenants, which
> breaks the uniqueness assumption the schema I shipped yesterday is built on. Stopping.
> The migration and the importer both need revisiting before I go further.

"Sure, I'll add that too" is not a classification. It is absorption with a friendly tone.

## Boundary

- **This is not a generic end-of-task checklist.** Its subject is late-arriving scope, and
  it fires on the *arrival* of something new — not on finishing. If it triggers every time
  you say "I'm done," it is misfiring and colliding with `recoge-tu-tiradero`,
  `pero-tu-primo`, and `vienen-las-visitas`, which all legitimately live at completion.
- Vague deferrals and TODOs you are writing yourself — `ahorita`.
- A settled decision you want to reopen — `porque-yo-lo-digo`.
- Debug leftovers and cleanup — `recoge-tu-tiradero`.
- The handoff gate before shipping — `vienen-las-visitas`.
- A warning you gave earlier and then ignored — `pero-no-haces-caso`.

## Exit criteria

You may proceed once the addition has been named as new scope out loud, classified as
exactly one of IN / FOLLOW-UP / BLOCKER, and the consequence of that class has been stated
— the plan or estimate change for IN, the durable record for FOLLOW-UP, the stop and the
list of what is invalidated for BLOCKER. If completion had already been claimed and the
item was taken IN, you may not re-claim completion until verification has run again.

If you notice you already absorbed something silently, say so now and classify it
retroactively. Late is recoverable; never is not.

## Cómo te regaña

> "Ya me voy… ah, y no se te olvide que el sábado es lo de tu tía."
> "Una cosita más y ya."
