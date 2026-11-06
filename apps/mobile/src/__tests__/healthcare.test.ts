/**
 * Unit tests for TASK-005 healthcare module.
 *
 * Coverage:
 * - Career catalog integrity: 6 careers, required fields, routes, sources, warnings
 * - Program catalog integrity: 6 programs, careerId mappings, helper functions
 * - Pathway builder: all 18 careerId × learnerCategory combinations
 * - Pathway content: milestone counts, step kinds, requiresConfirmation flags
 * - Safety: null for unknown careerId, consistency of linkedProgramIds
 * - Determinism: same inputs always produce identical output
 */

import { HEALTHCARE_CAREERS, getCareerById } from '../healthcare/careers';
import { HEALTHCARE_PROGRAMS, getProgramsByCareer, getProgramById } from '../healthcare/programs';
import { buildHealthcarePathway } from '../healthcare/pathways';
import type { OnboardingAnswers } from '../types/onboarding';
import type { LearnerCategory } from '../catalog/types';
import type { MilestoneKind } from '../healthcare/types';

// ─── Fixtures ──────────────────────────────────────────────────────────────────

const HS: OnboardingAnswers = {
  learnerType: 'high-school',
  grade: '12th',
  careerInterest: 'healthcare',
  goal: 'explore-career-pathways',
  budget: 'flexible',
};

const UNIV: OnboardingAnswers = {
  learnerType: 'university',
  studyArea: 'health-medicine',
  careerInterest: 'healthcare',
  goal: 'explore-career-pathways',
  budget: 'flexible',
  institutionName: 'State University',
};

const ADULT: OnboardingAnswers = {
  learnerType: 'adult',
  careerGoal: 'healthcare',
  careerGoalOther: '',
  goal: 'change-career',
  budget: 'flexible',
  stateRegion: 'Louisiana',
};

const CAREER_IDS = ['rn', 'lpn', 'cna', 'medical-assistant', 'phlebotomy', 'patient-care-technician'];
const LEARNER_TYPES: LearnerCategory[] = ['high-school', 'university', 'adult'];

// ─── Career catalog integrity ─────────────────────────────────────────────────

