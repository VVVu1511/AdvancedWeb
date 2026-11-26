# PA#2 task allocation

Status checked on November 26, 2026 against the repository and GitHub evidence. Codex performed Hùng Linh's assigned review at his request; this record does not claim a separate human review.

| Member | Responsibility | Status and evidence |
|---|---|---|
| Vũ | Service, validation, contract, initial tests, local checks, permissions, rules and initial AI log. | Implemented and merged through [PR #1](https://github.com/VVVu1511/AdvancedWeb/pull/1). |
| Thái | CI, protected main, deliberate break and red/green evidence. | Implemented and merged through [PR #2](https://github.com/VVVu1511/AdvancedWeb/pull/2) and [PR #3](https://github.com/VVVu1511/AdvancedWeb/pull/3). GitHub confirms all four required checks. |
| Hùng Linh | Review contract and tests, permissions/history, CI commands; assemble final evidence, tag and ZIP. | Review and submission documents merged through [PR #4](https://github.com/VVVu1511/AdvancedWeb/pull/4) as `8fa11dd9`. A fresh clone passed all four checks and 16 tests; Gitleaks found no leaks in 23 fetched-history commits or the tree. Release acceptance follows the procedure below. |

## Delivery order

1. PR #3 merged as `f974494`.
2. PR #4 was approved and merged as `8fa11dd9`. Merge the final delivery-record correction through an approved PR before tagging.
3. Tag the final `main` commit `pa2` once and push that tag.
4. Verify all four checks on the tag run.
5. Clone the public repository at that tag, retain `.git`, and create the ZIP with the three actual student IDs in ascending order and the self-assessed total of 94.
6. One member submits using their student email account before November 26, 2026, 22:00 Vietnam time.

Use the remote `pa2` tag, its green CI run, and inspection of the actual ZIP as the delivery evidence. This pre-tag task record does not certify operations that occur after its commit. No post-tag document amendment is required; preserve the tagged tree exactly in the archive.

Team identities from the earlier repository report: Nguyen Phan Hung Linh, 23127081; Pham Ngoc Thai, 23127472; Vu Van Vu, 23127543. Required archive name: `23127081-23127472-23127543_94.zip`.
