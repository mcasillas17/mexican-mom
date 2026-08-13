---
name: a-ver-ensename
description: Use before claiming your own work is fixed, passing, complete, compatible, secure, built, or deployed — the claim requires artifact output produced since the latest change. NOT for unverified external library or API facts; use cadena-de-whatsapp. NOT for claiming a repo artifact is absent; use y-si-lo-encuentro-que.
---

# A ver, enséñame

You are about to say it works. Show the output first.

## Rule

No success claim without the artifact. Every assertion that your own work is fixed,
passing, complete, compatible, secure, built, or deployed must carry, in the same
message, the output that proves it — produced **this turn**, after the latest relevant
change. Output from before your last edit is stale and does not count. If you did not run
it this turn, the sentence is "I have not verified this," never "it works."

## Procedure

1. **Name the claim.** Write the exact sentence you were about to send: "the tests pass,"
   "the endpoint returns 200," "the build is clean." A vague claim cannot be proven.
2. **Pick the smallest sufficient artifact.** The least output that would falsify the
   claim if it were false.

   | Claim | Smallest artifact |
   | --- | --- |
   | Tests pass | Test runner summary line + exit status |
   | Bug is fixed | The failing reproduction, re-run, now passing |
   | It builds | Build command + exit status |
   | Endpoint works | Request + status code + response body |
   | Deployed / running | Health check or status output with a timestamp |
   | Config or code change applied | Diff of the changed lines |
   | Compatible with X | Version output of X + the run against it |

3. **Run it now.** Execute the command in this turn. Do not report from memory, from an
   earlier turn, or from what you expect the command to print.
4. **Read the output, not the vibe.** Check exit status explicitly. Check the counts.
   Check that the thing you claim ran actually ran — see the near-misses below.
5. **Quote it.** Paste the relevant lines verbatim into your message. Do not paraphrase
   output; paraphrase is how a misread becomes a false report.
6. **Redact.** Strip credentials, tokens, keys, connection strings, and personal data from
   anything you paste. Redaction is not a reason to skip the evidence — quote the
   surrounding lines with the secret masked.
7. **If it cannot be run, downgrade the claim explicitly.** No environment, no
   permissions, no test suite: say what you changed, say "I have not verified this," and
   name the command the user should run. Do not soften it into "should work now."

### Near-misses that look like success

Each of these prints something green and proves nothing. Check for them before quoting.

- **0 tests collected** — the runner found nothing and exited 0.
- **All tests skipped** — a summary of skips reads almost identically to a summary of passes.
- **A filter that matched nothing** — `-k`, `--grep`, or a path argument with a typo.
- **A cached result** — the tool reported a prior run without re-executing.
- **A passing build of stale artifacts** — it compiled, but not your edit; the source was
  not saved, or the build read a previous output directory.
- **Exit 0 from a wrapper** — a shell script, `npm` alias, or `|| true` that swallowed the
  real exit code from the command underneath.

## Evidence

Quote the artifact and the status, together, in the message that makes the claim:

> `pytest tests/auth` → `47 passed, 2 skipped in 3.1s`, exit 0. The two skips are the
> S3 integration tests, unchanged by this fix.

Not evidence: "tests pass," "I ran the tests and they're green," "verified," "the build
succeeded." Those are the claim restated, which is the failure this skill exists to stop.

When the claim cannot be proven:

> I changed the token refresh in `src/auth/session.py`. I have not verified this — there
> is no test runner configured here. Run `npm test -- auth` to confirm.

## Boundary

- Claims about **external** libraries, APIs, versions, or platform behavior —
  `cadena-de-whatsapp`.
- Claims that a **repository artifact is absent** — `y-si-lo-encuentro-que`.
- The gate before work **crosses to another person or system** — `vienen-las-visitas`.
  That skill delegates success evidence here; this one covers the claim, not the handoff.
- This skill governs one sentence only: "it works."

## Exit criteria

You may make the success claim once all of these are true:

- The artifact was produced by a command you ran **this turn**, after your most recent
  relevant change.
- Exit status was read, and the near-miss list was checked against the output.
- The relevant lines are quoted in the message, with secrets redacted.
- Nothing in the output contradicts the claim, and nothing in it is unexplained.

Otherwise the claim is downgraded to "I have not verified this," with the reason and the
command that would verify it.

If you claimed success and it later fails, say so directly and quote the failing output.
No "it seems the fix may not have fully applied." You reported green on red; name it and
fix it.

## Cómo te regaña

> "A ver, enséñame."
> "No te creo. Enséñame las manos."
