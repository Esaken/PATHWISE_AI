# TASK-002 Independent QA Review 3

**Date:** 2026-11-04  
**Branch:** `feature/task-002-onboarding`  
**Implementation commit:** `3d7dda3`  
**Result:** **FAIL**

## Decision

The T2-B2 browser-history synchronization defect from QA Review 2 is resolved. Real Chromium testing confirmed correct Back/Forward behavior, stable history entries, preserved answers, in-app Back synchronization, and browser Back from Step 1.

However, the required Review edit/cancel workflow has a remaining blocking defect: controls labeled `Cancel` retain edited values instead of discarding them. TASK-002 therefore remains FAIL.

TASK-001 B3 and B4 remain open release blockers and are not changed by this review.

## T2-B2 browser-history result — PASS

Testing used a fresh Chromium profile against the current Expo web implementation at commit `3d7dda3`.

### Initial completion and entry structure

The high-school flow was completed with:

- Grade: `10th grade`
- Primary goal: `Prepare for college`
- Career: `Technology & Computing`
- Budget: `Free only`

Review displayed all four values correctly. Chromium navigation history contained exactly four same-URL entries, corresponding to Steps 1, 2, 3, and Review. The current index was 3.

### Browser Back and Forward

- Back from Review returned to Step 3.
- `Technology & Computing` and `Free only` remained checked.
- Forward restored Review with the complete summary.
- A second consecutive Back/Forward cycle produced the same result.
- Entry count remained 4 and entry IDs remained unchanged (`6`, `13`, `14`, `15`); no duplicate or replacement entry was created.

### In-app Back followed by browser Forward

- The Review Back control returned to Step 3.
- Chromium's history index moved from 3 to 2, confirming that the UI and browser index moved together.
- Browser Forward restored Review and index 3.
- History count and entry IDs remained unchanged.

### Edit and Save

- The Grade Edit control opened Step 1 in edit mode with `10th grade` selected.
- Selecting `11th grade` and pressing Save returned to Review with `11th grade` displayed.
- History remained at index 3 with exactly four unchanged entries.
- Back returned to Step 3 and Forward restored Review with the saved `11th grade` answer.
- Career and budget answers remained preserved.

### Browser Back from Step 1

A separate clean Chromium profile started at the welcome screen, selected High school, and activated Get started. Browser Back from onboarding Step 1 returned to `/` and the welcome UI. History showed two entries with index 0 after Back. No crash or submission occurred.

## Remaining blocker

### T2-B4 — Cancel applies rather than discards an unsaved Review edit

**Severity:** High / functional correctness / blocking  
**Location:** `apps/mobile/src/app/onboarding/[type].tsx:110-115`, `:137-147`, and edit-mode Step handlers

The edit flow updates the canonical `answers` object immediately through `SET_FIELD`. The `BACK` branch for `editingFromReview` only returns to Review; it does not restore the pre-edit value.

**Real-browser reproduction:**

1. Complete the high-school flow with `10th grade` and reach Review.
2. Activate Edit for Grade.
3. Select `12th grade`.
4. Activate the control labeled `Cancel`.
5. Observe Review now displays `12th grade`; `10th grade` is gone.

The Cancel action therefore behaves like Save. This violates the expected semantics of the visible control and the requested save/cancel edit verification.

**Required correction:** Snapshot the relevant answer state when edit mode opens, or keep edit values in a draft. Save should commit the draft; Cancel should restore/discard it. Confirm this for edit steps 1, 2, and 3 across all learner types, including optional text/state fields. The correction must not regress the now-passing history behavior or create history entries for edit mode.

## T2-B1 regression — PASS

- A fresh high-school route exposed `9th grade` as the sole onboarding radio with `tabIndex=0`; the remaining grade options were `-1`.
- After the page was fully loaded, the first Tab focused `Back to welcome` and the second Tab entered the initially unselected group on `9th grade`.
- Previously verified Space, Enter, arrow-key, checked-state, and roving-tabindex behavior remains covered by the passing browser result from QA Review 2 and the current 103-test suite.
- Returning to populated Step 3 exposed one checked/tabbable option in each independent group: the selected career and selected budget.

## T2-B3 regression — PASS

After an empty Next attempt on high-school Step 1:

- the `Current grade` radiogroup exposed `aria-required="true"` and `aria-invalid="true"`;
- `aria-describedby="grade-choice-error"` matched the rendered alert ID;
- Chromium's accessibility tree exposed role `radiogroup`, name `Current grade`, `required=true`, `invalid=true`, and computed description `Please select your current grade to continue.`;
- the error remained an assertive alert.

No accessibility-semantics regression was identified.

## Automated checks

All commands ran independently from `apps/mobile`:

| Command | Result | Evidence |
|---|---|---|
| `npm.cmd test -- --runInBand` | PASS | 2 suites, 103 tests, 0 failures, 0 snapshots; 42.836 s |
| `npx.cmd tsc --noEmit` | PASS | exit 0 |
| `npm.cmd run lint` | PASS | exit 0 |
| `npx.cmd expo export --platform web` | PASS | exit 0; 7 bundles and 4 static routes exported |

The automated history tests correctly cover popstate suppression and `history.back()`, but the suite does not catch Cancel retaining a changed answer.

## Repository and inherited blockers

- No product code was changed during this QA review.
- The pre-existing worktree remains unclean with untracked supervisor/QA artifacts; the new QA Review 3 report is the only intended artifact from this review.
- TASK-001 **B3 remains open**: the welcome pathway focus indicator has not been independently accepted.
- TASK-001 **B4 remains open**: a fresh production web export can initially render the mobile welcome layout at tablet/desktop widths. B4 is not an iOS back-button issue.
- TASK-002 still cannot merge independently into `main` because it depends on unapproved TASK-001 work.

## Limitations

- Android/iOS hardware-back behavior was not tested because no emulator or device was available.
- Browser testing used Chromium DevTools automation against the local Expo development server, not a physical touchscreen.
- History behavior was exercised deeply on the high-school flow. University/adult history behavior shares the same wizard implementation and is covered by automated tests, but the complete repeated browser-history matrix was not duplicated for those routes.
- Enlarged native system text, screen-reader speech output, and production-export visual behavior were not re-tested in this focused review.

## Final status

**FAIL.** T2-B2, T2-B1, and T2-B3 pass, but Review edit Cancel incorrectly commits unsaved changes. This is the remaining TASK-002 blocker. Do not merge, deploy, or begin TASK-003.
