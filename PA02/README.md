# AI Travel Planner

PA#2 establishes the quality gate and implements the contract for saving a validated travel plan. The service is dependency-free and requires Node.js 22 or newer.

## Setup and checks

Copy `.env.example` to `.env` if you need local configuration. Do not put real values in the example file. Run each required check with one command:

<!--
  Why `npm run` and not `npm.cmd run`:
  The commands used to be written as `npm.cmd run ...`. `npm.cmd` exists only on
  Windows, so on Linux and macOS every documented command failed with
  "command not found", and CI could only run them on a Windows runner.
  `npm run ...` works on Windows (cmd and PowerShell), Linux and macOS.
  The CI workflow (.github/workflows/pa02-quality-gate.yml) runs exactly these
  four lines, so keep the README, AGENTS.md and the workflow identical when
  one of them changes (rubric criterion 3: same commands locally and in CI).
-->

```sh
npm run lint
npm run format:check
npm run typecheck
npm test
```

<!--
  Windows PowerShell note:
  If PowerShell refuses `npm` with "running scripts is disabled on this system",
  its execution policy is blocking npm.ps1. Allow signed scripts for your user
  once, then use the same commands as above:
      Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
  Typing `npm.cmd` instead of `npm` also works on Windows, but it is not the
  documented command, so do not write it in this file or in CI.
-->
On Windows, if PowerShell blocks `npm` because script execution is disabled, run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once.

<!--
  Line endings:
  `npm run format:check` requires LF line endings in every .mjs file. Git for
  Windows defaults to core.autocrlf=true, which used to check those files out
  with CRLF, so the format check failed on a fresh Windows clone although git
  stores them with LF. PA02/.gitattributes (`*.mjs text eol=lf`) now forces LF
  in every checkout. Linux and macOS were never affected.
-->
Git keeps `.mjs` files with LF line endings on every operating system through `.gitattributes`. If a Windows working copy was cloned before that file existed and the format check reports CRLF, check the `.mjs` files out again as described in [the CI guide](docs/ci/quality-gate.md#local-verification-on-windows).

<!--
  `npm run check` calls the four scripts from package.json. The `check` script
  used to chain `npm.cmd run ...`, so it failed on Linux and macOS even after
  the individual commands were fixed. It now chains the same `npm run ...`
  commands as above. package.json is JSON and cannot hold comments, so the
  explanation lives here.
-->
`npm run check` runs all four. The [CI workflow](../.github/workflows/pa02-quality-gate.yml) runs the same four commands as separate required checks on every pull request into `main`; see [the CI guide](docs/ci/quality-gate.md).

## Model-key and spending policy

PA#2 makes no model calls. A later server-only integration may read `MODEL_API_KEY`; it must honour `MODEL_MONTHLY_SPENDING_CAP_USD` (default: USD 5/month) before making any paid call. Keys must never be included in a browser bundle, tests, logs, or git history.

## API

See [the save-plan contract](docs/contract/save-plan.md). Start the local service with
`npm start`.
<!-- Was `npm.cmd start`; changed to `npm start` for the same cross-platform reason as the checks above. -->

