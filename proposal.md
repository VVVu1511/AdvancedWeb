# PA#1: CineMatch proposal and planning

**Course:** CSC13114  
**Project:** CineMatch, find a movie that matches your mood  
**Team:** 
-  
-
-  
**Repository:** https://github.com/VVVu1511/AdvancedWeb/tree/PA01

## 1. Problem and users

Minh is a university student who opens a streaming service after 10 p.m. but spends 20 to 30 minutes comparing categories, trailers, ratings, and recommendation lists. He can describe the experience he wants, but ordinary title and genre filters cannot turn that description into a trustworthy shortlist.

The primary users are students and young adults who know the tone, theme, setting, or ending they want but not a title. They currently ask friends, browse streaming categories, search the web, or prompt a general chatbot. These options require manual checking and may return invented titles or unsupported claims.

CineMatch will accept a request such as, "I want a highly rated school romance about loneliness, with a bittersweet ending, but nothing too depressing." It will return up to five real films from a controlled catalog. Each result will explain the match and show verified facts. Users can save films and rate the match, which will affect later rankings.

## 2. Core LLM feature and cost of errors

The core feature is natural-language intent matching. The LLM will identify the user's hard constraints and preferences, such as genre, setting, theme, emotional intensity, ending type, rating, runtime, and exclusions. The server will retrieve eligible films using facts from The Movie Database, or TMDB, and team-reviewed mood and ending tags. The LLM will rank only those candidates and explain each choice from supplied metadata. It cannot create a title, movie ID, rating, or plot fact.

An LLM suits this task because people describe mood in combinations that fixed filters handle poorly. The app will show its interpretation as editable search preferences before another search.

A nonexistent title or false rating can waste 5 to 15 minutes of checking. A wrong tone, ending, or content note can waste a 90 to 150 minute viewing session and expose the user to content they excluded. A watchlist error can be removed, but lost time and an unwanted viewing experience cannot be undone.

The system will reduce and measure these errors in four ways:

- The API will reject any recommendation whose TMDB ID is absent from the retrieved candidate set.
- Factual fields will come from TMDB. The team will review subjective tags before a film enters the catalog.
- The interface will show matched constraints and flag uncertain interpretations.
- A 30-prompt labelled test set will measure valid IDs, hard-constraint accuracy, and Precision@5. Release targets are 100%, 90%, and 70% respectively. User feedback will record real-world mood fit.

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
| 1. Proposal and repository baseline | Approved scope, risk register, project board, README, and branch rules | [Member 1 name] | 2026-10-23 |
| 2. Requirements and UX | IA#1, user flow, wireframes, data model, tag taxonomy, and acceptance tests | [Member 2 name] | 2026-11-02 |
| 3. Catalog prototype | TMDB import, 50 reviewed films, catalog pages, authentication, and database migration | [Member 3 name] | 2026-11-16 |
| 4. Core LLM feature | Intent extraction, retrieval and ranking pipeline, ID validation, and prompt tests | [Member 1 name] | 2026-11-30 |
| 5. Integrated MVP | 200 reviewed films, watchlist, feedback, preference reranking, and end-to-end tests | [Member 2 name] | 2026-12-14 |
| 6. Evaluation and release | Run the 30-prompt evaluation, fix release blockers, deploy, document, and rehearse the demo | [Member 3 name] | 2026-12-28 |

Each owner is accountable for integration and evidence. Other work will be tracked as project-board tasks and reviewed pull requests.

## 5. Major risks and mitigation

1. **The catalog cannot support subjective requests.** TMDB does not reliably label loneliness, intensity, or bittersweet endings. Without those fields, the core search fails. This week, [Member 2] and [Member 3] will define a tag guide, independently label 20 films, resolve disagreements, and test 10 queries. If agreement is below 80%, they will simplify the taxonomy before catalog entry continues.

2. **The LLM invents evidence or fails during the demo.** Either failure removes the core value. This week, [Member 1] will implement constraint checks, a candidate-ID allowlist, a metadata-only prompt, a response cache, and a deterministic fallback. The app will identify degraded mode, and a budget cap will stop excess spending.

## 6. Technology choices

- **Next.js with TypeScript:** One typed codebase will handle the responsive UI, server routes, and validation.
- **Supabase Postgres and Auth:** Relational tables fit movies, tags, watchlists, and feedback. Its $0 plan's 500 MB database is enough for this catalog.
- **TMDB API:** It supplies stable IDs and factual movie data, free for attributed non-commercial use. CineMatch will show the required notice and logo.
- **OpenAI `gpt-5-mini`:** The model can interpret detailed mood requests at low cost. Input costs $0.25 per million tokens and output costs $2.00 per million tokens. At 5,000 input and 250 output tokens, one search costs about $0.00175 and 1,000 cost about $1.75. The cap is $5 per month.
- **Zod, Vitest, and Playwright:** These tools will validate model output, test ranking logic, and cover the search, save, and feedback flows.
- **Vercel:** Its $0 plan supplies direct Next.js deployment and pull-request previews for the class demo.
