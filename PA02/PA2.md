# PA#2 evidence

The CI gate, branch protection and deliberate contract break are complete. The `pa2` tag row links to the workflow runs filtered by that tag, so it is valid before the tag exists and shows the tag's run once the tag is pushed. [`docs/ci/quality-gate.md`](docs/ci/quality-gate.md) describes the workflow and how this evidence was produced.

| Evidence | Link |
|---|---|
| Repository | https://github.com/VVVu1511/AdvancedWeb |
| CI workflow | [`.github/workflows/pa02-quality-gate.yml`](../.github/workflows/pa02-quality-gate.yml) |
| Protected-branch settings for `main` | Screenshots [part 1](docs/ci/evidence/branch-protection-1.webp), [part 2](docs/ci/evidence/branch-protection-2.png) and [part 3 (up-to-date branches and the four required checks)](docs/ci/evidence/branch-protection-3.png); settings in [`docs/ci/branch-protection-main.json`](docs/ci/branch-protection-main.json) |
| Blocked PR: a red check stopped the merge | [PR #2](https://github.com/VVVu1511/AdvancedWeb/pull/2): the required check `PA02 test` failed in [run 45567788651](https://github.com/VVVu1511/AdvancedWeb/actions/runs/45567788651) ([failing job](https://github.com/VVVu1511/AdvancedWeb/actions/runs/45567788651/job/139046727689)) and the merge was blocked although the PR was approved. Screenshot: [`docs/ci/evidence/blocked-pr.png`](docs/ci/evidence/blocked-pr.png) |
| Deliberate contract break | Commit [`5016679`](https://github.com/VVVu1511/AdvancedWeb/commit/501667904297de727e5faba8fd506cf149086398) (`test(PA02): deliberately break the save-plan ownership contract`) |
| PR that turned green | The same [PR #2](https://github.com/VVVu1511/AdvancedWeb/pull/2): revert commit [`4bc62f2`](https://github.com/VVVu1511/AdvancedWeb/commit/4bc62f2c7f8fbaaf6785e327d9ddc1b49d10ae23) passed all four required checks in [run 45574532972](https://github.com/VVVu1511/AdvancedWeb/actions/runs/45574532972); merged as [`b0bd889`](https://github.com/VVVu1511/AdvancedWeb/commit/b0bd8895fbd4fcb7634262a162b7af8d27c7cee5) |
| CI run for the `pa2` tag | [PA02 quality gate runs for `pa2`](https://github.com/VVVu1511/AdvancedWeb/actions/workflows/pa02-quality-gate.yml?query=branch%3Apa2): the workflow runs on every push of the `pa2` tag (`on.push.tags`), and this filtered list shows that run |

## Required checks

`main` requires these four checks from the CI workflow. Each runs the README command verbatim in `PA02/`:

| Check | Command |
|---|---|
| `PA02 lint` | `npm run lint` |
| `PA02 format check` | `npm run format:check` |
| `PA02 typecheck` | `npm run typecheck` |
| `PA02 test` | `npm test` |

## Deliberate break

The break changes only `src/app.mjs`: another user's save returns `404 plan-not-found` instead of the contract's `403 plan-not-owned`. Neither the test nor the contract changes. `PA02 test` fails on `rejects another user before exposing or saving a plan`. In [run 45567788651](https://github.com/VVVu1511/AdvancedWeb/actions/runs/45567788651) the test reported `not ok 3 - rejects another user before exposing or saving a plan` with `expected: 403` and `actual: 404`; lint, format check and typecheck passed, so the gate failed for the contract violation only. A follow-up `git revert` commit on the same PR restored the code and the four checks turned green. Both commits are in `main`'s history through the merge commit; nothing was squashed, rebased or force-pushed.

## History of `main` since protection

Every change after protection was turned on reached `main` through an approved pull request whose four required checks passed:

| PR | Merge commit | Content |
|---|---|---|
| [#1](https://github.com/VVVu1511/AdvancedWeb/pull/1) | [`9bb7277`](https://github.com/VVVu1511/AdvancedWeb/commit/9bb7277342b52f66319713d003f681e8bddac744) | Service, contract, tests, cross-platform checks, CI workflow |
| [#2](https://github.com/VVVu1511/AdvancedWeb/pull/2) | [`b0bd889`](https://github.com/VVVu1511/AdvancedWeb/commit/b0bd8895fbd4fcb7634262a162b7af8d27c7cee5) | Deliberate contract break and its revert |
| [#3](https://github.com/VVVu1511/AdvancedWeb/pull/3) | — | This evidence |

