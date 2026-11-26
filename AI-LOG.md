# PA#2 AI log

This log records assistant use for the harness and quality-gate checkpoint. The November 23 implementation entry comes from the existing team log. The earlier November 25 CI entries are reconstructed from commit messages and repository evidence; they are not transcripts or claims that the current reviewer saw those sessions. Kept and Changed describe what reached the repository, not an unrecorded independent human review.

## 2026-11-23: Vũ's initial service and harness

Tool: Codex, as recorded in the original team log.

Asked for: Implement Vũ's assigned save-plan service, contract, local checks, permissions and initial tests.

Kept: The dependency-free Node service, ownership and idempotency checks, contract, initial eight HTTP tests, and local scripts in [commit d9ea140](https://github.com/VVVu1511/AdvancedWeb/commit/d9ea14098edbe0a1136cd643a29bd8ad08d5e7fa).

Changed: The original log records that the lint pattern matched its own `var/eval` diagnostic and failed `npm.cmd run check`. The pattern was narrowed to declarations and calls, then the full check suite was rerun.

Rejected: CI, branch-protection and remote changes were left out of this task because they belonged to Thái's assignment. The existing log does not preserve another rejected implementation suggestion.

## 2026-11-25: Cross-platform commands and checkout formatting

Tool: Claude Opus 5.5, credited in [commit c4be690](https://github.com/VVVu1511/AdvancedWeb/commit/c4be690f51d20d6b39af6ac6a54a14b21e152480).

Asked for: Make the documented checks usable on every supported OS, as recorded in the commit's task description.

Kept: The four command names and the dependency-free scripts.

Changed: Replaced Windows-only `npm.cmd` with `npm` in the README, contributor rules and combined check command. Added `.gitattributes` to force LF after fresh Windows checkouts failed formatting with CRLF. The commit records both failures; the rules retain both lessons.

Rejected: Retaining Windows-only command spelling as the shared local/CI instructions. No additional rejected assistant proposal is preserved in the available record.

## 2026-11-25: Thái's CI gate and deliberate contract break

Tool: Claude Opus 5.5, credited in [workflow commit c0e9c5b](https://github.com/VVVu1511/AdvancedWeb/commit/c0e9c5be6ee63ed429493119dd3e1551a495eed7), [break commit 5016679](https://github.com/VVVu1511/AdvancedWeb/commit/501667904297de727e5faba8fd506cf149086398), and [evidence commit 1d72f24](https://github.com/VVVu1511/AdvancedWeb/commit/1d72f245f93ee4c1f459432363fae9b0886f4eab). Scope below is reconstructed from those commits.

Asked for: Add the four required CI checks and demonstrate that an ownership-contract violation blocks a merge.

Kept: The workflow's identical README commands, protection configuration, screenshots, and red/green links in [PA2.md](PA2.md).

Changed: The deliberate break returned 404 instead of the required 403 for another user's plan. [Run 45567788651](https://github.com/VVVu1511/AdvancedWeb/actions/runs/45567788651) failed the required test. [Revert 4bc62f2](https://github.com/VVVu1511/AdvancedWeb/commit/4bc62f2c7f8fbaaf6785e327d9ddc1b49d10ae23) restored the code and [run 45574532972](https://github.com/VVVu1511/AdvancedWeb/actions/runs/45574532972) passed.

Rejected: The broken 404 ownership behavior was not retained. The restore changed implementation, not the expected contract or test. No separate rejected assistant suggestion is preserved for this task.

## 2026-11-25: Hùng Linh's contract and submission review

Tool: Codex.

Asked for: Complete Hùng Linh's assigned review and final-delivery preparation after reading the brief, rubric and task allocation.

Kept: The existing service architecture, four CI commands, branch protection, and original deliberate-break history. Added eight HTTP tests covering full problem details, malformed inputs, key boundaries, ownership before replay, plan-scoped keys, and concurrent retries.

Changed: The new error test failed against original main because unknown routes returned `not-found`, while the contract promised `plan-not-found`. Corrected the implementation; all 16 tests passed locally and in [PR #4 run 45608225703](https://github.com/VVVu1511/AdvancedWeb/actions/runs/45608225703). Moved canonical hand-in documents and the contract to root paths. Removed values from `.env.example`. Corrected the claim that local tests used Node 22 after `node --version` reported v23.11.0; CI selects Node 22. See [review commit 398cd22](https://github.com/VVVu1511/AdvancedWeb/commit/398cd228af28410998cc38133b34562e4a1adf95).

Rejected: Calling the runtime boundary script a static type checker, describing the future USD 5 policy as an active provider cap, and tagging before the final approved merge. Codex performed this review at Linh's request; it does not count as the teammate approval required by branch protection.

## 2026-11-25: Template-based log and rubric reassessment

Tool: Codex.

Asked for: Follow the supplied AI-log and self-assessment templates and grade the actual work honestly against the PA#2 rubric.

Kept: Evidence-backed credit for the rules, enforced CI gate and contract tests. Preserved the original implementation account and real failure history. Retrieved the three member names and IDs from this repository's earlier team report, rather than using example IDs from the rubric.

Changed: Replaced the log tables with dated Tool, Asked for, Kept, Changed and Rejected entries. Added member lines and What we would do differently to the report. Changed the total from 95 to 94: permissions 9 to 8 because no provider cap is configured; checks 8 to 7 because they are narrow and lack static analysis; contract 23 to 24 because missing later production features should not be treated as separate PA#2 deductions, while unsupported Content-Type behavior remains unspecified. Linked the successful PR run and made unfinished delivery explicit.

Rejected: Choosing a score to target the honesty-adjustment tolerance, awarding marks for a tag run that does not exist, and inventing historical prompts or human reviews. Reference-template filesystem paths are not included in the submission documents.

## Verification, data and delivery limits

Gitleaks 8.21.1 reported no findings in the 21 commits reachable from fetched refs at the initial review and in the working tree. This is scanner evidence, not proof about inaccessible history. Scans used redaction; no secret values were printed. See [the review record](docs/pa2-review.md).

The assistants were given assignment material, repository code, documentation and tool output for these tasks. No real API key or real traveler data was intentionally supplied. The application itself makes no model call: no application data leaves for a model, no provider is configured, and model cost per plan is USD 0. Any later integration must document its outgoing data and configure its cap before making paid calls.

The user authorized work on Linh's assignment, including PR, tag and archive preparation. The existing git author identity was retained. The team remains responsible for understanding and explaining the code. At the November 25 review, PR #4's implementation checks had passed and approval and merge were pending. The November 26 entry below records the subsequent merge and delivery checks. No classroom upload is performed by this log.


## 2026-11-26: Final delivery preflight

Tool: Codex.

Asked for: Check carefully whether the approved work is ready to submit and finish the release preparation.

Kept: The approved implementation and 94/100 assessment. GitHub confirms PR #4 merged as `8fa11dd9`, all four required checks remain enforced, the repository is public, and main CI run `45621028245` passed. A fresh remote clone passed all four local commands and all 16 tests. `git fsck --full` passed; redacted Gitleaks scans found no leaks in 23 fetched-history commits or the checkout.

Changed: Corrected stale statements that PR #4 still needed approval. Replaced changing delivery-status claims with a release acceptance procedure tied to the remote tag, tag CI and extracted ZIP, so completing those operations does not require moving the submission tag or editing the archive's tracked files.

Rejected: Tagging while the submission report still said the merged PR needed approval, bypassing branch protection for a documentation correction, and claiming that passing PR CI proves the later tag run passed. The correction goes through another reviewed PR. Tagging and archive verification follow the procedure in [PA2.md](PA2.md); this entry records only checks already performed before its commit.
