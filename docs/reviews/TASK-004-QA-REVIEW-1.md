# TASK-004 Independent QA Review 1

**Branch:** `feature/task-004-opportunity-matching`
**Implementation:** `9e46aa4`
**Base:** `main` at `20145ec`
**Review date:** 2026-11-05
**Verdict:** **FAIL**

TASK-004 is not ready for integration. The implementation is deterministic, technically stable, and passes all automated gates, but it presents category-compatible opportunities with no goal, career, study-area, or location relevance as personalized recommendations. It also assigns the internal status `eligible` based only on broad learner-category membership. These are recommendation-accuracy and eligibility-safety defects, not inherited TASK-001 issues.

## Blocking findings

### T4-B1 — Topically irrelevant opportunities are presented as personalized recommendations

**Severity:** High / blocking
**Files:** `apps/mobile/src/matching/engine.ts:208`, `apps/mobile/src/matching/engine.ts:229`, `apps/mobile/src/matching/engine.ts:241`, `apps/mobile/src/app/recommendations/index.tsx:129`

Every category-compatible record starts with 15 points and is returned even when it has no goal, career/study-area, or location match. A flexible budget can add another 10 points to an otherwise irrelevant record. The UI then labels the complete result set **Your Recommendations**.

**Real Chromium reproduction (production export):**

1. Select Adult learner.
2. Enter `Hospitality compliance` for Something else.
3. Select Complete job-related training, Flexible / show all options, and Louisiana.
4. Finish onboarding.

**Expected:** Louisiana Responsible Vendor Training is recommended. Unrelated cybersecurity/networking records are absent or explicitly separated as general catalog items, not personalized matches.

**Actual:** Three personalized results are shown. The two Cisco records have no goal, career, study, or location explanation; their only explanation is `Fits your budget preference`. They receive 25 points (15 baseline + 10 budget). The same behavior is codified by the engine returning every category-compatible record.

This becomes more misleading for healthcare, arts, business, trades, or missing-interest profiles: records can appear with only the 15-point baseline and no user-facing match reason. `docs/tasks/TASK-004.md:131` and `:179` acknowledge this behavior, but documenting it does not satisfy recommendation relevance.

**Required remediation:** Define a relevance threshold independent of category compatibility. A returned personalized recommendation must have at least one substantive goal, career/study-area, or applicable-location match. Budget and education/category compatibility must not independently qualify an item. When no substantive matches exist, show the existing empty state and full-catalog option. Add tests for no-topic-match and budget-only profiles.

### T4-B2 — Broad category membership is recorded as confirmed `eligible`

**Severity:** High / blocking
**Files:** `apps/mobile/src/matching/types.ts:3`, `apps/mobile/src/matching/engine.ts:205`, `apps/mobile/src/matching/engine.ts:245`, `apps/mobile/src/__tests__/matching.test.ts:286`

The hard filter correctly excludes records whose catalog category does not include the learner type. However, every remaining record is assigned `eligibilityStatus: 'eligible'`. Learner-category compatibility does not prove that prerequisites, employer conditions, institutional policy, or provider-specific requirements are satisfied. The test at `matching.test.ts:287-293` explicitly requires this unsafe interpretation.

The current recommendations page does not render the status, which limits immediate UI harm, and the visible CLEP/Modern States and Louisiana caveats are accurate. Nevertheless, the typed recommendation result makes a stronger claim than the available data supports and can be surfaced by subsequent UI work.

**Expected:** Category compatibility and confirmed eligibility are distinct. A high score must not imply prerequisites or eligibility have been verified.

**Required remediation:** Replace `eligible` with a truthful status such as `category-compatible`/`eligibility-unconfirmed`, or derive `unknown` unless all relevant requirements are actually represented and satisfied. Update tests to reject confirmed eligibility based only on category membership. Preserve the visible credit, employer, and location caveats.

## Nonblocking findings and test-quality gaps

### T4-N1 — Required boundary coverage is incomplete or weak

**Files:** `apps/mobile/src/__tests__/matching.test.ts:237`, `:338`, `:375`, `:416`, `:461`

