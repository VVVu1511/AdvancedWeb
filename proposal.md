# PA#1: CineMatch proposal and planning

**Course:** CSC13114 · **Project:** CineMatch, find a movie that matches your mood  
**Team:** Nguyen Phan Hung Linh (Linh), Vu Van Vu (Vu), Pham Ngoc Thai (Thai)  
**Repository:** https://github.com/VVVu1511/AdvancedWeb/tree/PA01

## 1. Problem and users

Minh is a university student who opens a streaming service after 10 p.m. but spends 20 to 30 minutes comparing categories, trailers, ratings, and recommendation lists. **Problem: Minh cannot turn a mood he can describe into a shortlist of real films that respects what he wants to avoid.**

Today Minh asks friends, browses streaming categories, searches the web, or prompts a general chatbot, which may return invented titles or unsupported claims. Users like Minh are students and young adults who know the tone, theme, setting, or ending they want but not a title.

CineMatch accepts a request like "a highly rated school romance about loneliness, bittersweet but nothing too depressing" and returns up to five real films from a controlled catalog, each with an explanation and verified facts. Users can save films and rate the match, which only reorders later verified candidates.

## 2. Core LLM feature and cost of errors

The core feature is natural-language intent matching. The LLM extracts hard constraints and preferences such as genre, setting, theme, emotional intensity, ending type, rating, runtime, and exclusions. The server will retrieve eligible films using The Movie Database (TMDB) facts and team-reviewed tags. The LLM will rank only those candidates and explain each choice from supplied metadata. It cannot create a title, movie ID, rating, or plot fact. An LLM suits this task because people describe mood in combinations that fixed filters handle poorly. The app will show its interpretation as editable search preferences before results appear.

A nonexistent title or false rating wastes 5 to 15 minutes of checking. A wrong tone, ending, or content note can waste a 90 to 150 minute viewing session and expose the user to content they excluded, such as a suicide scene Minh asked to avoid. A watchlist error can be removed, but lost time and an unwanted viewing experience cannot be undone.

The system will reduce and measure these errors in four ways:

- The API will reject any recommendation whose TMDB ID is absent from the retrieved candidate set, and any explanation that cites a tag the film does not have.
- Factual fields will come from TMDB. The team will review subjective tags before a film enters the catalog.
- Human gate: the costliest error is a broken exclusion, so if an exclusion maps to no reviewed tag, Minh must confirm or edit it before results appear. Tone needs no gate, because the shown interpretation and explanations let him correct it before watching.
- A 30-prompt labelled test set will measure valid IDs, hard-constraint accuracy, and Precision@5. A result is relevant if two of three members labelled it so before the run. Release targets are 100%, 90%, and 70% respectively, with zero results that break an exclusion; 10 of the 30 prompts contain one. Linh runs it on every prompt or model change from PA#4. A "broke my exclusion" report hides the film until re-review.

## 3. Scope

### In scope this semester

- A responsive web app with sign-in, about 200 films, title search, and detail pages.
- Natural-language mood search, candidate retrieval, ranking, and evidence-based explanations.
- Verified TMDB data plus reviewed mood, theme, intensity, ending, and content tags.
- A watchlist, match feedback, simple preference reranking, automated tests, evaluation, and deployment.
- Guardrails and operations: budget cap, cache, tag-only fallback, exclusion gate and report, logs, metrics, one post-mortem.

### Out of scope this semester

- Film streaming, payments, real-time availability, TV series, social features, written user reviews, and native mobile apps.
- Full TMDB coverage, fine-tuning, collaborative filtering, and generated plot facts missing from stored metadata.

## 4. Plan and ownership

| Checkpoint | Deliverable | Owner | Due date |
|---|---|---|---|
| PA#1 Proposal | Linh: §1–2, README, 10-prompt pilot. Vu: §3, §5, tag guide. Thai: §4, §6, self-assessment. Vu and Thai: 20-film agreement test | Linh | 2026-10-23 |
| PA#2 Harness, quality gates | Linh: scaffold, data model, migrations, TMDB import. Vu: conventions, lint, types, merge-blocking CI. Thai: Vitest, Playwright, Vercel previews. Each reviews tags for about 67 films | Vu | 2026-11-27 |
| PA#3 LLM prototype | Linh: auth, title search, detail pages. Vu: intent extraction, interpretation UI, prompt tests. Thai: retrieval, ranking, explanations, ID and tag validation, tag-only fallback | Thai | 2026-12-11 |
| PA#4 Eval, guardrails, human gate | Linh: eval runner, report. Vu: budget cap, cache, exclusion gate, report-and-hide. Thai: red-team fixes. Each writes 10 of the 30 prompts | Linh | 2026-12-18 |
| PA#5 Final, operations | Linh: watchlist, feedback. Vu: preference reranking, end-to-end tests. Thai: deployment, logs, metrics, post-mortem | Vu | 2026-12-25 |
| PA#6 Oral exam | Each explains the other two members' code in a mock oral | Thai | Exam week; mock 2026-12-31 |

Checkpoints are the syllabus's PA#1–PA#6, dated by its topic order (PA#2–PA#5 at topics 7, 9, 10, 11) and re-synced with Classroom. Each member owns two and does a third of each.

## 5. Major risks and mitigation

1. **The catalog cannot support subjective requests.** TMDB lacks labels for loneliness, intensity, or bittersweet endings, so the core search would fail. This week, Vu will write the tag guide, and Vu and Thai will independently label 20 films and test 10 queries. If per-tag agreement is below 80%, they simplify the taxonomy before catalog entry.

2. **The LLM invents evidence or misses exclusions.** This week, Linh will run 10 prompts, five with exclusions, through `gpt-5-mini` on 30 fixed candidates, counting invented IDs and missed exclusions, and set a $5 hard budget limit. If any appears, the model may only return candidate indices and tag IDs, with template explanations, until the test set passes.

## 6. Technology choices

- **Next.js with TypeScript:** Server routes keep the OpenAI key and the candidate-ID check on the server, in one typed codebase with the responsive UI.
- **Supabase Postgres and Auth:** Relational tables fit movies, tags, watchlists, and feedback, and Postgres row-level security on Auth user IDs keeps each watchlist private. The $0 plan's 500 MB fits the catalog; a CI ping stops idle pausing.
- **TMDB API:** Stable IDs and factual data, free for non-commercial use with the attribution we show.
- **OpenAI `gpt-5-mini`:** Structured Outputs return the strict JSON our allowlist checks; only the query and candidate metadata are sent, never account data. Input costs $0.25 and output $2.00 per million tokens (checked 2026-10-22). Extraction (about 600 in, 150 out) plus ranking (5,000 in for 30 candidates, 250 out) costs about $0.0022 per search and $2.20 per 1,000. The cap is $5 per month.
- **Zod, Vitest, and Playwright:** Validate model output, test ranking, and cover search, save, and feedback.
- **Vercel:** Its $0 plan deploys Next.js, and previews let a second member try each PR's search before merge.
