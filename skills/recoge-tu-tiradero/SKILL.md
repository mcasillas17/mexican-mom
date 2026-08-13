---
name: recoge-tu-tiradero
description: Use after debugging or experimentation, before final evidence or handoff, to remove residue you created that the solution does not need — trace logs, scratch files, `.only`, temporary flags, abandoned deps. NOT for the handoff gate itself; use vienen-las-visitas. NOT for unreproducible state; use por-si-se-ocupa.
---

# A ver si ya recoges tu tiradero

The bug is fixed. Everything you knocked over finding it is still on the floor.

## Rule

One test governs every line you added:

> **KEEP** anything that helps the next person diagnose the same **class** of failure.
> **CUT** anything that only helped you diagnose **this instance**.

Apply it to each added line individually. "I'll leave it, it's harmless" is not a verdict;
neither is "I'll delete the whole area to be safe."

**Scope: only your residue, from this work.** You may remove what you added and restore
what you loosened. You may not delete pre-existing code, unrelated TODOs, someone else's
commented-out block, a test you did not write, or anything that was in the tree before you
started. Removing another person's work under cover of cleanup is worse than the mess —
the mess is visible, and that is not.

## Procedure

1. **Diff your own changes.** Get the full diff of this work against its starting point.
   Cleanup you do from memory misses the file you touched an hour ago.
2. **Classify every added line** by the test above. Most rows are already decided:

   | What you added | Verdict | Why |
   | --- | --- | --- |
   | A test written while debugging | KEEP | It now guards the class |
   | A helper extracted during the fix | KEEP | It is part of the solution |
   | A structured log line that would diagnose this class in production | KEEP | The next person gets it for free |
   | Trace logging added to find the bug | CUT | It found this instance |
   | `console.log("here 1")` and friends | CUT | It never helped anyone but you |
   | A commented-out earlier attempt | CUT | Git has it |
   | A loosened timeout, retry count, or threshold | CUT and restore | It hides the class |
   | A disabled check, assertion, or lint rule | CUT and restore | Same |
   | `.only` or `.skip` left in a test | CUT | See below |
   | A temporary flag or env toggle | CUT, and remove it from the docs and examples too |
   | A debug or verbose setting switched on | CUT, restore the default |
   | A scratch script, throwaway fixture, or stray output file | CUT | Not part of the solution |
   | A dependency added then abandoned | CUT from the manifest **and** the lockfile | A lockfile entry is a real install |

   **`.only` deserves its own line.** A shipped `.only` does not fail — it silently runs
   one test and reports green while the rest of the suite never executes. A shipped `.skip`
   is a test that quietly stopped protecting anything. Grep for both before you finish.

3. **Restore what you loosened.** Every value you relaxed goes back to its original, and
   the suite runs again against the original. If it fails at the real value, the bug is not
   fixed — that is a finding, not a cleanup item.
4. **Check the manifest and the lockfile.** Every dependency you added must still be
   imported somewhere. If it is not, remove it from both files and regenerate. A dependency
   in the lockfile alone still ships, still installs, still needs patching.
5. **Re-read the diff as a stranger's.** Read it once more as though reviewing someone
   else's pull request. Anything you would ask "why is this here?" about is either
   explained in the change or removed from it.

## Evidence

Say what you cut and what you kept, and why the kept things stayed:

> Cleanup: removed 14 trace `console.log` calls in `src/sync/queue.ts`, deleted
> `scripts/repro-dedup.mjs`, restored the poll timeout from 30s to 5s (suite still
> passes), dropped `deep-diff` from `package.json` and `package-lock.json`. Kept
> `queue.test.ts` (guards the duplicate-ack case) and the one `logger.warn` on ack
> mismatch (diagnoses this class in production).

"Cleaned up debug code" is not evidence. If you cannot name what you removed, you did not
read your own diff.

## Boundary

- The **pre-handoff gate** — `vienen-las-visitas`. It delegates cleanup here rather than
  repeating it; this skill is cleanup only, not the decision that the work is ready.
- **Naming** things badly, as opposed to leaving things behind — `frijoles-en-el-tupper`.
- **Proving the work succeeded** — `a-ver-ensename`. Clean first, then prove; evidence
  produced before cleanup is stale the moment you delete a line.
- **Deleting anything unreproducible** — `por-si-se-ocupa`. If you cannot recreate it,
  this skill does not authorize removing it.
- **Ordering:** this runs *after* `pero-tu-primo`, because a comparison that triggers a
  rewrite makes the cleanup you already did worthless, and *before* `a-ver-ensename` and
  `vienen-las-visitas`.

## Exit criteria

You may move on to evidence or handoff once all of these are true:

- Every line you added has a verdict, and every CUT is gone.
- Nothing loosened, disabled, or toggled remains loosened, disabled, or toggled, and the
  suite passes at the restored values.
- No `.only` or `.skip` you introduced survives.
- Manifest and lockfile contain only dependencies the code actually imports.
- Nothing you did not add was removed.

If someone later finds your leftovers, do not explain that they were harmless. Remove them
and say what you missed. And if you deleted something that was not yours, restore it first
and say so before anything else.

## Cómo te regaña

> "¿Y quién va a levantar esto? ¿La Virgen?"
> "Deja las cosas como las encontraste."
