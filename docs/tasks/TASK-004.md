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
    matching.test.ts — 85 unit tests for the matching engine
```

The engine is a pure function with no side effects, no I/O, and no dependency on React. It can be called from any context including server-side rendering or background workers.

Navigation change: `app/onboarding/[type].tsx` now routes to `/recommendations` on wizard completion instead of `/opportunities`. The `/recommendations` screen provides a "Browse full catalog" link to `/opportunities`.

---

## Matching algorithm

### Step 1 — Hard eligibility filter

An opportunity is excluded entirely if `opportunity.learnerEligibility.categories` does not include the learner's type (`high-school`, `university`, or `adult`). This check runs before any scoring. A high score never overrides this constraint.

### Step 2 — Substantive relevance gate

An opportunity must have at least one topical match signal to appear in personalized recommendations:

- Opportunity topics intersect the learner's goal-derived topics, OR
- Opportunity topics intersect the learner's career/study-area-derived topics.

**Location, budget, and learner-category membership alone cannot qualify an opportunity.** A learner whose profile matches no catalog topics receives the empty-state ("No recommendations yet") and a link to the full catalog. Location is a ranking signal only: it may add up to 10 points to an already-qualified recommendation but does not independently pass the gate.

### Step 3 — Scoring

Each passing opportunity receives a score (0–100) built from five independent components:

| Component | Weight | Condition |
|---|---:|---|
| Goal alignment | 40 | opportunity topics intersect goal-derived topics |
| Career/subject interest | 25 | opportunity topics intersect career-derived topics |
| Education level suitability | 15 | baseline — awarded to all learner-eligible items |
| Budget compatibility | 10 | opportunity price fits stated budget preference |
| Location relevance | 10 | Louisiana-specific opportunity + learner in Louisiana |

Maximum score: 100. Minimum score for any returned item: 15 (education baseline).

### Step 4 — Sort

Results are sorted:
1. Score descending
2. Verification status (`verified-official-source` before `needs-recheck`)
3. Title ascending (stable tie-breaking)
4. ID ascending (final tiebreaker)

This sort is deterministic: identical inputs always produce identical output.

---

## Eligibility rules

### Category compatibility versus confirmed eligibility

The engine assigns `eligibilityStatus: 'category-compatible'` to every recommendation. This status means:

> The learner's type is listed in `opportunity.learnerEligibility.categories`.

It does **not** mean:
- Prerequisites have been verified as satisfied.
- Provider-specific enrollment requirements have been checked.
- Institutional credit policies have been confirmed.
- Employer conditions or applicable law have been verified.

Category membership is the only eligibility fact the engine can confirm from catalog data. All other conditions must be verified by the learner with the provider, institution, or employer. Recommendation scores never imply confirmed eligibility.

The status `'eligibility-unconfirmed'` is reserved in the type for future catalog records with explicit prerequisites that have not been independently satisfied.

### Hard constraints (exclude before scoring)
- Learner category not in `opportunity.learnerEligibility.categories`

### Substantive relevance (exclude before scoring)
- No goal-topic or career/study-area-topic match (see Step 2 above)

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

**Location relevance (10%)** is a ranking signal only. It fires for Louisiana-specific opportunities when the learner selected Louisiana, adding up to 10 points to an already-topically-qualified result. It does not independently qualify an opportunity: a learner in Louisiana whose goal and career interests produce no catalog topic matches receives zero recommendations regardless of location.

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

- The catalog contains 5 verified records. Learners with interests in healthcare, business, arts, trades, and many other areas have no catalog topic matches; the substantive-match gate will produce an empty recommendations list for these profiles. The full catalog remains accessible at `/opportunities`.
- University study areas beyond `computer-science` and `engineering` produce no career topics with the current catalog. This will improve as the catalog grows.
- `responsible-vendor` training qualifies for Louisiana adult learners with `job-training` goal (goal-topic match) regardless of career interest. This is by design: the training is a statutory employment requirement for the described learner type.
- `eligibilityStatus: 'category-compatible'` does not imply all enrollment conditions are met. Individual prerequisites, provider conditions, and institutional or employer requirements must be confirmed separately.

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

File: `src/__tests__/matching.test.ts` — 85 tests in 17 suites.

| Suite | Coverage |
|---|---|
| Substantive match qualification | Budget-only excluded, category-only excluded, goal/career/location-only qualify |
| Louisiana hospitality compliance profile | Cisco excluded; RV only; exact T4-B1 reproduction |
| High school learner — explore-credit | Exact scores (MS=65, CLEP=55, Cisco=50); $97 not free |
| High school learner — build-career-skills | 2 results only; Modern States/CLEP excluded (no match) |
| University learner — explore-credit | Top-2 ordering, credit caveats on CLEP/Modern States |
| Adult — technology, Texas | 3 results; RV=65 pts; location-dependent caveat |
| Adult — technology, Louisiana | RV=75 pts; Cisco=50 pts; location match/caveat |
| Hard eligibility constraint | Category exclusion; unsupported learner type returns [] |
| Eligibility status (T4-B2) | category-compatible; not implying prerequisites satisfied |
| Missing optional fields | Null profiles → empty recommendations; null budget → no reason |
| Unknown-price budget handling | Unknown ≠ free; unknown matches flexible; not up-to-25/100 |
| Score bounds | All scores in [0, 100] across 7 substantive-match profiles |
| Determinism | Same answers → identical order and scores |
| Stable tie-breaking | Assert tie first (40=40), then title-ascending resolution |
| Explanation accuracy | Goal/career/budget/location reasons only when backed by data |
| Catalog integrity | 5 records, expected IDs, no mutation |
| Empty catalog | Returns [] for all learner types |

---

## Known limitations

1. **Browser-level UI testing not performed.** The recommendations screen is TypeScript-validated and Expo-web-exported, but interactive Chromium testing (keyboard navigation, focus indicators, accessibility tree) requires independent QA verification.
2. **Many profiles produce empty recommendations.** Only `technology` and `engineering` career interests and `prepare-college`/`explore-credit`/`job-training` goals map to current catalog topics. Healthcare, business, arts, trades, and many other profiles will reach the empty state and be directed to the full catalog.
3. **No learner-to-learner differentiation within a category.** A 9th grader and a 12th grader receive the same recommendations; grade is not used in scoring (the catalog does not distinguish by grade level).
4. **Unknown-price items with non-flexible budgets.** Louisiana RV training has an unknown price and will only receive a budget match reason from a learner who selected `flexible`.
5. **`category-compatible` does not imply all requirements are satisfied.** Prerequisites, employer conditions, institutional policies, and provider-specific requirements are not verified by the engine. All recommendations carry this caveat regardless of score.

---

## Future AI integration extension points

The matching engine is designed so an AI-assisted relevance layer can replace or augment the rule-based scoring without rewriting the core:

1. **`scoreGoal()` and `scoreCareer()`** — replace the topic-intersection logic with embedding cosine similarity. The function signature and return contract remain the same.
2. **`goalTopicsFor()` / `careerTopicsFor()`** — the topic arrays can be replaced with LLM-generated candidates, still validated against the catalog's known topics before scoring.
3. **Match reason labels** — template strings can be replaced with LLM-generated contextual explanations while keeping `MatchReason.field` for structured access.
4. **Hard eligibility filter** — this must remain rule-based regardless of AI involvement. AI scores never override the category check.

The engine is a pure function with typed inputs and outputs, making it straightforward to swap the internals without touching the UI or test surface.
