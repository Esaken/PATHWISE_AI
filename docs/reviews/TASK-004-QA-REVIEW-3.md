# TASK-004 Independent QA Review 3

**Branch:** `feature/task-004-opportunity-matching`
**Commit:** `66f921f`
**Previous commit:** `33a3f88`
**Base:** `main` at `20145ec`
**Review date:** 2026-11-05
**Verdict:** **PASS WITH NONBLOCKING ISSUES**

TASK-004's matching, relevance, and eligibility-safety blockers are resolved. The mandatory location-only adversarial profile produced the empty state in the production export, while the hospitality, Texas technology, and high-school credit profiles retained the expected recommendations and safety caveats. No new TASK-004 blocker was found.

Enter activation remains **NOT VERIFIED** because Chromium DevTools key injection was inconclusive; Space, Tab, mouse activation, focus visibility, roles, names, layout, and navigation were independently verified. Inherited TASK-001 B3/B4 and TASK-002 label debt remain outside TASK-004 acceptance and are not closed here.

## Blocker status

| Finding | Status | Evidence |
|---|---|---|
| T4-B1 — baseline/budget/category-only recommendations | **RESOLVED** | The substantive gate runs before baseline and budget scoring and accepts only goal-topic or career/study-topic intersections. Browser no-match profile rendered zero results. |
| T4-B2 — category membership presented as confirmed eligibility | **RESOLVED** | Engine emits `category-compatible`, never `eligible`; the status is not rendered as confirmed eligibility. Existing caveats remain visible. |
| T4-B3 — location-only recommendations | **RESOLVED** | Location was removed from `hasSubstantiveMatch()`. Healthcare/general-skills/Louisiana returned zero results in Chromium. |

## Source verification

### Relevance gate

`apps/mobile/src/matching/engine.ts:114-122` now requires one of two evidence-based intersections:

- opportunity topics intersect goal-derived topics; or
- opportunity topics intersect career/study-area-derived topics.

Location is no longer an argument or qualifying branch. At `engine.ts:219-225`, learner-category membership remains a hard pre-filter and `hasSubstantiveMatch()` runs before any score is added. Consequently:

- category compatibility alone cannot qualify;
- the 15-point education baseline cannot qualify;
- budget compatibility cannot qualify; and
- location cannot qualify.

After topical qualification, budget and Louisiana location may add score at `engine.ts:248-257`. The hard learner-category exclusion at `engine.ts:219-221` remains intact.

Goal, career, and study-area signals are mapped to catalog `Topic` values and checked through `topicsIntersect()` at `engine.ts:63-87` and `:120-121`; displayed reasons are added only when the same intersection succeeds at `:230-245`.

### Eligibility semantics

`apps/mobile/src/matching/types.ts:3-9` retains the conservative `category-compatible | eligibility-unconfirmed` union and explicitly states that category compatibility does not verify prerequisites, provider conditions, institutional policy, or employer requirements. `engine.ts:264` assigns `category-compatible`.

A repository-wide search found no UI consumer that renders this field as an eligibility claim. No recommendation is labeled `eligible`. Credit, employer, and location caveats remain derived separately from catalog data.

## Chromium evidence

The fresh Expo production export at `66f921f` was served locally and tested in Chromium 156 using real pointer and keyboard events, computed layout inspection, and the Chromium accessibility tree.

### Scenario A — Healthcare/general skills/Louisiana

Profile: Adult / Healthcare or medical field / Build general skills / Flexible / Louisiana.

**PASS.** `/recommendations` displayed:

- `0 results`;
- `No recommendations yet`;
- the honest no-match explanation; and
- `Browse all opportunities`.

Louisiana Responsible Vendor Training was absent. Mouse activation of `Browse all opportunities` navigated to `/opportunities`. The accessibility tree exposed the empty-state control as a named button, the full-catalog control as a link, and `Your Recommendations` as a heading.

### Scenario B — Hospitality compliance/Louisiana

Profile: Adult / Something else / `Hospitality compliance` / Complete job-related training / Flexible / Louisiana.

**PASS.** Exactly one result appeared: Louisiana Responsible Vendor Training. Cisco courses were absent. Visible reasons were:

- `Aligns with your goal to complete job-related training`;
- `Fits your budget preference`; and
- `Available in Louisiana`.

The UI displayed `Price not confirmed` and `Duration not confirmed`. The Responsible Vendor employer/legal disclaimer remained visible. The accessibility tree exposed one accurately named recommendation button. Space activation opened `/opportunities/louisiana-atc-responsible-vendor`.

Independent score evaluation: baseline 15 + goal 40 + flexible budget 10 + Louisiana 10 = **75**.

### Scenario C — Adult technology/Texas

Profile: Adult / Technology or computing skills / Complete job-related training / Flexible / Texas.

**PASS.** Three results appeared in the expected order:

1. Responsible Vendor — **65**: baseline 15 + goal 40 + budget 10; no Louisiana points.
2. Introduction to Cybersecurity — **50**: baseline 15 + career 25 + budget 10.
3. Networking Basics — **50**: baseline 15 + career 25 + budget 10.

