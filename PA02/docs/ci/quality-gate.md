# CI quality gate

Owner: Thái. This file describes the pull-request gate for PA#2 and how its evidence is produced.

## Workflow

[`.github/workflows/pa02-quality-gate.yml`](../../../.github/workflows/pa02-quality-gate.yml) runs on every pull request into `main`, on every push to `main`, on the `pa2` tag, and on manual dispatch. It has one job per documented check, and each job runs the README command verbatim from `PA02/`:

| Required status check | Command (same as README and `AGENTS.md`) |
|---|---|
| `PA02 lint` | `npm run lint` |
| `PA02 format check` | `npm run format:check` |
| `PA02 typecheck` | `npm run typecheck` |
| `PA02 test` | `npm test` |

Design decisions:

- The jobs run on `ubuntu-latest` and use the README commands verbatim. The commands used to be `npm.cmd …`, which exists only on Windows; README and `AGENTS.md` now document the cross-platform `npm run …`, so the same commands run locally on any OS and in CI.
- `PA02/.gitattributes` keeps `*.mjs` LF in every checkout, so the LF format check sees the committed bytes on every runner and every developer machine.
- There is no `paths` filter. A required check that is skipped stays pending and blocks the PR; a filter would also let a change outside `PA02/` merge without the gate.
- `fail-fast: false` reports all failing checks in one run. `permissions: contents: read` gives the job a read-only token.
- Each check is a separate job so that each of the four checks from rubric criterion 3 can be required separately on `main`.

## Branch protection on `main`

[`branch-protection-main.json`](branch-protection-main.json) is the protection applied to `main`:

- The four checks above are required, bound to the GitHub Actions app (`app_id` 15368), so a commit status posted through the API cannot satisfy them.
- `strict: true` requires the PR branch to be up to date with `main` before merging.
- A pull request with one approving review from another member is required for every change; `enforce_admins: true` (*Do not allow bypassing the above settings*) applies the rule to administrators too, so nobody can push directly to `main`.
- Force-pushes and deletion of `main` are blocked.

Apply it with a repository administrator's GitHub CLI login (run from the repository root):

```powershell
gh api --method PUT repos/VVVu1511/AdvancedWeb/branches/main/protection --input PA02/docs/ci/branch-protection-main.json
```

Read it back for evidence:

```powershell
gh api repos/VVVu1511/AdvancedWeb/branches/main/protection
```

Branch protection on a private repository needs a paid plan; PA#2 requires the repository to be public, so make it public first.

## Applied settings

Vũ (repository owner) enabled the rule on `main` in *Settings → Branches* with these settings; the JSON above mirrors them. Screenshots: [part 1](evidence/branch-protection-1.webp), [part 2](evidence/branch-protection-2.png). Anyone with read access can confirm the required checks:

```powershell
gh api repos/VVVu1511/AdvancedWeb/branches/main --jq '{protected, required_checks: .protection.required_status_checks}'
```

## Evidence procedure

Do these steps in order. Rubric criteria 4 and 6 do not accept rebased or rebuilt history, so merge without squashing or rebasing the evidence commits and never force-push them.

1. **Gate PR.** Push the branch that adds the workflow (`PA02`) and open a PR into `main`. Wait for the four checks to pass. This run also registers the check names with GitHub.
2. **Protect `main`.** Apply the protection above, before anything is merged. Take a screenshot of *Settings → Branches → main* that shows the four required checks, and save it in `PA02/docs/ci/evidence/`. Then merge the gate PR through the GitHub UI after another member approves it.
3. **Deliberate contract break.** Create `pa2/deliberate-contract-break` from the updated `main` and change only the code, not the test or contract. In `PA02/src/app.mjs`, make the ownership rule return the wrong documented status:

   ```diff
   -    if (plan.ownerId !== userId) return response(403, problem(403, 'plan-not-owned', 'Plan is not owned by caller', 'Only the plan owner may save this plan.'));
   +    if (plan.ownerId !== userId) return response(404, problem(404, 'plan-not-found', 'Plan not found', 'The requested plan does not exist.'));
   ```

   Commit it as `test(PA02): deliberately break the save-plan ownership contract`, push it, and open a PR into `main` titled `PA#2 deliberate contract break`. In the PR body, state that the break is deliberate and that the contract requires `403 plan-not-owned`.
4. **Capture red.** `PA02 test` fails on the test `rejects another user before exposing or saving a plan` (expected `403`, received `404`), and the merge button is blocked. Save screenshots of the failed check and the blocked merge box as `PA02/docs/ci/evidence/blocked-pr.png` and `PA02/docs/ci/evidence/red-check.png`, and copy the failing run's URL.
5. **Restore and capture green.** On the same branch, revert the code change with a new commit (`git revert <break-commit>`, no amend or force-push). Push it, wait for the four checks to pass, and save `PA02/docs/ci/evidence/green-pr.png`. Copy the green run's URL and the restore commit's URL. Then merge the PR (merge commit) so `main` keeps both commits.
6. **Tag run.** After Hùng Linh tags the submission commit `pa2` and pushes the tag, the workflow runs for the tag. Copy that run's URL into `PA2.md`.
7. Fill in every link in [`PA2.md`](../../PA2.md).

## Local verification on Windows

`git config core.autocrlf` is `true` by default on Git for Windows. Without a rule, that setting checks `.mjs` files out with CRLF and `npm run format:check` fails, although git stores them with LF. [`PA02/.gitattributes`](../../.gitattributes) sets `*.mjs text eol=lf`, so every clone gets LF and a fresh clone that follows the README passes. CI runs on Linux, where git does not convert line endings.

A working copy that was checked out before `.gitattributes` existed keeps its CRLF files. Check out the `.mjs` files again once:

```powershell
git ls-files -- '*.mjs' | ForEach-Object { Remove-Item $_ }; git checkout -- '*.mjs'
```
