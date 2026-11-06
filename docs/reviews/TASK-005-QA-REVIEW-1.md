# TASK-005 Independent QA Review 1

**Branch:** `feature/task-005-healthcare-pathways`
**Implementation:** `979a65a`
**Base:** `main` at `9be4c0a`
**Review date:** 2026-11-06
**Verdict:** **FAIL**

The module is structurally strong and all automated gates pass, but it contains a release-blocking Louisiana CNA training-hours error and unsupported allied-health duration claims. Healthcare guidance cannot pass QA while state training requirements or program durations are stated without matching primary evidence.

## Repository integrity

- Branch and commit match the handoff: `feature/task-005-healthcare-pathways` at `979a65a8f2ab3b0be405516d0741a23aae52a09d`.
- Base `main` is `9be4c0a091deaf09bd37cee9baae7b747af4c562`.
- The worktree was clean before this report. This report is the only intentional untracked QA artifact.
- The commit contains the four healthcare data/engine files, two healthcare routes, healthcare tests, onboarding routing changes, catalog topic additions, matching mappings, and TASK-005 documentation.
- No unexpected dependency or paid-API integration was introduced.
- The trailing handoff tracker about unfinished TASK-003 sourcing/filter keyboard work is stale. TASK-003 QA Review 5 records PASS, its remediations are in `main`, and the 454-test regression suite remains green. It is not evidence of a current TASK-005 defect.

## Blocking findings

### T5-B1 — False Louisiana CNA minimum training requirement

**Severity:** Critical factual accuracy / blocking

**Files:**

- `apps/mobile/src/healthcare/careers.ts:194`
- `apps/mobile/src/healthcare/programs.ts:241-242`
- `apps/mobile/src/healthcare/pathways.ts:465-470`
- `apps/mobile/src/healthcare/pathways.ts:516-520`
- `apps/mobile/src/healthcare/pathways.ts:567-571`

The app repeatedly says Louisiana requires a minimum of **75 hours** of CNA training. Current Louisiana Department of Health rules require an **80-hour core curriculum**, and the clinical-site orientation is a separate minimum four hours not included in those 80 hours. Delgado's current official program page likewise says its program contains at least 80 hours, including 40 hours in a long-term-care facility.

Primary evidence:

