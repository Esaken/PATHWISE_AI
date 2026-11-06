# TASK-005 QA Review 4 — Production Chromium End-to-End Verification

**Branch:** `feature/task-005-healthcare-pathways`  
**Commit:** `593fb020dc7b0b39ebbe56db3a2a1601c246d0ff`  
**Base:** `main` at `9be4c0a091deaf09bd37cee9baae7b747af4c562`  
**Review date:** 2026-11-06  
**Verdict:** **FAIL**

T5-B3 is partially resolved: all four required onboarding-to-healthcare journeys, all six career routes, pointer interaction, Space activation, browser Back, missing-session redirects, catalog/recommendations navigation, responsive measurements, and visible focus were exercised in Chromium 156 against the production export. However, a focused healthcare career card did not activate with Enter. This is a reproducible TASK-005 keyboard blocker, T5-B4. The inherited TASK-001 B4 production initial-load defect also remains reproducible and is kept separate from TASK-005 acceptance.

T5-B1 and T5-B2 remain resolved and were not reopened.

## Test method and harness diagnosis

The existing `apps/mobile/dist` production export was served from `127.0.0.1:8096` and driven through Chromium's DevTools Protocol on port 9234. The harness used actual pointer and keyboard input events. It did not inject `SessionContext`, local/session storage, cookies, or application state.

Every transition used condition-based synchronization:

1. role-based pointer activation of the learner radio;
2. wait for exact `/onboarding/{type}` pathname;
3. wait for the next step's visible text and an interactable target;
4. activate the target; and
5. repeat after each step and route.

This corrected Review 3's timing problem. The welcome selector was consistently functional. The failed Enter check occurred after focus was programmatically placed on the same rendered focusable card that successfully responded to Space; repeating the key dispatch with Chromium virtual-key metadata did not navigate.

## Results

| Test case | Actual observed behavior | Status | Evidence/classification |
|---|---|---:|---|
| High school → RN | Completed real onboarding; `/healthcare` opened, then `/healthcare/pathways/rn`. Page stated “9 steps for high school learners” and showed science/math preparation and verify-with-provider guidance. Browser Back returned to `/healthcare`. | PASS | Real Chromium pointer journey; product behavior |
| College/University → RN | Completed real onboarding; exact RN route opened. Page stated “9 steps for university learners” and required confirmation of prerequisite equivalency rather than assuming transfer. | PASS | Real Chromium pointer journey |
| Adult → CNA | Completed real onboarding; `/healthcare/pathways/cna` opened. Six adult steps included LDH-approved training, the 80-hour core, separate clinical-site orientation, competency evaluation, registry placement, Delgado evidence, and verification warnings. | PASS | Real Chromium pointer journey |
| Adult → LPN | Completed real onboarding; `/healthcare/pathways/lpn` opened. Eight adult steps included prerequisite/transfer confirmation and practical-nursing/licensure guidance. | PASS | Real Chromium pointer journey |
| Six-career matrix | RN, LPN, CNA, Medical Assistant, Phlebotomy Technician, and Patient Care Technician opened `/healthcare/pathways/rn`, `/lpn`, `/cna`, `/medical-assistant`, `/phlebotomy`, and `/patient-care-technician`, respectively, with matching headings and learner-specific content. | PASS | Six real pointer activations and exact pathname assertions |
| Browser Back | Browser Back from every tested pathway returned to `/healthcare` with the adult session and cards intact. Back after recommendations/catalog also returned correctly. | PASS | Real browser history interaction |
| Healthcare → recommendations | Accessible control “View opportunity recommendations” opened `/recommendations`; healthcare/general-skills profile honestly displayed zero recommendations and the existing empty state. | PASS | Real pointer activation |
| Healthcare → catalog | Accessible control “Browse the full opportunity catalog” opened `/opportunities`; catalog and filters rendered. | PASS | Real pointer activation |
| Missing session | Fresh `/healthcare` navigation redirected safely to `/`. Fresh `/healthcare/pathways/not-real` also redirected to `/` because no in-memory session existed. | PASS | Fresh production navigation |
| Invalid career ID with a live session | A direct full-page invalid URL cannot preserve the in-memory-only session, and there is no UI control that generates an invalid ID. The no-session redirect was verified, but the in-session not-found branch was not reached without artificial router/state manipulation. | NOT VERIFIED | Honest harness limitation; no session injection used |
| Pointer/mouse activation | Learner radios, onboarding choices, navigation links, and all career cards activated once and reached the expected route. | PASS | Real CDP pointer press/release |
| Tab and visible focus | Tab moved among career cards. Focused Medical Assistant and Phlebotomy cards exposed their accessible labels and computed `box-shadow: rgb(108, 92, 231) 0 0 0 3px, rgb(255,255,255) 0 0 0 5px` plus browser outline. | PASS | Real key input plus computed-style inspection |
| Space activation | Focused LPN card activated once and navigated from `/healthcare` to `/healthcare/pathways/lpn`. | PASS | Real Chromium Space key sequence |
| Enter activation | Focused RN card remained at `/healthcare`; no pathway navigation occurred. Two runs, including native virtual-key metadata, produced the same result. | FAIL | Product defect T5-B4 |
| Roles/names | Career cards exposed focusable controls with accessible names such as “View Registered Nurse pathway”; navigation controls and source links exposed explicit accessible labels. | PASS | Rendered DOM/Chromium accessibility attributes |
| Official-source link keyboard activation | Source controls were present, named, focusable, and at least 44 px high. Opening an external source with Enter was not completed after the Enter defect was isolated. | NOT VERIFIED | Remaining keyboard interaction gap |
| 390×844 | CNA page measured `clientWidth=390`, `scrollWidth=390`; no undersized interactive targets; milestone content remained present. | PASS | Live DOM geometry |
| 768×1024 | CNA page measured `768/768`; no undersized interactive targets. | PASS | Live DOM geometry |
| 1440×900 | CNA page measured `1440/1440`; no undersized interactive targets. | PASS | Live DOM geometry |
| 44×44 targets | Across the measured CNA pathway, five visible interactive targets had minimum width 108.4 px and minimum height exactly 44 px; none were below 44×44. | PASS | `getBoundingClientRect()` |
| Runtime console | A production navigation emitted minified React hydration error #418 from the exported bundle. The app recovered and subsequent journeys rendered, but the exception violates the requested no-runtime-error check. | FAIL | Inherited production hydration/initial-load behavior; see TASK-001 B4 |
| Fresh desktop initial layout | At 1440×900, `clientWidth=scrollWidth=1440`, but the three welcome radios remained vertically stacked at x=260, width=920, y=246/414/582 instead of the approved desktop three-card row. | FAIL | Inherited TASK-001 B4, not a new TASK-005 defect |

