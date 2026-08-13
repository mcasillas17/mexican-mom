---
name: ya-comiste
description: Use when a failure may come from an unavailable or misconfigured environment — service down, dependency or version missing, unset or expired credential, exhausted port, disk, or memory, unreachable host — before you debug application code. NOT for stale state you created this session; use el-vaporub.
when_to_use: >
  Triggers: "connection refused", "module not found", "ECONNREFUSED", "401",
  "no such host", "address already in use", "cannot connect", "it works locally",
  "the client is misconfigured", "something is wrong with the code".
---

# ¿Ya comiste?

Nothing runs on an empty machine.

## Rule

Before you read a line of application code, prove the environment can actually run it. Six
checks, in order, each one either **pass** or **fail** with the observation that decided
it. You may not skip a check because the previous one passed, and you may not infer a pass
from configuration that merely *looks* correct. Secrets are confirmed by presence and
shape, never by value.

## Procedure

Run all six, in this order. Stop and report at the first failure — a failed check is the
finding, not a detour.

1. **Is it running, and is it listening?** A live process is not a bound socket. Confirm
   the process exists (`ps`, `docker ps`, `systemctl status`, container health) **and**
   that something is listening on the expected address and port (`ss -ltnp`, `lsof -i
   :PORT`). A process stuck in startup passes the first half and fails the second.
2. **Is the dependency installed, at the version the code imports?** Presence is not
   enough. Compare the *installed* version (`node_modules/<pkg>/package.json`, `pip show`,
   `<bin> --version`) against what the manifest declares and what the code imports. Also
   confirm you are in the interpreter or virtualenv that owns that install — the right
   package under the wrong `python` is a fail.
3. **Are the required env vars and credentials set, non-empty, and unexpired?** Verify
   **without printing values**. Check that the name is defined, that the length is
   non-zero and plausible, that the prefix or format matches the expected shape, and that
   any embedded expiry (token `exp`, cert `notAfter`) is in the future. Check the process's
   own environment, not just the `.env` file on disk — the file may never have been loaded.
4. **Are local resources available?** The port free (or bound by the intended process, not
   a leftover), disk space on the volumes that matter (`df -h`, including `/tmp` and the
   data directory), memory headroom, and file-descriptor limits (`ulimit -n`) above what
   the workload opens. "No space left" and "too many open files" surface as unrelated
   application errors.
5. **Is the host reachable, and does the name resolve?** Resolve the hostname first (`dig`,
   `getent hosts`), then reach the port (`nc -z`, `curl -v`). DNS failure and connection
   refusal are different diagnoses, and inside containers or VPNs the name may resolve
   differently than it does in your shell.
6. **Does the connection actually open, end to end?** One real round trip from the same
   context the application runs in — a query, an authenticated ping, a health endpoint —
   returning a real response. Reading the config file is not this check. Credentials that
   are present and well-formed can still be revoked.

Only after all six report pass may you move on to application code.

## Evidence

Report a line per check: the check, the verdict, and what proved it.

> 1. Listening — **pass**: `ss -ltnp` shows postgres on `127.0.0.1:5432`.
> 2. Dependency — **fail**: code imports `psycopg` (v3); `pip show` reports `psycopg2`
>    2.9.9 installed, `psycopg` absent in this venv.

For secrets, confirm shape and never the value:

> `DATABASE_URL` — set in the process environment, 87 chars, begins `postgresql://`.
> `API_KEY` — set, 40 chars, expected `sk-` prefix. Value not printed.

"Environment looks fine" is not evidence. Neither is a check you decided to skip because
it passed yesterday.

## Boundary

- Stale state **you** created this session — unsaved file, unrestarted process, stale
  cache, wrong branch or worktree — `el-vaporub`.
- A **repo artifact** you cannot find — file, symbol, config key — `y-si-lo-encuentro-que`.
- Claims about how an external tool or platform *behaves* — `cadena-de-whatsapp`.
- This skill governs one sentence only: "the environment can run this."

## Exit criteria

You may open application code once all six checks report pass, each with a named
observation, and the end-to-end connection actually returned a response. If any check
fails, that is your report — state which one, what you observed, and what would fix it.
Do not begin a code review on a machine that cannot open the socket.

If a check you marked pass turns out to have been wrong, say which one and what you
actually observed. Then rerun the checklist from the top; a bad reading invalidates
everything you concluded after it.

## Cómo te regaña

> "¿Ya comiste? ¿Seguro? Mírame."
> "Con el estómago vacío nada sale bien."
