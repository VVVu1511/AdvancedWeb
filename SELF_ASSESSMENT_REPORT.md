# SELF_ASSESSMENT_REPORT — PA#1 Proposal and planning (CineMatch)

Team: Nguyen Phan Hung Linh · Vu Van Vu · Pham Ngoc Thai (23127472)
Zip: `<ID1>-<ID2>-<ID3>_91.zip`, with the IDs in ascending order
Rubric: "PA#1 — Proposal and planning · rubric", six criteria, 100 points. The scored document is `proposal.md`, which prints on two A4 pages at 11 pt.

| # | Criterion | Max | Claimed | Evidence |
|---|---|---|---|---|
| 1 | Problem and users | 20 | 18 | `proposal.md` §1: **named user** (Minh, a third-year student in Ho Chi Minh City), **named situation** (10 p.m., with a quoted request), and **one problem sentence** in bold. **What he does today:** scrolls Netflix rows for 20–30 min, asks a friend, asks ChatGPT, which invents titles. The wider user group is stated as secondary ("He stands for…"). |
| 2 | The LLM feature and the cost of being wrong | 25 | 23 | `proposal.md` §2. **One feature:** mood search, in three concrete steps (extract → SQL/pgvector retrieve → rank with ID and tag allowlist). **Named cost:** a table of three failure modes, each with who is harmed, how badly (distress; 90–150 min; 5–15 min) and whether it can be undone. **How we know:** 60-prompt eval, owner, pass thresholds (100% valid IDs, 0 exclusion violations, ≥90% extraction, P@5 ≥ 0.6) and labelling rule. **Where we stop it:** the human gate is on unmappable exclusions only, with the reason there is no gate elsewhere. **Data sent to OpenAI** is stated. |
| 3 | Scope: in and out | 15 | 14 | `proposal.md` §3. **In:** each item is tagged with its milestone [PA#2–PA#5]. **Out:** an explicit list, including items a reader might assume (multi-turn chat, Vietnamese queries, admin tagging UI, personalisation). **Consistent with the plan:** every in-scope item has an owner in the §4 row of the same milestone. |
| 4 | Plan and ownership | 20 | 18 | `proposal.md` §4. **The six checkpoints are the syllabus's PA#1–PA#6** (syllabus §7). Each has a date, a named lead and one named work item per member. **Equal split:** one item per milestone each, two leads each, 60 films tagged + 60 reviewed each, 20 eval prompts each. **Dates follow the syllabus teaching plan** (topic 2 → PA#1, 7 → PA#2, 9 → PA#3, 10 → PA#4, 11 → PA#5). |
| 5 | Risks | 10 | 9 | `proposal.md` §5. **Two project-sinking risks:** inconsistent human tagging, and the model missing negations or ignoring the candidate list. **Each mitigation can start this week**, with an owner, a measurable threshold (80% agreement; zero missed exclusions in a 10-prompt pilot) and a fallback. The $5 hard limit is set today. |
| 6 | Technology choices | 10 | 9 | `proposal.md` §6. Every choice has a one-line, project-specific reason. **Model provider and cost:** OpenAI `gpt-5-mini` at $0.25/$2.00 per 1M tokens (checked on OpenAI's pricing page 2026-10-22), worked out per search (≈ $0.002) and per 1,000 searches (≈ $2), with a $5/month cap. The embedding cost and the free-tier limits (Supabase 7-day pause, Vercel timeout fallback) are stated. |
| | **Total** | **100** | **91** | |

## What we did not manage

- **Dates after PA#1 are estimates.** The syllabus gives the order of topics but no calendar dates. We assumed one topic per weekly session, with session 2 on 2026-10-15, and will re-sync when Classroom publishes each rubric. For that reason we claim 18 for criterion 4, not 20.
- **The "this week" mitigations are not done yet.** Tag guide v1, the 20-film agreement test and the 10-prompt pilot are planned for this week, not finished at submission. The rubric asks only that they *could* start this week.
- **The problem is consumer, not safety-critical.** The serious harm (an excluded trigger shown) is real but rarer than the everyday cost (a wasted evening). A grader may weigh it lower, which is why we claim 23, not 25, for criterion 2.
- **Two-page limit.** We met it by cutting wording. Some lines are dense; for example, the §6 test-tool line is terse.
