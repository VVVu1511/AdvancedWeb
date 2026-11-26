# AI Travel Planner contributor rules

## Stack

- Node.js 22, native `node:http`, and the built-in Node test runner.
- The save-plan endpoint is a JSON API. It uses no browser-side model key and makes no model call.

## Commands

<!--
  These commands were `npm.cmd ...` before. `npm.cmd` exists only on Windows:
  on Linux/macOS each command failed with "command not found", and CI had to
  run on a Windows runner to use them verbatim. `npm run ...` works on every
  operating system. Keep this list identical to PA02/README.md and to
  .github/workflows/pa02-quality-gate.yml (rubric criterion 3: the same
  commands locally and in CI).
-->
- `npm run lint`
- `npm run format:check`
- `npm run typecheck`
- `npm test`
- `npm run check` runs all four checks.

## Conventions

- Keep PA#2 documents in `PA02/`, without duplicate copies or navigation stubs at the repository root.
- Read [permissions](PERMISSIONS.md) and the [contract](docs/contract/save-plan.md) before editing.
- Changes to protected `main` go through reviewed PRs. Obtain explicit user approval before creating any new PR, even when broader implementation work is authorized.

- Return JSON, including RFC 9457 problem details for every API error.
- Authenticate the request before exposing plan data, and enforce that the plan owner is the caller.
- Keep validation deterministic and side-effect-free; test a contract through HTTP, not only helpers.
<!--
  The two lines below come from real failures in PA#2:
  1. Commands written as `npm.cmd` worked only on Windows (see Commands above).
  2. Git for Windows (core.autocrlf=true) checked .mjs files out with CRLF, so
     `npm run format:check` failed on a fresh clone although git stored LF.
     PA02/.gitattributes now forces LF for *.mjs.
-->
- Write commands as `npm run …`, never `npm.cmd`; they must work on Windows, Linux, macOS and CI.
- Keep `.mjs` files LF (enforced by `.gitattributes`); do not convert them to CRLF.

## Never

- Never put a model key in a browser bundle or commit a real secret.
- Never make a real model call in a unit or contract test.
- Never edit a test, eval data, or validator rule merely to make a check pass.
- Never save or share a plan after its backend validation fails. This follows the project brief's final-validator rule.
- Never treat a reused idempotency key with a different request as a replay. This rule exists because retry safety otherwise hides a client bug.
- Never move an existing submission tag to conceal later changes.