Responsible Vendor did not display `Available in Louisiana`; it retained the non-Louisiana location caveat instructing the learner to confirm Louisiana employment/vendor conditions.

### Scenario D — High-school college credit

Profile: High school / 12th grade / Technology & Computing / Explore courses that may be eligible for college credit / Free only.

**PASS.** Four results appeared in the expected order:

1. Modern States — **65**: baseline 15 + goal 40 + free budget 10.
2. CLEP — **55**: baseline 15 + goal 40; no free-budget points.
3. Introduction to Cybersecurity — **50**.
4. Networking Basics — **50**.

CLEP displayed `$97`, not Free, and had no budget reason. CLEP and Modern States displayed `Potential credit — confirm with institution/advisor` and `Credit is not guaranteed...`. Cisco records remained `Skills only`.

### Scenario E — Missing session

**PASS.** A full direct navigation to `/recommendations` without an onboarding session redirected to `/`.

### Accessibility, navigation, and layout

- Tab reached the full-catalog link and then the recommendation card.
- The catalog link showed a purple/white focus ring.
- The recommendation card showed a visible native focus outline.
- Space activated the focused recommendation card and opened its detail route.
- Mouse activation worked for onboarding, empty-state catalog navigation, and recommendation controls.
- Chromium exposed recommendation cards as buttons with names in the form `View details for [title] by [provider]`.
- No JavaScript runtime exception was captured.
- No horizontal overflow was observed:

| Viewport | clientWidth | scrollWidth | Recommendation card |
|---|---:|---:|---|
| 390×844 | 390 | 390 | width 358, height 256 |
| 768×1024 | 768 | 768 | width 736, height 235 |
| 1440×900 | 1440 | 1440 | width 768, height 235, centered |

All measured recommendation/empty-state controls met or exceeded 44×44 px.

**Enter activation: NOT VERIFIED.** DevTools Enter injection did not reliably produce native button activation in this environment, including when focus was assigned directly. This does not provide sufficient evidence to classify application behavior as PASS or FAIL. Space and mouse activation were verified.

## Scoring, ordering, and safety assessment

- Exact representative scoring matches the required 40/25/15/10/10 model.
- Budget and location points are applied only after topical qualification.
- Unknown price is never treated as Free; it matches only the Flexible budget preference.
- Sorting remains deterministic: score descending, official verification status, title ascending, then stable ID.
- Hard learner-category filtering remains enforced.
- No invented opportunity, price, deadline, guarantee, credential, or employment outcome appeared.
- High scores do not render confirmed eligibility.
- Credit, employer, non-Louisiana, unknown-price, and unknown-duration caveats remained intact.

## Test-quality review

The updated tests genuinely enforce:

- location-only exclusion using the exact healthcare/general-skills/Louisiana adversarial profile (`matching.test.ts:170-183`);
- budget-only exclusion;
- baseline/category-only exclusion;
- goal-topic qualification;
- career/study-area topic qualification;
- +10 Louisiana points only after goal qualification, with a total score of 75;
- hard category filtering and unsupported learner inputs;
- exact representative scores, including CLEP receiving no Free-budget points;
- unknown-price behavior across all budget choices;
- deterministic repeatability and a real 40-point tie resolved by title; and
- conservative `category-compatible` eligibility semantics with credit caveats.

Remaining nonblocking coverage limitations from Review 2 persist: there is no custom malformed verification-metadata record test, and `eligibility-unconfirmed` is reserved but has no assignment path. Catalog validation for production records remains covered by the TASK-003 suite.

## Automated validation

All commands were run independently at `66f921f`.

| Command | Exit code | Evidence |
|---|---:|---|
| `npm.cmd test -- --runInBand` | 0 | 5 suites; **286/286 tests passed**; 0 snapshots; 75.04 s |
| `npx.cmd tsc --noEmit` | 0 | No diagnostics |
| `npm.cmd run lint` | 0 | Expo lint completed without findings |
| `npm.cmd ls --depth=0` | 0 | Dependency tree resolved; no unmet/extraneous dependency reported |
| `npx.cmd expo export --platform web` | 0 | 10 bundles; 7 static routes; production `dist` exported |
| `git diff --check main...HEAD` | 0 | No whitespace errors |

## Remaining limitations and nonblocking issues

1. Enter activation is NOT VERIFIED due to the browser-automation limitation described above.
2. Native Android/iOS builds and physical-device screen readers were not run.
3. A full network packet capture was not performed; the remediation contains no new external-request or persistence mechanism.
4. Exhaustive TASK-002 browser-history/Save/Cancel cycling and every TASK-003 filter combination were not repeated. The full 286-test regression suite passed, and the shared onboarding, catalog, and detail paths were exercised in Chromium.
5. `eligibility-unconfirmed` remains unused and should be handled deliberately if future catalog records require a stronger distinction than category compatibility.

## Merge recommendation

**TASK-004 is QA-approved on its feature branch and is ready to merge into `main` from a TASK-004 scope perspective, subject to product-owner approval.** No merge was performed.

This approval does not close or waive inherited release blockers TASK-001 B3/B4 or the TASK-002 labeling debt. Those remain separate from TASK-004 acceptance and must be handled according to the existing release plan.
