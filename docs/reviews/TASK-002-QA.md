# TASK-002 Independent QA Review

**Date:** 2026-11-04  
**Branch:** `feature/task-002-onboarding`  
**Implementation commit:** `051c371`  
**Comparison:** TASK-002 changes against `feature/task-001-welcome`; full branch ancestry checked against `main` (`8238bd1`)  
**Result:** **FAIL**

## Executive result

TASK-002 is not ready for approval or merge. The three learner-specific flows, validation model, summaries, anonymous in-memory state, invalid-route fallback, automated tests, type check, lint, and web export are substantially implemented. However, three acceptance-criteria failures are blocking:

1. A choice group with no current selection has no tabbable radio, preventing keyboard-only users from entering the group.
2. browser Back is not represented in wizard history and exits the route instead of returning to the preceding onboarding step.
3. required and invalid state are not exposed in Chromium's accessibility tree.

TASK-001 also remains failed with open release blockers B3 and B4. TASK-002 inherits that unapproved branch and cannot merge independently into `main`.

## Blocking defects

### T2-B1 — Empty choice groups cannot be reached with Tab

**Severity:** High / accessibility / blocking  
**Location:** `apps/mobile/src/components/onboarding/ChoiceGroup.tsx:71`

Every option uses `tabIndex={selected ? 0 : -1}`. Before a selection exists, all radios therefore have `tabIndex=-1`. Fresh Chromium DOM inspection confirmed every grade, study-area, and adult-goal radio was `-1`. A keyboard user tabbing forward moves from Back to Next without entering the required radio group. This violates acceptance criteria 19–21 and the required roving-tabindex pattern.

**Reproduction:**

1. Direct-load `/onboarding/high-school` in Chromium.
2. Press Tab from the browser/body through the page.
3. Observe that no grade option receives focus.
4. Inspect the four radios: each has `tabIndex=-1` and `aria-checked=false`.

**Required correction:** Make the selected option tabbable, or the first option tabbable when there is no selection. Re-test Tab, Shift+Tab, Space, Enter, and all four arrow keys in every group. Arrow navigation must retain one checked option and one `tabIndex=0` option.

### T2-B2 — Browser Back discards the current wizard position

**Severity:** High / navigation and data preservation / blocking  
**Locations:** `apps/mobile/src/app/onboarding/[type].tsx:102-125`, `:623-655`

Wizard transitions only update reducer state; they do not add or synchronize browser history entries. The in-app Back button dispatches `BACK`, but browser Back navigates away from `/onboarding/[type]` to the preceding document rather than moving from step 2 to step 1. This can discard the in-memory session and violates the explicit navigation rule and acceptance criterion 6.

**Required correction:** Integrate wizard position with safe route/history behavior (without putting answers in the URL) or intercept browser/native back consistently. Browser Back on steps 2/3/review must move to the prior wizard state without submitting or losing preserved answers; Back on step 1 may return to pathway selection.

### T2-B3 — Required and invalid form state is absent from the accessibility tree

**Severity:** High / accessibility / blocking  
**Locations:** `apps/mobile/src/components/onboarding/ChoiceGroup.tsx:127-131`, `TextField.tsx:50-63`

After an attempted empty Next, the inline error correctly appears as an assertive alert, but DOM inspection found no `aria-invalid=true` element and no `aria-required=true` element. Chromium reported the grade radiogroup as `required: false`. This directly fails acceptance criterion 21. `TextField` similarly does not set required/invalid semantics.

**Required correction:** Expose required state for required groups/fields and invalid state after validation failure, with the existing error text referenced through `aria-describedby`. Verify the resulting Chromium AX properties, not only rendered text.

## Functional evidence

- Valid routes independently loaded the correct learner-specific first step:
  - high school: grade choices;
  - university: academic-area choices including Undecided/Exploring;
  - adult: career/skill goal choices including Something else.
- `/onboarding/bogus` rendered a safe error and Return to pathway selection action rather than crashing.
- Source and automated tests cover the three happy paths, required validation, optional institution/state behavior, trimming, bounded text, Back/Edit preservation, accurate summaries, completion, and invalid routes.
- Review rows map each answer to the intended edit step and preserve unrelated reducer state.
- Completion remains anonymous and does not claim that a recommendation, credit, certification, internship, job, or price is guaranteed.
- Fresh local browser inspection showed empty `localStorage`, empty `sessionStorage`, no cookies, and no non-local resource requests during the inspected flow.

Because T2-B1 prevents genuine keyboard-only completion, Space, Enter, arrow-key, and roving-tabindex behavior cannot be accepted merely from direct event tests. Mouse selection and reducer behavior are covered, but the end-to-end keyboard requirement fails at group entry.

