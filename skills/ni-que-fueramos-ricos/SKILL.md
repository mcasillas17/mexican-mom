---
name: ni-que-fueramos-ricos
description: Use when a design creates material or repeated cost — API or model calls, database queries, compute, memory, storage, network, polling, builds, CI minutes, review time — to measure or bound the expensive path before optimizing it, then cut real waste. NOT for failure handling or defensive paths; use pero-ponte-sueter.
when_to_use: >
  Triggers: "this is more efficient", "let's optimize this", "it's a little slow",
  "just fetch it inside the loop", "we can poll every second", "send the whole file
  to the model", "it's only a few extra queries", "we'll cache it later".
---

# ¡Apaga la luz, ni que fuéramos ricos!

The light is on in a room nobody is in. The money is not the point — the waste is.

## Rule

**Measure or bound the expensive path before you optimize it.** You do not get to guess
which line is hot; the line you would guess is usually not the one paying. Once you know
what the path costs, remove the work that is genuinely waste — work that costs something
and buys nothing.

**The ceiling: never remove a correctness or security safeguard to save a call.**
Validation, error handling, capped retries with backoff on genuinely flaky I/O, and audit
logging are not waste. Where this conflicts with `pero-ponte-sueter`, correctness wins.

## Procedure

**1. Name the cost unit and what it scales with.** Requests, rows, tokens, milliseconds,
megabytes, dollars, CI minutes, reviewer minutes — and per what: per call, per item, per
user, per run. "Slow" and "expensive" are not units.

**2. Measure it, or bound it in writing.** One of these, before you change a line:

| Way | What you produce |
| --- | --- |
| Count | Actual call, query, or request count from a log, counter, or query log |
| Time | A profile or a timer around the suspected path, with the input that produced it |
| Bound | An analytic bound stated with the input size: "N orders → 1 + N queries; N is 430 in production" |
| Bill | The usage or billing dashboard figure for the endpoint, model, or job |

If you cannot measure it, write the bound and the input size that produces it. If you can
do neither, say so and stop — you are guessing, and guessing is how the wrong line gets
rewritten.

**3. Find the waste.** Read the measured path against these rows:

| Where it leaks | What it looks like |
| --- | --- |
| Data access | N+1 queries; refetching data already in hand; missing pagination, `LIMIT`, or result cap |
| Loops | A per-item call where one batch would serve; a value recomputed every iteration |
| Model and LLM calls | Whole file sent when one function would do; the largest model on a trivial task; unchanged context resent instead of cached; a failed prompt retried without changing it |
| Waiting | Polling where an event, webhook, or subscription exists; fixed sleeps longer than the work |
| Retries | Unbounded retries; no cap; retrying a deterministic failure that will fail identically |
| Resources | Connections, file handles, clients, or subscriptions opened and never closed; a client constructed per call |
| Build and CI | A full rebuild where incremental works; CI re-running suites the diff cannot affect; a cache configured but never restored |

**4. Check the ceiling before deleting anything.** For each thing you are about to remove,
answer: *what breaks if this is gone and something goes wrong?* Input validation, loud
failures, backoff on flaky I/O, authorization checks, idempotency keys, and audit or
security logging are load-bearing. They cost something because they are doing their job.
If removing it changes behavior on the failure path, it is not waste — put it back.

**5. State the saving in real units.** Before and after, in the unit from step 1.

## Evidence

Report the measurement and the delta, not the fact that you optimized:

> `listOrders`: 1 query plus 1 per order. Staging query log, 430-order page — 431 queries,
> 2.9 s. Replaced with a single `IN` fetch and an in-memory join: 2 queries, 140 ms.
> Validation and error paths unchanged.

> Summarizer sent the full 40 KB file each call. Measured 11 k input tokens per request,
> ~$0.9 per 100 runs. Now sends the target function plus its imports: 900 tokens, same
> output on the 12 fixtures. The retry cap and the parse-failure raise are untouched.

"This is more efficient" is not evidence. It is the sentence this skill exists to stop.

## Boundary

- **Failure handling** and the paths that are not being taken — `pero-ponte-sueter`. Where
  they conflict, correctness wins: never drop a safeguard to save a call.
- Judging the implementation against a **better one that already exists** — `pero-tu-primo`.
- Removing **debug leftovers**, dead code, and stray scaffolding — `recoge-tu-tiradero`.
- This skill governs work that costs something and buys nothing.

## Exit criteria

You may call a path optimized once the cost unit is named, the path is measured or bounded
with its input size stated, the ceiling check in step 4 has run over everything you removed,
and the saving is reported in real units.

**If the measurement says the path is not hot, leave it alone and say so.** A rewrite you
cannot show a number for is not an optimization; it is a diff. And if the only way to make
the number smaller is to delete a check, the number stays where it is.

## Cómo te regaña

> "¿Tú pagas la luz?"
> "¡Estás calentando la calle!"
