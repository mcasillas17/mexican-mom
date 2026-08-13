---
name: por-si-se-ocupa
description: Use before an operation that destroys state you cannot reproduce: deleting untracked files, overwriting uncommitted work, `git reset --hard` or `git clean`, dropping a table, deleting a bucket or volume, discarding an expensive artifact. NOT for ordinary edits to clean, committed files — git is already the copy.
when_to_use: >
  Triggers: "let me just delete", "I'll overwrite it", "reset --hard", "git clean",
  "drop the table", "wipe the volume", "regenerate it from scratch", "we don't need
  the old one".
---

# Guárdalo, por si se ocupa

Nothing leaves this house until there is a copy you have actually opened.

## Rule

Copy first, then **verify the copy exists and is readable**, and only then destroy
anything. An unverified backup is not a backup. Your report must say where the copy is
and how to restore from it — a backup nobody can find is the same as no backup.

**This skill does not fire on ordinary edits to clean, committed, git-tracked files.**
Git is already the copy. Firing on every `Write` and every `Edit` is how a safety rule
becomes background noise.

## Procedure

1. **Name exactly what would be lost.** Not "the directory" — the files, rows, or hours
   of compute inside it.
2. **Ask whether it can be regenerated** from source, from git, or from rerunning a
   cheap command. If yes, proceed without a copy. If no, or if the rerun is expensive,
   continue.
3. **Make the copy** using the row that matches.
4. **Verify it** — read it back, list it, check the size, count the rows. A command that
   exited 0 is not verification.
5. **State the restore path**, then destroy.

| What would be lost | Copy it by |
| --- | --- |
| Uncommitted changes to tracked files | `git stash push -u -m <label>`, or a WIP commit on a throwaway branch |
| Untracked or git-ignored files | `cp` / `cp -R` to a clearly named path *outside* the delete target |
| A stash about to be dropped | `git stash show -p stash@{0} > <label>.patch`, or record the sha from `git rev-parse stash@{0}` |
| Database rows or schema | A snapshot table (`CREATE TABLE t_backup_<date> AS SELECT …`) or a dump/export to a file |
| Bucket, volume, or container contents | Sync or copy to another prefix or a local directory first |
| Expensive build artifact or long-running output | Copy the artifact to a named path before the rebuild starts |

Migrations and truncations count as destruction. So does overwriting the only copy of
generated data.

## Evidence

Report the copy and the way back, not the intention to have made one:

> Before `git reset --hard`: `git stash push -u -m "pre-reset"` → `stash@{0}`, verified
> with `git stash show --stat stash@{0}` (3 files, 74 insertions). Restore with
> `git stash pop stash@{0}`.

"I made a backup first" is not evidence. Neither is a path you never listed.

## Boundary

- **Consent** — `me-estas-avisando-o-pidiendo-permiso`, and it runs **first**. The order
  is consent → verified backup → operation. They are not in conflict.
- **Ordinary edits to clean, committed, tracked files** — no copy, no ceremony. Git
  already holds it.
- **Removing your own debug leftovers** — `recoge-tu-tiradero`. That is cleanup, not
  destruction. Do not back up a `console.log`.
- **Urgency** never waives this. Even mid-incident, see `ahorita-es-ahorita`; a fix that
  destroys the evidence is not a fix.

## Exit criteria

You may run the destructive operation once the copy exists, you have verified it by
reading or listing it, and the restore path is stated in your response.

If the copy fails or cannot be verified, stop and say so. Do not proceed on the theory
that it probably worked. If you destroyed something without a copy, say that plainly and
name exactly what is gone — do not discover it later.

## Cómo te regaña

> "No lo tires. Guárdalo por si se ocupa."
> "Eso todavía sirve."
