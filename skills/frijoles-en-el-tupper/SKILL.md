---
name: frijoles-en-el-tupper
description: Use when writing or reviewing names — functions, variables, types, files, schemas, API fields, config keys — and the comments attached to them, to check that each label predicts what is actually inside. NOT for whether failure paths are handled; use pero-ponte-sueter.
when_to_use: >
  Triggers: "let's call it", "rename this to", "the comment says", "it's typed as
  string", "getX also updates", "just pass a flag", "this file also handles",
  "what unit is that", "it's basically the same as the old one".
---

# Dice helado, pero son frijoles

The next person will believe the label.

## Rule

A name is a promise about its contents. Every identifier, field, file, key, and comment
must let a reader predict what is inside without opening it. When the label and the
contents disagree, one of them changes — you do not get to keep both and rely on the
reader knowing better.

## Procedure

1. **List the labels in play.** Every name introduced, renamed, or touched in this
   change: functions, parameters, variables, types, struct fields, files, schema
   columns, API fields, config keys — plus every comment or docstring attached to code
   you edited. This is a bounded list from the diff, not a tour of the repository.
2. **Write what each name predicts, before reading the body.** One sentence: what it
   returns, what it changes, what unit it is in, what it holds.
3. **Read the actual contents** — the body, the value, the file — and compare against
   your sentence.
4. **Check each name against the known lies.** These are the ones that survive review
   because everyone in the codebase has already adapted to them.

| The label | What is actually inside | The fix |
| --- | --- | --- |
| `get*`, `is*`, `find*`, `format*`, `parse*` | It also writes, sends, caches, mutates an argument, or throws where a miss is normal | Rename to the verb that dominates (`fetchAndCacheUser`), or move the effect out of the function |
| A comment or docstring | Behavior the code stopped having; a parameter that no longer exists; a warning about a bug that was fixed | Rewrite it from the current code, or delete it — a stale comment outranks the code in the reader's head |
| A type | `string` that is really a fixed set; `T \| null` that is never null; `any`, `object`, or `dict` standing in for a shape the code already assumes | Narrow it to the enum, union, or declared shape the code relies on |
| A config key or numeric constant | A unit or scale the name does not state — `timeout: 30`, `size: 5`, `delay: 0.5` | Put the unit in the name (`timeoutMs`, `maxSizeMb`) or in the type |
| A boolean | `false` means something ambiguous — `disableCache`, `notReady`, `skipValidation`, `noRetry` | Name the positive state (`cacheEnabled`, `ready`) so both values read in one direction |
| A file or module | A subset of what it now holds, or the one thing it was originally extracted for | Rename the file, or move the strangers out of it |

5. **Resolve every mismatch.** Rename when the contents are right; change the contents
   when the name states the contract callers depend on. Documenting the surprise instead
   is the third option, not the first, and only when an external contract freezes both —
   and then the comment states the surprise plainly, not apologetically.

Then answer the question that catches the rest: **would a caller who read only the name
be surprised by what happened?** If yes, the name is the bug.

## Evidence

Report each mismatch as label, prediction, contents, resolution. Names you checked and
cleared need no report.

> `getSessionToken` — the name predicts a read; it also refreshes the token and writes
> it to Redis. Renamed `refreshSessionToken`.
> `retryDelay: 5` — the caller passes it to `setTimeout`, so it is 5ms, not 5s as the
> comment above it claimed. Renamed `retryDelayMs`, comment deleted.

"Reviewed the naming" is not evidence. Neither is renaming one thing and leaving its
stale docstring in place directly above it.

## Boundary

- Whether a failure path is handled at all, and whether a side effect is *safe* —
  `pero-ponte-sueter`. Here, an undisclosed side effect is a defect of the **name**;
  the effect's correctness is not this skill's business.
- Whether a better implementation or existing library exists — `pero-tu-primo`.
- Debug prints, dead code, and stray scaffolding — `recoge-tu-tiradero`.
- This is not a general code review. One question only: does the label match what is
  inside?

## Exit criteria

You may move on once every name on your list has a stated prediction that matches its
contents, or has been renamed, or has had its contents corrected, or carries an explicit
note of a contract you cannot change. Where a name is merely unlovely but honest, leave
it and follow the surrounding convention.

If you find the mismatch after the name already shipped, rename it now and say what it
used to claim. A wrong label gets more expensive with every caller that learns to ignore
it.

## Cómo te regaña

> "Sí, ahí dice helado. Adentro hay frijoles. Ya sabías."
> "Ponle su nombre, no seas así."
