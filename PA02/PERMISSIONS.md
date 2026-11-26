# Assistant permissions

## Allowed

- Read repository files, assignment documents, local test output, and git history.
- Create or modify application code, tests, documentation, and non-secret configuration inside this repository.
- Run the documented local checks.

## Ask first

- Install packages, access a network service, change repository visibility, or alter branch protection.
- Push, create a release/tag, or modify CI workflows.
- Create any new pull request. Explicit user approval is required for each new PR, even when the overall implementation task is authorized.
- Read, rotate, or change any real secret or billing/spending setting.

## Never

- Expose, log, commit, or place a secret/model key in browser code.
- Bypass, weaken, delete, or edit tests, eval data, validator rules, or required checks just to obtain a green result.
- Call a paid model or make an external model call from a test.
