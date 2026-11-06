# TASK-003 Independent QA Review 2

**Date:** 2026-11-05  
**Reviewer:** Codex  
**Branch:** `feature/task-003-opportunity-catalog`  
**Implementation reviewed:** `ef15115`  
**Base:** `feature/task-002-onboarding` at `f048758`  
**Result:** **FAIL**

## Decision

The remediation resolves T3-B1, T3-B3, and T3-B4. T3-B2 is only partially resolved and remains blocking. A new blocking keyboard defect was also found: catalog filter checkboxes do not activate with Space. Evidence metadata for Modern States and CLEP still omits official pages used for material claims.

TASK-003 is not ready for feature-branch QA approval or merge.

## Remediation verdicts

### T3-B1 — CLEP duration and delivery: RESOLVED

`apps/mobile/src/catalog/data.ts:141-187` now:

- Uses typed unknown duration rather than a universal 90-minute value.
- Explains that duration is exam-specific.
- Correctly gives College Composition as 125 minutes and Spanish with Writing as 110 minutes.
- Uses hybrid availability and conditions remote delivery on eligibility.
- Retains the institution-confirmation disclaimer; no credit is guaranteed.

Independent official-source verification:

- [College Composition](https://clep.collegeboard.org/clep-exams/college-composition) states 125 minutes.
- [Spanish with Writing](https://clep.collegeboard.org/prepare-for-an-exam/study-resources-by-exam/spanish-with-writing) states 110 minutes.
- [CLEP remote proctoring](https://clep.collegeboard.org/about-remote-proctoring/take-clep-exam-remote-proctoring) confirms home testing, eligibility restrictions, and test-center fallback.
- The [CLEP exam list](https://clep.collegeboard.org/clep-exams) supports the $97 registration price.

The record's examples are accurate. Evidence-link completeness remains an issue under T3-B6 below.

### T3-B2 — Louisiana Responsible Vendor accuracy: PARTIALLY RESOLVED, STILL BLOCKING

Resolved portions in `apps/mobile/src/catalog/data.ts:193-242`:

- Provider is now “ATC-Approved Responsible Vendor Training Providers,” not ATC itself.
- Copy distinguishes ATC as administrator/regulator from independent approved providers.
- Availability is hybrid/provider-dependent rather than in-person-only.
- Provider-specific price, duration, delivery, and schedule remain explicitly unknown.
- The unsupported penalty-reduction claim was removed.

Remaining blocker:

- The catalog stores the 2025-11-07 provider-list URL at `data.ts:229-234`, but the live [ATC Responsible Vendor page](https://atc.louisiana.gov/responsible-vendors/responsible-vendor-information/) currently links to `rv-list_9-23-26.pdf`. A record checked on 2026-11-04 cannot call the older 2025 list the current approved-provider evidence.
- The ATC information page contains bar-card retrieval and a provider-list link; it does not contain the asserted legal basis, course/exam sequence, or “completion certificate” claims. The record says the information page confirms those facts, but it does not. The applicable current ATC lawbook/rules must be stored and cited claim-by-claim.
- The wording “after completing ... training ... pass a separate exam” and “completion certificate” is not supported by the two stored sources and may misstate a provider-administered course/examination process as sequential independent products.

**Reproduction:** Open the live ATC information page and follow “Responsible Vendor Provider List”; compare its current target with `verification.sourceUrls`. Then compare `data.ts:197,234,239-240` with the content of the two stored sources.

**Required correction:** Store the current ATC-linked provider list and the current official rule/law source supporting every legal, examination, permit-card, and outcome statement. Rewrite the sequence using the official terminology exactly. If “completion certificate” cannot be verified, remove it or mark the outcome unknown. Do not infer provider approval from an old list.

### T3-B3 — Cisco durations: RESOLVED

- `cisco-intro-cybersecurity` stores 6 hours.
- `cisco-networking-basics` stores 22 hours.
- Evidence notes and displayed cards now agree with the official pages.
- Both remain free, self-paced, online, and skills-only.

Verified independently against [Cisco Introduction to Cybersecurity](https://www.netacad.com/courses/introduction-to-cybersecurity) and [Cisco Networking Basics](https://www.netacad.com/courses/networking-basics).

### T3-B4 — 44×44 interaction targets: RESOLVED

Fresh Chromium DOM measurements:

| Viewport | document clientWidth | document scrollWidth | Smallest visible catalog target | Below 44 px |
|---|---:|---:|---:|---:|
| 320×800 | 320 | 320 | 44×44 px | 0 |
| 390×844 | 390 | 390 | 44×44 px | 0 |
| 768×1024 | 768 | 768 | 44×44 px | 0 |
| 1440×900 | 1440 | 1440 | 44×44 px | 0 |

All filter chips, Personalize, Clear, empty-state recovery, cards, and visible actions met the target minimum. No page-level horizontal overflow was measured. The intentionally wide filter rail remains contained in its horizontal scroller.

## Additional blocking defects

### T3-B5 — High — Space does not activate catalog filter checkboxes

**Location:** `apps/mobile/src/components/catalog/FilterBar.tsx:16-38`

Chromium Tab navigation reached the University filter and displayed the visible purple/white focus ring (`box-shadow` 3 px plus 5 px). Pressing Space left the result count at five and the Chromium accessibility-tree checked state remained false. Mouse activation works. `Chip` supplies only `onPress`; unlike the onboarding radio component, it has no web key handler for Space.

This violates the TASK-003 keyboard requirement for accessible filter controls.

**Required correction:** Implement Space and Enter activation without double-firing, preserve native/React Native behavior on other platforms, and add browser-level regression coverage for checked-state and result-count synchronization.

### T3-B6 — High — Material evidence claims are not linked in record metadata

**Locations:** `apps/mobile/src/catalog/data.ts:127-129`, `data.ts:175-183`

- Modern States evidence notes quote the official helpdesk policy and describe voucher qualification, but `sourceUrls` contains only `https://modernstates.org`. The homepage supports free/flexible course availability, while the exact voucher qualification and institution-policy wording is on the [official Modern States helpdesk article](https://helpdesk.modernstates.org/support/solutions/articles/151000233533-can-i-start-earning-college-credit-with-clep-).
- CLEP evidence notes and duration reason cite the 125- and 110-minute exam examples, but neither exam-specific official page is in `sourceUrls`.

The facts independently verify, but the catalog does not meet its own traceability rule that each material claim be backed by stored official evidence.

**Required correction:** Add the exact official pages to each record's evidence tuple and keep evidence notes aligned with the stored URLs.

## Five-record verification matrix

| Record | Independent official-source result | Result |
|---|---|---|
| Cisco Introduction to Cybersecurity | Provider/title/free/self-paced/online/6 hours supported | PASS |
| Cisco Networking Basics | Provider/title/free/self-paced/online/22 hours supported | PASS |
| Modern States CLEP preparation | Free, flexible CLEP preparation and conditional voucher path supported; credit remains institution-dependent; exact policy page missing from stored evidence | FAIL — evidence metadata |
| College Board CLEP | $97, exam-specific duration, remote/test-center delivery, eligibility conditions, and non-guaranteed credit are accurate; exam-specific duration URLs missing from stored evidence | FAIL — evidence metadata |
| Louisiana Responsible Vendor | ATC-versus-provider and hybrid delivery corrections are directionally accurate; stored provider list is obsolete and legal/exam/outcome claims are unsupported by stored sources | FAIL |

## Real Chromium functional evidence

Fresh Chromium was used against the remediation build; prior screenshots/captures were not reused.

### Complete onboarding-to-catalog flows

- High school: 10th grade → Build career skills → Technology & Computing → Free only → Review → Submit. Navigated to `/opportunities`; two results: Introduction to Cybersecurity and Networking Basics.
- University: Computer Science & IT → Explore possible college-credit options → Technology & Computing → Flexible → Review → Submit. Navigated to `/opportunities`; four results: both Cisco courses, Modern States, and CLEP.
- Adult: Something else (“Responsible Vendor training”) → Complete job-related training → Flexible → Louisiana → Review → Submit. Navigated to `/opportunities`; one result: Louisiana Responsible Vendor Training.

All three flows reached a review screen before submission and transferred answers through the session to `/opportunities`.

### Catalog interaction

- Direct catalog entry showed all five records.
- High-school + Responsible Vendor filters produced the honest zero-results state with “No matching opportunities found.”
- Clear filters restored all five records.
- Detail navigation reached `/opportunities/clep-exam-program` and displayed the exam-specific duration warning and remote/test-center delivery.
- `/opportunities/not-a-real-id` displayed safe recovery to browse all opportunities.
- Mouse/click filter interaction synchronized results and accessibility checked state.
- Chromium AX exposed named, focusable checkbox controls and a level-1 “Learning Opportunities” heading.
- Tab focus was visible. Space activation failed as T3-B5; therefore keyboard QA does not pass.

### Privacy

For all three completed flows:

- Final URL was exactly `/opportunities`; answers were absent from the URL/query.
- `localStorage`, `sessionStorage`, and cookies were empty.
- Chromium Resource Timing showed no non-localhost runtime requests.
- Source inspection found no new persistence, analytics, catalog fetch, or client secret.

## TASK-002 regression evidence

- All three learner pathways, required step advancement, review, and submission worked in Chromium.
- The full Jest suite includes the previously approved Save/Cancel, validation, keyboard-radio, and history regression tests and passed 206/206.
- TASK-003 changed no TASK-002 onboarding product file in this remediation commit.

The exhaustive QA Review 4 edit/history matrix was not manually repeated in this run; this is recorded as a limitation rather than claimed as fresh browser coverage.

## Automated gates

Run independently from `apps/mobile`:

| Command | Exit code | Evidence |
|---|---:|---|
| `npm.cmd test -- --runInBand` | 0 | 4 suites, 206 tests, 0 snapshots, 63.247 s |
| `npx.cmd tsc --noEmit` | 0 | No diagnostics |
| `npm.cmd run lint` | 0 | Expo ESLint completed cleanly |
| `npm.cmd ls --depth=0` | 0 | Dependency tree resolved |
| `npx.cmd expo export --platform web` | 0 | 9 bundles, 6 static routes |

No dependency manifest or lockfile changed in `04f0731..ef15115`. `git diff --check` passed.

## Limitations

- Chromium was headless but used its real DOM, keyboard event pipeline, layout engine, resource timing, and accessibility tree.
- Native Android/iOS devices, native screen readers, physical touch hardware, and offline browser network emulation were not tested.
- The external provider pages were independently opened for source review, but the app's popup/tab completion was not followed through as an end-to-end enrollment action.
- Production export succeeded, but the complete Chromium matrix used the Expo development server. TASK-001 B4 therefore remains open and was not retested or closed here.
- TASK-002's exhaustive manual Save/Cancel and Back/Forward matrix was not repeated; the unchanged code and passing regression suite provide partial, not exhaustive, evidence.

## Existing debt preserved

- **TASK-001 B3 — open release blocker:** missing visible keyboard focus indicator in the inherited TASK-001 surface.
- **TASK-001 B4 — open release blocker:** production web export initially renders the mobile layout at tablet/desktop widths.
- **TASK-002 — nonblocking debt:** Back-versus-Cancel label ambiguity.

None was relabeled or closed.

## Re-review requirements

Before QA Review 3:

1. Correct the Louisiana record using the live ATC-linked provider list and exact current official legal/rule sources.
2. Remove or directly substantiate the “separate exam,” “completion certificate,” server-card sequence, and all legal requirement claims.
3. Add the exact Modern States and CLEP exam-specific official pages to stored evidence metadata.
4. Make every filter operable by both Space and Enter and verify AX checked-state/result synchronization.
5. Repeat all automated gates and fresh Chromium flow/viewport/keyboard checks.

Do not merge or deploy this branch in its current state.
