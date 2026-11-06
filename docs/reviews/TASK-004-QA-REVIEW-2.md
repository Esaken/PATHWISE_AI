# TASK-004 Independent QA Review 2

**Branch:** `feature/task-004-opportunity-matching`
**Remediation commit:** `33a3f88`
**Previous implementation:** `9e46aa4`
**Base:** `main` at `20145ec`
**Review date:** 2026-11-05
**Verdict:** **FAIL**

The remediation fixes baseline-only and budget-only qualification and corrects the eligibility status contract. It does not fully resolve relevance filtering: Louisiana location alone is deliberately treated as a substantive match. A healthcare learner seeking general skills therefore receives Louisiana Responsible Vendor Training as a personalized recommendation solely because Louisiana was selected. This violates the explicit QA acceptance condition.

## Blocker status

| ID | Status | Result |
|---|---|---|
| T4-B1 — irrelevant recommendations | **PARTIALLY RESOLVED / still blocking** | Baseline-only and budget-only records are excluded, but location-only records still qualify. Tracked below as T4-B3 for the remaining concrete defect. |
| T4-B2 — confirmed eligibility from category membership | **RESOLVED** | `eligible` was removed; the engine returns `category-compatible`, which is not rendered as confirmed eligibility. Caveats remain intact. |
| T4-B3 — location-only qualification | **OPEN / blocking** | Newly isolated remediation defect. Louisiana geography alone qualifies topically unrelated Responsible Vendor training. |

## T4-B3 — Location alone qualifies an unrelated opportunity

**Severity:** High / blocking

**Files:**

- `apps/mobile/src/matching/engine.ts:114-123`
- `apps/mobile/src/matching/engine.ts:223-225`
- `apps/mobile/src/matching/engine.ts:254-257`
- `apps/mobile/src/__tests__/matching.test.ts:170-183`

`hasSubstantiveMatch()` returns `true` when the learner selected Louisiana and an opportunity is Louisiana-specific, even if neither the learner goal nor career/study topics intersect the opportunity topics. The remediation test explicitly requires this behavior under the name `Louisiana location match qualifies responsible-vendor training`.

### Real Chromium reproduction

Production Expo web export, Chromium 156:

1. Select Adult learner.
2. Select `Healthcare or medical field`.
3. Select `Build general skills`.
4. Select `Flexible / show all options`.
5. Select `Louisiana`.
6. Finish onboarding.

**Expected:** Zero personalized recommendations because healthcare/general skills has no catalog evidence linking it to Responsible Vendor training. The existing empty state should offer the full catalog.

**Actual:** `/recommendations` displays exactly one result under **Your Recommendations**: Louisiana Responsible Vendor Training. Its explanations are only `Fits your budget preference` and `Available in Louisiana`. There is no goal, career, study-area, hospitality, alcohol-service, employer, or responsible-vendor interest match.

The resulting score is 35: education baseline 15 + flexible-budget 10 + location 10. Geography is therefore functioning as the sole qualifying signal and budget/baseline inflate the score after that qualification.

### Required remediation

Location may boost or filter an already topically relevant recommendation, but it must not independently pass the substantive relevance gate. Require a goal or career/study-area topic match before returning an item. For the required hospitality scenario, the `job-training` goal already supplies the responsible-vendor topic match; Louisiana can then add location relevance. Replace the location-only test with a negative test using the healthcare/general-skills/Louisiana profile.

## T4-B1 verification

### Source behavior

- Category membership is still a hard compatibility filter at `engine.ts:219-221`, but no longer independently qualifies a result.
- Budget is not part of `hasSubstantiveMatch()` and cannot independently qualify a result.
- Baseline and budget are added only after the relevance gate at `engine.ts:223-250`.
- Goal topics and career/study topics are checked through actual intersections with `Opportunity.topics` at `engine.ts:120-121` and again when score reasons are created.
- The remaining exception is location at `engine.ts:122`, which causes T4-B3.

### Required hospitality Chromium scenario

Profile: Something else / `Hospitality compliance` / Complete job-related training / Flexible / Louisiana.

