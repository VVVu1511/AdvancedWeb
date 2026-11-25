# PA#2 task allocation

This allocation covers every rubric criterion while keeping CI work away from Vũ. Status is
recorded honestly: only Vũ's items are implemented in this working tree.

| Member | Assignment requirements and deliverables | Status |
|---|---|---|
| **Vũ** | Create the Node service and the `POST /plans/{planId}/save` implementation; define request validation, ownership enforcement, validator rejection and idempotency; write `docs/contract/save-plan.md` and contract tests; configure documented local lint, format, type and test commands; add `.env.example`, secret ignore rules, `PERMISSIONS.md`, product-specific `AGENTS.md`, README instructions and the PA#2 AI log. | Implemented locally; CI integration still awaits Thái/Hùng Linh. |
| **Thái** | Create and maintain the GitHub Actions workflow which runs the exact documented checks on every pull request; configure protected `main` with those checks required; open a deliberate-contract-break PR, capture its red check, restore the contract and capture the green PR; provide links/screenshots for `PA2.md`. | Pending. **All CI and branch-protection work belongs to Thái.** |
| **Hùng Linh** | Independently review the endpoint/contract/test coverage; extend tests for every documented error and replay/ownership boundary if needed; review permissions and secrets for history leaks; help verify the CI workflow against README commands; prepare the final tag, public-repository check, submission archive and evidence links. | Pending. CI verification is permitted for Hùng Linh; CI implementation is not assigned to Vũ. |

## Coverage checklist

| Rubric criterion | Owner |
|---|---|
| Rules file | Vũ |
| Permissions and secrets | Vũ, reviewed by Hùng Linh |
| One command for every check | Vũ locally; Thái wires the same commands into CI |
| CI that blocks a merge | Thái, verified by Hùng Linh |
| One endpoint contract | Vũ |
| Contract tests that bite | Vũ, reviewed/extended by Hùng Linh; Thái runs them in CI and supplies the deliberate-break PR evidence |
| `AI-LOG.md`, `PA2.md`, tag and submission evidence | Vũ writes the log; Thái supplies CI/PR evidence; Hùng Linh assembles and verifies final delivery evidence |
