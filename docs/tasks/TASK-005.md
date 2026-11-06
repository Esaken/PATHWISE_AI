# TASK-005: Healthcare-First Career Pathways

**Status:** Remediation complete (QA Review 1 T5-B1/T5-B2 addressed) — pending independent QA Review 2
**Branch:** `feature/task-005-healthcare-pathways`
**Base:** `main` at `9be4c0a`
**Owner:** Claude Code
**Reviewer:** Codex CLI

---

## Objective and scope

Build a healthcare-first career pathway experience layered on top of the existing onboarding and
opportunity catalog. After completing onboarding, learners land on a healthcare career selection
screen where they choose a career (RN, LPN, CNA, Medical Assistant, Phlebotomy, or PCT) and
receive a personalized, learner-category-specific pathway of sequential milestones, linked
Louisiana programs, education routes, official regulatory sources, and verification checklists.

The module is deterministic, uses no external AI or APIs, and makes no claims beyond what can be
derived from verified official sources and the learner's onboarding answers.

**P0 scope implemented:**
- Healthcare career selection screen at `/healthcare` (6 careers)
- Personalized pathway detail at `/healthcare/pathways/[careerId]`
- 18 milestone sets (6 careers × 3 learner categories: high-school, university, adult)
- 6 verified Louisiana program records with official source references
- Safe navigation and empty states
- Preservation of TASK-001 through TASK-004 functionality
- Matching engine extended with healthcare topics for future opportunity integration

---

## Architecture

```
src/
  healthcare/
    types.ts           — HealthcareCareer, HealthcareProgram, LearnerPathway, PathwayMilestone types
    careers.ts         — 6 career definitions (HEALTHCARE_CAREERS, getCareerById)
    programs.ts        — 6 verified Louisiana programs (HEALTHCARE_PROGRAMS, getProgramsByCareer, getProgramById)
    pathways.ts        — buildHealthcarePathway(answers, careerId, programs): LearnerPathway | null
  app/
    healthcare/
      index.tsx        — /healthcare career selection screen
      pathways/
        [careerId].tsx — /healthcare/pathways/[careerId] pathway detail screen
  __tests__/
    healthcare.test.ts — 168 unit tests (career catalog, program catalog, pathway builder)
  catalog/
    types.ts           — Topic union extended with nursing, practical-nursing, nurse-aide, allied-health
  matching/
    engine.ts          — CAREER_TOPICS and STUDY_TOPICS extended for healthcare
```

**Navigation change:** Onboarding completion routes to `/healthcare` instead of `/recommendations`.
The `/healthcare` screen provides links to both `/recommendations` and `/opportunities`.
The `/healthcare/pathways/[careerId]` screen provides a link to `/opportunities`.

---

## Healthcare careers

| ID | Title | Credential class | Programs linked |
|---|---|---|---|
| `rn` | Registered Nurse | professional-license | delgado-adn, brcc-asn, lsuhsc-bsn |
| `lpn` | Licensed Practical Nurse | professional-license | delgado-pn, brcc-pn |
| `cna` | Certified Nursing Assistant | registry-certification | delgado-cna |
| `medical-assistant` | Medical Assistant | national-certification | (none in catalog) |
| `phlebotomy` | Phlebotomy Technician | national-certification | (none in catalog) |
| `patient-care-technician` | Patient Care Technician | employer-preference | (none in catalog) |

---

## Louisiana program catalog

All 6 program records verified from official institution websites on 2026-11-05.

| ID | Institution | Career | Verification |
|---|---|---|---|
| `delgado-adn` | Delgado Community College | RN | verified-official-source |
| `brcc-asn` | Baton Rouge Community College | RN | verified-official-source |
| `lsuhsc-bsn` | LSU Health Sciences Center School of Nursing | RN | verified-official-source |
| `delgado-pn` | Delgado Community College | LPN | verified-official-source |
| `brcc-pn` | Baton Rouge Community College | LPN | verified-official-source |
| `delgado-cna` | Delgado Community College | CNA | needs-recheck (LDH approval not independently confirmed from official source) |

Fields that could not be confirmed from official sources are set to `null`. Programs do not
include invented tuition amounts, guarantee statements, or claims not derivable from official pages.

---

## Pathway builder

`buildHealthcarePathway(answers, careerId, programs): LearnerPathway | null`

Returns `null` for unknown `careerId` or for a valid `careerId` with no defined milestone set
for the learner's category.

Each `LearnerPathway` contains:
- `milestones` — ordered sequence of `PathwayMilestone` objects with `requiresConfirmation` flags
- `relevantRoutes` — the career's education routes (from `HEALTHCARE_CAREERS`)
- `verifyWithProvider` — a list of verification items specific to the career's regulatory bodies
- `linkedProgramIds` — IDs of Louisiana programs filtered to the career
- `disclaimer` — conservative text emphasizing this is general guidance, not professional advice

### Milestone step counts

| Career | high-school | university | adult |
|---|---:|---:|---:|
| RN | 9 | 9 | 8 |
| LPN | 9 | 9 | 8 |
| CNA | 6 | 6 | 6 |
| Medical Assistant | 7 | 6 | 6 |
| Phlebotomy | 6 | 5 | 5 |
| PCT | 6 | 6 | 6 |

### Milestone kinds used

