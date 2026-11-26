# Self-assessment: PA#2, harness and quality gate

Submitted by:

- 23127081: Nguyen Phan Hung Linh
- 23127472: Pham Ngoc Thai
- 23127543: Vu Van Vu

Total we claim: **94 / 100**

Assessed on November 25, 2026 against the seven PA#2 rubric criteria. This is our estimate of the work evidenced below, not a requested mark or a guarantee of the lecturer's score. We have not awarded credit for planned fixes or treated later project features as PA#2 requirements.

| Criterion | Max | We claim | Evidence |
|---|---:|---:|---|
| Rules file | 15 | 15 | [AGENTS.md](AGENTS.md) has stack, commands, conventions and never sections, with product-specific restrictions. [Service rules](AGENTS.md) and [commit c4be690](https://github.com/VVVu1511/AdvancedWeb/commit/c4be690f51d20d6b39af6ac6a54a14b21e152480) trace two rules to actual failures: Windows-only `npm.cmd` and CRLF checkouts. These meet the top-band requirements. |
| Permissions and secrets | 10 | 8 | [PERMISSIONS.md](PERMISSIONS.md) defines all three tiers. [.env.example](.env.example) has empty values; [.gitignore](../.gitignore) excludes local secrets. [Review record](docs/pa2-review.md#permissions-and-secret-review) records no Gitleaks findings in 21 fetched-history commits or the working tree. We withhold two points because [the README](README.md#model-key-and-spending-policy) states a future USD 5 policy, not an enforced provider cap. No provider key is configured. The rubric does not explicitly exempt this requirement when no model is used. |
| One command for every check | 10 | 7 | [package.json](package.json), [README](README.md#setup-and-checks) and [CI workflow](../.github/workflows/pa02-quality-gate.yml) use identical commands. All four passed in [PR #4 run 45608225703](https://github.com/VVVu1511/AdvancedWeb/actions/runs/45608225703). However, [typecheck](scripts/typecheck.mjs) only checks runtime exports and one validator result; [lint](scripts/lint.mjs) checks a few text patterns, and [format check](scripts/format-check.mjs) checks line endings and the final newline. We withhold three points for the limited checks. Commands match; their names alone do not justify full credit. JavaScript has no mandatory compiler check, but we do not present this runtime check as static analysis. |
| CI that blocks a merge | 20 | 20 | [PA2.md](PA2.md) links the protected-main settings, [blocked PR #2](https://github.com/VVVu1511/AdvancedWeb/pull/2), [failed required test run](https://github.com/VVVu1511/AdvancedWeb/actions/runs/45567788651), [restore commit 4bc62f2](https://github.com/VVVu1511/AdvancedWeb/commit/4bc62f2c7f8fbaaf6785e327d9ddc1b49d10ae23), and [green run](https://github.com/VVVu1511/AdvancedWeb/actions/runs/45574532972). GitHub confirms all four checks are required. Recorded changes to main since protection use PR merges; the break and revert remain in history. [PR #4](https://github.com/VVVu1511/AdvancedWeb/pull/4) was approved and merged as `8fa11dd9`; its four checks passed. |
| Contract of one AI Travel Planner endpoint | 25 | 24 | [Save-plan contract](docs/contract/save-plan.md) defines owner-only access, fields, response metadata, six problem types and statuses, error precedence, retry scope/lifetime and change policy. Paging is explicitly inapplicable. We withhold one point because the request asks for `application/json` but does not define the response to an unsupported Content-Type; [the HTTP adapter](src/http.mjs) parses the body without checking that header. Mock authentication and in-memory storage are disclosed scope limits, not separate deductions for missing later features. |
| Contract tests that bite | 15 | 15 | [16 HTTP tests](test/save-plan.contract.test.mjs) check every documented error type and problem fields, ownership before replay, key boundaries, conflicts and concurrent retries. They passed in [required CI](https://github.com/VVVu1511/AdvancedWeb/actions/runs/45608225703). [Deliberate break 5016679](https://github.com/VVVu1511/AdvancedWeb/commit/501667904297de727e5faba8fd506cf149086398) changed only implementation and caused [red CI](https://github.com/VVVu1511/AdvancedWeb/actions/runs/45567788651). The revert restored green without weakening the test or contract. |
| AI log | 5 | 5 | [AI-LOG.md](AI-LOG.md) uses dated task entries with Tool, Asked for, Kept, Changed and Rejected. It identifies the lint false positive, cross-platform correction, route problem-type regression, mistaken local Node-version claim and revised assessment. Historical entries distinguish recorded evidence from unavailable conversation details. |
| **Total** | **100** | **94** | Required archive name: `23127081-23127472-23127543_94.zip`. |

## What we did not manage

We did not configure or verify a provider spending cap. PA#2 makes no model calls, so the model cost per plan is USD 0; the USD 5/month value is only a policy for later integration. We also did not replace the narrow custom checks with full linting, formatting and static type analysis. The contract leaves unsupported Content-Type handling unspecified. These are the reasons for the deductions above.

The endpoint uses mock bearer identities and in-memory seeded plans. It does not implement production authentication, durable replay storage, cost recomputation or the later place/hour/travel/weather checks. Those limits must be addressed before production use, but this report does not deduct points for the whole unfinished final project.

[PR #4](https://github.com/VVVu1511/AdvancedWeb/pull/4) was approved and merged on November 25. A fresh clone of merge commit `8fa11dd9` passed all four commands and 16 tests during the November 26 delivery review. [Main CI run 45621028245](https://github.com/VVVu1511/AdvancedWeb/actions/runs/45621028245) also passed.

## What we would do differently

Choose checks by what they detect before naming their scripts. Write down the no-model spending-cap situation when preparing permissions, rather than leaving a future policy to look like a configured control. Review every documented HTTP error through the server before collecting CI evidence; that would have caught the route problem-type mismatch sooner.

Prepare the root submission documents and member details earlier, while still creating the submission tag only after the final approved merge. Keep each AI entry as the task happens; reconstructing earlier tasks from commits cannot recover suggestions that were never recorded.