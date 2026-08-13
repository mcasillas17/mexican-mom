---
name: la-chancla
description: Use only when the user explicitly requests a strict review of one named task, change, plan, release, or invariant. Never self-selected, never auto-loaded, never invoked by another skill or by the mexican-mom router. NOT a session-wide mode and NOT a warning counter.
disable-model-invocation: true
---

# No me hagas ir por la chancla

You asked for the strict pass. It runs on this work, here, now.

## Rule

This is a **self-contained strict review** of one named piece of work — the task, change,
plan, release, or invariant the user pointed at when invoking. It runs the ten checks
below itself, inline, in this turn, and returns findings ranked as **BLOCKER** or
**WARNING**. The standard is exacting, and it is a standard, not a punishment: every
finding names a location and the smallest correction that clears it.

Three things this skill is not. Stated first, because assuming otherwise makes it
unimplementable:

- **Not a session mode.** It reviews the work named at invocation and then it is over. It
  does not stay switched on and does not make later turns stricter.
- **Not a mechanism over other skills.** Skills share no runtime and no state, so this one
  cannot raise a sibling's threshold or reach into a skill that is not loaded. Every check
  below is this skill's own work, performed here.
- **Not a counter.** It cannot track warnings across a session. Repetition *inside this
  review* is worth naming; anything beyond it is not something this skill can know.

**A blocker stops the scoped work.** You do not continue past one, work around it, or
carry it as a note. It is corrected, or the user consciously waives it after you state
what they are waiving. Warnings do not stop anything; they are reported and left with the
user to decide.

## Procedure

1. **State the scope in one line** — the exact change, files, plan step, or invariant
   under review, and where it starts and ends. Everything outside that line is out of
   scope for this review; say so rather than expanding it.
2. **Run all ten checks against that scope.** Each gets a verdict: pass, WARNING, or
   BLOCKER. A check you could not evaluate is not a pass — report it as unevaluated and
   say what you would need.

   | Check | It fails when |
   | --- | --- |
   | Scope | The work does more or less than what was asked; unrequested changes ride along; a stated requirement is silently unmet |
   | Evidence | A completion or success claim has no quoted command, output, or artifact behind it |
   | Safety and trust boundaries | Externally supplied or model-supplied content is treated as trusted; credentials or secrets sit in the diff; a new network, filesystem, or execution surface appears unannounced |
   | Consent | Something destructive, irreversible, or outside the agreed scope was done — or is about to be — without one clear question asked and answered first |
   | Recoverability | There is no verified way back: no checked backup, no tested revert, no rollback path that anyone has actually confirmed |
   | Failure handling | Errors are swallowed, retried without limit, or reported as success; timeouts and partial failure are unhandled; the unhappy path is untested |
   | Naming and contracts | A name misdescribes what the thing does; a signature, schema, flag, or return shape changed without updating callers or naming the break |
   | Efficiency | The same file, fetch, computation, or paid call is repeated when the result was already in hand. Proportion, not micro-optimization |
   | Cleanup | Scratch files, debug logging, `.only` / `.skip`, commented-out code, temporary flags, or dead branches are left behind |
   | Handoff readiness | Someone who was not here cannot tell what changed, why, what it does not do, and how to check it |

3. **Rank each finding.** BLOCKER: shipping or continuing with it causes loss, exposure, a
   false claim, or an unrecoverable state. WARNING: it degrades the work but the next step
   is still safe. When you are torn between the two, the deciding question is whether
   someone can undo the damage afterward — if not, it is a blocker.
4. **Give each finding three parts**: the specific `file:line` or numbered step; why it
   fails the check by name; the smallest correction that clears it. No general advice, no
   restated best practice.
5. **Stop at blockers.** Report them, do not proceed with the scoped work, and ask whether
   the user wants them corrected or waived. Corrections belong to the normal working turn
   after this review, not inside it.
6. **Close the review explicitly.** Say it is finished, list what remains open, and state
   that the strict pass is over.

## Evidence

The review is the artifact. Findings are located and ranked, and passing checks are
counted rather than narrated:

> **Scope:** retry logic in `src/webhooks/send.py`, plus its tests. 7 of 10 checks pass.
>
> **BLOCKER — recoverability.** `send.py:88` deletes the queued event before the retry
> loop resolves. A failed attempt 5 loses the payload with no way to reconstruct it.
> Smallest fix: delete after the loop returns success.
>
> **BLOCKER — evidence.** The summary says "retries verified." No test run is quoted, and
> `tests/webhooks/test_retry.py` is skipped at line 12. Smallest fix: unskip, run it,
> quote the output.
>
> **WARNING — failure handling.** `send.py:64` retries on every exception including
> `ValueError` from a malformed payload, which will never succeed. Narrow the catch to
> transport errors.
>
> Stopping here. Two blockers. Correct them or tell me to waive them.

Not a review: "looks good overall, a few things to tighten up." That is a mood with a
ranking attached, and it is exactly what this skill exists to replace.

## Boundary

What this skill cannot do, stated plainly because pretending otherwise is worse than the
limit itself:

- **Cannot override platform policy** or a user's explicit stop. Both outrank it.
- **Cannot grant tools or permissions.** It reviews; it authorizes nothing.
- **Cannot invent requirements.** Every check is measured against what the task actually
  implies. A finding you cannot trace back to the scoped work is not a finding.
- **Cannot count warnings across a session.** No state persists between invocations.
- **Cannot promise automatic resumption.** If work is suspended here, resuming it is the
  user's next instruction, not a guarantee this skill can make.
- **Yields to `ahorita-es-ahorita`.** An outage outranks a strict review. The review pauses
  and resumes after the incident, from where it stopped.

Routing:

- **The `mexican-mom` router cannot invoke this skill.** With model invocation disabled,
  its description is never loaded, so nothing can select it programmatically. The user
  explicitly invokes `la-chancla` with the platform's direct skill syntax or it does
  not run. On platforms without that field, the first line of the description is the
  only thing holding the line — treat it as binding.
- Ongoing discipline between reviews belongs to the individual skills — cleanup, evidence,
  consent, handoff each have their own. This review does not delegate its checks to them
  and does not replace them.

## Exit criteria

The review is complete once the scope was stated, all ten checks were run against it with
an explicit verdict each, every finding carries a location, a reason, and a smallest
correction, and the blocker/warning ranking is on the page.

If there are blockers, the scoped work stays stopped until they are corrected or the user
waives them out loud. A waived blocker is recorded as waived, in writing, in the same
place the finding was reported. Silence is not a waiver.

If you find nothing, say so in one line and end the review. A strict pass that manufactures
findings to look thorough has failed the same way a lenient one has.

## Cómo te regaña

> "No me hagas ir por la chancla."
> "Uno… dos… dos y medio…"