The new tests cover the three main profiles, hard category filtering, missing optional fields, bounds, determinism, title tie-breaking, explanations, and empty catalog. However:

- No test asserts the exact 40/25/15/10/10 component totals or representative final scores.
- The test named `Cisco courses rank above Louisiana RV` only checks that two values are numbers (`:237-243`), so it cannot detect an ordering regression.
- No test exercises an unknown-price record under every budget choice, especially verifying that unknown is never free.
- No custom record tests unknown location, an explicit prerequisite/restriction, or incomplete verification metadata.
- Unsupported learner-category behavior is not tested at the runtime boundary.
- The tie test conditionally skips its assertion if its setup fails to produce a tie (`:383`), rather than first asserting the tie.
- No test requires topically irrelevant/baseline-only results to be excluded; current tests instead expect them.

These gaps should be addressed with T4-B1/B2 remediation. They are not separate evidence that the present implementation crashes.

### T4-N2 — Documentation whitespace

`git diff --check main...HEAD` reports trailing whitespace in `docs/tasks/TASK-004.md:3-5`.

## Matching and scoring assessment

- **Hard learner-category filter:** PASS. `engine.ts:205-206` excludes categories not explicitly listed.
- **Goal alignment (40):** PASS by code inspection and observed ranking. `explore-credit` maps to alternative credit; `job-training` maps to responsible vendor.
- **Career/study alignment (25):** PASS for implemented technology/engineering/computer-science mappings.
- **Education baseline (15):** Mechanically correct, but FAIL as a recommendation qualifier (T4-B1).
- **Budget compatibility (10):** PASS mechanically. Unknown price receives budget points only for `flexible`; Chromium displayed `Price not confirmed`, never Free.
- **Location relevance (10):** PASS. A Louisiana selection produced `Available in Louisiana`; no non-Louisiana caveat appeared for that profile.
- **0–100 bounds:** PASS. The additive weights total 100 and all automated bound cases passed. There is no proportional rescaling; normalization is the bounded additive total.
- **Deterministic ordering:** PASS. Score descending, verified status, title, then ID are explicit at `engine.ts:250-258`.
- **Missing/unknown input:** No crash in covered tests; unknown price is honest. Relevance remains unsafe because baseline-only results are returned.
- **Explanations:** Displayed reasons were supported by onboarding answers and catalog data in the three browser scenarios. No fabricated opportunity, price, deadline, credential, or outcome was observed.

## Eligibility and claims assessment

- CLEP and Modern States displayed `Potential credit — confirm with institution/advisor` and `Credit is not guaranteed...` in both recommendations and details.
- Cisco records displayed `Skills only` and were not represented as college-credit opportunities.
- Louisiana Responsible Vendor displayed `Price not confirmed`, `Duration not confirmed`, the four-year server-permit/statutory caveat, and employer/current-law confirmation language.
- Louisiana matching showed `Available in Louisiana` and retained the employer-related caveat.
- No UI claim stated that an unknown price was free.
- T4-B2 remains because the internal status claims eligibility from category membership alone.

## Chromium evidence

Browser: headless Chromium `156.0.8078.80`, production Expo export served locally. Interactions used Chromium mouse and keyboard input through the DevTools protocol; DOM text, computed layout, focus styles, and the Chromium accessibility tree were inspected.

### Scenario A — High school

Profile: 12th grade / Explore courses that may be eligible for college credit / Technology & Computing / Free only.

- Reached `/recommendations` with four results.
- Ranking: Modern States, CLEP, Introduction to Cybersecurity, Networking Basics.
- Modern States and CLEP showed the college-credit caveat; Cisco showed Skills only.
- Mouse interaction completed onboarding and card/detail navigation.
- Space on the focused Modern States recommendation navigated to `/opportunities/modern-states-clep-prep`.
- Detail content retained the non-guarantee and institution-confirmation language.

### Scenario B — Adult learner

Profile: Something else (`Hospitality compliance`) / Complete job-related training / Flexible / Louisiana.

- Reached `/recommendations`; Responsible Vendor ranked first.
- Explanation included goal, budget, and `Available in Louisiana`.
- Employer/legal caveat remained visible; no non-Louisiana caveat was shown.
- T4-B1 reproduced: two unrelated Cisco records were also presented solely with a budget explanation.