describe('Career catalog integrity', () => {
  test('exports exactly 6 careers', () => {
    expect(HEALTHCARE_CAREERS).toHaveLength(6);
  });

  test('career IDs match expected set', () => {
    const ids = HEALTHCARE_CAREERS.map((c) => c.id).sort();
    expect(ids).toEqual([...CAREER_IDS].sort());
  });

  test('every career has a non-empty title and shortDescription', () => {
    for (const career of HEALTHCARE_CAREERS) {
      expect(career.title.length).toBeGreaterThan(0);
      expect(career.shortDescription.length).toBeGreaterThan(0);
    }
  });

  test('every career has at least one education route', () => {
    for (const career of HEALTHCARE_CAREERS) {
      expect(career.educationRoutes.length).toBeGreaterThan(0);
    }
  });

  test('every education route has a routeId, label, and description', () => {
    for (const career of HEALTHCARE_CAREERS) {
      for (const route of career.educationRoutes) {
        expect(route.routeId.length).toBeGreaterThan(0);
        expect(route.label.length).toBeGreaterThan(0);
        expect(route.description.length).toBeGreaterThan(0);
      }
    }
  });

  test('every career has at least one official source', () => {
    for (const career of HEALTHCARE_CAREERS) {
      expect(career.officialSources.length).toBeGreaterThan(0);
    }
  });

  test('every official source has a title, url, and organization', () => {
    for (const career of HEALTHCARE_CAREERS) {
      for (const src of career.officialSources) {
        expect(src.title.length).toBeGreaterThan(0);
        expect(src.url).toMatch(/^https:\/\//);
        expect(src.organization.length).toBeGreaterThan(0);
      }
    }
  });

  test('every career has at least one warning', () => {
    for (const career of HEALTHCARE_CAREERS) {
      expect(career.warnings.length).toBeGreaterThan(0);
    }
  });

  test('RN career has professional-license credential class', () => {
    const rn = getCareerById('rn');
    expect(rn?.credentialClass).toBe('professional-license');
  });

  test('CNA career has registry-certification credential class', () => {
    const cna = getCareerById('cna');
    expect(cna?.credentialClass).toBe('registry-certification');
  });

  test('medical-assistant has national-certification credential class', () => {
    const ma = getCareerById('medical-assistant');
    expect(ma?.credentialClass).toBe('national-certification');
  });

  test('patient-care-technician has employer-preference credential class', () => {
    const pct = getCareerById('patient-care-technician');
    expect(pct?.credentialClass).toBe('employer-preference');
  });

  test('getCareerById returns undefined for unknown id', () => {
    expect(getCareerById('unknown-career')).toBeUndefined();
  });

  test('HEALTHCARE_CAREERS array is not mutated by getCareerById', () => {
    const before = HEALTHCARE_CAREERS.length;
    getCareerById('rn');
    expect(HEALTHCARE_CAREERS).toHaveLength(before);
  });
});

// ─── Program catalog integrity ────────────────────────────────────────────────

describe('Program catalog integrity', () => {
  test('exports exactly 6 programs', () => {
    expect(HEALTHCARE_PROGRAMS).toHaveLength(6);
  });

  test('every program has a non-empty id, institution, and programTitle', () => {
    for (const p of HEALTHCARE_PROGRAMS) {
      expect(p.id.length).toBeGreaterThan(0);
      expect(p.institution.length).toBeGreaterThan(0);
      expect(p.programTitle.length).toBeGreaterThan(0);
    }
  });

  test('every program careerId is in the known career set', () => {
    for (const p of HEALTHCARE_PROGRAMS) {
      expect(CAREER_IDS).toContain(p.careerId);
    }
  });

  test('every program has a valid officialUrl', () => {
    for (const p of HEALTHCARE_PROGRAMS) {
      expect(p.officialUrl).toMatch(/^https:\/\//);
    }
  });

  test('every program has at least one approval entry', () => {
    for (const p of HEALTHCARE_PROGRAMS) {
      expect(p.approvals.length).toBeGreaterThan(0);
    }
  });

  test('every program has at least one warning', () => {
    for (const p of HEALTHCARE_PROGRAMS) {
      expect(p.warnings.length).toBeGreaterThan(0);
    }
  });

  test('getProgramsByCareer returns only programs for the given careerId', () => {
    const rn = getProgramsByCareer('rn');
    expect(rn.every((p) => p.careerId === 'rn')).toBe(true);
    expect(rn.length).toBeGreaterThan(0);
  });

  test('getProgramsByCareer returns empty array for unknown careerId', () => {
    expect(getProgramsByCareer('unknown')).toHaveLength(0);
  });

  test('getProgramById returns the correct program', () => {
    const p = getProgramById('brcc-asn');
    expect(p?.id).toBe('brcc-asn');
    expect(p?.careerId).toBe('rn');
  });

  test('getProgramById returns undefined for unknown id', () => {
    expect(getProgramById('nonexistent-program')).toBeUndefined();
  });

  test('RN programs: 3 programs exist (delgado-adn, brcc-asn, lsuhsc-bsn)', () => {
    const rnPrograms = getProgramsByCareer('rn');
    const ids = rnPrograms.map((p) => p.id).sort();
    expect(ids).toEqual(['brcc-asn', 'delgado-adn', 'lsuhsc-bsn']);
  });

  test('LPN programs: 2 programs exist (delgado-pn, brcc-pn)', () => {
    const lpnPrograms = getProgramsByCareer('lpn');
    const ids = lpnPrograms.map((p) => p.id).sort();
    expect(ids).toEqual(['brcc-pn', 'delgado-pn']);
  });

  test('CNA programs: 1 program exists (delgado-cna)', () => {
    const cnaPrograms = getProgramsByCareer('cna');
    expect(cnaPrograms).toHaveLength(1);
    expect(cnaPrograms[0].id).toBe('delgado-cna');
  });

  test('delgado-cna has verified-official-source status (refreshed with specific CNA page)', () => {
    const p = getProgramById('delgado-cna');
    expect(p?.verificationStatus).toBe('verified-official-source');
  });

  test('brcc-asn has verified-official-source status', () => {
    const p = getProgramById('brcc-asn');
    expect(p?.verificationStatus).toBe('verified-official-source');
  });

  test('brcc-asn durationNote includes 72 credit hours', () => {
    const p = getProgramById('brcc-asn');
    expect(p?.durationNote).toMatch(/72/);
  });
});

// ─── Pathway builder — all 18 combinations ───────────────────────────────────

describe('Pathway builder — all 18 careerId × learnerCategory combinations', () => {
  const fixtures: Record<LearnerCategory, OnboardingAnswers> = {
    'high-school': HS,
    university: UNIV,
    adult: ADULT,
  };

  for (const careerId of CAREER_IDS) {
    for (const learnerType of LEARNER_TYPES) {
      test(`${careerId} + ${learnerType} returns a non-null pathway`, () => {
        const pathway = buildHealthcarePathway(fixtures[learnerType], careerId, HEALTHCARE_PROGRAMS);
        expect(pathway).not.toBeNull();
      });

      test(`${careerId} + ${learnerType} pathway has matching careerId and learnerCategory`, () => {
        const pathway = buildHealthcarePathway(fixtures[learnerType], careerId, HEALTHCARE_PROGRAMS);
        expect(pathway?.careerId).toBe(careerId);
        expect(pathway?.learnerCategory).toBe(learnerType);
      });

      test(`${careerId} + ${learnerType} pathway has non-empty milestones`, () => {
        const pathway = buildHealthcarePathway(fixtures[learnerType], careerId, HEALTHCARE_PROGRAMS);
        expect(pathway?.milestones.length).toBeGreaterThan(0);
      });

      test(`${careerId} + ${learnerType} pathway has non-empty disclaimer`, () => {
        const pathway = buildHealthcarePathway(fixtures[learnerType], careerId, HEALTHCARE_PROGRAMS);
        expect(pathway?.disclaimer.length).toBeGreaterThan(0);
      });

      test(`${careerId} + ${learnerType} pathway has non-empty verifyWithProvider`, () => {
        const pathway = buildHealthcarePathway(fixtures[learnerType], careerId, HEALTHCARE_PROGRAMS);
        expect(pathway?.verifyWithProvider.length).toBeGreaterThan(0);
      });
    }
  }
});

// ─── Pathway builder — unknown careerId ───────────────────────────────────────

describe('Pathway builder — unknown careerId', () => {
  test('returns null for unknown careerId', () => {
    expect(buildHealthcarePathway(ADULT, 'unknown-career', HEALTHCARE_PROGRAMS)).toBeNull();
  });

  test('returns null for empty string careerId', () => {
    expect(buildHealthcarePathway(ADULT, '', HEALTHCARE_PROGRAMS)).toBeNull();
  });
});

// ─── Pathway content — RN ─────────────────────────────────────────────────────

describe('RN pathway content', () => {
  test('RN high-school pathway has 9 milestones', () => {
    const p = buildHealthcarePathway(HS, 'rn', HEALTHCARE_PROGRAMS);
    expect(p?.milestones).toHaveLength(9);
  });

  test('RN university pathway has 9 milestones', () => {
    const p = buildHealthcarePathway(UNIV, 'rn', HEALTHCARE_PROGRAMS);
    expect(p?.milestones).toHaveLength(9);
  });

  test('RN adult pathway has 8 milestones', () => {
    const p = buildHealthcarePathway(ADULT, 'rn', HEALTHCARE_PROGRAMS);
    expect(p?.milestones).toHaveLength(8);
  });

  test('RN high-school final milestone is licensure', () => {
    const p = buildHealthcarePathway(HS, 'rn', HEALTHCARE_PROGRAMS);
    const last = p?.milestones[p.milestones.length - 1];
    expect(last?.kind).toBe('licensure');
  });

  test('RN high-school pathway includes an examination step', () => {
    const p = buildHealthcarePathway(HS, 'rn', HEALTHCARE_PROGRAMS);
    const hasExam = p?.milestones.some((m) => m.kind === 'examination');
    expect(hasExam).toBe(true);
  });

  test('RN high-school pathway includes a clinical step', () => {
    const p = buildHealthcarePathway(HS, 'rn', HEALTHCARE_PROGRAMS);
    const hasClinical = p?.milestones.some((m) => m.kind === 'clinical');
    expect(hasClinical).toBe(true);
  });

  test('RN pathway links all 3 Louisiana programs', () => {
    const p = buildHealthcarePathway(ADULT, 'rn', HEALTHCARE_PROGRAMS);
    expect([...(p?.linkedProgramIds ?? [])].sort()).toEqual(['brcc-asn', 'delgado-adn', 'lsuhsc-bsn']);
  });

  test('RN milestones all have unique IDs', () => {
    const p = buildHealthcarePathway(HS, 'rn', HEALTHCARE_PROGRAMS);
    const ids = p?.milestones.map((m) => m.id) ?? [];
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('RN high-school pathway NCLEX step requiresConfirmation', () => {
    const p = buildHealthcarePathway(HS, 'rn', HEALTHCARE_PROGRAMS);
    const nclex = p?.milestones.find((m) => m.id === 'rn-hs-7');
    expect(nclex?.requiresConfirmation).toBe(true);
  });

  test('RN high-school clinical step does not requiresConfirmation', () => {
    const p = buildHealthcarePathway(HS, 'rn', HEALTHCARE_PROGRAMS);
    const clinical = p?.milestones.find((m) => m.kind === 'clinical');
    expect(clinical?.requiresConfirmation).toBe(false);
  });

  test('RN relevantRoutes match career education routes', () => {
    const rn = getCareerById('rn');
    const p = buildHealthcarePathway(HS, 'rn', HEALTHCARE_PROGRAMS);
    expect(p?.relevantRoutes).toEqual(rn?.educationRoutes);
  });
});

// ─── Pathway content — LPN ───────────────────────────────────────────────────

describe('LPN pathway content', () => {
  test('LPN high-school pathway has 9 milestones', () => {
    const p = buildHealthcarePathway(HS, 'lpn', HEALTHCARE_PROGRAMS);
    expect(p?.milestones).toHaveLength(9);
  });

  test('LPN adult pathway has 8 milestones', () => {
    const p = buildHealthcarePathway(ADULT, 'lpn', HEALTHCARE_PROGRAMS);
    expect(p?.milestones).toHaveLength(8);
  });

  test('LPN high-school final milestone is employment (future pathway)', () => {
    const p = buildHealthcarePathway(HS, 'lpn', HEALTHCARE_PROGRAMS);
    const last = p?.milestones[p.milestones.length - 1];
    expect(last?.kind).toBe('employment');
  });

  test('LPN adult final milestone is licensure', () => {
    const p = buildHealthcarePathway(ADULT, 'lpn', HEALTHCARE_PROGRAMS);
    const last = p?.milestones[p.milestones.length - 1];
    expect(last?.kind).toBe('licensure');
  });

  test('LPN pathway links 2 Louisiana programs', () => {
    const p = buildHealthcarePathway(HS, 'lpn', HEALTHCARE_PROGRAMS);
    expect([...(p?.linkedProgramIds ?? [])].sort()).toEqual(['brcc-pn', 'delgado-pn']);
  });
});

// ─── Pathway content — CNA ───────────────────────────────────────────────────

describe('CNA pathway content', () => {
  test('CNA high-school pathway has 6 milestones', () => {
    const p = buildHealthcarePathway(HS, 'cna', HEALTHCARE_PROGRAMS);
    expect(p?.milestones).toHaveLength(6);
  });

  test('CNA adult pathway has 6 milestones', () => {
    const p = buildHealthcarePathway(ADULT, 'cna', HEALTHCARE_PROGRAMS);
    expect(p?.milestones).toHaveLength(6);
  });

  test('CNA pathway includes a registry step', () => {
    const p = buildHealthcarePathway(ADULT, 'cna', HEALTHCARE_PROGRAMS);
    const hasRegistry = p?.milestones.some((m) => m.kind === 'registry');
    expect(hasRegistry).toBe(true);
  });

  test('CNA pathway does NOT include a licensure step', () => {
    const p = buildHealthcarePathway(ADULT, 'cna', HEALTHCARE_PROGRAMS);
    const hasLicensure = p?.milestones.some((m) => m.kind === 'licensure');
    expect(hasLicensure).toBe(false);
  });

  test('CNA pathway links delgado-cna program', () => {
    const p = buildHealthcarePathway(ADULT, 'cna', HEALTHCARE_PROGRAMS);
    expect(p?.linkedProgramIds).toContain('delgado-cna');
  });

  test('CNA verifyWithProvider mentions LDH', () => {
    const p = buildHealthcarePathway(ADULT, 'cna', HEALTHCARE_PROGRAMS);
    const mentionsLDH = p?.verifyWithProvider.some((v) => v.includes('LDH') || v.includes('ldh.la.gov'));
    expect(mentionsLDH).toBe(true);
  });
});

// ─── Pathway content — Medical Assistant ─────────────────────────────────────

describe('Medical Assistant pathway content', () => {
  test('MA high-school pathway has 7 milestones', () => {
    const p = buildHealthcarePathway(HS, 'medical-assistant', HEALTHCARE_PROGRAMS);
    expect(p?.milestones).toHaveLength(7);
  });

  test('MA university pathway has 6 milestones', () => {
    const p = buildHealthcarePathway(UNIV, 'medical-assistant', HEALTHCARE_PROGRAMS);
    expect(p?.milestones).toHaveLength(6);
  });

  test('MA adult pathway has 6 milestones', () => {
    const p = buildHealthcarePathway(ADULT, 'medical-assistant', HEALTHCARE_PROGRAMS);
    expect(p?.milestones).toHaveLength(6);
  });

  test('MA pathway has no linked programs (no MA programs in catalog)', () => {
    const p = buildHealthcarePathway(ADULT, 'medical-assistant', HEALTHCARE_PROGRAMS);
    expect(p?.linkedProgramIds).toHaveLength(0);
  });

  test('MA pathway does not include licensure or registry steps', () => {
    const p = buildHealthcarePathway(ADULT, 'medical-assistant', HEALTHCARE_PROGRAMS);
    const forbidden: MilestoneKind[] = ['licensure', 'registry'];
    const hasAny = p?.milestones.some((m) => forbidden.includes(m.kind));
    expect(hasAny).toBe(false);
  });
});

// ─── Pathway content — Phlebotomy ────────────────────────────────────────────

describe('Phlebotomy pathway content', () => {
  test('Phlebotomy high-school pathway has 6 milestones', () => {
    const p = buildHealthcarePathway(HS, 'phlebotomy', HEALTHCARE_PROGRAMS);
    expect(p?.milestones).toHaveLength(6);
  });

  test('Phlebotomy adult pathway has 5 milestones', () => {
    const p = buildHealthcarePathway(ADULT, 'phlebotomy', HEALTHCARE_PROGRAMS);
    expect(p?.milestones).toHaveLength(5);
  });

  test('Phlebotomy pathway includes a clinical step', () => {
    const p = buildHealthcarePathway(ADULT, 'phlebotomy', HEALTHCARE_PROGRAMS);
    const hasClinical = p?.milestones.some((m) => m.kind === 'clinical');
    expect(hasClinical).toBe(true);
  });

  test('Phlebotomy pathway has no linked programs', () => {
    const p = buildHealthcarePathway(ADULT, 'phlebotomy', HEALTHCARE_PROGRAMS);
    expect(p?.linkedProgramIds).toHaveLength(0);
  });
});

// ─── Pathway content — PCT ────────────────────────────────────────────────────

describe('Patient Care Technician pathway content', () => {
  test('PCT high-school pathway has 6 milestones', () => {
    const p = buildHealthcarePathway(HS, 'patient-care-technician', HEALTHCARE_PROGRAMS);
    expect(p?.milestones).toHaveLength(6);
  });

  test('PCT adult pathway has 6 milestones', () => {
    const p = buildHealthcarePathway(ADULT, 'patient-care-technician', HEALTHCARE_PROGRAMS);
    expect(p?.milestones).toHaveLength(6);
  });

  test('PCT pathway has no linked programs', () => {
    const p = buildHealthcarePathway(ADULT, 'patient-care-technician', HEALTHCARE_PROGRAMS);
    expect(p?.linkedProgramIds).toHaveLength(0);
  });

  test('PCT pathway verifyWithProvider mentions CNA requirement', () => {
    const p = buildHealthcarePathway(ADULT, 'patient-care-technician', HEALTHCARE_PROGRAMS);
    const mentionsCNA = p?.verifyWithProvider.some((v) => v.includes('CNA'));
    expect(mentionsCNA).toBe(true);
  });
});

// ─── Linked program IDs are valid ─────────────────────────────────────────────

describe('Linked program IDs validity', () => {
  const programIdSet = new Set(HEALTHCARE_PROGRAMS.map((p) => p.id));
  const fixtures: Record<LearnerCategory, OnboardingAnswers> = {
    'high-school': HS,
    university: UNIV,
    adult: ADULT,
  };

  for (const careerId of CAREER_IDS) {
    test(`${careerId} linkedProgramIds are all valid HEALTHCARE_PROGRAMS IDs`, () => {
      const p = buildHealthcarePathway(fixtures.adult, careerId, HEALTHCARE_PROGRAMS);
      for (const id of p?.linkedProgramIds ?? []) {
        expect(programIdSet.has(id)).toBe(true);
      }
    });
  }
});

// ─── Determinism ─────────────────────────────────────────────────────────────

describe('Determinism', () => {
  test('same inputs produce identical pathway for RN adult', () => {
    const a = buildHealthcarePathway(ADULT, 'rn', HEALTHCARE_PROGRAMS);
    const b = buildHealthcarePathway(ADULT, 'rn', HEALTHCARE_PROGRAMS);
    expect(a).toEqual(b);
  });

  test('same inputs produce identical pathway for CNA high-school', () => {
    const a = buildHealthcarePathway(HS, 'cna', HEALTHCARE_PROGRAMS);
    const b = buildHealthcarePathway(HS, 'cna', HEALTHCARE_PROGRAMS);
    expect(a).toEqual(b);
  });

  test('same inputs produce identical pathway for MA university', () => {
    const a = buildHealthcarePathway(UNIV, 'medical-assistant', HEALTHCARE_PROGRAMS);
    const b = buildHealthcarePathway(UNIV, 'medical-assistant', HEALTHCARE_PROGRAMS);
    expect(a).toEqual(b);
  });
});

// ─── Empty programs list ──────────────────────────────────────────────────────

describe('Empty programs list', () => {
  test('pathway with empty programs list has empty linkedProgramIds', () => {
    const p = buildHealthcarePathway(HS, 'rn', []);
    expect(p?.linkedProgramIds).toHaveLength(0);
  });

  test('pathway with empty programs list still returns milestones', () => {
    const p = buildHealthcarePathway(HS, 'rn', []);
    expect(p?.milestones.length).toBeGreaterThan(0);
  });
});

// ─── T5-B1 regression: Louisiana CNA 80-hour requirement ─────────────────────
// These tests prevent regression to the incorrect 75-hour figure.
// Source: Louisiana NATCEP rules (LDH); Delgado CNA program page states
// "at least 80 hours" including 40 hours in a long-term care facility.

describe('T5-B1 regression — Louisiana CNA 80-hour requirement', () => {
  test('CNA education route notes reference 80-hour core curriculum, not 75 hours', () => {
    const cna = getCareerById('cna');
    const route = cna?.educationRoutes.find((r) => r.routeId === 'cna-training');
    expect(route?.notes).not.toContain('75');
    expect(route?.notes).toContain('80');
  });

  test('CNA education route notes distinguish core curriculum from clinical-site orientation', () => {
    const cna = getCareerById('cna');
    const route = cna?.educationRoutes.find((r) => r.routeId === 'cna-training');
    expect(route?.notes).toMatch(/clinical.site orientation|separate/i);
  });

  test('CNA high-school training milestone uses 80-hour requirement', () => {
    const p = buildHealthcarePathway(HS, 'cna', HEALTHCARE_PROGRAMS);
    const trainingStep = p?.milestones.find((m) => m.id === 'cna-hs-3');
    expect(trainingStep?.description).not.toContain('75');
    expect(trainingStep?.description).toContain('80');
  });

  test('CNA university training milestone uses 80-hour requirement', () => {
    const p = buildHealthcarePathway(UNIV, 'cna', HEALTHCARE_PROGRAMS);
    const trainingStep = p?.milestones.find((m) => m.id === 'cna-univ-3');
    expect(trainingStep?.description).not.toContain('75');
    expect(trainingStep?.description).toContain('80');
  });

  test('CNA adult training milestone uses 80-hour requirement', () => {
    const p = buildHealthcarePathway(ADULT, 'cna', HEALTHCARE_PROGRAMS);
    const trainingStep = p?.milestones.find((m) => m.id === 'cna-adult-3');
    expect(trainingStep?.description).not.toContain('75');
    expect(trainingStep?.description).toContain('80');
  });

  test('CNA university training milestone requiresConfirmation is true', () => {
    const p = buildHealthcarePathway(UNIV, 'cna', HEALTHCARE_PROGRAMS);
    const trainingStep = p?.milestones.find((m) => m.id === 'cna-univ-3');
    expect(trainingStep?.requiresConfirmation).toBe(true);
  });

  test('CNA adult training milestone requiresConfirmation is true', () => {
    const p = buildHealthcarePathway(ADULT, 'cna', HEALTHCARE_PROGRAMS);
    const trainingStep = p?.milestones.find((m) => m.id === 'cna-adult-3');
    expect(trainingStep?.requiresConfirmation).toBe(true);
  });

  test('all three CNA pathways consistently reference 80 hours', () => {
    for (const answers of [HS, UNIV, ADULT]) {
      const p = buildHealthcarePathway(answers, 'cna', HEALTHCARE_PROGRAMS);
      const educationStep = p?.milestones.find((m) => m.kind === 'education');
      expect(educationStep?.description).not.toContain('75');
      expect(educationStep?.description).toContain('80');
    }
  });

  test('delgado-cna durationNote references at least 80 hours, not 75', () => {
    const p = getProgramById('delgado-cna');
    expect(p?.durationNote).not.toContain('75');
    expect(p?.durationNote).toContain('80');
  });
});

// ─── T5-B2 regression: allied-health unsupported duration ranges ───────────────
// These tests prevent numeric duration ranges without claim-level evidence from
// appearing as confirmed facts.

describe('T5-B2 regression — allied-health program-dependent durations', () => {
  test('MA certificate route has null typicalDurationMonths (not an unsupported range)', () => {
    const ma = getCareerById('medical-assistant');
    const cert = ma?.educationRoutes.find((r) => r.routeId === 'ma-certificate');
    expect(cert?.typicalDurationMonths).toBeNull();
  });

  test('MA associate route has null typicalDurationMonths', () => {
    const ma = getCareerById('medical-assistant');
    const assoc = ma?.educationRoutes.find((r) => r.routeId === 'ma-associate');
    expect(assoc?.typicalDurationMonths).toBeNull();
  });

  test('phlebotomy certificate route has null typicalDurationMonths', () => {
    const ph = getCareerById('phlebotomy');
    const cert = ph?.educationRoutes.find((r) => r.routeId === 'phlebotomy-certificate');
    expect(cert?.typicalDurationMonths).toBeNull();
  });

  test('PCT certificate route has null typicalDurationMonths', () => {
    const pct = getCareerById('patient-care-technician');
    const cert = pct?.educationRoutes.find((r) => r.routeId === 'pct-certificate');
    expect(cert?.typicalDurationMonths).toBeNull();
  });

  test('MA high-school pathway compare-options milestone requiresConfirmation is true', () => {
    const p = buildHealthcarePathway(HS, 'medical-assistant', HEALTHCARE_PROGRAMS);
    const compareStep = p?.milestones.find((m) => m.id === 'ma-hs-3');
    expect(compareStep?.requiresConfirmation).toBe(true);
  });

  test('MA adult pathway compare-options milestone requiresConfirmation is true', () => {
    const p = buildHealthcarePathway(ADULT, 'medical-assistant', HEALTHCARE_PROGRAMS);
    const compareStep = p?.milestones.find((m) => m.id === 'ma-adult-2');
    expect(compareStep?.requiresConfirmation).toBe(true);
  });

  test('phlebotomy high-school training milestone requiresConfirmation is true', () => {
    const p = buildHealthcarePathway(HS, 'phlebotomy', HEALTHCARE_PROGRAMS);
    const edStep = p?.milestones.find((m) => m.id === 'phleb-hs-3');
    expect(edStep?.requiresConfirmation).toBe(true);
  });

  test('phlebotomy adult training milestone requiresConfirmation is true', () => {
    const p = buildHealthcarePathway(ADULT, 'phlebotomy', HEALTHCARE_PROGRAMS);
    const edStep = p?.milestones.find((m) => m.id === 'phleb-adult-2');
    expect(edStep?.requiresConfirmation).toBe(true);
  });

  test('PCT high-school training milestone requiresConfirmation is true', () => {
    const p = buildHealthcarePathway(HS, 'patient-care-technician', HEALTHCARE_PROGRAMS);
    const edStep = p?.milestones.find((m) => m.id === 'pct-hs-4');
    expect(edStep?.requiresConfirmation).toBe(true);
  });

  test('PCT milestone descriptions do not contain "3–6 months" as a confirmed fact', () => {
    for (const answers of [HS, UNIV, ADULT]) {
      const p = buildHealthcarePathway(answers, 'patient-care-technician', HEALTHCARE_PROGRAMS);
      const edStep = p?.milestones.find((m) => m.kind === 'education');
      expect(edStep?.description).not.toContain('3–6 months');
    }
  });

  test('phlebotomy milestone descriptions do not contain "1–6 months" as a confirmed fact', () => {
    for (const answers of [HS, UNIV, ADULT]) {
      const p = buildHealthcarePathway(answers, 'phlebotomy', HEALTHCARE_PROGRAMS);
      const edStep = p?.milestones.find((m) => m.kind === 'education');
      expect(edStep?.description).not.toContain('1–6 months');
    }
  });
});

// ─── T5-N1 regression: BRCC PN provisional status ────────────────────────────

describe('T5-N1 regression — BRCC PN provisional status', () => {
  test('brcc-pn approval kind is provisional', () => {
    const p = getProgramById('brcc-pn');
    const approval = p?.approvals[0];
    expect(approval?.kind).toBe('provisional');
  });

  test('brcc-pn approval has LSBPNE evidence URL', () => {
    const p = getProgramById('brcc-pn');
    const approval = p?.approvals[0];
    expect(approval?.evidenceUrl).toContain('lsbpne.la.gov');
  });

  test('brcc-pn approval notes mention provisional', () => {
    const p = getProgramById('brcc-pn');
    const approval = p?.approvals[0];
    expect(approval?.notes?.toLowerCase()).toContain('provisional');
  });

  test('brcc-pn warning mentions provisional status', () => {
    const p = getProgramById('brcc-pn');
    const mentionsProvisional = p?.warnings.some((w) => w.toLowerCase().includes('provisional'));
    expect(mentionsProvisional).toBe(true);
  });
});

// ─── T5-N1 regression: Delgado PN campus-specific status ─────────────────────

describe('T5-N1 regression — Delgado PN campus-specific approval', () => {
  test('delgado-pn approval kind is provisional (campus-nuanced, not full)', () => {
    const p = getProgramById('delgado-pn');
    const approval = p?.approvals[0];
    expect(approval?.kind).toBe('provisional');
  });

  test('delgado-pn approval notes mention both campus statuses', () => {
    const p = getProgramById('delgado-pn');
    const approval = p?.approvals[0];
    expect(approval?.notes).toContain('City Park');
    expect(approval?.notes).toContain('Sidney Collier');
  });

  test('delgado-pn approval has LSBPNE evidence URL', () => {
    const p = getProgramById('delgado-pn');
    const approval = p?.approvals[0];
    expect(approval?.evidenceUrl).toContain('lsbpne.la.gov');
  });
});

// ─── T5-N2 regression: Delgado CNA evidence refresh ─────────────────────────

describe('T5-N2 regression — Delgado CNA verification', () => {
  test('delgado-cna verificationStatus is verified-official-source (not needs-recheck)', () => {
    const p = getProgramById('delgado-cna');
    expect(p?.verificationStatus).toBe('verified-official-source');
  });

  test('delgado-cna approval kind is state-board-approved', () => {
    const p = getProgramById('delgado-cna');
    const approval = p?.approvals[0];
    expect(approval?.kind).toBe('state-board-approved');
  });

  test('delgado-cna approval has specific CNA page as evidence URL', () => {
    const p = getProgramById('delgado-cna');
    const approval = p?.approvals[0];
    expect(approval?.evidenceUrl).toContain('certified-nursing-assistant');
  });

  test('delgado-cna officialUrl points to specific CNA page', () => {
    const p = getProgramById('delgado-cna');
    expect(p?.officialUrl).toContain('certified-nursing-assistant');
  });

  test('delgado-cna tuitionNote reflects published estimate, not null', () => {
    const p = getProgramById('delgado-cna');
    expect(p?.tuitionNote).not.toBeNull();
    expect(p?.tuitionNote).toContain('1,673');
  });
});

// ─── T5-N3 regression: source verification ≠ regulatory approval ─────────────

describe('T5-N3 regression — source verification and regulatory approval are distinct', () => {
  test('provisional approval kind is a valid ProgramApprovalKind', () => {
    const brccPn = getProgramById('brcc-pn');
    const kind = brccPn?.approvals[0]?.kind;
    // 'provisional' is now a valid kind; it is distinct from 'state-board-approved'
    expect(kind).toBe('provisional');
    expect(kind).not.toBe('state-board-approved');
  });

  test('needs-verification kind is still available for unconfirmed approvals', () => {
    // No program currently uses needs-verification, but the type must accept it.
    // This compiles only if 'needs-verification' is in the ProgramApprovalKind union.
    const kind: import('../healthcare/types').ProgramApprovalKind = 'needs-verification';
    expect(kind).toBe('needs-verification');
  });

  test('verified-official-source verifiedOn does not automatically imply regulatory approval', () => {
    // BRCC PN is verified-official-source (institution page confirmed) but approval is provisional.
    const p = getProgramById('brcc-pn');
    expect(p?.verificationStatus).toBe('verified-official-source');
    expect(p?.approvals[0]?.kind).toBe('provisional');
  });

  test('state-board-approved appears only on programs with direct official evidence', () => {
    for (const p of HEALTHCARE_PROGRAMS) {
      for (const approval of p.approvals) {
        if (approval.kind === 'state-board-approved') {
          // Must have an evidenceUrl
          expect(approval.evidenceUrl).not.toBeNull();
        }
      }
    }
  });
});
