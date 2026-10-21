# AI-LOG.md — PA#1 Proposal and planning (CineMatch)

## 2026-10-22 — rubric review and revision of proposal.md (Pham Ngoc Thai)
Tool: Claude Code (Claude Opus 5.5).

**Asked for:**
- a critical review of the team's draft `proposal.md` against the PA#1 rubric
- then a revision to score above 90, with the work split exactly equally across the three members

**Kept:**
- The review findings:
  - The owners were placeholders, and the six checkpoints were invented rather than the syllabus's PA#1–PA#6.
  - There was no `SELF_ASSESSMENT_REPORT.md`.
  - The cost of a wrong answer was stated as wasted time only.
  - The ID allowlist did not stop invented explanations.
  - Risk 2's "this week" mitigation contradicted the plan.
- The revised §2: hard constraints are applied in SQL before the model; the ID and tag allowlist; a failure-mode table; the human gate on exclusions only.
- The plan table: one item per member per milestone, two leads each.

**Changed:**
- **Catalog size:** cut from 200 to 180 films, so tagging splits evenly (60 + 60 review each).
- **Eval:** grown from 30 to 60 prompts (20 per member).
- **Preference re-ranking:** moved to out of scope.
- **Prices:** checked against OpenAI's pricing page on 2026-10-22 ($0.25 / $2.00 per 1M tokens for `gpt-5-mini`; $0.02 per 1M for `text-embedding-3-small`).
- **Length:** the text was cut until it rendered on two A4 pages.

**Rejected:**
- a human gate on every interpretation (the syllabus says that does not earn full marks)
- keeping 200 films (it cannot be split equally)

**By hand / to confirm:**
- the team names
- the milestone dates once Classroom publishes them
- Linh's and Vu's student IDs for the zip name

## Earlier drafts (Vu Van Vu, Nguyen Phan Hung Linh)
Commits `7eb4a45` and `db1c711` produced the first draft and the CineMatch version. Each author adds their own tool, scope and changes here before submission.
