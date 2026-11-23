# AI Travel Planner

PA#2 establishes the quality gate and implements the contract for saving a validated travel plan. The service is dependency-free and requires Node.js 22 or newer.

## Setup and checks

Copy `.env.example` to `.env` if you need local configuration. Do not put real values in the example file. Run each required check with one command:

```powershell
npm.cmd run lint
npm.cmd run format:check
npm.cmd run typecheck
npm.cmd test
```

`npm.cmd run check` runs all four. The CI workflow, to be added by Thái, must run these exact commands on every pull request.

## Model-key and spending policy

PA#2 makes no model calls. A later server-only integration may read `MODEL_API_KEY`; it must honour `MODEL_MONTHLY_SPENDING_CAP_USD` (default: USD 5/month) before making any paid call. Keys must never be included in a browser bundle, tests, logs, or git history.

## API

See [the save-plan contract](docs/contract/save-plan.md). Start the local service with
`npm.cmd start`.
