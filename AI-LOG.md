# AI-LOG.md — PA#1 Proposal and planning (CineMatch)

## 2026-10-22 — rubric review and targeted fixes to proposal.md (Pham Ngoc Thai)
Tool: Claude Code (Claude Opus 5.5).

**Asked for:** a critical review of the team's draft `proposal.md` against the PA#1 rubric, then the smallest set of changes that makes it score above 90.

**Kept:** the original draft's structure, wording and format. Only the following changed:
- **Team:** filled in the team names.
- **§1:** bolded the one-sentence problem statement.
- **§2:**
  - named the irreversible harm (a scene the user excluded)
  - extended the allowlist to explanations that cite tags the film lacks
  - added a zero-exclusion-violation target and who runs the test set
- **§4:** mapped the checkpoints to the syllabus's PA#1–PA#6. Added named owners, an equal per-member split of each checkpoint, and dates derived from the syllabus teaching plan.
- **§5:**
  - Filled in the risk owners.
  - Rewrote risk 2's mitigation so it can start this week (a 10-prompt pilot and the budget limit), instead of building the whole guardrail stack, which the plan schedules for PA#3–PA#4.
- **§6:** dated the `gpt-5-mini` price, after checking it on OpenAI's pricing page.

**Rejected:** a full rewrite tried first in the same session. The team preferred the original draft's format and wording, so it was reverted to commit `db1c711` and only the fixes above were applied.

**By hand / to confirm:**
- the milestone dates once Classroom publishes them
- Linh's and Vu's student IDs for the zip name

## Earlier drafts (Vu Van Vu, Nguyen Phan Hung Linh)
Commits `7eb4a45` and `db1c711` produced the first draft and the CineMatch version. Each author adds their own tool, scope and changes here before submission.
