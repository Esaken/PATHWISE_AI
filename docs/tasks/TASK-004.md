# TASK-004: Personalized Opportunity Matching Engine

**Status:** Implementation complete — pending independent QA  
**Branch:** `feature/task-004-opportunity-matching`  
**Base:** `main` at `20145ec`  
**Owner:** Claude Code  
**Reviewer:** Codex CLI

---

## Objective and scope

Build a deterministic, explainable recommendation engine that matches learner onboarding answers with verified catalog opportunities and presents them in a personalized recommendations screen. No external AI API is used. The engine is rule-based and produces consistent, reproducible results.

Scope:
- Pure-TypeScript matching engine (`src/matching/`)
- Recommendations screen at `/recommendations`
- Post-onboarding navigation update (wizard now routes to `/recommendations`)
- Unit tests for all engine behaviors
- No changes to catalog data, catalog selectors, or existing onboarding architecture

Out of scope:
- Real-time catalog updates
- User accounts or persistent sessions
- LLM or embedding-based matching (extension points documented below)

---

## Architecture

```
src/
  matching/
    types.ts       — Recommendation, EligibilityStatus, EligibilityCaveat types
    engine.ts      — recommend(answers, catalog): Recommendation[]
  app/
    recommendations/
      index.tsx    — Recommendations screen (Expo Router route /recommendations)
  __tests__/
    matching.test.ts — 51 unit tests for the matching engine
```

The engine is a pure function with no side effects, no I/O, and no dependency on React. It can be called from any context including server-side rendering or background workers.

Navigation change: `app/onboarding/[type].tsx` now routes to `/recommendations` on wizard completion instead of `/opportunities`. The `/recommendations` screen provides a "Browse full catalog" link to `/opportunities`.

---

## Matching algorithm

### Step 1 — Hard eligibility filter

An opportunity is excluded entirely if `opportunity.learnerEligibility.categories` does not include the learner's type (`high-school`, `university`, or `adult`). This check runs before any scoring. A high score never overrides this constraint.

### Step 2 — Scoring

Each passing opportunity receives a score (0–100) built from five independent components:

| Component | Weight | Condition |
|---|---:|---|
| Goal alignment | 40 | opportunity topics intersect goal-derived topics |
| Career/subject interest | 25 | opportunity topics intersect career-derived topics |
| Education level suitability | 15 | baseline — awarded to all learner-eligible items |
| Budget compatibility | 10 | opportunity price fits stated budget preference |
| Location relevance | 10 | Louisiana-specific opportunity + learner in Louisiana |

Maximum score: 100. Minimum score for any returned item: 15 (education baseline).

### Step 3 — Sort

Results are sorted:
1. Score descending
2. Verification status (`verified-official-source` before `needs-recheck`)
3. Title ascending (stable tie-breaking)
4. ID ascending (final tiebreaker)

This sort is deterministic: identical inputs always produce identical output.

---

## Eligibility rules

### Hard constraints (exclude before scoring)
- Learner category not in `opportunity.learnerEligibility.categories`

### Eligibility caveats (surface to user; never block)
- `credit-not-guaranteed` — appears on `possible-institution-approval` opportunities; label is the catalog's own disclaimer text
- `confirm-with-employer` — appears on `certification-or-required-training` opportunities with the `responsible-vendor` topic
- `location-dependent` — appears when a Louisiana-specific opportunity is shown to a non-Louisiana learner; warns that the training is specific to Louisiana-based employment

Caveats are drawn from catalog fields only. No claim is invented.

---

## Scoring weights and rationale

**Goal alignment (40%)** is weighted highest because the learner's stated primary goal is the clearest signal of intent. Example: `explore-credit` → `alternative-credit` topic matches CLEP and Modern States strongly.

**Career/subject interest (25%)** captures domain preference. Example: `technology` career interest → `cybersecurity`, `networking`, `information-technology` topics match Cisco courses.

**Education level suitability (15%)** is a hard-filter baseline. All returned items have passed the category check, so this component establishes a floor score for any eligible result rather than differentiating between them.

**Budget compatibility (10%)** is a convenience signal, not a correctness constraint. An opportunity outside budget may still be valuable.

**Location relevance (10%)** is narrow: it only fires for Louisiana-specific opportunities with Louisiana adult learners, matching the current catalog's one jurisdiction-specific record.

---

## Goal-to-topic mapping

