# Hùng Linh assignment review

Codex performed this review at Hùng Linh's request on November 25, 2026, starting from main commit `f974494`. It does not substitute for the teammate approval required by branch protection.

## Contract and tests

All six documented error types now receive complete HTTP problem-detail assertions. Additional coverage checks malformed authentication and JSON, invalid request field types, zero/exact/over-cap totals, key length and ASCII rules, ownership before replay, failed requests not reserving keys, conflicts preserving original replies, key isolation between plans, and concurrent retries returning one save.

A new assertion against the original `origin/main` implementation failed because an unknown route returned `https://ai-travel-planner.example/problems/not-found`. The contract already required `plan-not-found`; the implementation was corrected. The regression was reproduced in a temporary directory without changing or rewriting git history. All 16 tests pass on the corrected implementation.

The contract now names the full problem URI prefix, response field types, error precedence, in-memory replay lifetime, field-order-sensitive fingerprints, and mock-authentication limits. Its current canonical repository path is `PA02/docs/contract/save-plan.md`.

## Local checks

Run from `PA02/`, using local Node v23.11.0:

```sh
npm run lint
npm run format:check
npm run typecheck
npm test
```

All passed, with 16 tests and no skips. CI uses these exact commands on Node 22. The custom typecheck is a runtime boundary check, not static analysis.

## Permissions and secret review

`PA02/PERMISSIONS.md` has allowed, ask-first and never tiers. The current user authorized the final-delivery operations; protection and review requirements remain in force. `.env` and local variants are ignored. `.env.example` now contains only empty values; defaults and the absence of model integration are explained in the README.

Gitleaks 8.21.1 commands run from the root:

```sh
gitleaks git --redact --log-opts=--all --no-banner .
gitleaks dir --redact --no-banner .
```

Both reported no leaks. The history scan covered 21 commits reachable from fetched refs before this review commit. Redaction was enabled. No real key or provider setting was accessed. The repository is public.

## GitHub gate verification

GitHub branch metadata reports `protected: true`, enforcement for everyone, and required `PA02 lint`, `PA02 format check`, `PA02 typecheck`, and `PA02 test` checks. The admin protection endpoint is unavailable to the current write-level account; the saved configuration and screenshots document the approval and strict-update settings.

The failed run `45567788651` is attached to break commit `5016679`; only the test job failed. Restore run `45574532972` succeeded at `4bc62f2`. PR #3 is merged at `f974494`. See [PA2.md](../PA2.md) for the links.

PR #4 received teammate approval and merged as `8fa11dd9`. On November 26, a fresh clone of that merge passed all four commands, all 16 HTTP tests, and `git fsck --full`. Gitleaks found no leaks in 23 fetched-history commits or the checkout. Main CI run `45621028245` passed. Team identities were retrieved from the earlier team report in this repository.

Follow [PA2.md's release acceptance procedure](../PA2.md#release-acceptance) after the final delivery-record correction merges. Verify the remote tag, tag CI and extracted ZIP before uploading; retain `.git` and preserve the tagged files unchanged.
