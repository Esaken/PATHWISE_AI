# TASK-003 Independent QA Review 1

**Date:** 2026-11-05  
**Reviewer:** Codex (independent QA supervisor)  
**Branch:** `feature/task-003-opportunity-catalog`  
**Implementation reviewed:** `04f0731`  
**Base:** `feature/task-002-onboarding` at `f048758`  
**Result:** **FAIL**

## Executive result

TASK-003 is not ready for QA approval. The implementation compiles, lints, exports, and passes its Jest suite, and its typed schema/filtering foundation is generally sound. However, three catalog records contradict their cited official sources, the two Cisco records contain false verification notes about duration, and every catalog filter has a 32 px interaction target instead of the required 44 px minimum. These are release-blocking because TASK-003 explicitly requires a verifiable catalog and accessible touch controls.

TASK-001 B3 and B4 remain open, separate release blockers. The TASK-002 Back-versus-Cancel wording remains nonblocking technical debt.

## Blocking defects

### T3-B1 — Critical — CLEP record presents a program-wide 90-minute duration and omits remote delivery

**Location:** `apps/mobile/src/catalog/data.ts:159-170`

The record models the whole CLEP program with `minutes: 90` and `availability: 'in-person'`. The official College Board pages do not support either claim as a universal value:

- [College Composition](https://clep.collegeboard.org/clep-exams/college-composition) is 125 minutes.
- [Spanish with Writing](https://clep.collegeboard.org/clep-exams/spanish-with-writing) is 110 minutes.
- [College Board remote proctoring](https://clep.collegeboard.org/about-remote-proctoring/take-clep-exam-remote-proctoring) states all 34 CLEP exams are available through remote proctoring for eligible test takers.

The $97 exam fee is supported by the [official CLEP exam list](https://clep.collegeboard.org/clep-exams), and the record correctly labels credit as potential and institution-dependent rather than guaranteed.

**Reproduction:** Open `/opportunities/clep-exam-program`; observe “90 minutes” and “In person.” Compare with the official exam-specific and remote-proctoring pages above.

**Required correction:** Do not assign one duration to the program. Model duration as exam-specific/unknown at the catalog-record level and state that users must check the selected exam. Represent delivery as hybrid or otherwise accurately conditional on test-center/remote-proctoring eligibility. Review the broad eligibility sentence against College Board's official eligibility restrictions.

### T3-B2 — Critical — Louisiana Responsible Vendor record misidentifies delivery/provider and includes unsupported outcome language

**Location:** `apps/mobile/src/catalog/data.ts:191-237`

The record identifies Louisiana ATC as the provider and marks the opportunity as in-person. ATC administers/regulates the program; training is delivered by approved providers. The record's own [official provider list](https://atc.louisiana.gov/media/5e4bsyim/responsible-vendor-provider-list-updated-11-7-25.pdf) contains online-only and online/classroom providers, so `availability: 'in-person'` is false. The outcome text about a completion certificate supporting “permit penalty reduction” is not established by the two stored source URLs and risks conflating vendor certification, server permits, training/exam completion, and statutory mitigation.

The implementation does correctly leave provider-specific price and duration unknown and tells users to confirm current providers, prices, and schedules. The [ATC Responsible Vendor information page](https://atc.louisiana.gov/responsible-vendors/responsible-vendor-information/) and provider list are official sources.

**Reproduction:** Open `/opportunities/louisiana-responsible-vendor`; compare provider, delivery, description, and outcome with both stored ATC sources.

**Required correction:** Identify ATC as the administering authority and approved providers as training providers. Represent delivery as provider-dependent/hybrid. Remove or precisely source the penalty-reduction statement, and distinguish the training course, exam, server permit/card, vendor certification, and employer/legal requirements. Keep provider-specific cost and schedule unknown unless an approved provider's current official page is separately cited.

### T3-B3 — High — Cisco records claim duration is not stated although official pages state 6 and 22 hours

**Locations:** `apps/mobile/src/catalog/data.ts:25-44`, `apps/mobile/src/catalog/data.ts:69-88`

Both records use unknown duration and their verification notes explicitly say duration is not stated. The cited official pages currently state:

- [Introduction to Cybersecurity](https://www.netacad.com/courses/introduction-to-cybersecurity): free, self-paced, 6 hours.
- [Networking Basics](https://www.netacad.com/courses/networking-basics): free, self-paced, 22 hours.

Provider, title, free price, beginner level, and self-paced presentation are otherwise supported. The current evidence notes are demonstrably stale/false and violate the verifiability requirement.

**Required correction:** Store the official durations, update evidence notes, and re-check learner eligibility wording against the cited page. Add a separate official source if a claim is not present on the stored official URL.

### T3-B4 — High — Catalog filters and header actions fail the 44 px interaction-target requirement

**Locations:** `apps/mobile/src/components/catalog/FilterBar.tsx:262`, `apps/mobile/src/app/opportunities/index.tsx:190`, `apps/mobile/src/app/opportunities/index.tsx:204`

Fresh Chromium DOM measurements at 320, 390, 768, and 1440 CSS-pixel widths measured every filter chip at 32 px high. “Personalize results” and “Clear all active filters” were also 32 px high. TASK-003 requires at least 44×44 CSS pixels for interactive targets.

**Reproduction:** Open `/opportunities`, inspect the bounding rectangle of elements with `role="checkbox"` and the two header actions. Each affected element reports 32 px height.

**Required correction:** Make each interactive hit target at least 44×44 CSS px without introducing clipping or obscuring the horizontal filter affordance. Re-test keyboard focus and touch at all required widths.

## Catalog verification matrix

| Record | Official-source result | QA result |
|---|---|---|
| Cisco Introduction to Cybersecurity | Title/provider/free/self-paced supported; official page states 6 hours, contradicting unknown duration and evidence note | FAIL |
| Cisco Networking Basics | Title/provider/free/self-paced supported; official page states 22 hours, contradicting unknown duration and evidence note | FAIL |
| Modern States CLEP preparation | Official homepage supports free, flexible CLEP preparation. Classification is potential/institution-dependent, not guaranteed. Voucher-detail wording should be backed by a directly stored official policy URL | PASS with evidence improvement |
| College Board CLEP | $97 and non-guaranteed institutional recognition are correctly presented; universal 90-minute duration and in-person-only delivery are false | FAIL |
| Louisiana Responsible Vendor | Official ATC program/provider-list URLs are real; unknown provider-specific price/schedule are honest; provider/delivery/outcome claims are inaccurate or insufficiently sourced | FAIL |

All records use stable IDs and official HTTPS URLs. Verification dates are stored as `2026-11-4`; this is parseable by the current validator but not normalized ISO `YYYY-MM-DD` formatting.

## Schema, validation, and ranking

- `Opportunity` uses discriminated unions for price, duration, availability, and credit recognition. Unknown price/duration are explicit and render honestly.
- `validateCatalog()` detects duplicate/invalid IDs, malformed URLs, invalid union shapes, duplicate evidence URLs, missing evidence, and basic checked-date formatting.
- Validation gaps: it does not validate a real calendar date, evidence-to-claim support, official URL/evidence consistency, nonnegative minimum age, or cross-field availability invariants. Consequently, all factually incorrect records pass validation.
- `filterAndRank()` returns a newly sorted array, does not mutate the source catalog, and uses deterministic ordering: verification status, relevance score, title, then ID.
- `filtersFromSession()` is typed and deterministic. It correctly creates the three requested demo filter families. Product limitation: every adult selecting Louisiana is assigned the Responsible Vendor topic regardless of stated career goal, while free-text `careerGoalOther` is ignored. This over-personalizes unrelated Louisiana adult sessions.

## Browser and functional evidence

Fresh Chromium was run against the current Expo development server; no QA3 artifacts were reused.

Verified:

- Direct `/opportunities` entry displayed all five records (`5 results`). This supplies a full-catalog path.
- Selecting Cybersecurity reduced the list to the Cisco cybersecurity record; clearing filters restored all five.
- The university networking/alternative-credit onboarding path submitted to `/opportunities` and displayed four recommendations including both Cisco records, Modern States, and CLEP.
- Session answers did not appear in the URL. Chromium showed empty local storage, session storage, and cookies and no non-localhost resource requests during the tested catalog/session flow.
- Invalid opportunity ID displayed a recovery state with a 44 px recovery control.
- Chromium accessibility tree exposed filter controls as focusable checkboxes with names and checked states. Source inspection confirms a visible web focus style.
- At 320, 390×844, 768×1024, and 1440×900, the card/list page loaded and retained its five records. The filter rail intentionally overflows inside a horizontal scroller; the page structure uses that rail rather than wrapping filters.
- Detail navigation reached `/opportunities/clep-exam-program`. Official links are implemented as link-role controls and open the stored official URL.

Not fully verified in this run:

- The scripted high-school flow did not advance reliably in the browser harness, so no manual-browser pass is claimed for that complete flow. The adult flow output was not retained cleanly enough to make a pass claim. Both pathways have component/unit coverage, but that is not a substitute for the requested real-browser evidence.
- The zero-results combination was not reliably produced by the browser harness. Source and automated tests cover the empty state, but no independent visual pass is claimed.
- Native Android/iOS hardware, native screen readers, physical touch, external-site popup completion, and production-export runtime behavior were not tested. The production export itself succeeded.
- TASK-002 Save/Cancel and browser-history behavior were regression-covered by the passing Jest suite, but this review did not repeat the full QA Review 4 interactive matrix.
- No packet-level proxy capture was taken; privacy conclusions are based on code search, Performance Resource Timing, URL/storage/cookie inspection, and the absence of networking code in the TASK-003 diff.

Because the result is already FAIL on reproducible content and accessibility defects, these limitations do not reduce the severity of the blockers; they must be re-run during remediation QA.

## Automated checks

Run independently from `apps/mobile`:

| Command | Exit code | Result |
|---|---:|---|
| `npm.cmd test -- --runInBand` | 0 | PASS — 3 suites, 189 tests, 0 snapshots, 93.966 s |
| `npx.cmd tsc --noEmit` | 0 | PASS |
| `npm.cmd run lint` | 0 | PASS |
| `npm.cmd ls --depth=0` | 0 | PASS — dependency tree resolved |
| `npx.cmd expo export --platform web` | 0 | PASS — 9 web bundles and 6 static routes exported |

Some commands exceeded an individual 30-second output-yield interval but continued normally; none timed out.

## Regression, security, and repository hygiene

- No dependency manifest or lockfile change exists in `f048758..04f0731`; no new package compatibility concern was introduced.
- No client secret, API key, persistent storage, cookie write, or external fetch was found in the TASK-003 product diff.
- Onboarding transfers answers through `SessionContext` and `router.replace('/opportunities')`; it does not serialize answers into URLs or browser storage.
- `git diff --check f048758..04f0731` reported no whitespace errors.
- New opportunity routes use `(router.push as any)` / `(router.replace as any)` (`apps/mobile/src/app/opportunities/index.tsx:74`, `apps/mobile/src/app/opportunities/[id].tsx:62,90`). This weakens route type safety and should be removed as a nonblocking code-quality improvement.
- The working tree was already dirty before this report: modified `docs/tasks/TASK-003.md` plus untracked `.claude/`, earlier QA reports/evidence, and `docs/technical-debt.md`. Those files are outside implementation SHA `04f0731` and must be reviewed/committed or removed deliberately before any future merge. This report is the only intentional QA artifact added by this review.

## Existing debt preserved

- **TASK-001 B3 — release blocker:** missing visible keyboard focus indicator.
- **TASK-001 B4 — release blocker:** production web export initially renders the mobile layout at tablet/desktop widths.
- **TASK-002 — nonblocking:** Back-versus-Cancel label ambiguity.

These issues were not relabeled or closed by TASK-003.

## Re-review acceptance

TASK-003 may be re-reviewed after Claude Code:

1. Corrects all five catalog records against directly stored official sources, especially CLEP duration/delivery, ATC provider/delivery/outcome, and both Cisco durations/evidence notes.
2. Adds regression tests that fail on the corrected factual invariants and improves `validateCatalog()` for relevant cross-field/date invariants.
3. Raises every catalog filter/header action to a minimum 44×44 CSS-pixel target and retains visible focus.
4. Supplies fresh browser evidence for all three complete onboarding-to-catalog flows, zero results/reset, details/invalid ID, keyboard/touch behavior, and all four viewport sizes.
5. Re-runs Jest, TypeScript, ESLint, dependency listing, and Expo web export with exit code 0.

Do not merge or deploy this branch in its current state.