### Scenario C — University learner

Profile: Computer Science / possible college-credit goal / Technology / Flexible.

- Reached `/recommendations` with CLEP and Modern States first, followed by the two relevant Cisco skills courses.
- Credit and skills-only classifications remained distinct.

### Scenario D — Missing session

Direct navigation to `/recommendations` after a fresh production-page load redirected safely to `/`; no recommendation content flashed in the captured state.

### Accessibility and layout

- Chromium accessibility tree exposed the heading, one catalog link, and recommendation cards as named buttons (for example, `View details for ... by ...`).
- Sequential Tab reached the catalog link and recommendation card.
- The catalog link had a visible custom purple/white focus ring. Recommendation cards retained a visible native focus outline.
- Space activated the focused recommendation card. Mouse activation also worked. Enter was not separately instrumented in this review and is listed as a limitation below.
- Measured recommendation layouts:
  - 390×844: `scrollWidth=390`, `clientWidth=390`; cards 358 px wide.
  - 768×1024: `scrollWidth=768`, `clientWidth=768`; cards 736 px wide.
  - 1440×900: `scrollWidth=1440`, `clientWidth=1440`; cards capped at 768 px wide.
- No horizontal overflow was observed. Recommendation card targets were 235–257 px high and the catalog target is coded with 44 px minimum height. No target under 44×44 was found on the recommendations screen.
- No JavaScript runtime exception was captured during the four scenarios.

TASK-001 B3/B4 are inherited release blockers and are not relabeled or closed by this report. The TASK-002 Back/Cancel wording debt also remains separate. TASK-004 introduced the custom focus ring used on its catalog link; T4 findings above concern matching accuracy and eligibility semantics.

## Automated validation

All commands were run independently from `apps/mobile` at `9e46aa4`.

| Gate | Result | Evidence |
|---|---|---|
| `npm.cmd test -- --runInBand` | PASS, exit 0 | 5 suites; 260/260 tests; 0 snapshots; 64.51 s |
| `npx.cmd tsc --noEmit` | PASS, exit 0 | No diagnostics |
| `npm.cmd run lint` | PASS, exit 0 | Expo lint completed without findings |
| `npm.cmd ls --depth=0` | PASS, exit 0 | Dependency tree resolved; no unmet/extraneous dependency reported |
| `npx.cmd expo export --platform web` | PASS, exit 0 | 10 web bundles; 7 static routes; exported `dist` |

No new production dependency was introduced by the TASK-004 diff. Static inspection found no `fetch`, Axios, browser storage, cookie, or AsyncStorage use in the matching, recommendations, onboarding, or session-context paths. Existing onboarding answers are placed in in-memory `SessionContext` at `onboarding/[type].tsx:745` and navigation replaces the route with `/recommendations` at `:746`.

## Regression assessment

- Welcome → all three onboarding pathways → recommendations remained functional in Chromium.
- Recommendation cards opened existing TASK-003 opportunity details; the full-catalog link remained exposed.
- Missing-session recovery worked.
- Automated TASK-001/002/003 suites remained green as part of the 260-test run.
- Deep browser-history Save/Cancel cycling and every TASK-003 filter combination were not repeated; see limitations.

## Limitations / NOT VERIFIED

- Enter activation of recommendation cards was not separately instrumented; Space and mouse activation were verified.
- Touch was approximated by pointer activation and target-size measurement; no physical Android/iOS device or mobile screen reader was available.
- Native Android and iOS builds were not run. Expo web production export was verified.
- This review did not repeat the exhaustive TASK-002 browser Back/Forward and Save/Cancel matrix or every TASK-003 catalog filter combination; the automated regression suites passed and all three end-to-end paths traversed the shared onboarding/catalog surfaces.
- Network privacy was assessed by source inspection and local-browser observation; a full packet capture was not performed.

## Final decision

**FAIL.** Remediate T4-B1 and T4-B2, add the missing boundary/exact-score assertions described in T4-N1, and return the branch for independent QA. Do not merge TASK-004 into `main` in its current state.