| Goal | Derived catalog topics |
|---|---|
| `prepare-college` | `alternative-credit` |
| `explore-credit` | `alternative-credit` |
| `job-training` | `responsible-vendor` |
| All other goals | *(none — career interest provides topics)* |

## Career interest / study area to topic mapping

| Career interest or study area | Derived catalog topics |
|---|---|
| `technology` | `cybersecurity`, `networking`, `information-technology` |
| `engineering` | `networking`, `information-technology` |
| `computer-science` (university study area) | `cybersecurity`, `networking`, `information-technology` |
| All others | *(none — no current catalog match)* |

---

## Data limitations

- The catalog contains 5 verified records. Learners with interests in healthcare, business, arts, trades, and many other areas will receive only the education-baseline score (15 pts) on any eligible item — they will still see recommendations, but without interest-specific reasons.
- University study areas beyond `computer-science` and `engineering` produce no career topics with the current catalog. This will improve as the catalog grows.
- `responsible-vendor` training ranks highly for Louisiana adult learners with `job-training` goal even when their career interest is unrelated to hospitality. This is by design: the training is a statutory employment requirement for the described learner type.
- Scores do not imply verified eligibility. All returned items have `eligibilityStatus: 'eligible'` based on the category check; individual enrollment requirements must be confirmed with the provider.

---

## User journey

```
Welcome (/) → learner type selection
  → Onboarding (/onboarding/[type]) → 3 steps + review + completion screen
    → Recommendations (/recommendations) → ranked cards with match reasons + caveats
      → Opportunity detail (/opportunities/[id])
      → Full catalog (/opportunities) via "Browse full catalog →" link
```

Back navigation works at every step. The recommendations screen redirects to `/` if no session answers are present (deep link or page refresh).

---

## Test coverage

File: `src/__tests__/matching.test.ts` — 51 tests in 15 suites.

| Suite | Coverage |
|---|---|
| High school learner — explore-credit | Category exclusion, goal/career scoring, budget reason |
| High school learner — build-career-skills | Goals with no topic mapping, career reasons only |
| University learner — explore-credit | Top-2 ordering, credit caveats on CLEP/Modern States |
| Adult — technology, Texas | Exclusion of uni-only items, location caveat for non-LA |
| Adult — technology, Louisiana | Location match reason, no location caveat |
| Adult — something-else, Louisiana | RV training ranks first; goal + location reasons |
| Hard eligibility constraint | All learner types exclude wrong-category items |
| Eligibility status | All items eligible; credit never presented as guaranteed |
| Missing optional fields | Null careerInterest/goal/budget — no crash, no fabricated reasons |
| Score bounds | All scores in [0, 100] across 9 answer profiles |
| Determinism | Same answers → identical order and scores |
| Stable tie-breaking | Tied-score items sorted by title ascending |
| Explanation accuracy | Goal/career/budget/location reasons only when backed by data |
| Catalog integrity | 5 records, expected IDs, no mutation |
| Empty catalog | Returns [] for all learner types |

---

## Known limitations

1. **Browser-level UI testing not performed.** The recommendations screen is TypeScript-validated and Expo-web-exported, but interactive Chromium testing (keyboard navigation, focus indicators, accessibility tree) requires independent QA verification.
2. **Narrow topic coverage.** Only `technology` and `engineering` career interests produce catalog topic matches. Other interests receive the education baseline score only.
3. **No learner-to-learner differentiation within a category.** A 9th grader and a 12th grader receive the same recommendations; grade is not used in scoring (the catalog does not distinguish by grade level).
4. **Unknown-price items with non-flexible budgets.** Louisiana RV training has an unknown price and will only receive a budget match reason from a learner who selected `flexible`.

---

## Future AI integration extension points

The matching engine is designed so an AI-assisted relevance layer can replace or augment the rule-based scoring without rewriting the core:

1. **`scoreGoal()` and `scoreCareer()`** — replace the topic-intersection logic with embedding cosine similarity. The function signature and return contract remain the same.
2. **`goalTopicsFor()` / `careerTopicsFor()`** — the topic arrays can be replaced with LLM-generated candidates, still validated against the catalog's known topics before scoring.
3. **Match reason labels** — template strings can be replaced with LLM-generated contextual explanations while keeping `MatchReason.field` for structured access.
4. **Hard eligibility filter** — this must remain rule-based regardless of AI involvement. AI scores never override the category check.

The engine is a pure function with typed inputs and outputs, making it straightforward to swap the internals without touching the UI or test surface.
