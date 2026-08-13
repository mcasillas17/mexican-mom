---
name: y-si-lo-encuentro-que
description: Use before reporting that a repository file, path, symbol, function, route, config key, or dependency is absent or cannot be found. NOT for unverified claims about an external library, API, or platform; use cadena-de-whatsapp.
when_to_use: >
  Triggers: "I couldn't find", "there is no", "does not exist", "no such file",
  "the repo doesn't have", "that isn't defined anywhere".
---

# ¿Y si voy y lo encuentro, qué te hago?

You do not get to say "not found" yet.

## Rule

Absence is a finding, and it requires evidence exactly like presence does. You may not
report that something does not exist until you have searched every way it could
plausibly be named or stored, and your report must name the searches you ran.

## Procedure

Find the row matching what you are looking for. Run **all** of its searches before
concluding anything.

| Looking for | Run all of |
| --- | --- |
| File or path | Glob the exact name; glob a distinctive fragment; list the directory it would obviously live in |
| Symbol, function, class | Grep the exact identifier; grep a distinctive substring (catches prefixes, renames, casing); read the file it would obviously live in |
| Config key or env var | Grep the key repo-wide; check the stack's known config locations; check example and template files (`.env.example`, `*.sample`, defaults) |
| Route or endpoint | Grep the path string; grep the handler name; read the router or registration file |
| Dependency | Read the manifest (`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`); grep the import name; check the lockfile |

Then answer the two questions that catch most false negatives:

1. **Could it be named something else?** Abbreviated, pluralized, prefixed, hyphenated
   instead of underscored, or in another language.
2. **Am I looking in the right tree?** Right branch, right worktree, right package in a
   monorepo — and not excluding a vendored or ignored directory out of habit.

## Evidence

Report the searches themselves, not the fact that you searched:

> Searched for `getUserPrefs`: grep for the identifier (0 hits), grep for `UserPref`
> (0 hits), read `src/user/` (12 files, none matching). It is not in this repository.

"I looked and couldn't find it" is not evidence. It is the thing this skill exists to
stop.

## Boundary

- Claims about **external** libraries, APIs, or platform behavior — `cadena-de-whatsapp`.
- Claims that **your own work** succeeded — `a-ver-ensename`.
- This skill governs one sentence only: "it isn't there."

## Exit criteria

You may report absence once every search for that artifact type has run, both
false-negative questions are answered, and your report names the searches. Until then,
say you are still looking.

If it turns up after you said it was not there, say so plainly and name where it was. No
hedging, no "ah, it appears it was actually in…". You were wrong; say it and move on.

## Cómo te regaña

> "Búscalo BIEN. Con los ojos, no con la boca."
> "Está donde siempre. Donde tú no buscas."
