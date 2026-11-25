# PA#2 AI log

| Tool | Used for | Changed | Rejected |
|---|---|---|---|
| Codex | Read the PA#2 rubric and product brief, inspect the empty PA02 branch, divide work, and implement Vũ's scoped service, documentation, local quality commands, and contract tests. | The initial lint rule matched its own `var/eval` diagnostic text and made `npm.cmd run check` fail. The rule was narrowed to detect actual `var` declarations and `eval(` calls, then the complete check suite was rerun. | No CI workflow, branch-protection setting, pull request, tag, or remote change was made: those are assigned to Thái/Hùng Linh and require repository authority. |

| Codex, Hùng Linh's assigned review | Read the rubric and brief, review the endpoint through HTTP, verify GitHub evidence, scan history and prepare root submission documents. | Added eight tests covering complete problem details, malformed input, ownership before replay, key boundaries, plan-scoped keys and concurrent retries. The new error test failed against original main because unknown routes returned `not-found`; changed the code to the existing contract's `plan-not-found` and all 16 tests passed. Moved canonical submission documents and contract to root paths. | Rejected claiming that the runtime `typecheck` script performs static analysis, or that the future USD 5 policy is an active provider cap. Rejected tagging before the final approved merge. |

## Rules learned from actual failures

The cross-platform changes in [PR #1](https://github.com/VVVu1511/AdvancedWeb/pull/1) replaced Windows-only `npm.cmd` commands after macOS/Linux failures, and added `.gitattributes` after CRLF caused fresh Windows checkouts to fail format checking. Both incidents are recorded in the comments in `PA02/AGENTS.md` and `PA02/README.md`; the root rules retain the lessons.

The deliberately broken ownership response in [commit 5016679](https://github.com/VVVu1511/AdvancedWeb/commit/501667904297de727e5faba8fd506cf149086398) failed required CI. [Commit 4bc62f2](https://github.com/VVVu1511/AdvancedWeb/commit/4bc62f2c7f8fbaaf6785e327d9ddc1b49d10ae23) reverted the implementation, without weakening the test or contract.

## Verification and limits

On November 25, 2026, the four documented commands passed locally with Node v23.11.0, including 16 HTTP tests. The installed path named `node@22` also reports v23.11.0; we use the reported runtime version, not the directory name. GitHub CI selects Node 22.

Gitleaks 8.21.1 reported no findings in 21 commits reachable from all fetched refs and in the working tree. This is scanner evidence, not proof about unfetched or inaccessible history. No secret values were printed. No model provider or API key is configured, no model call is made, and model cost per plan is USD 0. The USD 5/month provider cap remains a policy for a later milestone.

The user authorized work for Hùng Linh, including a final PR, tag and archive. Codex kept the existing git author identity and did not claim to be a different person. A teammate must review and approve the PR under the existing protection rule. The tag, tag CI and submission ZIP remain pending that merge. No classroom upload has occurred.
