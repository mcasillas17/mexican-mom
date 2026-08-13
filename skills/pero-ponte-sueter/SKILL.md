---
name: pero-ponte-sueter
description: Use when writing code that touches input, I/O, network, parsing, persistence, concurrency, or lifecycle boundaries, to handle the null, empty, malformed, timed-out, partial, and failed paths before the happy path is called finished. NOT for hostile input, injection, or secrets; use ya-te-lavaste-las-manos.
---

# Pero ponte suéter

It is 35 degrees. Take it anyway — she is not planning for now, she is planning for later.

## Rule

Code that crosses a boundary must account for the conditions that are not happening right
now. Every boundary gets one of two treatments, chosen deliberately: **handle the failure
meaningfully, or let it fail loudly with the original cause attached.**

There is no third option, and the third option is the one you will reach for. Catching a
failure and continuing with a degraded value is worse than the crash it prevented, because
the crash told you the truth and the fallback lies. The sweater is **one layer, not five** —
a handler you cannot explain the purpose of is not protection, it is padding.

## Procedure

Run steps 1–3 for the change you are making, then step 4 on everything you wrote.

**1. Enumerate the boundaries this code actually touches.** Not hypothetical ones — the
lines you are writing. Find each row that applies.

| Boundary | What realistically goes wrong |
| --- | --- |
| Caller input, arguments, config | Null, undefined, empty string, empty collection, zero, wrong type, out of range |
| Parsing, deserialization, formats | Malformed, truncated, wrong encoding, unexpected schema, missing field, extra field |
| Network, RPC, external API | Timeout, connection refused, non-2xx, partial body, rate limit, retry storm, slow success |
| Filesystem, I/O | Missing path, permission denied, disk full, partial write, file changed mid-read |
| Persistence, database | No rows, duplicate key, constraint violation, transaction rollback, stale read |
| Concurrency, async, queues | Duplicated delivery, out-of-order arrival, race on shared state, cancellation, deadlock |
| Lifecycle | Called before init, called after shutdown, resource already closed, cleanup on the error path |

**2. For each boundary, write down what can go wrong** from that row — the realistic cases,
not the exotic ones. A case you list and dismiss as impossible is fine; a case you never
listed is the outage.

**3. Decide each case explicitly, one of two ways.**

- **Handle it** — only if there is a genuinely correct behavior: a real default the caller
  expects, a capped retry for a transient fault, a documented empty result, a fallback the
  caller can distinguish from success.
- **Fail loudly** — otherwise. Raise or propagate, with the original cause attached
  (`raise ... from e`, `cause:`, wrapped error), and with context naming what was being
  done to what.

"Handle it" is not the default. Failing loudly with good context is the default, and it is
a complete, professional answer.

**4. Check the ceiling.** Read back everything you just wrote and answer both:

- **Does any handler swallow information?** Search your diff for bare `except:`,
  `catch {}`, `catch (e) {}`, `except Exception: pass`, `rescue nil`, `_ = err`, a logged
  error followed by normal execution, and any retry loop without a cap and a final failure.
- **Does any fallback produce a value the caller cannot distinguish from success?** A
  `?? null`, `|| {}`, `|| []`, empty struct, or zero returned where a real failure occurred
  is a lie with a return type. If the caller cannot tell "no data" from "lookup broke," the
  fallback is the bug.

Delete every handler that fails either question and replace it with a loud failure. Then
delete any remaining layer you cannot justify in one sentence.

## Evidence

Report the boundaries and the decision at each, not the fact that you thought about errors:

> `fetchInvoice`: three boundaries. Network — timeout and non-2xx, handled with a capped
> 3-attempt retry, then raised with the status and URL attached. Parsing — malformed JSON
> and missing `total`, raised with the invoice ID and original `JSONDecodeError` as cause.
> Caller input — empty ID, rejected at entry. No fallback values; a failure here is
> unrecoverable for the caller, so it propagates.

"I added error handling" is not evidence. It is the sentence this skill exists to stop.

## Boundary

- **Hostile** input, injection, credentials, or secrets — `ya-te-lavaste-las-manos`. This
  skill covers input that is merely broken, not input that is out to get you.
- Whether names, types, and contracts **describe** what the code does —
  `frijoles-en-el-tupper`.
- Removing unnecessary work, calls, or layers — `ni-que-fueramos-ricos`. Where they
  conflict, correctness wins: never drop a safeguard to save a call.
- This skill governs the paths that are not being taken right now.

## Exit criteria

The happy path is not finished until every boundary from step 1 has each of its realistic
failure cases decided in step 3, and step 4 has run over the diff.

**Never catch and continue with a degraded value.** Not "just for now," not behind a TODO,
not because the caller "probably handles null." If you cannot state what the fallback means
to the caller, there is no fallback — there is a raise. And if you have wrapped one call in
three layers of defense, take two of them off; you are sweating, and the extra layers are
hiding the one that matters.

## Cómo te regaña

> "Llévatelo aunque sea en la mano."
> "Más vale prevenir que lamentar."
> "Uno, no cinco. Te vas a sofocar."
