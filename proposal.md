# PA#1: CineMatch — proposal and plan

**CSC13114** · **Team:** Nguyen Phan Hung Linh (Linh), Vu Van Vu (Vu), Pham Ngoc Thai (Thai) · **Repo:** https://github.com/VVVu1511/AdvancedWeb/tree/PA01

## 1. Problem and users

**Problem: Minh can describe the film he wants in one sentence, but no tool he uses turns it into a short list of real films that respects what he does not want to see.**

Minh is a third-year student in Ho Chi Minh City. At 10 p.m. he wants "a school romance about loneliness, bittersweet but not too depressing, nothing about suicide." Today he scrolls Netflix rows and trailers for 20–30 minutes, asks a friend, or asks ChatGPT, which has named a film that does not exist and cannot reliably say whether a film shows suicide. He stands for students who know the tone, theme or ending they want but not the title. CineMatch returns up to five films from a reviewed 180-film catalog, each with why it matches and facts from TMDB.

## 2. The LLM feature and the cost of it being wrong

**Mood search**, one request in three steps:

1. **Extract:** the LLM maps the sentence to strict JSON over 40 tags: hard (excluded content, genre, runtime, min. rating) and soft (theme, tone, intensity, ending).
2. **Retrieve:** SQL applies the hard constraints, then tag overlap plus pgvector similarity picks 30 candidates. The model never sees an excluded film.
3. **Rank and explain:** the LLM returns five `{tmdb_id, matched_tag_ids, reason}`. The server drops IDs outside the 30 and tags the film lacks; titles, ratings, posters come only from our DB.

**Why an LLM:** "bittersweet but not too depressing" → `ending=bittersweet, intensity≤3`; keyword search cannot handle negation, and 40 checkboxes are worse than a sentence.

| Wrong output | Who is harmed, how badly | Undone? |
|---|---|---|
| Missed exclusion: "nothing about suicide" dropped, a `suicide`-tagged film is watched | Minh, or any user avoiding a trigger: distress, beyond 90–150 min | **No**: the failure we design against |
| Wrong tone or ending (sad for "bittersweet") | Minh: one lost evening, 90–150 min | No; retry is cheap |
| Invented title, rating or claim | Minh: 5–15 min checking, lost trust | Blocked in step 3 |

**How we know:** an eval of 60 labelled prompts (20 per member, 20 with exclusions), owned by Vu and run in CI on every prompt or model change from PA#4. Pass: 100% valid IDs, **0 exclusion violations**, ≥90% of hard constraints extracted, and Precision@5 ≥ 0.6. Relevant = 2 of 3 members agree, labelled beforehand. Live "excluded content" reports become incidents.

**Where we stop it:** the human gate covers exclusions only. If an exclusion maps to no tag ("no animal death"), the app shows "We can't filter 'animal death'" and waits for the user to edit or continue. Other interpretations are editable chips with no gate: a wrong tone costs a retry, not harm. A film enters the catalog only after two members agree on its tags.

**Data sent to OpenAI:** the query and candidates' public metadata only; never account data.

## 3. Scope

**In** (milestone in brackets):

- Harness, with a CI that blocks merges [PA#2].
- Sign-in, title search and detail pages; 180 films with TMDB facts and two-member-agreed tags, loaded from a CSV seed; mood search with the exclusion gate [PA#3].
- 60-prompt eval in CI, allowlist, budget cap, timeout fallback, red-team fixes [PA#4].
- Watchlist, "Doesn't match" feedback, logs, metrics, post-mortem, release [PA#5].

**Out:**

- Streaming, payments, availability, TV series, social features, reviews, mobile apps.
- Multi-turn chat (edit chips instead); Vietnamese queries (one eval language).
- Admin tagging UI (CSV seed), full TMDB, personalisation, fine-tuning, plot generation.

## 4. Plan and ownership

Milestones are the syllabus's PA#1–PA#6; dates after PA#1 assume one topic per weekly session (session 2 = 2026-10-15), due the Friday after the topic, re-synced when Classroom publishes each rubric. Each member owns one equal item per milestone and leads two (integration, submission, `AI-LOG.md`). In PA#3 each member also tags 60 films and reviews 60 of another's; in PA#4 each writes 20 eval prompts.

| Due 2026 · lead | Linh | Vu | Thai |
|---|---|---|---|
| **PA#1** 10-23 · Thai | §1, §3; tag guide v1 | §2; 10-prompt pilot | §4–§6; self-assessment |
| **PA#2** 11-27 · Linh | Conventions file, ESLint, Prettier, `tsc` | Vitest, Playwright; CI blocks merges | Next.js + Supabase scaffold, migrations, secrets |
| **PA#3** 12-11 · Vu | TMDB import, auth, catalog pages | Extraction, chips, exclusion gate | Retrieval, ranking, allowlist |
| **PA#4** 12-18 · Thai | Red-team fixes, prompt-injection tests | Eval runner in CI, report | Budget cap, timeout fallback, gate tests |
| **PA#5** 12-25 · Linh | Watchlist, feedback | Logs, metrics, cost alert | Release, rollback, post-mortem |
| **PA#6** mock 12-31 · Vu | Explains Vu's + Thai's code | Explains Linh's + Thai's code | Explains Linh's + Vu's code |

## 5. Risks that would sink the project

1. **People cannot tag subjective content consistently.** TMDB has no "bittersweet" or "suicide" tag; if taggers disagree, "0 exclusion violations" means nothing. Tagging is budgeted at 30 h (180 films × 2 passes × 5 min), 10 h each. **This week:** Linh finishes tag guide v1; all three tag the same 20 films independently; below 80% agreement on content tags, we merge or drop tags before PA#3 tagging.
2. **The model misses negations or ignores the candidate list.** That sinks the safety claim. **This week:** Vu's script runs the 10-prompt pilot (5 with exclusions) through `gpt-5-mini` on a fixed 30-candidate JSON, counting missed exclusions and out-of-list IDs; if any is missed, we add a deterministic negation check (phrase list → tags) before the LLM. Thai sets a $5/month hard limit on the OpenAI project today.

## 6. Technology choices

- **Next.js + TypeScript:** one typed codebase for UI and the server route holding the API key; all three know React.
- **Supabase (Postgres, Auth, pgvector), $0 plan:** SQL enforces hard filters, pgvector handles similarity, 500 MB dwarfs 180 films; a daily CI ping prevents the 7-day idle pause. Embeddings: `text-embedding-3-small` ($0.02/1M), < $0.01 total.
- **TMDB API:** stable IDs, posters, facts; free non-commercially with attribution.
- **OpenAI `gpt-5-mini`, Structured Outputs:** a strict schema guarantees the `{tmdb_id, matched_tag_ids}` shape our allowlist checks. $0.25 in / $2.00 out per 1M tokens (OpenAI pricing, 2026-10-22); two calls ≈ 5,000 in + 400 out ≈ $0.002 per search, $2 per 1,000, $5/month cap. `gpt-5-nano` ($0.05/$0.40) only if it passes the pilot.
- **Zod, Vitest, Playwright, Actions:** validate model output; unit, E2E tests; CI gate.
- **Vercel Hobby, $0:** Next.js deploys, PR previews; timeout → labelled tag-overlap fallback.
