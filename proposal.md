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

1. **The catalog cannot support subjective requests.** TMDB does not consistently provide tags for subjective concepts such as loneliness, emotional intensity, or bittersweet endings, which could reduce search relevance. This week, Vu will define the tagging guidelines, and Vu and Thai will independently label 20 films and evaluate 10 test queries. If inter-annotator agreement for tags falls below 80%, the team will simplify the taxonomy before labeling the full catalog.

2. **The LLM invents evidence or misses exclusions.** This week, Linh will test 10 prompts, including five with explicit exclusions, using gpt-5-mini and 30 fixed candidate films. The team will measure invented movie IDs and missed exclusions and enforce a $5 monthly API spending limit. If either error occurs, the model will be restricted to returning candidate indices and approved tag IDs, with explanations generated from templates, until the evaluation set passes.

## 6. Technology choices

- **Next.js with TypeScript:** Server routes keep the OpenAI key and the candidate-ID check on the server, in one typed codebase with the responsive UI.
- **Supabase Postgres and Auth:** Relational tables store movies, reviewed tags, watchlists, and feedback. Row-level security (RLS) restricts each user's watchlist to their authenticated user ID. The free plan is suitable for a small prototype; the team will monitor storage and usage limits and document recovery steps if the project becomes inactive.
- **TMDB API:** Provides stable movie IDs and factual metadata, including titles, genres, ratings, and runtime. The team will follow TMDB's attribution requirements and its non-commercial-use terms.
- **Google Gemini API (gemini-2.5-flash):** The free tier supports natural-language preference extraction and candidate ranking without per-token API charges within its usage limits. Structured Outputs and server-side validation constrain responses to the expected schema. The server checks candidate IDs, verifies referenced tags, and enforces exclusions independently of the model. Only the user's search query and necessary candidate metadata are sent; account data is excluded. The team will monitor quota usage, handle rate-limit errors, and avoid promising unlimited free requests.
- **Zod, Vitest, and Playwright:** Zod validates model responses, Vitest tests preference extraction and ranking logic, and Playwright covers end-to-end search, watchlist saving, and feedback flows.  
- **Vercel:** The free plan supports deploying the Next.js prototype. Preview deployments allow another team member to test each pull request's search flow before merging it into the main branch.
