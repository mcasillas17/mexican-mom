---
name: pero-tu-primo
description: Use after a substantial implementation works and before claiming it is good, clean, idiomatic, or optimal. Compare it against a concrete alternative you open and read in this session. NOT for unverified claims about an external library you did not open; use cadena-de-whatsapp.
---

# Pero tu primo ya se tituló

The cousin only counts if you can open him.

## Rule

Before you call your own implementation good, compare it to something specific. The
reference must be something you can open in this session and read: another
implementation in this repository, a function in the language's standard library, or a
dependency already installed on this machine. **If you cannot open it, you may not cite
it.** No remembered comparison, no "lodash does this in three lines," no "the standard
approach uses a trie." When there is nothing to open, compare against a measurable
property instead — or say there is no gap.

## Procedure

1. **State what your implementation does**, in one sentence, at the level of behavior:
   the input, the output, and the mechanism. "Dedupes a list by key, preserving first
   occurrence, via a `Set` over a single pass."
2. **Find an openable reference**, in this order. Stop at the first one that actually
   solves the same problem.

| Reference class | Where to look |
| --- | --- |
| Another implementation here | Grep for the same operation elsewhere in the repo; read the sibling module, the older version of this file, the test fixtures that predate it |
| Standard library | Read the installed stdlib source or type definitions on this machine (`itertools`, `collections`, `Array.prototype`, `slices`, `std::`) |
| Installed dependency | Read the real source in `node_modules/<pkg>`, `site-packages/<pkg>`, `vendor/`, not the README and not memory |
| Nothing openable | Skip to step 5 |

3. **Open it and read it.** Not the docs for it, not its name in a manifest — the code.
   If reading it shows it solves a different problem, it is not a reference; go back to
   step 2.
4. **Name the specific difference.** One property, stated concretely: round trips,
   allocations, queries, branches, time complexity, error paths, lines *with the reason
   the lines differ*. "Theirs is shorter" is not a difference; "theirs avoids the
   intermediate array, so one allocation instead of three" is.
5. **If no reference was openable**, compare against a named measurable property of your
   own implementation and state the gap plainly — "three queries where one would do" —
   or state that there is no gap. **"No meaningful comparison available" is a valid
   outcome.** Inventing a cousin to fill the silence is the failure this skill exists to
   stop.
6. **Decide, and say which:** adopt the reference, adapt the idea into your code, or
   keep yours with the reason it wins here. Then act on it or record the explicit "no
   change warranted."

## Evidence

Cite the reference by the path you opened:

> Compared against `src/sync/batchWriter.ts` in this repo, which solves the same
> fan-out: it buffers and issues one write per flush; mine issues one write per item —
> N round trips instead of one. Adapting its buffer.

When nothing was openable, say so and give the measurable property instead:

> No comparable implementation in this repo, stdlib, or installed deps. Measured on its
> own terms: two passes and one intermediate list where one pass suffices. Rewritten as
> a single pass.

> No comparable implementation available, and no measurable gap I can name. Keeping it.

A comparison you did not open is not evidence — it is a `cadena-de-whatsapp` violation
wearing a family resemblance. Name it as one and drop the claim.

## Boundary

- Unverified claims about an **external** library you did not open —
  `cadena-de-whatsapp`. That is the same failure; this skill just catches it in
  comparison form.
- Justifying a choice because it is **popular or conventional** —
  `si-el-lo-hace-tu-tambien`. Popularity is not a reference you can open.
- **Cost** specifically — tokens, spend, compute — `ni-que-fueramos-ricos`.
- This skill compares to improve the work. It never grades the author, and it never
  ends in shame.

## Exit criteria

You may make the quality claim once the reference has been opened and cited by path, one
specific difference is named, and a decision is recorded — adopted, adapted, or kept with
a reason. If no reference was openable, the measurable property and its verdict stand in
its place.

Run this **before** `recoge-tu-tiradero`. A rewrite decided after cleanup wastes the
cleanup.

If the comparison shows yours is better, say that plainly and move on. Mom compares to
make you better, not to make you small.

## Cómo te regaña

> "Tu primo lo hizo con la mitad de código."
> "No te estoy comparando. Nomás digo."
