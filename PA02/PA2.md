# PA#2 evidence

Every `TODO` below is a link that only exists after the steps in [`docs/ci/quality-gate.md`](docs/ci/quality-gate.md) have been done on GitHub. Do not fill one in until the PR or run it names exists.

| Evidence | Link |
|---|---|
| Repository | https://github.com/VVVu1511/AdvancedWeb |
| CI workflow | [`.github/workflows/pa02-quality-gate.yml`](../.github/workflows/pa02-quality-gate.yml) |
| Protected-branch settings for `main` | TODO(Thái): `docs/ci/evidence/branch-protection.png` and https://github.com/VVVu1511/AdvancedWeb/settings/branches |
| Blocked PR: a red check stopped the merge | TODO(Thái): PR URL, failing run URL, `docs/ci/evidence/blocked-pr.png`, `docs/ci/evidence/red-check.png` |
| Deliberate contract break | TODO(Thái): commit URL of `test(PA02): deliberately break the save-plan ownership contract` |
| PR that turned green | TODO(Thái): PR URL, restore commit URL, green run URL, `docs/ci/evidence/green-pr.png` |
| CI run for the `pa2` tag | TODO(Thái, after Hùng Linh pushes the tag): run URL |

## Required checks

`main` requires these four checks from the CI workflow. Each runs the README command verbatim in `PA02/`:

| Check | Command |
|---|---|
| `PA02 lint` | `npm run lint` |
| `PA02 format check` | `npm run format:check` |
| `PA02 typecheck` | `npm run typecheck` |
| `PA02 test` | `npm test` |

## Deliberate break

The break changes only `src/app.mjs`: another user's save returns `404 plan-not-found` instead of the contract's `403 plan-not-owned`. Neither the test nor the contract changes. `PA02 test` fails on `rejects another user before exposing or saving a plan`. A follow-up commit on the same PR reverts the code and the checks turn green.
