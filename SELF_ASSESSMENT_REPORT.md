# PA#2 self-assessment

Prepared for the final review PR on November 25, 2026. Total claimed: **95/100**. These marks cover the implementation and linked evidence. Tagging, the tag run and the submission ZIP must still be completed after the final approved merge.

| Criterion | Max | Claimed | Evidence and assessment |
|---|---:|---:|---|
| Rules file | 15 | 15 | [Root rules](AGENTS.md), [service rules](PA02/AGENTS.md), and [AI log](AI-LOG.md). Four sections, product-specific restrictions, and recorded Windows-command/CRLF failures. |
| Permissions and secrets | 10 | 9 | [Three-tier permissions](PA02/PERMISSIONS.md), [empty example variables](PA02/.env.example), [.gitignore](.gitignore), and [scan record](docs/pa2-review.md). No Gitleaks findings. No provider cap exists because no provider is configured; the README states a future policy. |
| One command for every check | 10 | 8 | [Scripts](PA02/package.json), [README](PA02/README.md), [workflow](.github/workflows/pa02-quality-gate.yml). Same four commands, but typecheck is a runtime boundary check and lint/format checks are narrow. |
| CI that blocks a merge | 20 | 20 | [PA2.md](PA2.md) links protection screenshots, blocked PR #2, its failed run and green restore commit. Live branch metadata confirms all four required checks. Changes since protection use PRs. |
| Endpoint contract | 25 | 23 | [Save contract](docs/contract/save-plan.md) specifies caller/ownership, shapes, problem types, statuses, retry scope/lifetime and change policy. Mock authentication, in-memory storage and limited validation are explicit limitations. |
| Contract tests that bite | 15 | 15 | [16 HTTP tests](PA02/test/save-plan.contract.test.mjs), [deliberate break](https://github.com/VVVu1511/AdvancedWeb/commit/501667904297de727e5faba8fd506cf149086398), [failed CI](https://github.com/VVVu1511/AdvancedWeb/actions/runs/45567788651), [green restore](https://github.com/VVVu1511/AdvancedWeb/actions/runs/45574532972). New local regression also detects the route problem-type mismatch. |
| AI log | 5 | 5 | [AI-LOG.md](AI-LOG.md) records tools, scope, actual corrections, rejected claims and verification limits. |
| **Total** | **100** | **95** | The submission archive must end in `_95.zip`. |

## What we did not manage

This checkpoint does not implement production identity verification, durable saves/replays, the later place/hour/travel/weather validators, or model integration. The `typecheck` command does not provide static type analysis. No provider spending cap can be claimed as configured. These limitations are disclosed rather than counted as completed work.

Delivery remains pending the final PR approval and merge, one `pa2` tag push, a successful tag run, and an archive containing `.git`. A team member must upload that archive from their student account. See [TASKS.md](TASKS.md) for the required order.
