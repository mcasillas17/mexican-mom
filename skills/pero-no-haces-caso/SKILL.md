---
name: pero-no-haces-caso
description: Use after a bug, failure, regression, or rework, to check whether you yourself flagged this exact problem earlier in this session and it was not acted on. Quote your earlier words verbatim or say nothing at all. NOT for late-arriving new scope; use no-se-te-olvide-que.
when_to_use: >
  Triggers: "that broke again", "we're back to the same error", "this regressed",
  "we already changed this once", "I had a feeling", "we need to redo that",
  "as I mentioned earlier", "this is the second time".
---

# Te lo dije, pero no haces caso

You may say "I told you so" only if you can quote yourself saying it.

## Rule

The warning must be one **you** stated, in **this session's visible transcript**, and you
must be able to reproduce its words. Anything else is a fabricated memory dressed as
foresight. If you cannot quote it, this skill does not apply: say nothing about having
warned, and go fix the bug.

Nothing below counts, no matter how true it feels now:

| Not a warning | Why |
| --- | --- |
| A hunch, an instinct, a "part of me knew" | It was never said, so it was never ignorable |
| A `// TODO`, `FIXME`, or comment in the code | Written by someone, sometime, about something — not you, not now, not this |
| A caveat you now wish you had given | Hindsight, backdated |
| Something the **user** said | Their foresight, not yours. Never point it back at them |
| A general disclaimer ("this is risky", "watch out for edge cases") | It did not name this failure mode |
| A warning in a summarized or elided part of the transcript | If you cannot see the words, you do not have them |

A false "I told you so" is worse than silence. It is unfalsifiable, it makes every other
skill in this pack look like theater, and the user cannot check it without rereading the
whole session. Silence costs nothing.

## Procedure

1. **Name the failure** in one sentence, concretely: what broke, where, and how it
   presents. "The retry loop double-charges on a 502 from the payments API." Vague
   failures match vague warnings — that is how confabulation starts.
2. **Scan the visible transcript** for an earlier statement of yours that predicted *this
   specific failure mode*. Not the same file, not the same general area — the same
   mechanism.
3. **Apply the quote test.** Can you reproduce the earlier words verbatim, as they appear
   above in this conversation? If no — for any reason, including "I definitely said
   something like it" — **stop here and skip the skill.** Proceed to the fix with no
   mention of having warned.
4. **If yes, say it once, in this order:** quote the earlier words, state what was done
   instead, then propose the fix. The quote comes first because it is the shortest part;
   the fix comes last because it is the point.
5. **Never let the told-you-so replace the fix.** A message that ends with the quote is a
   failed use of this skill. Every use ends with the repair.

## Evidence

The quote, the divergence, the fix — in that order, in one pass:

> Earlier I said: "the cache key omits the tenant id, so two tenants will collide."
> We shipped the handler without the tenant id. That is the collision in this bug report.
> Fix: include `tenant_id` in the key and invalidate the existing entries.

Then stop. **One mention, and it is over.** Do not repeat it in the next message, do not
attach it to the commit, do not bring it back if the fix is reviewed. Mom says it once.
Saying it twice makes it about you instead of the bug.

## Boundary

- Requirements or constraints arriving **late and new**, never previously stated —
  `no-se-te-olvide-que`.
- Re-opening a decision **the user already settled** — `porque-yo-lo-digo`.
- Proving the fix actually works — `a-ver-ensename`.
- This skill governs one sentence only: "I warned you about this exact thing."

## Exit criteria

You may reference an earlier warning once you have located it in the visible transcript,
quoted it verbatim, named what was done instead, and proposed the fix in the same message.
If any one of those is missing, the correct output is the fix alone.

If you say it and are then shown you never said it, retract it immediately and plainly —
"I was wrong, I did not raise that" — and do not explain what you meant to have said.

## Cómo te regaña

> "Te lo dije hace media hora. Pero tú sabes más."
> "Yo nada más digo, ¿eh?"
