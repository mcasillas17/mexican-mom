---
name: el-vaporub
description: Use at the very start of a failure investigation, before forming any theory, to rule out your own stale state — unsaved file, unrestarted process, stale cache, wrong branch or worktree, wrong file, outdated build output. Run the ladder once. NOT for an unavailable or misconfigured environment; use ya-comiste.
when_to_use: >
  Triggers: "the fix didn't work", "it's still failing", "that's weird",
  "the change had no effect", "it worked a minute ago", "same error as before".
---

# ¿Te duele? Ponte Vaporub

Before you theorize, rule out the mess you made yourself.

## Rule

Most surprising failures are the agent's own stale state, not the system's behavior. So
you run one cheap ladder of checks **first**, once, before forming any theory — and then
you never run it again on that same unchanged failure. The single pass is the remedy; a
second pass is a substitute for thinking.

## Procedure

Run every rung once, in order. Each rung has a check and a tell — the tell is how you
know whether that rung was the problem.

1. **Unsaved file.** Re-read the file you edited from disk. *Tell:* the edit is missing
   or the content differs from what you believe you wrote.
2. **Stale process.** Identify the running process, server, watcher, or REPL and restart
   it. *Tell:* it was started before your edit, or its log shows no reload.
3. **Stale cache or artifact.** Clear the relevant build, module, bundler, or test cache
   and rebuild. *Tell:* the failure changes or disappears after the clean rebuild.
4. **Wrong branch or worktree.** Check the current branch, the working directory, and
   whether another worktree or checkout of this repo exists. *Tell:* you are not on the
   branch the change landed on, or the running path is not the path you edited.
5. **Wrong file.** Confirm the file being executed is the file you edited — resolved
   import path, installed vs. local copy, `dist/` vs. `src/`, a shadowing duplicate.
   *Tell:* two files match the name, or the import resolves elsewhere.
6. **Outdated generated output.** Compare the timestamp of compiled, generated, or
   transpiled output against its source. *Tell:* the output is older than the source.

7. **The ladder is now spent.** Whatever you found, reconcile it and re-run the failing
   thing exactly once. If it still fails, the cause is real. Stop guessing at state:
   read the actual error, form a theory, and gather evidence for it.

## Evidence

Name the rungs and what each one showed, so nobody — including you — is tempted to climb
it twice:

> Ladder run once: file on disk matches the edit; dev server restarted (was 40 min old);
> `.next/` cleared and rebuilt; on `feat/auth`, single worktree; import resolves to
> `src/auth.ts`, the file I edited; no generated output involved. Failure unchanged, so
> it is not stale state. Diagnosing the 401 now.

"I restarted it and it still fails" is not evidence. It is one rung out of six.

## Boundary

- An **environment** that is unavailable or misconfigured — service down, dependency not
  installed, env var unset, port taken — `ya-comiste`.
- Verifying that a **fix actually worked** — `a-ver-ensename`.
- This skill governs the first sixty seconds of an investigation, and nothing after.

## Exit criteria

You may proceed once all six rungs have been run in this investigation and step 7 has
been executed. From that moment the ladder is closed for this failure.

**Never run the ladder a second time on the same unchanged failure.** No second restart,
no second cache clear, no "let me just try rebuilding again." If the same symptom
survived one honest pass, more state-clearing is avoidance. The only thing that reopens
the ladder is a genuinely new change — you edited something, switched branches, or the
symptom itself changed. Vaporub before bed is fine. Vaporub three nights running means
you should have gone to the doctor.

## Cómo te regaña

> "¿Te duele? Ponte Vaporub."
> "Un tecito y se te quita."
> "Si mañana sigues igual, ya vamos al doctor."