**PASS:** Exactly one recommendation was displayed: Louisiana Responsible Vendor Training. Both Cisco records were absent. The result showed goal, budget, and Louisiana explanations and retained the employer/legal caveat.

Observed accessibility tree:

- Heading: `Your Recommendations`
- Link: `Browse the full opportunity catalog`
- One button: `View details for Louisiana Responsible Vendor Training by ATC-Approved Responsible Vendor Training Providers`

Space on the focused recommendation opened `/opportunities/louisiana-atc-responsible-vendor`. The detail retained the statutory and employer-confirmation language.

### Empty state

The same healthcare/general-skills profile without Louisiana produced zero results and rendered:

- `No recommendations yet`
- The honest no-match explanation
- `Browse all opportunities`

Mouse activation of the empty-state control navigated to `/opportunities`. This confirms the existing empty state works when the defective location-only gate is not triggered.

## T4-B2 verification

**Status: RESOLVED.**

- `matching/types.ts:3-9` defines only `category-compatible` and `eligibility-unconfirmed` and explicitly states that prerequisites, provider conditions, institutional policies, and employer requirements are not independently verified.
- `matching/engine.ts:264` assigns `category-compatible`; it no longer emits `eligible`.
- Repository-wide inspection found no product consumer that renders `eligibilityStatus`. The field is currently consumed only by matching tests.
- `category-compatible` therefore does not appear as a user-facing eligibility claim.
- CLEP and Modern States retain `credit-not-guaranteed` caveats.
- Responsible Vendor retains the employer/current-law caveat.
- Non-Louisiana Responsible Vendor results retain the location caveat.
- The runtime UI did not claim that prerequisites, employer conditions, institutional policies, credit, or credentials were confirmed.

One semantic limitation remains nonblocking: `eligibility-unconfirmed` is defined but never selected. Every returned item is `category-compatible`, including records with explicit prerequisites. This is not currently user-facing, but future consumers should treat the status and catalog eligibility notes together.

## Independent scoring verification

The following totals were verified from the score branches and catalog topics/prices, and the representative automated assertions passed:

| Profile/result | Components | Score | Result |
|---|---|---:|---|
| Louisiana hospitality — Responsible Vendor | baseline 15 + goal 40 + flexible budget 10 + Louisiana 10 | **75** | PASS; only result |
| High-school credit — Modern States | baseline 15 + goal 40 + free budget 10 | **65** | PASS; rank 1 |
| High-school credit — CLEP | baseline 15 + goal 40; $97 does not satisfy Free only | **55** | PASS; rank 2 |
| High-school credit — each Cisco course | baseline 15 + technology career 25 + free budget 10 | **50** | PASS; stable title order |
| Adult technology/Texas — Responsible Vendor | baseline 15 + job-training goal 40 + flexible budget 10 | **65** | PASS; location caveat, no location points |
| Adult technology/Texas — each Cisco course | baseline 15 + technology career 25 + flexible budget 10 | **50** | PASS |
| No goal/career/location substantive match | no qualifying signal | — | PASS; empty |
| Healthcare/general-skills/Louisiana — Responsible Vendor | baseline 15 + budget 10 + location 10 | **35** | **FAIL; should not qualify** |

Unknown-price handling is correct: Responsible Vendor price is displayed as `Price not confirmed`; it receives budget points only for Flexible, not Free, Up to $25, or Up to $100.

Ordering remains deterministic: score descending, official verification before needs-recheck, title ascending, then ID ascending at `engine.ts:269-277`.

## Test quality review

### Improved and meaningful coverage

The expanded matching suite now enforces:

- Category-only, baseline-only, and budget-only empty results.
- Exact representative scores for the required profiles.
- Hard learner-category exclusions and unsupported learner types.
- Missing optional fields.
- Unknown-price behavior for all budget bands.
- Score bounds and deterministic ordering.
- A real asserted score tie followed by title ordering.
- `category-compatible` status and preserved credit caveats.
- Empty catalog behavior.

### Problematic or missing coverage