`preparation`, `education`, `clinical`, `examination`, `licensure`, `registry`, `employment`

RN and LPN pathways include `licensure` as the final step. CNA pathways include `registry` (not
`licensure`) to reflect that registry placement is distinct from professional licensure.

---

## Matching engine extension

New topics added to `catalog/types.ts`:
- `nursing`, `practical-nursing`, `nurse-aide`, `allied-health`

New mappings in `matching/engine.ts`:
- `CAREER_TOPICS.healthcare = ['nursing', 'practical-nursing', 'nurse-aide', 'allied-health']`
- `STUDY_TOPICS['health-medicine'] = ['nursing', 'practical-nursing', 'nurse-aide', 'allied-health']`

These topics are reserved for future healthcare catalog entries. The existing opportunity catalog
contains no healthcare records; the matching engine returns empty recommendations for
healthcare-only profiles, directing learners to the full catalog as intended.

---

## Eligibility language

The pathway module maintains the same conservative eligibility standards as TASK-004:

- Completing an ADN, BSN, or PN program does not automatically grant an RN or LPN license.
  The NCLEX-RN or NCLEX-PN must be passed and a licensure application submitted to LSBN or LSBPNE.
- CNA registry placement is distinct from RN or LPN professional licensure.
- Category membership is the only eligibility fact confirmed by the system. Prerequisites,
  employer conditions, institutional policies, and accreditation status must be verified
  directly with providers and regulatory bodies.
- Steps marked `requiresConfirmation: true` require direct confirmation before acting.

---

## User journey

```
Welcome (/) → learner type selection
  → Onboarding (/onboarding/[type]) → 3 steps + review + completion screen
    → Healthcare Pathways (/healthcare) → career selection (6 cards)
      → Pathway Detail (/healthcare/pathways/[careerId]) → milestones + programs + sources
      → Opportunity Recommendations (/recommendations) [link from /healthcare]
      → Full catalog (/opportunities) [link from /healthcare and /healthcare/pathways/[careerId]]
```

Back navigation works at every step. Both healthcare screens redirect to `/` if no session.

---

## Test coverage

File: `src/__tests__/healthcare.test.ts` — 168 tests in 15 suites.

| Suite | Coverage |
|---|---|
| Career catalog integrity | 6 careers, IDs, fields, routes, sources, warnings, getCareerById |
| Program catalog integrity | 6 programs, careerId mappings, getProgramsByCareer, getProgramById |
| Pathway builder — all 18 combinations | non-null, correct careerId/learnerCategory, non-empty milestones, disclaimer, verifyWithProvider |
| Pathway builder — unknown careerId | returns null for unknown and empty string |
| RN pathway content | milestone counts, step kinds, requiresConfirmation, linkedProgramIds, relevantRoutes |
| LPN pathway content | milestone counts, final step kinds, linkedProgramIds |
| CNA pathway content | milestone counts, registry vs licensure, linkedProgramIds, verifyWithProvider |
| Medical Assistant pathway | milestone counts, no linked programs, no licensure/registry steps |
| Phlebotomy pathway | milestone counts, clinical step, no linked programs |
| Patient Care Technician pathway | milestone counts, no linked programs, verifyWithProvider |
| Linked program IDs validity | all linkedProgramIds are valid HEALTHCARE_PROGRAMS IDs |
| Determinism | identical inputs produce identical pathway (3 representative combinations) |
| Empty programs list | pathway returns milestones; linkedProgramIds is empty |

---

## Known limitations

1. **Browser-level UI testing not performed.** Healthcare screens are TypeScript-validated and
   Expo-web-exported, but interactive Chromium testing (keyboard navigation, focus indicators,
   accessibility tree) requires independent QA verification.
2. **No MA, Phlebotomy, or PCT Louisiana programs in catalog.** These careers show pathway
   steps and official sources but have no linked Louisiana program records.
3. **CNA program needs-recheck.** `delgado-cna` could not confirm LDH state-approval status
   from the official page alone. The UI surfaces this status; learners are directed to confirm
   with LDH directly.
4. **Back navigation on deep link.** `router.back()` without prior app history will not return
   to `/healthcare`. The not-found fallback explicitly links to `/healthcare`.
5. **Healthcare topics have no catalog records.** `nursing`, `practical-nursing`, `nurse-aide`,
   and `allied-health` topics are registered but no Opportunity catalog records carry them yet.
   Healthcare learners reach the empty-state recommendations screen and are directed to the
   full catalog.

---

## Automated validation results

| Gate | Result | Evidence |
|---|---|---|
| `npm.cmd test -- --runInBand` | PASS, exit 0 | 454 tests (6 suites); 0 failures |
| `npx.cmd tsc --noEmit` | PASS, exit 0 | No diagnostics |
| `npm.cmd run lint` | PASS, exit 0 | No findings |
| `npm.cmd ls --depth=0` | PASS, exit 0 | No unmet/extraneous dependencies |
| `npx.cmd expo export --platform web` | PASS, exit 0 | 12 bundles; 9 static routes including `/healthcare` and `/healthcare/pathways/[careerId]` |
| `git diff --check HEAD` | PASS | No trailing whitespace |

No new production dependency was introduced by the TASK-005 diff. The healthcare module uses
no fetch, Axios, browser storage, cookie, or AsyncStorage.
