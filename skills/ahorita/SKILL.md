---
name: ahorita
description: Use when deferring work, writing a TODO, giving a time estimate, or promising a follow-up. Every deferral must resolve to one stated outcome: committed with a trigger and owner, declared out of scope, or deleted. NOT for urgent work that must preempt everything; use ahorita-es-ahorita.
when_to_use: >
  Not for: "drop everything", "stop, this is on fire", "do it now" — that is
  ahorita-es-ahorita. Triggers: "later", "eventually", "in a future PR", "for now",
  "we can improve this", "TODO: fix this properly", "I'll follow up", "should take
  a few minutes", "quick follow-up after this".
---

# Ahorita

You do not get to write "later."

## Rule

A deferral is a commitment shaped like a deferral, and it must be honest about which one
it is. Every deferral you write resolves to exactly **one** of three states, stated
explicitly at the moment you write it.

| State | What it means | What you must do |
| --- | --- | --- |
| **COMMITTED** | It will actually happen | Name a concrete trigger and an owner, and record it somewhere it will be seen |
| **OUT OF SCOPE** | A deliberate decision not to do it | Say so plainly in your response |
| **NEVER** | You are not going to do this | Delete the note rather than leave it lying |

A **trigger** is a named event — "when the API v2 migration lands," "before the next
release," "when the flaky test is quarantined." It is not "later," and it is not a
calendar date you have no power to create; a trigger is sufficient and usually better.

**Recorded somewhere it will be seen** means an issue, a ticket, a skipped test with a
reason, or the response the user is reading. A bare `// TODO` in a file nobody greps is
not a record. It is state 3 wearing state 1's clothes.

Out of scope is honorable. A declined item is a decision, not a failure, and saying so
costs you nothing. Pretending it is state 1 costs the user a month of waiting.

**Banned outright:** "later," "eventually," "in a future PR," "we can improve this,"
"TODO: fix this properly," and any estimate with no unit or no basis.

## Procedure

1. **Catch it as you write it.** The tells are a future-tense verb about your own work, a
   `TODO`/`FIXME`, a hedge like "for now," a bare number of minutes, or a sentence whose
   subject is a thing you are not doing.
2. **Classify into one of the three states.** Ask: if nobody ever asks me about this
   again, does it happen? If no, it is not COMMITTED, whatever you were about to type.
3. **Act on the state.**
   - COMMITTED — name the trigger, name the owner, write it where it will be seen.
   - OUT OF SCOPE — say it in the response, in one sentence, without apology.
   - NEVER — delete the comment, the stub, the placeholder. Leave nothing implying it.
4. **Re-read your own message** before sending and replace every vague time word with a
   state. This step catches most of them; the deferral you did not notice is the one in
   your summary paragraph.

## Evidence

State the state. The reader must never have to guess which of the three they got:

> Fixed the parser. The retry path still swallows the timeout error — **out of scope**
> here, not doing it in this change. Opened `#412` for the connection-pool leak,
> **committed**, triggered by the v2 migration, owned by whoever takes that migration.
> Deleted the `// TODO: handle unicode` stub in `normalize.ts`; nobody is going to do it.

"I'll clean this up later" is not a deferral. It is a way of ending a sentence.

## Boundary

- Work that must **preempt everything right now** — `ahorita-es-ahorita`. Same word,
  opposite job.
- **New** scope arriving from the user mid-task — `no-se-te-olvide-que`.
- **Debug leftovers** — logs, stubs, commented code — `recoge-tu-tiradero`.
- This skill governs one thing only: the honesty of a thing you said you would do later.

## Exit criteria

You may send the message once every deferral in it carries a state, every COMMITTED one
names a trigger and an owner and lives somewhere durable, every NEVER one has actually
been deleted, and no banned phrase survives.

If you later find you are not going to do a COMMITTED item, say that out loud and close
it. Downgrading a promise on purpose is fine. Letting it rot is what this skill exists to
stop.

## Cómo te regaña

> "Sí, ahorita. Como ayer, ¿no?"
> "¿Cuál ahorita? Dime la hora."
