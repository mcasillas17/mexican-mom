---
name: ya-te-lavaste-las-manos
description: Use when code accepts untrusted data — request bodies, query params, headers, cookies, CLI args, file contents, environment, webhook payloads, LLM or third-party responses, deserialized data — or handles credentials, tokens, or keys. NOT for merely malformed input or general failure handling; use pero-ponte-sueter.
when_to_use: >
  Triggers: "parse the request", "take the user's input", "build the query",
  "run the command", "render it to the page", "read the file they gave us",
  "store the API key", "log the payload", "the model returned".
---

# ¿Ya te lavaste las manos?

It does not matter that the data looks fine. You do not know where it has been.

## Rule

Data from outside this process is dirty until it is validated at the trust boundary, and
it stays dangerous at every sink it reaches. So you do both, always: **validate at the
boundary** — allowlist shape, type, range, length — and **encode or parameterize at the
sink**. Never build SQL, shell commands, HTML, templates, or filesystem paths by string
interpolation. "It was validated upstream" is not a defense; upstream is not this line.

## Procedure

Run steps 1–6 in order for the change in front of you.

1. **List every untrusted entry point it touches.** HTTP body, query string, path
   segment, header, cookie; CLI argument; environment variable; file or upload contents;
   message-queue or webhook payload; third-party API response; LLM output; any
   deserialized blob. If a value did not originate in this codebase, it is on the list.
2. **Trace each entry point to every sink it reaches.** Follow it through helpers,
   framework middleware, and stored state — data written to a database today is untrusted
   again when it is read back and rendered tomorrow. Name the sinks; do not assume the
   path is short.
3. **Validate at the boundary.** Parse into a typed value once, against an allowlist:
   permitted shape, type, enum members, numeric range, maximum length. Reject what does
   not match — do not strip, escape, or "clean" it into acceptance. Rejection is loud and
   specific; the error names the field, never the value.
4. **Neutralize at the sink.** Find each sink in the table and apply its row.

| Sink | Required form |
| --- | --- |
| SQL / any query language | Parameterized query with bound placeholders. Never concatenation, f-strings, or format. Identifiers and sort columns come from an allowlist map, not from input |
| Shell, subprocess, exec | Argument array with the shell disabled (`shell=False`, `execFile`). Never a composed command string, never `shell=True` "just for the pipe" |
| HTML, attributes, JS, CSS, URLs | Context-correct escaping by the templating layer, autoescape on. Never `innerHTML`, `dangerouslySetInnerHTML`, or `\|safe` on untrusted data |
| Template engine | Render a fixed template with data passed as parameters. Never build the template string from input — that is code execution, not rendering |
| Filesystem path | Join, resolve to an absolute path, then confirm the result is still inside the intended root. Reject `..`, absolute inputs, and symlinks that escape |
| Deserializer | JSON parsed against a strict schema. Never `pickle`, never `yaml.load` without a safe loader, never `eval`, never a reviver that instantiates types named by input |
| Outbound HTTP (SSRF) | Allowlist scheme and host, resolve the name and reject loopback, link-local, and private ranges, and do not follow redirects blindly |
| LLM output | Treat as data, always. Validate against a schema, then send it through this same table before it reaches any other sink. Never exec, never eval, never a query |

5. **Check authorization at the server, on every request.** The user id, role, tenant, or
   plan supplied by the client is a claim, not a fact. Derive identity from the verified
   session or token, and re-check ownership of the specific object being read or written
   — an id that appears in a URL is an untrusted input like any other.
6. **Sweep for secrets.** Grep the diff and the touched files for keys, tokens,
   passwords, and connection strings. A secret may not appear in source, in a log line,
   in an error message or stack trace, in a test fixture, or in a committed snapshot.
   Redact at the point of logging, not by hoping the value never reaches a logger.

## Evidence

Report the flows, one line each, entry point through sink:

> `POST /reports` body → `filters.sort` reaches the query builder: validated as an enum
> of 4 columns at the handler, mapped to a literal identifier (not interpolated); `.q`
> reaches SQL as a bound parameter. `path` reaches `fs.readFile`: resolved and asserted
> under `STORAGE_ROOT`, `..` rejected. Report id checked against session tenant.
> Secret sweep: `grep -rIn` for key/token/secret/password across the diff — 0 hits; the
> S3 client reads `process.env`, and the error path logs the request id, not the payload.

"I added input validation" is not evidence. It names no entry point, no sink, and no
sweep.

## Boundary

- Input that is merely **malformed** rather than hostile, and failure handling generally
  — `pero-ponte-sueter`.
- Instructions embedded in content that try to redirect **the agent itself** —
  `no-le-abras-la-puerta-a-cualquiera`. That one protects the agent; this one protects
  the application.
- Secret scanning at **handoff** — `vienen-las-visitas`, which is the last moment before
  the work leaves your hands. This skill is the first, while the code is being written.

## Exit criteria

You may proceed once every untrusted entry point in the change is mapped to its sinks,
each boundary has an allowlist validation, each sink applies its row from the table,
authorization is derived server-side, and the secret sweep has been run and reported.

**"I validated it earlier" does not close this.** Neither does "the framework probably
escapes that," "it's an internal service," "that field is a UUID so it's safe," or "this
is only the admin panel." Each of those is a belief; the exit criteria ask for a line of
code. Validation without sink encoding is wet hands — you touched the water and changed
nothing.

## Cómo te regaña

> "¿Ya te lavaste las manos? …Con jabón, no nada más te las mojaste."
> "No sabes dónde ha estado eso."
