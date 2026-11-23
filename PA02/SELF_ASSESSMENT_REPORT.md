# PA#2 self-assessment

This report is deliberately provisional. The repository has Vũ's local implementation only; CI, branch protection, PR evidence, and final delivery evidence have not yet happened and are not claimed as complete.

## Rubric assessment

| Criterion | Max | Claimed marks | Evidence / current assessment |
|---|---:|---:|---|
| Rules file | 15 | TBD | `AGENTS.md` has stack, commands, conventions, and product-specific never rules. Final claim awaits team review and commit evidence. |
| Permissions and secrets | 10 | TBD | `PERMISSIONS.md`, `.env.example`, `.gitignore`, and README model-cap policy exist. History/remote review is still required. |
| One command for every check | 10 | TBD | `package.json` documents lint, format, API-boundary, and test commands; local verification is recorded in the final handoff. CI has not been added. |
| CI that blocks a merge | 20 | 0 | Pending Thái: no workflow, protected branch, or PR evidence exists yet. |
| Endpoint contract | 25 | TBD | `docs/contract/save-plan.md` specifies ownership, request/response rules, RFC 9457 errors, idempotency, and change policy. |
| Contract tests that bite | 15 | TBD | `test/save-plan.contract.test.mjs` covers success, authentication, ownership, invalid key, validator rejection, replay, and key reuse. CI and deliberate-red evidence are pending. |
| AI log | 5 | 5 | `PA02/AI-LOG.md` identifies tool use and an actual corrected issue. |
| **Total** | **100** | **TBD** | Set only after Thái and Hùng Linh complete and evidence their assigned work. |

## What we did not manage

At the time of this report, the team has not configured pull-request CI or protected `main`, run a deliberate contract-break PR, tagged a submission commit, or collected the required repository/CI/PR links for `PA2.md`. Those missing items must be completed before submission; this report does not claim their marks.