- [Louisiana NATCEP rule](https://ldh.la.gov/assets/medicaid/hss/NurseAide/NATCEP_LAC_11.29.23.pdf) — requires 80 hours and separately addresses clinical-site orientation.
- [LDH nurse aide training and certification](https://ldh.la.gov/health-standards-section/nurse-aide-cna-training-and-certification) — requires state-approved NATCEP/competency compliance.
- [Delgado CNA program](https://dcc.edu/academics/charity-school-nursing/programs/certified-nursing-assistant.aspx) — current program states at least 80 hours.

**Expected:** State the current Louisiana 80-hour requirement accurately, cite LDH directly, and distinguish the separate orientation requirement where described.

**Actual:** All high-school, university, and adult CNA pathways repeat 75 hours, and the Delgado program record labels the same number as Louisiana's requirement.

**Remediation:** Correct every affected data record and milestone using the current LDH rule. Add a test that asserts the Louisiana requirement against the stored value. Do not substitute the federal 75-hour floor for Louisiana's 80-hour rule.

### T5-B2 — Allied-health duration ranges lack claim-level evidence

**Severity:** High factual traceability / blocking

**Files:**

- `apps/mobile/src/healthcare/careers.ts:240-258` (medical assistant 9–12/18–24 months)
- `apps/mobile/src/healthcare/careers.ts:303-314` (phlebotomy 1–6 months)
- `apps/mobile/src/healthcare/careers.ts:358-369` (PCT 3–6 months)
- Repeated as definitive education milestones in `apps/mobile/src/healthcare/pathways.ts:620-625`, `:673-676`, `:722-727`, `:783-788`, `:826-831`, `:869-874`, `:930-935`, `:981-986`, and `:1032-1037`.

The stored source inventory links only broad organization homepages (AAMA, NPA, NHA, and LCTCS). It does not store a source URL or evidence note supporting the exact duration ranges. Several milestones set `requiresConfirmation: false`, making the ranges appear established rather than illustrative/unknown.

TASK-005 explicitly prohibits invented duration and cost data. Generic certification/college-system homepages do not verify these exact ranges across programs.

**Remediation:** Either attach direct official evidence supporting each exact duration claim and clearly scope it, or replace the ranges with unknown/program-dependent language and require confirmation. Add tests that prevent numeric duration claims without claim-level source evidence.

## Nonblocking findings

### T5-N1 — BRCC PN regulatory status is more current than the app record

`programs.ts:211-225` marks LSBPNE approval as `needs-verification`, while the current official [LSBPNE approved PN list](https://www.lsbpne.la.gov/education/pn-program-list/) lists BRCC with **PROVISIONAL** status for 2025–26. The app does warn users to confirm approval, so it does not falsely claim full approval; however, its card-level `verificationStatus` is `verified-official-source` and renders `Verified 2026-11-05`, which can be read more broadly than “the institution page exists.” Store the current regulator URL/status and clarify what the Verified badge covers.

### T5-N2 — Delgado CNA is unnecessarily stale, but displayed honestly

The Delgado CNA record is marked `needs-recheck`, and the UI renders `Needs recheck — last reviewed 2026-11-05` plus warnings not to assume approval, availability, cost, or schedule. This satisfies the honesty requirement.

Current primary sources now provide stronger evidence:

- Delgado's [specific CNA page](https://dcc.edu/academics/charity-school-nursing/programs/certified-nursing-assistant.aspx) confirms the program, LDH approval, eight-week delivery, at least 80 training hours, published estimated tuition/fees, qualifications, and 2026 sessions.
- The [LDH Delgado listing](https://ldh.la.gov/directory/detail/19331) identifies Delgado Community College Workforce as a certified nurse aide training school.

The record should be refreshed rather than excluded, but its current “needs recheck” presentation is conservative and not itself blocking.

### T5-N3 — `eligibility-unconfirmed`/approval semantics remain coarse

Program-level `verified-official-source` means the official institution page was checked; it does not necessarily mean regulatory approval was confirmed. The UI should label source verification and approval verification separately to prevent ambiguity.

## Program and source audit

| Record | Official page / existence | Key claims | Regulatory/accreditation assessment |
|---|---|---|---|
| Delgado ADN | Confirmed on current Delgado Charity School pages | Program exists; Delgado page states 2.5 years, while app conservatively says duration not confirmed and “typical” | ACEN continuing accreditation and LSBN full approval are supported by Delgado and LSBN primary sources. |
| BRCC ASN | Confirmed on current BRCC page | Five semesters, 72 credits, 2.8 prerequisite GPA, 65% TEAS, competitive admission, and current application cycle are supported | BRCC states ACEN continuing accreditation with removal of conditions; LSBN current published materials list the ASN program. |
| LSU Health Traditional BSN | Confirmed | Three years after prerequisites, competitive admission, 3.0 GPA, science-grade and HESI requirements are broadly supported | LSU page states the program prepares for NCLEX; accreditation/approval should continue to be checked with CCNE/LSBN. The current admission page contains nuanced grade wording; learners are correctly told to verify. |
| Delgado PN | Confirmed | Program exists; app does not invent tuition | Current LSBPNE list shows City Park provisional and Sidney Collier full status for 2025–26. The app's generic “approved” statement lacks this campus/status nuance. |
| BRCC PN | Confirmed | Five semesters, 59 credits, Acadian site, limited enrollment, NCLEX-PN eligibility are supported | Current LSBPNE list shows provisional status; app leaves approval unverified and warns users. |
| Delgado CNA | Confirmed by specific Delgado and LDH pages | Program exists, but app's 75-hour claim is false; official page states at least 80 hours | Current Delgado page expressly states LDH approval. App conservatively shows needs-recheck but should refresh evidence. |

No stored healthcare URL was fabricated. All five unique institution URLs resolve to the claimed institution/program family. The principal sourcing defects concern claim precision and current regulator evidence, not nonexistent providers.

## Healthcare career and pathway model

- Six unique stable IDs are present: `rn`, `lpn`, `cna`, `medical-assistant`, `phlebotomy`, and `patient-care-technician`.
- Careers, education routes, institution programs, and learner pathways are represented as distinct types.
- `buildHealthcarePathway()` is deterministic, validates the career ID, branches on learner category, returns null for invalid IDs/missing combinations, and filters linked programs by career ID.
- All 18 career/category combinations exist and return distinct milestone arrays keyed by career and learner type; they are not label-only copies.
- High-school pathways distinguish preparation/exploration from admission and professional licensure.
- University RN pathways explicitly require confirmation of prerequisites and transfer credit.
- Adult RN accelerated/bridge language is conditional and does not assume a prior bachelor's degree or LPN license.
- RN and LPN education is not presented as automatic licensure; NCLEX and state-board steps are separate.
- CNA competency/registry steps are distinct from RN/LPN licensure.
- Medical assistant, phlebotomy, and PCT are described as employer/national-certification driven rather than universally state licensed.
- Missing optional onboarding answers do not fabricate prerequisite completion.
- Allied-health pathways with no linked Louisiana programs show general milestones and no fabricated program cards.

The model itself is maintainable: adding a career requires coordinated entries in career data, 3 milestone arrays, verification/disclaimer maps, and tests, but does not require changes across unrelated application modules. Adding a state would require a broader refactor because current regulator language and program data are Louisiana-specific.

## TASK-004 matching regression

- `CAREER_TOPICS.healthcare` and health-related study areas map to healthcare topics, but the existing opportunity catalog has no healthcare records. Healthcare-only profiles therefore yield the honest empty recommendation state rather than unrelated Cisco recommendations.
- Location, budget, baseline, and category compatibility still cannot independently qualify an opportunity.
- `category-compatible` remains conservative and is not shown as confirmed eligibility.
- Existing technology and college-credit matching tests remain green and deterministic.
- Healthcare career selection is connected to the new pathway screens, not to individual healthcare opportunity records. Program cards are a separate curated healthcare-program collection. This is an explicit prototype limitation, documented in TASK-005.

## Chromium status

The production export was built successfully and a local Chromium session was started. A complete healthcare end-to-end browser matrix was **NOT VERIFIED** in this review: the automation environment did not reliably change the welcome-screen learner radio before onboarding, so continuing would have produced mislabeled scenario evidence. No browser PASS is claimed for Scenarios A–F.

Source and rendered-component inspection confirms:

- healthcare career cards are Pressables with accessible labels and focus styles;
- pathway source/program links use link roles and accessible names;
- missing-session guards redirect `/healthcare` and pathway routes to `/`;
- invalid career IDs render the implemented safe fallback;
- program cards visibly render `Verified` versus `Needs recheck` status and warnings;
- responsive max-width/min-target styles are present.

The following mandatory items remain NOT VERIFIED in real Chromium: all six card routes, Back behavior, adult/college/high-school complete journeys, 390/768/1440 runtime overflow measurements, Enter/Space activation, and runtime-console monitoring. This limitation does not change the FAIL verdict because T5-B1/T5-B2 are independently established blockers, but they must be completed in remediation QA.

## Automated validation

All commands were run independently from `apps/mobile` at `979a65a`.

| Command | Exit | Result |
|---|---:|---|
| `npm.cmd test -- --runInBand` | 0 | 6 suites; **454/454 tests passed**; 0 snapshots; 63.704 s |
| `npx.cmd tsc --noEmit` | 0 | No diagnostics |
| `npm.cmd run lint` | 0 | Expo lint completed without findings |
| `npm.cmd ls --depth=0` | 0 | Dependency tree resolved; no unmet/extraneous dependency reported |
| `npx.cmd expo export --platform web` | 0 | 12 web bundles; 9 static routes including healthcare routes; `dist` exported |
| `git diff --check main...HEAD` | 0 | No whitespace errors |

The 168 healthcare tests exercise catalog integrity, all 18 pathway combinations, ordering/structure, invalid IDs, linked programs, disclaimers, deterministic output, and empty program lists. They do not validate claims against primary evidence and currently encode the incorrect 75-hour figure indirectly rather than preventing it.

## Documentation assessment

TASK-005 documents healthcare-first scope, types, learner personalization, program verification statuses, source inventory, limitations, navigation, tests, and future expansion. It accurately states that healthcare matching has no general-catalog records and that the module uses no external API. Its claim that all program records were verified requires nuance because BRCC PN approval remains unverified and Delgado CNA evidence is stale despite a current direct page.

## Remaining limitations

- Complete real-Chromium journeys and responsive/accessibility measurements are NOT VERIFIED as described above.
- Native Android/iOS builds and physical screen readers were not run.
- This review verified program claims against accessible primary web sources; it did not independently contact regulators or institutions.
- Program availability can change after the checked date and must continue to be revalidated.

## Merge recommendation

**Do not merge TASK-005.** Correct T5-B1, provide claim-level evidence or unknown handling for T5-B2, refresh regulatory/program verification metadata, add factual regression tests, and return the branch for independent source and Chromium QA.
