# TASK-002 Independent QA Review 2

**Date:** 2026-11-04  
**Branch:** `feature/task-002-onboarding`  
**Implementation commit reviewed:** `870dc65`  
**QA handoff commit reviewed:** `5369e3a`  
**Result:** **FAIL**

## Decision

T2-B1 and T2-B3 are resolved in a real Chromium session. T2-B2 is only partially corrected and remains release-blocking: initial browser Back navigation works and preserves answers, but browser Forward creates/replaces history incorrectly and cannot return to Review. In-app Back also changes wizard state without moving the browser history index, leaving the visible step and current history entry out of sync.

TASK-002 must not be merged or deployed. TASK-001 B3 and B4 remain open release blockers.

## Corrected defects

### T2-B1 — PASS

Fresh Chromium interaction at `/onboarding/high-school` established:

- Before selection, exactly one radio had `tabIndex=0`: `9th grade`; the other three had `-1`.
- First Tab focused `Back to welcome`; the second Tab entered the group on `9th grade`.
- Space selected `9th grade`, producing exactly one `aria-checked=true` radio.
- ArrowDown moved focus and selection to `10th grade`; `10th grade` became the only `tabIndex=0` and checked radio.
- Shift+Tab moved back to the Back button; Tab returned to the selected `10th grade` option.
- A separate real key dispatch focused `11th grade` and pressed Enter; `11th grade` became the only checked and tabbable option.
- Direct loads of high-school, university, and adult routes each exposed exactly one initially tabbable radio in their first group.

This confirms browser-real Tab/Shift+Tab, Space, Enter, arrow selection, checked-state synchronization, and roving tabindex behavior.

### T2-B3 — PASS

Before validation, Chromium DOM inspection reported the high-school `Current grade` radiogroup as `aria-required="true"`, with no invalid state. After an empty Next attempt:

- the group exposed `aria-invalid="true"`;
- `aria-describedby="grade-choice-error"` matched the rendered alert element ID;
- the alert text was `Please select your current grade to continue.`;
- Chromium's accessibility tree exposed role `radiogroup`, name `Current grade`, `required=true`, `invalid=true`, `describedby=grade-choice-error`, and the error text as the computed description.

The conditional adult `Describe your goal` input was also tested after choosing `Something else` and attempting Next with an empty value. DOM and AX inspection exposed:

- textbox name `Describe your goal`;
- `required=true` and `invalid=true`;
- `describedby=career-goal-other-error`;
- computed description `Please describe your goal to continue.`;
- a matching assertive alert.

## Remaining blocking defect

### T2-B2 — FAIL: Forward and in-app Back desynchronize history

**Severity:** High / navigation and answer preservation / release-blocking  
**Location:** `apps/mobile/src/app/onboarding/[type].tsx:663-672`, `:674-686`, `:706-724`

A clean Chromium profile was opened directly at `/onboarding/high-school`. The completed sequence selected `10th grade`, `Prepare for college`, `Technology & Computing`, and `Free only`, then reached Review.

Evidence:

1. Initial history contained one entry.
2. Reaching Review produced exactly four same-URL entries representing steps 1, 2, 3, and Review; current index was 3.
3. Browser Back returned to step 3 with `Technology & Computing` and `Free only` still checked.
4. A second Back returned to step 2 with `Prepare for college` still checked.
5. Forward returned to step 3 with the answers preserved.
6. A second Forward **did not return to Review**; the UI remained on step 3.

Root cause confirmed from execution and source: handling the first Forward dispatches `NAV_TO_STEP` from step 2 to step 3. The forward-step effect then calls `pushState` again because it does not distinguish popstate navigation from user Next. That new step-3 entry truncates/replaces the original forward Review entry.

The same clean run also showed that pressing the in-app Back control changes reducer state without calling browser history Back. The browser index remains at the newer entry while the UI moves to an earlier step, so state and history no longer represent the same position. Subsequent browser navigation is therefore stale/unpredictable.

**Required correction:** Track popstate-originated transitions so they never push another history entry. In-app Back must move the history index consistently or otherwise replace/synchronize the current marker. Re-test the complete matrix from clean profiles:

- step 2: browser Back and Forward;
- step 3: browser Back and Forward;
- Review: browser Back and Forward;
- in-app Back from steps 2, 3, and Review followed by browser Back/Forward;
- Edit/Save paths;
- no duplicate/truncated forward entries and all answers preserved.

## Regression evidence

- All valid routes loaded learner-specific first-step content: grade for high school, academic area for university, and career/skill goal for adults.
- Invalid `/onboarding/invalid` rendered the safe recovery screen and did not crash.
- Real Chromium completion to Review produced accurate high-school, university, and adult summaries. University showed blank institution as optional (`—`); adult showed blank state/region as optional (`—`).
- Required radio and conditional text validation produced actionable inline errors and blocked advancement.
- Browser storage inspection during tested university and adult flows found empty localStorage/sessionStorage and no cookies.
- At 320x800, 390x844, 768x1024, and 1440x900, fresh university first-step checks reported `documentElement.scrollWidth == clientWidth` and no element bounds beyond the viewport. The measured widths were exactly 320, 390, 768, and 1440 pixels.
- The automated suite covers learner happy paths, optional inputs, trimming, review, completion, invalid routes, and validation. Because T2-B2 fails in the real browser, its simulated popstate tests are insufficient for history acceptance.

## Automated checks

All commands ran independently from `apps/mobile`:

| Command | Result | Evidence |
|---|---|---|
| `npm.cmd test -- --runInBand` | PASS | 2 suites, 100 tests, 0 failures, 0 snapshots; 43.221 s |
| `npx.cmd tsc --noEmit` | PASS | exit 0 |
| `npm.cmd run lint` | PASS | exit 0 |
| `npx.cmd expo export --platform web` | PASS | exit 0; 7 web bundles and 4 static routes exported |
| `npm.cmd ls --depth=0` | PASS | exit 0; dependency tree resolved |

Dependency cleanup is correct: `@testing-library/react-native` and `jest-expo` are now in `devDependencies`. `apps/mobile/src/__tests__/rntlDiag.test.tsx` is deleted.

## TASK-001 dependency

- **B3 remains open:** welcome-screen pathway cards still require independent acceptance of a visible keyboard focus indicator.
- **B4 remains open:** the production web export can render the mobile welcome layout at tablet/desktop widths on initial load. B4 is not an iOS back-button defect and is not closed or relabeled by this review.
- TASK-002 continues to depend on unapproved TASK-001 work and cannot merge independently into `main`.

## Limitations

- Android and iOS emulator/device testing was unavailable.
- Touchscreen gesture testing and enlarged native system-text testing were not performed.
- Full visual screenshot comparison of every step, validation state, Review, and Completion at every viewport was not performed; DOM boundary measurements covered the university first step at all four required widths, with learner-route and summary checks at 390x844.
- The real-browser completion checks reached and validated Review summaries; the final completion action remains supported by automated tests but was not independently exercised for every learner after the history blocker was reproduced.
- TASK-001 B3/B4 were preserved as open defects rather than re-tested for closure.

## Final status

**FAIL.** T2-B1 and T2-B3 pass, but T2-B2 remains blocking due to reproducible Forward-entry truncation and in-app Back/history desynchronization. No merge, deployment, or TASK-003 work is approved.
