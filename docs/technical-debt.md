# Pathwise AI Technical Debt and Open Defects

This file tracks deferred defects that remain open after task QA. Deferral permits dependent prototype work to continue; it does not constitute QA approval or release acceptance.

## Feature-branch QA status

### TASK-002 — Anonymous onboarding

**Status:** Feature-branch QA-approved at `f048758`  
**Evidence:** `docs/reviews/TASK-002-QA-REVIEW-4.md`  
**Integration constraint:** Not independently mergeable to `main`; the branch descends from unapproved TASK-001 work and retains release blockers B3 and B4 below.

TASK-002 passed independent browser, accessibility, history, validation, responsive, TypeScript, ESLint, Jest, and Expo web-export checks with one nonblocking labeling issue recorded below.

## Open release blockers

### B3 — Pathway cards lack a visible keyboard focus indicator

**Status:** Open  
**Severity:** High — accessibility / release-blocking  
**Introduced or confirmed:** TASK-001 QA Review 5  
**Affected area:** `apps/mobile/src/app/index.tsx`, welcome pathway radio group  
**Acceptance criteria affected:** TASK-001 criterion 16; WCAG 2.4.7/2.4.11 focus visibility and 1.4.11 non-text contrast

#### Reproduction

1. Run the Pathwise AI web app and open `/`.
2. Use Tab or the radio-group arrow keys to focus an unselected pathway such as College/University.
3. Confirm in browser developer tools that the radio is focused.
4. Compare its border, shadow, and other presentation before and after focus.
5. Observe that focus produces no discernible visual change. QA5 measured identical border and shadow values and captured evidence at `docs/reviews/evidence/task001-qa5/qa5-focus-390.png`.

#### Release acceptance criteria

- Every keyboard-focusable pathway and action has a clearly visible focus indicator.
- Focus appearance is distinct from selected, unselected, hover, and pressed states.
- The focus indicator has at least 3:1 contrast against adjacent colors.
- It remains visible at 320px, 390px, 768px, 1440px, and 200% zoom.
- Tab, Shift+Tab, Space, Enter, and arrow-key navigation retain correct focus and selection behavior.
- Independent QA confirms the computed style changes and captures focused-state evidence.

### B4 — Static production web load does not apply tablet/desktop pathway layout

**Status:** Open  
**Severity:** High — responsive production regression / release-blocking  
**Introduced or confirmed:** TASK-001 QA Review 5  
**Affected area:** welcome screen responsive width/hydration behavior  
**Acceptance criteria affected:** TASK-001 criterion 13

#### Reproduction

1. From `apps/mobile`, run `npx expo export --platform web`.
2. Serve the generated `dist` directory over local HTTP.
3. Open the exported site in a fresh Chromium process at 768x1024 or 1440x900 without resizing after load.
4. Observe that the three pathway cards remain stacked as full-width mobile cards instead of using the intended desktop/tablet row.
5. Compare with `docs/reviews/evidence/task001-qa5/qa5-fresh-768.png` and `qa5-fresh-1440.png`.

#### Release acceptance criteria

- A fresh initial load of the exported production web build derives the correct viewport width after hydration without requiring manual resize.
- At 1440x900 the pathways use the approved deliberate desktop composition, including the intended three-card row or an independently approved equivalent.
- At 768x1024 the layout uses the specified tablet breakpoint and has no clipping, overlap, or horizontal overflow.
- Behavior matches between Metro development and the exported static build.
- `document.documentElement.scrollWidth <= clientWidth` at 320px, 390px, 768px, and 1440px.
- Independent QA uses fresh browser processes against the exported build and captures tablet/desktop evidence.

## Dependency and release policy

- TASK-001 remains **FAIL** and must not be merged to `main` until B3 and B4 pass independent QA or the product owner explicitly changes release acceptance in writing.
- TASK-002 may branch from `feature/task-001-welcome` for schedule reasons, but inherits these defects and cannot merge independently to `main`.
- Fixes for B3/B4 must remain separately reviewable and must not be hidden inside unrelated onboarding changes.

## Nonblocking technical debt

### TD-002-01 — Edit rollback is labeled Back on Steps 2 and 3

**Status:** Open  
**Severity:** Low — UX/accessibility clarity; nonblocking  
**Introduced or confirmed:** TASK-002 QA Review 4  
**Affected area:** onboarding edit mode navigation labels

#### Reproduction

1. Complete onboarding and reach Review.
2. Edit an answer belonging to Step 2 or Step 3.
3. Observe that the control which discards the edit and restores the Review snapshot is labeled `Back`.
4. Compare with Step 1 edit mode, where the equivalent control is labeled `Cancel`.

#### Acceptance criteria

- Use one consistent, accurate label for discarding edits on Steps 1–3, preferably `Cancel`.
- Preserve the approved snapshot/restore behavior, clear edit validation errors, and create no browser-history entry.
- Expose the same action name to assistive technology and visible text.
- Re-run the edit Save/Cancel and browser-history regression tests.
