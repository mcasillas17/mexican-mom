---
name: vienen-las-visitas
description: Use before work crosses to another person or system — opening a pull request, pushing a shared branch, requesting review, handing off to another agent, a demo, or a release. NOT for ordinary intermediate commits; this is the boundary-crossing gate, not a per-commit ritual.
when_to_use: >
  Triggers: "open a PR", "push this branch", "ready for review", "ship it",
  "hand this off", "let's demo this", "cut the release", "send it over".
---

# ¡Vienen las visitas!

Someone who was not here is about to read this. Read it first, the way they will.

## Rule

This is the **last** gate before the boundary, and it runs once per crossing — not once
per commit. It composes rather than duplicates: cleanup belongs to `recoge-tu-tiradero`,
success evidence belongs to `a-ver-ensename`, and this skill invokes them instead of
restating them. What it owns is the crossing itself — the diff, the message, and the
reviewer.

Closure order: `pero-tu-primo` → `recoge-tu-tiradero` → `a-ver-ensename` → this skill.
Compare first, then clean, then prove, then hand off. Arriving here with the earlier
three unrun means you are not at this gate yet.

**Honesty outranks tidiness.** Hiding a known limitation so the diff looks clean is the
exact opposite of this skill. Mom cleans the house; she does not lie about what is in the
closet. State known gaps plainly, up front, in your own words — before the reviewer finds
them.

## Procedure

Run the delegated steps first, then the seven this skill owns.

1. **Read your own diff, top to bottom, as the reviewer would.** Whole thing, every hunk,
   in order — not the summary, not the file list. This catches more than any tool on this
   list, and skipping it invalidates the rest.
2. **Every file in the diff is one you meant to touch.** Hunt specifically for what you
   did not intend: formatter reflows across untouched files, lockfile churn from an
   incidental install, editor and IDE config, `.DS_Store`, scratch files, whitespace-only
   noise. Anything you cannot explain, revert.
3. **No secrets.** Tokens, API keys, real credentials, connection strings, private
   endpoints and internal URLs, customer or personal data — including in fixtures, test
   files, comments, example configs, and committed output. This is the **last** moment for
   a secret scan.
4. **No debug residue left switched on.** `.only` and `.skip`, commented-out assertions,
   verbose or trace-level logging, feature flags flipped for local testing, a timeout
   raised to make something pass, a mock left standing in for the real call.
5. **The message describes the change honestly.** The PR or commit message says what the
   change does **and what it does not do**. No claim beyond what `a-ver-ensename` proved.
   Scope stated in the same words the diff would use.
6. **The reviewer has what they need.** Why, not just what — the problem being solved.
   A test plan they can run themselves. Known limitations stated up front rather than
   discovered. If they would have to ask you a question to review it, answer it now.
7. **Anything intentionally left undone is named.** Deferred work goes in the message by
   name, not in your head — see `no-se-te-olvide-que` for tracking it and `ahorita` for
   the deferral itself. "I'll clean that up later" that nobody else can see is not
   deferred; it is hidden.

## Evidence

The handoff message is the artifact. It states scope, proof, and gaps together:

> **What:** Adds retry with backoff to the webhook sender (`src/webhooks/send.py`).
> **Why:** Transient 502s from the provider were dropping events silently.
> **Not included:** dead-letter queue for exhausted retries — events still drop after
> attempt 5, tracked as #412.
> **Test plan:** `pytest tests/webhooks` → `31 passed`, exit 0. Manual: `make webhook-demo`
> with the provider stub returning 502 twice, then 200.
> **Diff:** 4 files, all under `src/webhooks/` and `tests/webhooks/`. No config, no
> lockfile changes.

Not evidence: "cleaned up and ready for review," "LGTM from my side," "should be
straightforward to review." Those are the request restated, not the work shown.

## Boundary

- Removing agent-created residue — `recoge-tu-tiradero`. Run it before this gate, not
  inside it.
- Proving your own work succeeded — `a-ver-ensename`. This gate carries its output; it
  does not re-derive it.
- Permission for a risky or irreversible push — `me-estas-avisando-o-pidiendo-permiso`.
  A clean diff is not consent.
- Application-level security review of the change — `ya-te-lavaste-las-manos`. That skill
  is the first gate; this one is the last, and the secret scan here is the final sweep,
  not the whole review.
- **NOT for ordinary intermediate commits.** Committing on your own branch mid-task does
  not cross a boundary. If this fires on every commit it becomes noise and gets ignored,
  and then it is not there on the day it matters.

## Exit criteria

You may cross the boundary once all of these are true:

- The full diff was read end to end this turn, after the last change.
- Every file in it is intentional, and anything unexplained was reverted.
- The secret and debug sweeps ran over the diff, not from memory of what you wrote.
- The message states what the change does, what it does not do, and what was left undone.
- The reviewer has the why, a runnable test plan, and every known limitation in writing.

Otherwise you are not at the gate yet. Say what is still open and fix it before sending.

If a reviewer finds something you knew about and did not mention, that is the failure this
skill exists to stop. Name it as such, state it plainly, and put it in the message. Do not
explain that you were about to mention it.

## Cómo te regaña

> "¿Qué van a decir?"
> "Ayúdame aunque sea a recoger, no te quedes ahí parado."