No horizontal document overflow was found on the tested healthcare pathway at any required viewport. DOM geometry and content inspection found no clipped target, although the Windows visual-browser host was unavailable for a second screenshot channel; the primary test remained a real Chromium production session, not source inspection or component simulation.

## Blocking defect

### T5-B4 — Healthcare career cards do not activate with Enter

**Severity:** High — keyboard accessibility / mandatory acceptance blocker  
**Location:** `apps/mobile/src/app/healthcare/index.tsx:48` (the `CareerCard`), especially lines 58–65

#### Reproduction

1. Complete any learner onboarding that routes to `/healthcare` in the production web export.
2. Press Tab until a career card, such as “View Registered Nurse pathway,” has the visible purple/white focus ring.
3. Press Enter.

**Expected:** the card activates once and navigates to `/healthcare/pathways/rn`.  
**Actual:** the URL remains `/healthcare`; no navigation occurs. Pressing Space on the comparable LPN card does activate and navigate, confirming that focus and the card handler otherwise work.

The card is a React Native `Pressable` with `accessibilityRole="button"` and `onPress`, but the rendered web control did not provide working Enter activation. Remediation should preserve pointer/Space behavior and add browser-realistic coverage for both Enter and Space without double activation.

## Inherited defect kept separate

### TASK-001 B4 — production initial-load desktop layout/hydration

B4 remains open and release-blocking. A fresh 1440×900 production load showed the welcome cards as three stacked 920 px-wide rows, not the accepted desktop row, and Chromium captured React hydration error #418. This review does not relabel B4 as a TASK-005 defect or close it merely because healthcare pages themselves had no overflow.

## Accessibility and navigation notes

- Visible focus styling on TASK-005 career cards is present in `apps/mobile/src/app/healthcare/index.tsx:55-65` and passed computed-style inspection.
- Pathway Back and catalog controls provide explicit accessible labels at `apps/mobile/src/app/healthcare/pathways/[careerId].tsx:229-248`.
- Official sources provide explicit names at `apps/mobile/src/app/healthcare/pathways/[careerId].tsx:392-402`; their external Enter activation remains unverified because the same Pressable-web keyboard behavior warrants remediation first.
- Invalid-ID fallback content exists at `apps/mobile/src/app/healthcare/pathways/[careerId].tsx:190-219`, but a live in-memory session could not be retained through direct full-page invalid URL entry. No state bypass was used.

## Limitations

- Screenshot capture through the secondary in-app browser was unavailable (`browser access host is unavailable`). Browser evidence above comes from the primary Chromium 156 CDP session, including actual paths, text, accessibility attributes, computed styles, geometry, history behavior, and runtime exceptions.
- Invalid career fallback with an already-live session and external official-source Enter activation remain NOT VERIFIED.
- Automated/factual gates were not rerun in this browser-recovery review. Review 2 already recorded all 490 tests and the factual remediation as passing at this same commit; this review was scoped to closing the real-Chromium matrix.
- The working tree already contained untracked Review 2/3 reports and QA harness material. No product file was modified.

## Final decision

**FAIL.** T5-B3's journey and responsive-verification gap is substantially closed, but mandatory keyboard verification found T5-B4: focused healthcare career cards do not activate with Enter. TASK-005 is not ready to merge. Remediate T5-B4, retain Space/pointer/focus behavior, and rerun focused production-Chromium keyboard checks for career cards and official-source links. TASK-001 B4 remains a separate inherited release blocker.
