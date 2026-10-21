# PA#1: CineMatch proposal and planning

**Course:** CSC13114  
**Project:** CineMatch, find a movie that matches your mood  
**Team:** Nguyen Phan Hung Linh, Vu Van Vu, Pham Ngoc Thai  
**Repository:** https://github.com/VVVu1511/AdvancedWeb/tree/PA01

## 1. Problem and users

Minh is a university student who opens a streaming service after 10 p.m. but spends 20 to 30 minutes comparing categories, trailers, ratings, and recommendation lists. **Problem: Minh can describe the experience he wants, but ordinary title and genre filters cannot turn that description into a trustworthy shortlist.**

The primary users are students and young adults who know the tone, theme, setting, or ending they want but not a title. They currently ask friends, browse streaming categories, search the web, or prompt a general chatbot. These options require manual checking and may return invented titles or unsupported claims.

CineMatch will accept a request such as, "I want a highly rated school romance about loneliness, with a bittersweet ending, but nothing too depressing." It will return up to five real films from a controlled catalog. Each result will explain the match and show verified facts. Users can save films and rate the match, which will affect later rankings.

## 2. Core LLM feature and cost of errors

The core feature is natural-language intent matching. The LLM will identify the user's hard constraints and preferences, such as genre, setting, theme, emotional intensity, ending type, rating, runtime, and exclusions. The server will retrieve eligible films using facts from The Movie Database, or TMDB, and team-reviewed mood and ending tags. The LLM will rank only those candidates and explain each choice from supplied metadata. It cannot create a title, movie ID, rating, or plot fact.

An LLM suits this task because people describe mood in combinations that fixed filters handle poorly. The app will show its interpretation as editable search preferences before another search.

A nonexistent title or false rating can waste 5 to 15 minutes of checking. A wrong tone, ending, or content note can waste a 90 to 150 minute viewing session and expose the user to content they excluded, such as a suicide scene Minh asked to avoid. A watchlist error can be removed, but lost time and an unwanted viewing experience cannot be undone.

The system will reduce and measure these errors in four ways:

- The API will reject any recommendation whose TMDB ID is absent from the retrieved candidate set, and any explanation that cites a tag the film does not have.
- Factual fields will come from TMDB. The team will review subjective tags before a film enters the catalog.
- The interface will show matched constraints and flag uncertain interpretations.
- A 30-prompt labelled test set will measure valid IDs, hard-constraint accuracy, and Precision@5. Release targets are 100%, 90%, and 70% respectively, with zero results that break a user's exclusion. Linh runs it on every prompt or model change from PA#4. User feedback will record real-world mood fit.

## 3. Scope

### In scope this semester

- A responsive web app with sign-in, about 200 films, title search, and detail pages.
- Natural-language mood search, candidate retrieval, ranking, and evidence-based explanations.
- Verified TMDB data plus reviewed mood, theme, intensity, ending, and content tags.
- A watchlist, match feedback, simple preference reranking, automated tests, evaluation, and deployment.

### Out of scope this semester

- Film streaming, payments, and guaranteed real-time streaming availability.
- TV series, social or group features, reviews, and native mobile apps.
- Full TMDB coverage, model fine-tuning, and large-scale collaborative filtering.
- Unverified plot generation. CineMatch will not claim facts that are missing from its stored metadata.

## 4. Plan and ownership

| Checkpoint | Deliverable | Owner | Due date |
|---|---|---|---|
| PA#1. Proposal and plan | Linh: §1–2, README. Vu: §3, §5. Thai: §4, §6, self-assessment | Nguyen Phan Hung Linh | 2026-10-23 |
| PA#2. Harness and quality gates | Linh: scaffold, data model, migrations. Vu: conventions, lint, types, merge-blocking CI. Thai: tag guide, user flow, Vitest and Playwright | Vu Van Vu | 2026-11-27 |
| PA#3. LLM prototype | Linh: TMDB import, auth, catalog pages. Vu: intent extraction, prompt tests. Thai: retrieval, ranking, ID validation. Each reviews tags for about 67 films | Pham Ngoc Thai | 2026-12-11 |
| PA#4. Eval and guardrails | Linh: eval runner, report. Vu: budget cap, cache, fallback. Thai: red-team fixes. Each writes 10 of the 30 prompts | Nguyen Phan Hung Linh | 2026-12-18 |
| PA#5. Finalisation and operations | Linh: watchlist, feedback. Vu: preference reranking, end-to-end tests. Thai: deployment, logs, metrics, post-mortem | Vu Van Vu | 2026-12-25 |
| PA#6. Individual oral examination | Each member explains the other two members' code in a mock oral; demo rehearsal | Pham Ngoc Thai | 2026-12-31 (mock) |

Checkpoints are the syllabus's PA#1–PA#6. Dates after PA#1 assume one syllabus topic per week from session 2 (2026-10-15) and will be re-synced with Classroom. Each member owns two checkpoints and does a third of every checkpoint. Owners integrate and submit, and another member reviews each pull request.

## 5. Major risks and mitigation

1. **The catalog cannot support subjective requests.** TMDB does not reliably label loneliness, intensity, or bittersweet endings. Without those fields, the core search fails. This week, Vu and Thai will define a tag guide, independently label 20 films, resolve disagreements, and test 10 queries. If agreement is below 80%, they will simplify the taxonomy before catalog entry continues.

2. **The LLM invents evidence or fails during the demo.** Either failure removes the core value. This week, Linh will run 10 test prompts, five with exclusions, through `gpt-5-mini` against a fixed list of 30 candidate films. The run will count invented IDs and missed exclusions. Linh will also set a $5 hard budget limit on the OpenAI project. If any invented ID or missed exclusion appears, the candidate-ID allowlist and the deterministic fallback move to the start of PA#3. The app will identify degraded mode.

## 6. Technology choices

- **Next.js with TypeScript:** One typed codebase will handle the responsive UI, server routes, and validation.
- **Supabase Postgres and Auth:** Relational tables fit movies, tags, watchlists, and feedback. Its $0 plan's 500 MB database is enough for this catalog.
- **TMDB API:** It supplies stable IDs and factual movie data, free for attributed non-commercial use. CineMatch will show the required notice and logo.
- **OpenAI `gpt-5-mini`:** The model can interpret detailed mood requests at low cost. Input costs $0.25 per million tokens and output costs $2.00 per million tokens (OpenAI pricing page, checked 2026-10-22). At 5,000 input and 250 output tokens, one search costs about $0.00175 and 1,000 cost about $1.75. The cap is $5 per month.
- **Zod, Vitest, and Playwright:** These tools will validate model output, test ranking logic, and cover the search, save, and feedback flows.
- **Vercel:** Its $0 plan supplies direct Next.js deployment and pull-request previews for the class demo.
