# TASK-003 Independent QA Review 3

**Date:** 2026-11-05  
**Reviewer:** Codex  
**Branch:** `feature/task-003-opportunity-catalog`  
**Implementation reviewed:** `a69c658`  
**Base:** `feature/task-002-onboarding` at `f048758`  
**Result:** **FAIL**

## Decision

T3-B6 is resolved. T3-B2 and T3-B5 remain blocking.

The remediation now stores the current ATC provider-list URL and removes the earlier unsupported certificate/exam sequence. It does not store the official Louisiana law/rule source needed to substantiate its remaining mandatory-training and permit claims, and its evidence note attributes facts to an ATC information page that does not state them. In real Chromium, the new keyboard handler throws during Space activation; Space does not select the filter. Enter changes results through native click handling, but the Chromium accessibility tree remains `checked=false`.

TASK-003 is not ready for QA approval, merge, or deployment.

## Remediation findings

### T3-B2 — Louisiana ATC source accuracy: PARTIALLY RESOLVED, STILL BLOCKING

**Locations:** `apps/mobile/src/catalog/data.ts:193-242`

Resolved:

- The provider remains correctly distinguished as ATC-approved independent training providers, not ATC itself.
- The current provider-list URL stored by the app is `https://atc.louisiana.gov/media/5e4bsyim/rv-list_9-23-26.pdf`.
- Independent navigation from the live [ATC Responsible Vendor information page](https://atc.louisiana.gov/responsible-vendors/responsible-vendor-information/) through “Responsible Vendor Provider List” reached that exact PDF.
- The current list contains online-only, classroom-only, and online/classroom providers, supporting hybrid/provider-dependent delivery.
- Provider-specific price, duration, schedule, and delivery remain honestly unknown.
- The unsupported penalty-reduction, separate-exam, and completion-certificate claims were removed. `outcome` is now `null`.

Still blocking:

- `learnerEligibility.summary` says the training is required for Louisiana alcohol servers and sellers, and the disclaimer refers to requirements associated with the RV bar-card and permit system. Those legal/training/permit claims require the official rule/law source, but `verification.sourceUrls` contains only the general information page and provider list.
- The evidence note says the general ATC information page confirms that ATC administers the program and that training must be completed through an approved provider. The rendered page contains bar-card retrieval instructions and the provider-list link; it does not state those claims.
- The official [2026 ATC lawbook](https://atc.louisiana.gov/media/dx4bcx25/2026-atc-lawbook.pdf) does support the Responsible Vendor program, approved training providers, server/security training courses, and permit issuance/renewal requirements, but that exact source is absent from the record.

This violates TASK-003's claim-to-source traceability rule even though the independently located lawbook supports the general direction of the copy.

**Required correction:** Add the current 2026 ATC lawbook/rule URL to `sourceUrls`; cite exact sections in `evidenceNotes`; align “servers and sellers,” training, bar-card, and permit language exactly with the statute/rules. Do not claim the general information page contains language that it does not.

### T3-B6 — Exact Modern States and College Board evidence URLs: RESOLVED

Modern States now stores both:

- `https://modernstates.org`
- `https://helpdesk.modernstates.org/support/solutions/articles/151000233533-can-i-start-earning-college-credit-with-clep-`

The official helpdesk article supports free/self-paced preparation, conditional voucher qualification after course/practice work, the registration code, and the instruction to confirm institutional CLEP policy.

CLEP now stores the exact official pages for:

- General exams and $97 registration.
- Remote proctoring.
- College Composition at 125 minutes.
- Spanish with Writing at approximately 110 minutes.

The record continues to label duration as exam-specific/unknown at program level and credit as potential, institution-controlled, and not guaranteed. T3-B6 passes.

### T3-B5 — Space/Enter filter activation and state synchronization: FAIL

**Locations:** `apps/mobile/src/components/catalog/FilterBar.tsx:16-45`, `apps/mobile/src/__tests__/catalogUI.test.tsx`

Fresh Chromium evidence on the focused High school checkbox:

| Action | Chromium AX checked | Result count | Verdict |
|---|---|---:|---|
| Initial | false | 5 | baseline |
| Space | false | 5 | FAIL — no activation |
| Enter | false | 4 | FAIL — results changed, AX state did not synchronize |

The visible focus ring rendered correctly. Metro also logged a runtime exception during the keyboard path: `TypeError: Cannot set properties of undefined (setting 'defaultPrevented')`.

Cause: the handler destructures `preventDefault` from the event and calls it without its event receiver. It also reads a plain top-level `key`, whereas React Native web key events use the native event shape used elsewhere in this project. The new unit tests fire a synthetic `{ key: ... }` object and therefore do not represent the real Chromium/React Native event pipeline.

Mouse click and Chromium touch-event activation worked and changed result counts. That does not compensate for the keyboard and accessibility-state failures.

**Required correction:** Use the correctly typed React Native key event and `event.nativeEvent.key`, call `event.preventDefault()` on the event object, avoid Enter double activation with native `onPress`, and explicitly verify that `aria-checked`/Chromium AX checked state changes with filter state. Add a browser-level test or a DOM test using the real web event shape.

## Browser regression evidence

Fresh headless Chromium was used against the current Expo development build. It exercised Chromium's DOM, layout, keyboard pipeline, touch-event pipeline, Resource Timing, and accessibility tree.

### Complete onboarding-to-catalog flows

- High school: 10th grade → Build career skills → Technology & Computing → Free only → Review → Submit. `/opportunities` showed two results: both Cisco courses.
- University: Computer Science & IT → possible college credit → Technology & Computing → Flexible → Review → Submit. `/opportunities` showed four results: both Cisco courses, Modern States, and CLEP.
- Adult: Something else (“Responsible Vendor training”) → job-related training → Flexible → Louisiana → Review → Submit. `/opportunities` showed the single Louisiana Responsible Vendor record.

Each route reached Review before submission. No onboarding answer appeared in the resulting URL.

### Catalog interaction and states

- Mouse selection worked; selecting Adult produced three eligible records.
- Chromium touch activation of Cybersecurity produced one result and moved visible focus to that filter.
- High school + Responsible Vendor produced `0 results` and the honest “No matching opportunities found” state.
- Clear restored all five catalog records.
- Detail navigation reached `/opportunities/clep-exam-program`.
- `/opportunities/bad-id` rendered safe invalid-ID recovery.
- Keyboard focus was visible with the purple 3 px / white 5 px focus treatment.
- Chromium AX exposed named, focusable checkbox controls and the level-1 Learning Opportunities heading. Checked-state synchronization failed as documented in T3-B5.

### Responsive and target measurements

| Viewport | clientWidth | scrollWidth | Minimum visible target | Targets below 44×44 | Result |
|---|---:|---:|---:|---:|---|
| 320×800 | 320 | 320 | 44 px | 0 | PASS |
| 390×844 | 390 | 390 | 44 px | 0 | PASS |
| 768×1024 | 768 | 768 | 44 px | 0 | PASS |
| 1440×900 | 1440 | 1440 | 44 px | 0 | PASS |

No page-level horizontal overflow was measured. The filter rail remained contained in its intentional horizontal scroller.

### Privacy and security

For all three submitted onboarding flows:

- Final URL was `/opportunities` with no query or serialized answers.
- `localStorage` and `sessionStorage` were empty.
- Cookie string was empty.
- Resource Timing showed no non-localhost runtime requests.
- The remediation introduced no persistence, external catalog fetch, analytics, credential, or secret.

## Automated gates

Run independently from `apps/mobile`:

| Command | Exit code | Evidence |
|---|---:|---|
| `npm.cmd test -- --runInBand` | 0 | 4 suites, 210 tests, 0 snapshots, 78.976 s |
| `npx.cmd tsc --noEmit` | 0 | No diagnostics |
| `npm.cmd run lint` | 0 | Expo ESLint completed cleanly |
| `npm.cmd ls --depth=0` | 0 | Dependency tree resolved |
| `npx.cmd expo export --platform web` | 0 | 9 web bundles and 6 static routes exported |

No dependency manifest or lockfile changed in `ef15115..a69c658`. `git diff --check` passed.

The passing keyboard unit tests are insufficient evidence because their event object does not match the real browser event. The real Chromium failure is authoritative for this acceptance criterion.

## Accessibility assessment

- PASS: named checkbox roles, focusability, heading semantics, visible focus, mouse and touch operation, 44×44 targets.
- FAIL: Space activation.
- FAIL: checked state in Chromium AX after Enter-driven result change.
- FAIL: the Space path throws a runtime exception.

Overall accessibility result: **FAIL**.

## Limitations

- Chromium was headless; no native Android/iOS hardware, physical touchscreen, or native screen reader was available.
- The production web export completed, but browser interaction used the Expo development server. TASK-001 B4 was not retested or closed.
- External official sources were independently opened and compared, but no enrollment or external account workflow was attempted.
- The full TASK-002 Save/Cancel and browser Back/Forward manual matrix was not repeated. All three learner routes worked, TASK-002 product files were unchanged by this remediation, and the complete regression suite passed.

## Existing debt preserved

- **TASK-001 B3 — open release blocker:** inherited missing visible keyboard focus indicator.
- **TASK-001 B4 — open release blocker:** production initial-load tablet/desktop layout regression.
- **TASK-002 — nonblocking debt:** Back-versus-Cancel label ambiguity.

These items remain open and were not relabeled.

## Re-review requirements

1. Add and precisely cite the current 2026 ATC law/rule source for every mandatory-training, approved-provider, bar-card, and permit statement.
2. Correct the filter key handler to operate in real Chromium with Space and Enter without exceptions or duplicate activation.
3. Ensure the Chromium accessibility tree checked state and result count change together for keyboard, mouse, and touch activation.
4. Replace the misleading keyboard unit-event shape and add browser-realistic regression coverage.
5. Re-run all gates and fresh Chromium keyboard/AX checks.

Do not merge or deploy this branch in its current state.
