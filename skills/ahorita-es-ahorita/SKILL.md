---
name: ahorita-es-ahorita
description: Use when one task must preempt all other work — the user explicitly says stop, a production outage, a leaked or committed secret, an active security incident, a red build blocking the team, a broken critical path. NOT for time estimates, TODOs, or deferrals; use ahorita.
when_to_use: >
  NOT for "later", "I'll get to it", "TODO", "follow-up" — those are ahorita.
  Triggers: "stop", "wait", "drop that", "prod is down", "we're paged",
  "the key is in the repo", "main is red", "everything is broken", "hold on".
---

# Ahorita no. AHORA.

She dropped the diminutive. The softener was the only thing holding the queue together.

## Rule

An incident preempts everything. When one of the triggers above is live, all work in
flight stops — no parallel track, no "while I'm here," no finishing the current refactor
first, no bundling unrelated cleanup into the fix. You state a single stabilization
objective, contain or resolve it, confirm containment with evidence, and then explicitly
return to what you suspended and say that you are returning.

Prefer the **smallest containment** over the clever fix: revert the commit, turn the flag
off, roll back the deploy. The correct fix is a separate piece of work. Root-cause
analysis happens after stabilization, never during it.

### The ceiling urgency does not raise

Urgency **never** bypasses consent, recoverability, security, or verification. An
incident is precisely when people force-push over someone else's work, delete the wrong
volume, paste a live credential into a log, or announce a fix nobody checked. Speed is a
reason to act on the smallest safe option, not a reason to skip the gate.

- `me-estas-avisando-o-pidiendo-permiso` — full strength. Destructive or irreversible
  actions still require consent, asked in one line and answered before you move.
- `por-si-se-ocupa` — full strength. Verified recovery before you destroy state, even
  when the state is what is on fire.
- `a-ver-ensename` — full strength. "Contained" is a success claim and needs its artifact.

Panic is not authorization. Neither is being told to hurry.

## Procedure

1. **Confirm it is an incident, not merely important.** Something is currently broken,
   exposed, or blocking other people, and delay makes it worse. Urgent-sounding feature
   work is not an incident; route it as normal scope.
2. **State the one objective.** A single sentence naming the stabilization target: "stop
   the 500s on checkout," "revoke and rotate the committed key," "get `main` green."
   Not "fix checkout" — that is the follow-up work, not the objective.
3. **Note what you are suspending**, in writing, so it is not lost: the task, the file or
   branch, and where you stopped. This is the only record that the interrupted work
   existed.
4. **Contain with the smallest safe action.** Pick from the top of this list that applies.

   | Situation | Smallest containment |
   | --- | --- |
   | Bad deploy or commit | Roll back the deploy; revert the commit |
   | Feature causing the failure | Turn the flag off |
   | Leaked or committed secret | Revoke first, then rotate, then purge history |
   | Blocking red build | Revert the breaking change; do not patch forward under pressure |
   | Ongoing security incident | Cut access, preserve logs, then contain |

   If containment itself is destructive or irreversible, the consent and recovery gates
   above run first. They are fast. Run them.
5. **Verify containment with real evidence.** The error rate, the passing build, the
   revoked-key response, the health check — produced now, quoted. Not "should be fine."
6. **Declare the incident closed**, naming what is contained, what is still broken, and
   what follow-up work now exists (root cause, permanent fix, cleanup). File that
   follow-up honestly rather than doing it here.
7. **Resume the suspended work explicitly.** Say that the incident is over and that you
   are returning to the task from step 3, by name. Do not drift into something else and
   do not leave the interruption unclosed.

## Evidence

The interruption is announced, and the return is announced. Both are visible:

> Stopping the auth refactor at `src/auth/session.py` (extracted the token helper, not
> wired up). Objective: stop the checkout 500s. Rolling back deploy `a91f3c`.

> Contained: error rate `0.02%` over the last 5 min, was `31%`; health check 200. Root
> cause not yet known — follow-up filed. Returning to the auth refactor now.

Not evidence: "handled it," "should be stable," "fixed and back to work." An incident
report without numbers is a mood.

## Boundary

- Vague deferrals, estimates, "later," TODOs, promised follow-ups — `ahorita`. Same word,
  opposite meaning. If nothing is currently broken, you are in that skill, not this one.
- Scope arriving late, after the work was already defined — `no-se-te-olvide-que`.
- A shortcut the **user** is pressing for that crosses a safety line —
  `porque-soy-tu-mama`.
- **Precedence:** this skill outranks `la-chancla`. A strict review pauses for the
  incident and resumes after it, from where it stopped — it is not cancelled.

## Exit criteria

The incident is closed once the stated objective is met, containment is verified with
quoted evidence, follow-up work is recorded rather than silently absorbed, and every gate
you would have run on a calm day was run.

Then, and only then, you return to the suspended work and say so. Work interrupted by an
incident and never resumed is the failure mode this skill exists to prevent — the outage
ends and the refactor stays half-finished in a file nobody remembers.

If it turns out not to have been an incident, say so and resume. Do not keep the
emergency going to justify having declared one.

## Cómo te regaña

> "No, no, no. Ahorita es AHORITA. Deja eso."
> "Eso puede esperar. Esto no."
