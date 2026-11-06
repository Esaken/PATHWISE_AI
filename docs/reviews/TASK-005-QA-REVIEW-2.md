# TASK-005 Independent QA Review 2

**Branch:** `feature/task-005-healthcare-pathways`
**Commit:** `593fb02`
**Base:** `main` at `9be4c0a`
**Verdict:** **FAIL â€” mandatory Chromium verification incomplete**

The two product blockers from Review 1 are resolved in source, data, and regression tests. I found no new factual blocker in the remediation. TASK-005 is nevertheless not QA-approved because the mandatory real-Chromium journey/accessibility matrix remains NOT VERIFIED.

## Blocker status

- **T5-B1 RESOLVED.** `careers.ts:194,217`, all three CNA milestone sets (`pathways.ts:469,518-520,569-571`), and Delgado CNA (`programs.ts:248`) consistently state an 80-hour core curriculum. Clinical-site orientation is explicitly separate and excluded from the core. Repository search found no remaining application-content claim that Louisiana requires 75 hours.
- **T5-B2 RESOLVED.** Medical Assistant, Phlebotomy, and PCT routes now use `typicalDurationMonths: null` (`careers.ts:247,258,314,369`). Numeric unsupported ranges were removed from all milestones and replaced with program-dependent wording plus `requiresConfirmation: true`.
- **T5-B3 OPEN (QA verification blocker).** The required production-Chromium journeys, keyboard matrix, three viewport measurements, and runtime-console review were not completed in this review. This is not a demonstrated product defect, but the user explicitly made it mandatory; therefore the feature cannot receive PASS.

## Primary-source verification

- Louisiana's current [NATCEP rule](https://ldh.la.gov/assets/medicaid/hss/NurseAide/NATCEP_LAC_11.29.23.pdf) supports the 80-hour core and separate clinical-site orientation language.
- Delgado's [official CNA page](https://dcc.edu/academics/charity-school-nursing/programs/certified-nursing-assistant.aspx) confirms an eight-week program, at least 80 hours including 40 hours in long-term care, LDH approval, and an **estimated** $1,673.66 tuition/fees figure. `programs.ts:248-250` matches and labels the price an estimate requiring confirmation.
- The [LDH Delgado directory entry](https://ldh.la.gov/directory/detail/19331) independently identifies Delgado as a CNA training school.
- The current [LSBPNE program list](https://www.lsbpne.la.gov/education/pn-program-list/) supports BRCC Acadian Campus **PROVISIONAL**, Delgado City Park **PROVISIONAL**, and Delgado Sidney Collier **FULL** for 2025â€“26. `programs.ts:182-193,219-230` now preserves those distinctions and links regulator evidence.
- Institution-source verification and regulatory approval are separate fields. UI program cards show source verification while visible warnings disclose provisional/campus-specific regulatory status. The wording is materially safer than Review 1.

## Test quality and count reconciliation

The healthcare test file has **36** additional `test()` declarations (78 before, 114 after), not 35. Total Jest count increased exactly from 454 to 490. The new tests meaningfully cover:

- 80 hours and separate orientation across all learner categories;
- absence of 75-hour data;
- null allied-health durations and confirmation flags;
- BRCC/Delgado campus-specific provisional status;
- Delgado CNA official URL, approval, and estimated tuition;
- separation of source verification from regulatory approval.

## Regression assessment

Code inspection and the full 490-test suite confirm TASK-004's topical relevance gate, category-compatible semantics, deterministic ordering, healthcare-only empty recommendations, and existing technology/college-credit scenarios remain intact. No dependency or paid API was added. Prior TASK-001 B3/B4 and TASK-002 label debt remain open and are not relabeled here.

## Chromium

**NOT VERIFIED.** Review 1's automation issue was not successfully overcome in this review. I do not claim browser evidence from source inspection. The following remain mandatory for the next review: high-school RN, college RN, adult CNA/LPN, all six cards, Back, invalid-ID fallback, missing-session redirects, healthcare-to-recommendations, Tab/Enter/Space/mouse, visible focus, roles/names, source links, 44Ã—44 targets, runtime errors, and overflow at 390Ã—844, 768Ã—1024, and 1440Ã—900.

## Automated validation

| Command | Exit | Result |
|---|---:|---|
| `npm.cmd test -- --runInBand` | 0 | 6 suites; **490/490** tests; 65.988 s |
| `npx.cmd tsc --noEmit` | 0 | No diagnostics |
| `npm.cmd run lint` | 0 | PASS |
| `npm.cmd ls --depth=0` | 0 | No unmet/extraneous dependency reported |
| `npx.cmd expo export --platform web` | 0 | 12 bundles; 9 static routes; `dist` exported |
| `git diff --check main...HEAD` | 0 | No whitespace errors |

## Merge recommendation

**Do not merge yet.** T5-B1 and T5-B2 are remediated, but TASK-005 requires one further independent review that completes the mandatory production-Chromium matrix. If that matrix passes, no remaining source/data blocker identified here would prevent approval.
