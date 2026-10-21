# SELF_ASSESSMENT_REPORT — PA#1 Proposal and planning (CineMatch)

**Team:** Nguyen Phan Hung Linh · Vu Van Vu · Pham Ngoc Thai (23127472)
**Zip:** `<ID1>-<ID2>-<ID3>_91.zip`, IDs in ascending order
**Rubric:** "PA#1 — Proposal and planning · rubric", six criteria, 100 points. The scored document is `proposal.md`.

| # | Criterion | Max | Claimed | Evidence |
|---|---|---|---|---|
| 1 | Problem and users | 20 | 18 | `proposal.md` §1, paragraph 1. **Named user:** Minh, a university student. **Named situation:** after 10 p.m., spending 20–30 min comparing categories, trailers and ratings. **One-sentence problem:** shown in bold ("**Problem:** …"). **What users do today** (§1, paragraph 2): ask friends, browse categories, search the web, prompt a general chatbot that may invent titles. |
| 2 | The LLM feature and the cost of being wrong | 25 | 22 | `proposal.md` §2. **One feature:** natural-language intent matching. The LLM extracts constraints and ranks only server-retrieved candidates, and cannot create titles, IDs, ratings or plot facts. **Named cost:** 5–15 min checking an invented title. A 90–150 min viewing wasted on the wrong tone, plus exposure to excluded content (e.g. a suicide scene Minh asked to avoid). Lost time and an unwanted viewing cannot be undone. **How we know:** 30-prompt labelled test set with targets of 100% valid IDs, 90% hard-constraint accuracy, P@5 70% and zero exclusion violations. Linh runs it on every prompt or model change. **Guards:** ID allowlist, and explanations are rejected when they cite a tag the film lacks. |
| 3 | Scope: in and out | 15 | 14 | `proposal.md` §3. "In scope this semester" and "Out of scope this semester" are separate, explicit lists. **Consistent with the plan:** each in-scope item has a home in §4: sign-in and catalog in PA#3; mood search in PA#3; tags in PA#2 (guide) and PA#3 (reviews); watchlist, feedback and reranking in PA#5; tests in PA#2–PA#5; evaluation in PA#4; deployment in PA#5. |
| 4 | Plan and ownership | 20 | 18 | `proposal.md` §4 table. **The six checkpoints are the syllabus's PA#1–PA#6** (syllabus §7, Assessments). Each has a named owner and a due date, and every member has a named share of every checkpoint. **Equal split:** each member owns two checkpoints, does a third of each, reviews tags for about 67 of the 200 films, and writes 10 of the 30 test prompts. **Dates follow the order of the syllabus teaching plan:** topic 2 → PA#1, 7 → PA#2, 9 → PA#3, 10 → PA#4, 11 → PA#5. |
| 5 | Risks | 10 | 9 | `proposal.md` §5. **Two risks that would sink the project:** subjective tags cannot be labelled consistently; the LLM invents evidence or misses exclusions. **Each mitigation starts this week with a named owner and a threshold:** Vu and Thai run a 20-film labelling-agreement test with an 80% bar. Linh runs a 10-prompt pilot counting invented IDs and missed exclusions, and sets the $5 hard budget limit. |
| 6 | Technology choices | 10 | 10 | `proposal.md` §6. Each choice has a one-line, project-specific reason (relational tables for movies, tags and watchlists; TMDB for stable IDs and attribution; Zod for model-output validation). **Model provider and cost:** OpenAI `gpt-5-mini`, $0.25 in / $2.00 out per 1M tokens (checked 2026-10-22). That is about $0.00175 per search and $1.75 per 1,000 searches, with a $5/month cap. |
| | **Total** | **100** | **91** | |

## What we did not manage

- **Dates after PA#1 are estimates.** The syllabus gives the order of topics but no calendar dates. We assumed one topic per week from session 2 (2026-10-15), and will re-sync when Classroom publishes each rubric. This is why criterion 4 is claimed at 18, not 20.
- **The "this week" mitigations are planned, not finished.** The tag-agreement test and the 10-prompt pilot were not done by submission. The rubric asks only that they could start this week.
- **§1 also describes a broader user category.** It sits in the second paragraph, after Minh. A strict grader may weigh it down.
- **Length.** The proposal fits two A4 pages at 10 pt. At 11 pt it runs about a dozen lines onto a third page.
