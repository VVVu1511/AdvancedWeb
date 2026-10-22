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

**Verification:** we ran three rounds of blind grading, each with 5 fresh Claude Code agents. Each agent was given only the rubric, the syllabus and proposal.md. Totals:
- Round 1: 91, 91, 90, 91, 89
- Round 2: 90, 90, 89, 92, 91
- Round 3: 98, 93, 91, 94, 92

Between rounds we fixed only the deductions the graders repeated. These were:
- the compound problem sentence
- the Precision@5 relevance rule
- the exclusion-severity and gate wording
- owners for the fallback and explanations
- risk 2 being two risks in one
- the uncosted extraction call
- the RLS wording
- the Supabase idle pause
- length

**By hand / to confirm:**
- the milestone dates once Classroom publishes them
- Linh's and Vu's student IDs for the zip name

## 2026-10-22 — technology choices review and free-model replacement for `proposal.md` (Vu Van Vu)

**Tool:** ChatGPT (GPT-6).

**Asked for:** A revision of §6, Technology Choices, to replace the paid OpenAI model with a free model and align the technology choices with the core LLM feature and cost-of-errors section in §2.

**Kept:** The existing technology stack and proposal structure. Revised only the technology descriptions and their consistency with §2:

- **Next.js with TypeScript:** Clarified server-side API-key protection, candidate-ID validation, and exclusion enforcement.
- **Supabase Postgres and Auth:** Retained relational storage and row-level security (RLS), but replaced the CI keep-alive ping with usage monitoring and documented recovery steps.
- **TMDB API:** Retained as the source of factual movie metadata and stable IDs, with attribution and non-commercial-use requirements.
- **LLM:** Replaced the paid OpenAI `gpt-5-mini` API with Google's Gemini API free tier to avoid per-token charges within free-tier limits. Added structured-output validation, candidate-ID and tag checks, exclusion enforcement, and quota monitoring.
- **Zod, Vitest, and Playwright:** Clarified their respective roles in response validation, ranking tests, and end-to-end testing.
- **Vercel:** Retained free-tier deployment and preview deployments for pull-request testing.

**Rejected:** Continuing with a paid OpenAI API and its estimated per-search cost, because the requested priority was a free model for the student prototype. Also removed the assumption that a periodic CI ping reliably prevents Supabase inactivity.

**Verification / limitations:** The revised proposal recommends checking Google's official Gemini API pricing and rate limits before implementation. Free-tier quotas, model availability, and data-use terms must be confirmed. No live integration tests or independent model evaluations were performed as part of this revision.

**By hand / to confirm:**

- Confirm the selected Gemini model and its current free-tier availability, quotas, and data-use terms.
- Verify current Supabase and Vercel free-tier limits.
- Ensure §2's evaluation targets—100% valid candidate IDs, 90% hard-constraint accuracy, 70% Precision@5, and zero exclusion violations—are implemented and tested before claiming they are achieved.

## Earlier drafts (Nguyen Phan Hung Linh)
Commits `7eb4a45` and `db1c711` produced the first draft and the CineMatch version. Each author adds their own tool, scope and changes here before submission.