- **Location-only coverage enforces the defect:** `matching.test.ts:170-183` expects location alone to qualify Responsible Vendor training. There is no negative healthcare/general-skills/Louisiana adversarial test.
- Unknown location is covered indirectly through null/Texas profiles, but there is no custom opportunity with unknown jurisdiction metadata.
- The prerequisite test checks only the status string and CLEP caveat. It does not use a custom record with explicit unmet prerequisites to prove such a record is never reported as confirmed eligible.
- No custom malformed/incomplete verification-metadata record is exercised. Because the production schema is statically typed and catalog validation belongs to TASK-003, this is a coverage gap rather than a newly demonstrated crash.
- `eligibility-unconfirmed` has no behavioral test or assignment path.

## Chromium regression evidence

The current production export was served locally and exercised through real Chromium mouse and keyboard events plus Chromium accessibility-tree inspection.

### Navigation and functionality

- Adult hospitality onboarding → recommendations: PASS.
- Recommendation ordering/content: PASS for hospitality; FAIL for adversarial location-only profile.
- Empty-state catalog navigation: PASS.
- Recommendation detail navigation: PASS with Space and mouse activation.
- Missing-session direct `/recommendations` navigation: PASS; redirected to `/`.
- No JavaScript runtime exception was captured during the completed scenarios.

### Accessibility

- Recommendation heading, catalog link, and recommendation cards had appropriate roles and accessible names.
- Tab reached the catalog link and then the recommendation button.
- Catalog link showed the custom purple/white focus ring.
- Recommendation button showed a visible native focus outline.
- Space activation opened the opportunity detail.
- **Enter activation: NOT VERIFIED.** The CDP Enter injection used during this review did not produce navigation, but the same environment also failed to generate a native button click with a directly focused standard button. This is insufficient to distinguish an application defect from the automation input limitation, so it is not reported as a new blocker.

### Responsive layout

Fresh production-export measurements on the hospitality recommendation screen:

| Viewport | document clientWidth | document scrollWidth | Card bounds | Result |
|---|---:|---:|---|---|
| 390×844 | 390 | 390 | x=16, width=358, height=256 | PASS |
| 768×1024 | 768 | 768 | x=16, width=736, height=235 | PASS |
| 1440×900 | 1440 | 1440 | x=336, width=768, height=235 | PASS |

No horizontal overflow or clipping was observed. Recommendation controls exceeded the 44×44 target minimum.

Inherited TASK-001 B3/B4 and TASK-002 label debt remain separate and are neither relabeled nor closed here.

## Automated validation

All commands ran independently from `apps/mobile` at `33a3f88`.

| Command | Exit | Evidence |
|---|---:|---|
| `npm.cmd test -- --runInBand` | 0 | 5 suites passed; **285/285 tests passed**; 0 snapshots; 71.35 s |
| `npx.cmd tsc --noEmit` | 0 | No diagnostics |
| `npm.cmd run lint` | 0 | Expo lint completed without findings |
| `npm.cmd ls --depth=0` | 0 | Dependency tree resolved with no unmet/extraneous package reported |
| `npx.cmd expo export --platform web` | 0 | 10 web bundles, 7 static routes, `dist` exported |

`git diff --check 9e46aa4..33a3f88` passed for the remediation delta. `git diff --check main...33a3f88` reports trailing whitespace in `docs/reviews/TASK-004-QA-REVIEW-1.md:3-6,15,37`; this documentation file entered the branch in the remediation commit and remains a repository-hygiene issue, not a product blocker.

## Limitations

- Enter activation remains NOT VERIFIED as described above.
- No native Android/iOS build or physical-device screen reader was available.
- A full packet capture was not performed; matching remains local and no new external request/storage mechanism was found in the remediation delta.
- Exhaustive TASK-002 Back/Forward and Save/Cancel cycles and every TASK-003 filter combination were not repeated. The shared automated regression suite passed, and onboarding, catalog navigation, and details were exercised in Chromium.

## Final decision

**FAIL.** T4-B2 is resolved and most of T4-B1 is remediated, but T4-B3 violates the explicit requirement that Louisiana geography alone must not qualify a topically unrelated opportunity. Remove location as an independent substantive qualifier, replace the location-only positive test with the required negative adversarial case, and return the branch for independent QA.
