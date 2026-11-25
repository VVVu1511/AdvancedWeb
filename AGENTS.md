# Repository contributor rules

## Stack

AI Travel Planner uses Node.js 22 and native HTTP. Read [PA02/AGENTS.md](PA02/AGENTS.md) before editing the service.

## Commands

Run from `PA02/`: `npm run lint`, `npm run format:check`, `npm run typecheck`, and `npm test`. CI uses the same commands. Use `npm run`, not Windows-only `npm.cmd`; the earlier commands failed on macOS/Linux.

## Conventions

The canonical submission documents are at the root. Keep `.mjs` files LF; fresh Windows clones previously failed format checking with CRLF. See [AI-LOG.md](AI-LOG.md) for both incidents. Read [permissions](PA02/PERMISSIONS.md) and the [contract](docs/contract/save-plan.md). All changes to protected `main` go through reviewed PRs.

## Never

Never put a model key in a browser or git history. Never make real model calls in tests. Never weaken tests, eval data, validator rules or required checks to make a check pass. Never publish a plan rejected by backend validation. Never move an existing submission tag to conceal later changes.
