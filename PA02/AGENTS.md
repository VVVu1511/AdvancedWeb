# AI Travel Planner contributor rules

## Stack

- Node.js 22, native `node:http`, and the built-in Node test runner.
- The save-plan endpoint is a JSON API. It uses no browser-side model key and makes no model call.

## Commands

- `npm.cmd run lint`
- `npm.cmd run format:check`
- `npm.cmd run typecheck`
- `npm.cmd test`
- `npm.cmd run check` runs all four checks.

## Conventions

- Return JSON, including RFC 9457 problem details for every API error.
- Authenticate the request before exposing plan data, and enforce that the plan owner is the caller.
- Keep validation deterministic and side-effect-free; test a contract through HTTP, not only helpers.

## Never

- Never put a model key in a browser bundle or commit a real secret.
- Never make a real model call in a unit or contract test.
- Never edit a test, eval data, or validator rule merely to make a check pass.
- Never save or share a plan after its backend validation fails. This follows the project brief's final-validator rule.
- Never treat a reused idempotency key with a different request as a replay. This rule exists because retry safety otherwise hides a client bug.
