# SELF_ASSESSMENT_REPORT — PA#1 Proposal and planning (CineMatch)

**Team:** Nguyen Phan Hung Linh (23127081) · Pham Ngoc Thai (23127472) · Vu Van Vu (23127543) 
**Zip:** `23127081-23127472-23127543_92.zip`, with IDs in ascending order
**Rubric:** "PA#1 — Proposal and planning · rubric", six criteria, 100 points. The scored document is `proposal.md`.

| # | Criterion | Max | Claimed | Evidence |
|---|---|---|---|---|
| 1 | Problem and users | 20 | 18 | `proposal.md` §1. **Named user and situation:** Minh, a university student, opens a streaming service after 10 p.m. and spends 20–30 minutes comparing options. **One-sentence problem**, in bold: "Minh cannot turn a mood he can describe into a shortlist of real films that respects what he wants to avoid." **What he does today:** asks friends, browses categories, searches the web, or prompts a chatbot that may invent titles. |
| 2 | The LLM feature and the cost of being wrong | 25 | 23 | `proposal.md` §2. **One feature:** natural-language intent matching. The LLM extracts constraints and ranks only server-retrieved candidates, and cannot create a title, ID, rating or plot fact. **Named costs:** 5–15 min of checking; a 90–150 min viewing; exposure to an excluded scene (e.g. suicide). Lost time and an unwanted viewing cannot be undone. **How we know:** 30-prompt set, 10 of them with exclusions, plus a relevance-labelling rule. Targets are 100% valid IDs, 90% hard constraints, P@5 ≥ 70%, and zero exclusion breaks; Linh runs it. **Where we stop it:** a human gate on unmappable exclusions only, and §2 says why tone gets no gate. |
| 3 | Scope: in and out | 15 | 14 | `proposal.md` §3: explicit "In scope" and "Out of scope" lists. **Consistent with §4:** auth, title search and detail pages → PA#3; tags → PA#2; budget cap, cache, exclusion gate and report → PA#4; tag-only fallback → PA#3; watchlist, reranking, logs, metrics and post-mortem → PA#5. |
| 4 | Plan and ownership | 20 | 18 | `proposal.md` §4 table. **Checkpoints = the syllabus's PA#1–PA#6** (syllabus §7), each with a named owner, a date and every member's share. **Equal split:** each member owns two checkpoints and does a third of each. **Dates follow the syllabus topic order:** PA#2–PA#5 at topics 7, 9, 10, 11. |
| 5 | Risks | 10 | 9 | `proposal.md` §5: two risks that would sink the project. **Risk 1:** subjective tags are unreliable. This week Vu and Thai run a 20-film agreement test; below 80% per-tag agreement, the taxonomy is simplified. **Risk 2:** the LLM invents evidence or misses exclusions. This week Linh runs a 10-prompt pilot and sets a $5 limit; if anything fails, output is restricted to candidate indices and tag IDs. |
| 6 | Technology choices | 10 | 10 | `proposal.md` §6. Each choice has a project-specific reason: server routes keep the key and the ID check on the server; Postgres row-level security keeps watchlists private; Supabase idle pausing is handled. **Provider and cost:** OpenAI `gpt-5-mini`, $0.25 in / $2.00 out per 1M tokens (checked 2026-10-22). Both calls are costed, about $0.0022 per search and $2.20 per 1,000, with a $5/month cap. The data sent to OpenAI is stated. |
| | **Total** | **100** | **92** | |

## What we did not manage

- **Dates are not confirmed.** The syllabus gives only the order of topics, so the dates are derived from it and will be re-synced with Classroom. PA#6 shows "exam week" rather than a fixed date.
- **This week's mitigations are not done yet.** The tag-agreement test and the 10-prompt pilot are planned for this week and were not finished at submission.
- **Length.** The proposal fits two A4 pages at 10 pt. At 11 pt with wide margins it runs slightly over.
- **Query language is not stated.** The proposal does not say whether Vietnamese queries are supported.