## Responsive evidence

Fresh Chromium checks against the current Expo implementation found `scrollWidth == clientWidth` and no elements extending beyond the viewport at 390x844, 768x1024, and 1440x900 on the inspected learner entry screens. Cards and CTA controls were not clipped or overlapping at those sizes.

The local headless Chromium process did not honor the requested 320-pixel device override on its first capture (it reported a 764-pixel layout viewport), so an exact independent 320-pixel browser result is **not claimed**. Full visual coverage of every step/review/completion state and 200% zoom was also not completed after the blocking keyboard defects were confirmed. These are explicit limitations and must be rerun after remediation.

TASK-001 B4 remains open: a fresh exported-production initial load at tablet/desktop width can retain the mobile welcome layout. It is a production initial-load responsive defect, **not an iOS back-button issue**.

## Automated checks

Run from `apps/mobile`:

| Check | Result | Evidence |
|---|---|---|
| `npm.cmd test -- --runInBand` | PASS | 3 suites, 83 tests, 0 snapshots |
| `npx.cmd tsc --noEmit` | PASS | exit 0 |
| `npm.cmd run lint` | PASS | exit 0 |
| `npx.cmd expo export --platform web` | PASS | exit 0; web routes exported |
| `npm.cmd ls --depth=0` | PASS | exit 0 |
| `npm.cmd ci --dry-run --ignore-scripts` | PASS | exit 0 |

Passing automated tests do not cover the browser-history defect or the initial no-selection tab stop. The RNTL tests invoke events directly and therefore do not prove real browser tab order.

## Dependency and repository review

- Added packages resolve without dependency-tree errors and the clean-install dry run succeeds.
- `@testing-library/react-native` and `jest-expo` are test-only packages but are declared in runtime `dependencies`; move them to `devDependencies` unless a documented Expo constraint requires otherwise. This is nonblocking bundle/dependency hygiene.
- `apps/mobile/src/__tests__/rntlDiag.test.tsx` is a temporary one-assertion render diagnostic. It adds no TASK-002 behavior coverage and should be removed before approval. This is nonblocking cleanup.
- No `EXPO_PUBLIC_*` credential, API key, analytics SDK, persistence library, generated `dist` output, or secret was added in the committed TASK-002 diff.
- The worktree was not clean before this report: `.claude/`, the TASK-001 QA5 report/evidence, and `docs/technical-debt.md` were untracked. This report is the only QA artifact added by Codex. These pre-existing files must be intentionally committed or excluded before integration.

## Inherited TASK-001 blockers and regressions

- **B3 remains open:** the welcome pathway cards lack an independently accepted visible keyboard-focus indicator.
- **B4 remains open:** exported-production initial desktop/tablet load may use the wrong welcome layout. B4 is not an iOS back-button issue.
- TASK-002 does not resolve either defect and must not cause them to be relabeled or closed.
- No new secret exposure, persistent storage, external data transmission, or prohibited personal-information field was identified.

## Limitations

- Android and iOS emulator/device runtime checks were unavailable.
- The computer-use browser host was unavailable; local Chromium DevTools inspection was used instead.
- Exact 320-pixel visual verification, complete all-screen viewport screenshots, touch-device gestures, enlarged system text, and a full 200% zoom pass remain unverified.
- Network/storage evidence covers the inspected local browser session, not native runtimes.

## Release decision

**FAIL.** Remediate T2-B1, T2-B2, and T2-B3, add browser-realistic regression coverage where practical, remove or justify the diagnostic test and runtime test dependencies, then request a fresh independent QA pass. Do not merge, deploy, or begin TASK-003. TASK-001 B3/B4 remain separate release blockers.

---

# TASK-002 Remediation Handoff

**Date:** 2026-11-04  
**Remediation commit:** `870dc65`  
**Branch:** `feature/task-002-onboarding`  
**Base commit for diff:** `051c371` (original TASK-002 implementation)

## Summary

All three blocking defects identified in the QA FAIL report above have been remediated. The two nonblocking cleanup items (devDependencies move, diagnostic removal) were also completed.

## Defect fixes

### T2-B1 — Roving tabIndex in ChoiceGroup

**File:** `apps/mobile/src/components/onboarding/ChoiceGroup.tsx`

Added a `tabbable` boolean prop to `OptionCard`. In `ChoiceGroup.options.map()`:

```typescript
tabbable={option.value === selected || (selected == null && idx === 0)}
```

When no option is selected, `idx === 0` causes the first radio to receive `tabIndex=0`. When a selection exists, only that radio gets `tabIndex=0`; all others get `tabIndex=-1`. This is the standard roving-tabindex pattern.

