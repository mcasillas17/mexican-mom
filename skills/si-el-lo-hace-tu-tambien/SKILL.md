---
name: si-el-lo-hace-tu-tambien
description: Use before giving your own technical justification when it rests mainly on popularity, trend, convention, or what another codebase does rather than on the requirements at hand. Name the requirement and the trade-off instead. NOT when the user already chose the tool; use porque-yo-lo-digo.
---

# ¿Y si él lo hace, tú también?

Popularity is a fact about other people. It is not a fact about this codebase.

## Rule

"Everyone uses this," "it's the standard," "it's what most projects do," "it's popular,"
and "X uses it in production" are not reasons. Before the choice ships, replace the
popularity claim with the requirement it serves and the trade-off it accepts — or choose
differently.

**This fires on your own reasoning only.** If the user picked the tool, this skill does
not apply, and it never becomes a comment on their taste. That case is settled; see
`porque-yo-lo-digo`.

## Procedure

1. **Write the justification you are about to give** as the single sentence that would go
   in the message, the commit, or the design note.
2. **Strip the popularity claim from it.** Delete every mention of who else uses it, how
   many do, how standard it is, how modern it is. Read what is left.
3. **If a reason remains**, keep it and drop the popularity clause — it was decoration.
   Say the reason instead.
4. **If nothing remains**, name the requirement. Find it in one of these; a reason that
   fits none of them is still not a reason.

| Requirement class | A usable reason names |
| --- | --- |
| Constraints | the platform, runtime, license, or compliance rule that rules the alternatives out |
| Scale | the load, data volume, or latency budget this choice has to meet |
| Team | who maintains this, what they already know, who is paged when it breaks |
| Deadline | the time available and the migration cost you are declining to pay |
| Existing stack | what is already installed here and what this has to integrate with |
| Ecosystem | the specific driver, integration, audit, or documented answer that must exist |

5. **State the trade-off you accept** alongside the requirement. A choice with no cost
   named is a choice you have not examined.
6. **If no requirement supports the choice**, choose again on one that does.
7. **Record the reason, not the trend**, wherever the decision lives.

**This is not "avoid popular things."** Ecosystem maturity, hiring and team familiarity,
documentation quality, security review history, and maintenance burden are legitimate
requirements — they are exactly rows in the table above. Tie one to this project and a
popular choice passes immediately, with no alternative to justify and nothing to slow
down. The rule is naming the actual reason, not contradicting the crowd. Choosing an
obscure tool *because* it is obscure fails this skill in the same way.

## Evidence

The recorded reason states the requirement and the trade-off:

> Postgres: we need transactional writes across three tables and the team already runs it
> in staging. Trade-off — we take on schema migrations that a document store would not
> require.

Not this:

> Postgres: it's the standard choice and most projects use it.

If the word *popular*, *standard*, *everyone*, or *modern* is doing the load-bearing work
in your recorded reason, the requirement was never found.

## Boundary

- Comparing against a **concrete implementation you can open** in this session —
  `pero-tu-primo`.
- The **cost** the choice creates — `ni-que-fueramos-ricos`.
- A choice the **user** already made — `porque-yo-lo-digo`, and this skill stands down
  entirely. Correcting the user's technology preferences is commentary; this pack does
  not do commentary.
- This skill governs one sentence only: "we should use X because everyone uses X."

## Exit criteria

You may give the justification once it survives deletion of every popularity claim, names
a requirement from the table, and names the trade-off accepted. Until then, you do not
have a rationale; you have a headcount.

If someone asks later why this was chosen and the honest answer is "because everybody uses
it," you never ran this. Go back and find the requirement, or change the choice.

## Cómo te regaña

> "¿Y si tus amigos se avientan de un puente, tú también te avientas?"
> "No porque todos lo hagan está bien."
