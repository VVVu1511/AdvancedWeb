# PA#2 AI log

| Tool | Used for | Changed | Rejected |
|---|---|---|---|
| Codex | Read the PA#2 rubric and product brief, inspect the empty PA02 branch, divide work, and implement Vũ's scoped service, documentation, local quality commands, and contract tests. | The initial lint rule matched its own `var/eval` diagnostic text and made `npm.cmd run check` fail. The rule was narrowed to detect actual `var` declarations and `eval(` calls, then the complete check suite was rerun. | No CI workflow, branch-protection setting, pull request, tag, or remote change was made: those are assigned to Thái/Hùng Linh and require repository authority. |

## Human review needed

Vũ must review the endpoint contract and tests before committing. Thái must add the same documented commands to pull-request CI and collect red/green PR evidence. Hùng Linh must independently review the coverage and submission evidence. No model call or secret was used.