### T2-B2 — Browser history synchronization

**File:** `apps/mobile/src/app/onboarding/[type].tsx`

Added four `useEffect` hooks and a new `NAV_TO_STEP` reducer action:

1. **Initial stamp** — `replaceState` tags the current history entry with `{ pwStep: 1 }` on mount.
2. **Forward push** — when `state.step` advances and it was not an edit-from-review save, `pushState` adds an entry with `{ pwStep: N }`.
3. **Popstate intercept** — `window.addEventListener('popstate', ...)` reads `e.state.pwStep`; if it is a valid `WizardStep`, dispatches `NAV_TO_STEP` to restore that step without touching answers.
4. **Android hardware Back** — `BackHandler.addEventListener('hardwareBackPress', ...)` dispatches `BACK` when inside the wizard.

All web history code is gated on `isWebHistoryAvailable()` (`typeof window !== 'undefined' && !!window.history?.pushState`) so it is a no-op on native. The same URL is used for all `pushState` calls to avoid polluting the URL with answer data.

### T2-B3 — aria-required / aria-invalid in accessibility tree

**File:** `apps/mobile/src/components/onboarding/ChoiceGroup.tsx`

Added to the `role="radiogroup"` View:
- `aria-required={required}` (default `true`)
- `aria-invalid={hasError ? true : undefined}`
- `aria-describedby={hasError ? errorId : undefined}` (already present, confirmed)
- `testID={testID ? \`${testID}-group\` : undefined}` (required for RNTL test access)

**File:** `apps/mobile/src/components/onboarding/TextField.tsx`

Added to `TextInput`:
- `aria-required={!optional}`
- `aria-invalid={error != null && error !== '' ? true : undefined}`

## Nonblocking cleanup

- `@testing-library/react-native` and `jest-expo` moved from `dependencies` to `devDependencies` in `package.json`.
- `apps/mobile/src/__tests__/rntlDiag.test.tsx` deleted.

## Automated checks (post-remediation)

All run from `apps/mobile`:

| Check | Result | Evidence |
|---|---|---|
| `npm.cmd test -- --runInBand` | PASS | 2 suites, **100 tests**, 0 failures |
| `npx.cmd tsc --noEmit` | PASS | exit 0 |
| `npm.cmd run lint` | PASS | exit 0 |
| `npx.cmd expo export --platform web` | PASS | exit 0; 7 web bundles, 4 static routes |

## Regression test coverage added

**T2-B1 suite (5 tests):**
- First radio has `tabIndex=0` when no option is selected
- Selected radio gets `tabIndex=0`; others get `tabIndex=-1`
- Arrow navigation keeps exactly one `tabIndex=0` radio
- After navigating away and returning, roving state is correct
- In-app Back and return preserves `tabIndex=0` on the previously selected radio

**T2-B2 suite (7 tests):**
- Mount stamps initial `replaceState` with `{ pwStep: 1 }`
- Advancing to step 2 calls `pushState` with `{ pwStep: 2 }`
- Failed Next (validation blocked) does not call `pushState`
- In-app Back does not call `pushState`
- `popstate` with `pwStep: 1` returns wizard to step 1
- Grade selection is preserved after popstate back
- `popstate` without `pwStep` does not change wizard state

**T2-B3 suite (7 tests):**
- Radiogroup has `aria-required=true`
- No `aria-invalid` before interaction
- `aria-invalid=true` after attempted Next with no selection
- `aria-invalid` clears once a valid selection is made
- Error text `nativeID` matches radiogroup `aria-describedby`
- Something-else text field has `aria-required=true`
- Something-else text field has `aria-invalid=true` after failed validation

## Known limitations (unchanged from original QA report)

- T2-B1: `tabIndex` and `aria-checked` are verified via RNTL props, which reflect the React Native model but not a live Chromium DOM; re-inspect Chromium DevTools after remediation to confirm the live AX tree.
- T2-B2: The popstate test calls the captured handler directly; it does not use a real browser history API. Verify with actual browser Back button in Chromium.
- T2-B3: `aria-required` and `aria-invalid` are set on the React Native element and mapped to the DOM by react-native-web; verify with Chromium DevTools Accessibility panel post-build.
- Android/iOS emulator runtime checks remain unavailable.
- 320px, 200% zoom, and all-screen visual coverage remain unverified.
- TASK-001 B3 and B4 remain open and are not affected by this remediation.

## Requesting fresh QA pass

Please re-inspect the three blocking defects in Chromium DevTools (live AX tree and Tab/arrow keyboard testing), verify browser Back behavior, and confirm that the remediated items are resolved before changing the release decision.
