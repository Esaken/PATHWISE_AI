import { CATALOG } from '../catalog/data';
import { validateCatalog } from '../catalog/validators';
import { filterAndRank, filtersFromSession } from '../catalog/selectors';
import {
  formatPrice,
  formatDuration,
  creditLabel,
  categoryLabel,
  topicLabel,
} from '../catalog/format';
import { EMPTY_FILTERS } from '../catalog/types';
import type { CatalogFilters, Opportunity } from '../catalog/types';
import type { OnboardingAnswers } from '../types/onboarding';

// ─── Schema validation ────────────────────────────────────────────────────────

describe('catalog schema validation', () => {
  it('passes for all seed records', () => {
    const errors = validateCatalog(CATALOG);
    expect(errors).toEqual([]);
  });

  it('rejects duplicate IDs', () => {
    const dup = [CATALOG[0], CATALOG[0]] as unknown as readonly Opportunity[];
    const errors = validateCatalog(dup);
    expect(errors.some((e) => e.message === 'duplicate ID')).toBe(true);
  });

  it('rejects non-HTTPS official URL', () => {
    const bad = [{ ...CATALOG[0], officialUrl: 'http://example.com' }] as unknown as readonly Opportunity[];
    const errors = validateCatalog(bad);
    expect(errors.some((e) => e.field === 'officialUrl')).toBe(true);
  });

  it('rejects empty title', () => {
    const bad = [{ ...CATALOG[0], title: '' }] as unknown as readonly Opportunity[];
    const errors = validateCatalog(bad);
    expect(errors.some((e) => e.field === 'title')).toBe(true);
  });

  it('rejects negative price amount', () => {
    const bad = [
      {
        ...CATALOG[0],
        price: { kind: 'known', currency: 'USD', amount: -1, evidenceUrl: 'https://example.com' },
      },
    ] as unknown as readonly Opportunity[];
    const errors = validateCatalog(bad);
    expect(errors.some((e) => e.field === 'price.amount')).toBe(true);
  });

  it('rejects free price with non-zero amount', () => {
    const bad = [
      {
        ...CATALOG[0],
        price: { kind: 'free', currency: 'USD', amount: 5, evidenceUrl: 'https://example.com' },
      },
    ] as unknown as readonly Opportunity[];
    const errors = validateCatalog(bad);
    expect(errors.some((e) => e.field === 'price.amount')).toBe(true);
  });

  it('rejects empty topics array', () => {
    const bad = [{ ...CATALOG[0], topics: [] }] as unknown as readonly Opportunity[];
    const errors = validateCatalog(bad);
    expect(errors.some((e) => e.field === 'topics')).toBe(true);
  });

  it('rejects missing verification evidenceNotes', () => {
    const bad = [
      {
        ...CATALOG[0],
        verification: { ...CATALOG[0].verification, evidenceNotes: '' },
      },
    ] as unknown as readonly Opportunity[];
    const errors = validateCatalog(bad);
    expect(errors.some((e) => e.field === 'verification.evidenceNotes')).toBe(true);
  });

  it('rejects empty sourceUrls', () => {
    const bad = [
      {
        ...CATALOG[0],
        verification: { ...CATALOG[0].verification, sourceUrls: [] },
      },
    ] as unknown as readonly Opportunity[];
    const errors = validateCatalog(bad);
    expect(errors.some((e) => e.field === 'verification.sourceUrls')).toBe(true);
  });

  it('rejects non-HTTPS source URL', () => {
    const bad = [
      {
        ...CATALOG[0],
        verification: { ...CATALOG[0].verification, sourceUrls: ['http://example.com'] },
      },
    ] as unknown as readonly Opportunity[];
    const errors = validateCatalog(bad);
    expect(errors.some((e) => e.field === 'verification.sourceUrls')).toBe(true);
  });

  it('rejects skills-only disclaimer that does not match required text', () => {
    const bad = [
      {
        ...CATALOG[0],
        creditRecognition: { kind: 'skills-only', disclaimer: 'Wrong text.' },
      },
    ] as unknown as readonly Opportunity[];
    const errors = validateCatalog(bad);
    expect(errors.some((e) => e.field === 'creditRecognition.disclaimer')).toBe(true);
  });

  it('rejects possible-institution-approval with wrong disclaimer', () => {
    const bad = [
      {
        ...CATALOG[2],
        creditRecognition: {
          kind: 'possible-institution-approval',
          disclaimer: 'Wrong.',
          examOrPathway: null,
        },
      },
    ] as unknown as readonly Opportunity[];
    const errors = validateCatalog(bad);
    expect(errors.some((e) => e.field === 'creditRecognition.disclaimer')).toBe(true);
  });

  it('rejects non-kebab-case ID', () => {
    const bad = [{ ...CATALOG[0], id: 'Invalid ID' }] as unknown as readonly Opportunity[];
    const errors = validateCatalog(bad);
    expect(errors.some((e) => e.field === 'id')).toBe(true);
  });
});

// ─── Catalog data invariants ──────────────────────────────────────────────────

describe('catalog data invariants', () => {
  it('all IDs are unique', () => {
    const ids = CATALOG.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all IDs are non-empty kebab-case', () => {
    for (const opp of CATALOG) {
      expect(opp.id).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('all official URLs are HTTPS', () => {
    for (const opp of CATALOG) {
      expect(opp.officialUrl).toMatch(/^https:\/\//);
    }
  });

  it('all source URLs are HTTPS', () => {
    for (const opp of CATALOG) {
      for (const url of opp.verification.sourceUrls) {
        expect(url).toMatch(/^https:\/\//);
      }
    }
  });

  it('unknown price never has a numeric amount', () => {
    for (const opp of CATALOG) {
      if (opp.price.kind === 'unknown') {
        expect(opp.price.amount).toBeNull();
      }
    }
  });

  it('no record has an empty eligibility categories list', () => {
    for (const opp of CATALOG) {
      expect(opp.learnerEligibility.categories.length).toBeGreaterThan(0);
    }
  });
});

// ─── Selectors: filtering ─────────────────────────────────────────────────────

describe('filterAndRank: filtering', () => {
  it('no filters returns all records', () => {
    const results = filterAndRank(CATALOG, EMPTY_FILTERS);
    expect(results.length).toBe(CATALOG.length);
  });

  it('filters by learner category — high-school only', () => {
    const filters: CatalogFilters = { ...EMPTY_FILTERS, learnerCategories: ['high-school'] };
    const results = filterAndRank(CATALOG, filters);
    for (const r of results) {
      expect(r.opportunity.learnerEligibility.categories).toContain('high-school');
    }
  });

  it('filters by topic — cybersecurity', () => {
    const filters: CatalogFilters = { ...EMPTY_FILTERS, topics: ['cybersecurity'] };
    const results = filterAndRank(CATALOG, filters);
    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      expect(r.opportunity.topics).toContain('cybersecurity');
    }
  });

  it('filters by topic — responsible-vendor returns Louisiana record', () => {
    const filters: CatalogFilters = { ...EMPTY_FILTERS, topics: ['responsible-vendor'] };
    const results = filterAndRank(CATALOG, filters);
    expect(results.some((r) => r.opportunity.id === 'louisiana-atc-responsible-vendor')).toBe(true);
  });

  it('filters by topic — alternative-credit returns CLEP records', () => {
    const filters: CatalogFilters = { ...EMPTY_FILTERS, topics: ['alternative-credit'] };
    const results = filterAndRank(CATALOG, filters);
    expect(results.some((r) => r.opportunity.id === 'modern-states-clep-prep')).toBe(true);
    expect(results.some((r) => r.opportunity.id === 'clep-exam-program')).toBe(true);
  });

  it('filters by budget free — returns only free records', () => {
    const filters: CatalogFilters = { ...EMPTY_FILTERS, budget: 'free' };
    const results = filterAndRank(CATALOG, filters);
    for (const r of results) {
      expect(r.opportunity.price.kind).toBe('free');
    }
  });

  it('unknown price is excluded from free budget filter', () => {
    const filters: CatalogFilters = { ...EMPTY_FILTERS, budget: 'free' };
    const results = filterAndRank(CATALOG, filters);
    expect(results.every((r) => r.opportunity.price.kind !== 'unknown')).toBe(true);
  });

  it('unknown price IS included in flexible budget', () => {
    const filters: CatalogFilters = { ...EMPTY_FILTERS, budget: 'flexible' };
    const results = filterAndRank(CATALOG, filters);
    expect(results.some((r) => r.opportunity.price.kind === 'unknown')).toBe(true);
  });

  it('filters by budget up-to-25 excludes $97 exam', () => {
    const filters: CatalogFilters = { ...EMPTY_FILTERS, budget: 'up-to-25' };
    const results = filterAndRank(CATALOG, filters);
    expect(results.every((r) => r.opportunity.id !== 'clep-exam-program')).toBe(true);
  });

  it('filters by delivery mode online excludes in-person', () => {
    const filters: CatalogFilters = { ...EMPTY_FILTERS, deliveryMode: 'online' };
    const results = filterAndRank(CATALOG, filters);
    for (const r of results) {
      expect(r.opportunity.availability.mode).toBe('online');
    }
  });

  it('louisianaOnly includes responsible-vendor record', () => {
    const filters: CatalogFilters = { ...EMPTY_FILTERS, louisianaOnly: true };
    const results = filterAndRank(CATALOG, filters);
    expect(results.some((r) => r.opportunity.id === 'louisiana-atc-responsible-vendor')).toBe(true);
  });

  it('louisianaOnly excludes records without Louisiana jurisdiction', () => {
    const filters: CatalogFilters = { ...EMPTY_FILTERS, louisianaOnly: true };
    const results = filterAndRank(CATALOG, filters);
    // Online records with null jurisdictions pass the filter
    for (const r of results) {
      const juris = r.opportunity.availability.jurisdictions;
      if (juris !== null) {
        expect(juris.some((j) => j === 'Louisiana' || j === 'LA')).toBe(true);
      }
    }
  });

  it('credit class filter — skills-only', () => {
    const filters: CatalogFilters = { ...EMPTY_FILTERS, creditClasses: ['skills-only'] };
    const results = filterAndRank(CATALOG, filters);
    for (const r of results) {
      expect(r.opportunity.creditRecognition.kind).toBe('skills-only');
    }
  });

  it('opportunity category filter — exam', () => {
    const filters: CatalogFilters = { ...EMPTY_FILTERS, opportunityCategories: ['exam'] };
    const results = filterAndRank(CATALOG, filters);
    for (const r of results) {
      expect(r.opportunity.category).toBe('exam');
    }
    expect(results.some((r) => r.opportunity.id === 'clep-exam-program')).toBe(true);
  });

  it('combined filters: university + alternative-credit topic', () => {
    const filters: CatalogFilters = {
      ...EMPTY_FILTERS,
      learnerCategories: ['university'],
      topics: ['alternative-credit'],
    };
    const results = filterAndRank(CATALOG, filters);
    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      expect(r.opportunity.learnerEligibility.categories).toContain('university');
      expect(r.opportunity.topics).toContain('alternative-credit');
    }
  });

  it('no matching filter combination returns empty array', () => {
    const filters: CatalogFilters = {
      ...EMPTY_FILTERS,
      topics: ['responsible-vendor'],
      deliveryMode: 'online',
    };
    const results = filterAndRank(CATALOG, filters);
    expect(results.length).toBe(0);
  });
});

// ─── Selectors: ranking and determinism ──────────────────────────────────────

describe('filterAndRank: ordering', () => {
  it('verified-official-source records rank before needs-recheck', () => {
    const results = filterAndRank(CATALOG, EMPTY_FILTERS);
    let seenNeedsRecheck = false;
    for (const r of results) {
      if (r.opportunity.verification.status === 'needs-recheck') seenNeedsRecheck = true;
      if (seenNeedsRecheck) {
        expect(r.opportunity.verification.status).toBe('needs-recheck');
      }
    }
  });

  it('result list is deterministic across two calls with same filters', () => {
    const r1 = filterAndRank(CATALOG, EMPTY_FILTERS).map((r) => r.opportunity.id);
    const r2 = filterAndRank(CATALOG, EMPTY_FILTERS).map((r) => r.opportunity.id);
    expect(r1).toEqual(r2);
  });

  it('filtering does not mutate the original CATALOG array', () => {
    const original = [...CATALOG];
    filterAndRank(CATALOG, { ...EMPTY_FILTERS, topics: ['cybersecurity'] });
    expect(CATALOG).toEqual(original);
  });
});

// ─── Three demo profiles ──────────────────────────────────────────────────────

describe('demo profile: high-school cybersecurity learner', () => {
  const answers: OnboardingAnswers = {
    learnerType: 'high-school',
    grade: '10th',
    careerInterest: 'technology',
    goal: null,
    budget: null,
  };

  it('produces at least one result', () => {
    const filters = filtersFromSession(answers);
    const results = filterAndRank(CATALOG, filters);
    expect(results.length).toBeGreaterThan(0);
  });

  it('all results include high-school eligibility', () => {
    const filters = filtersFromSession(answers);
    const results = filterAndRank(CATALOG, filters);
    for (const r of results) {
      expect(r.opportunity.learnerEligibility.categories).toContain('high-school');
    }
  });

  it('cisco-intro-cybersecurity is in results', () => {
    const filters = filtersFromSession(answers);
    const results = filterAndRank(CATALOG, filters);
    expect(results.some((r) => r.opportunity.id === 'cisco-intro-cybersecurity')).toBe(true);
  });

  it('Louisiana adult-only record is excluded', () => {
    const filters = filtersFromSession(answers);
    const results = filterAndRank(CATALOG, filters);
    expect(results.every((r) => r.opportunity.id !== 'louisiana-atc-responsible-vendor')).toBe(true);
  });

  it('match reasons include topic label', () => {
    const filters = filtersFromSession(answers);
    const results = filterAndRank(CATALOG, filters);
    const cisco = results.find((r) => r.opportunity.id === 'cisco-intro-cybersecurity');
    expect(cisco?.matchReasons.some((mr) => mr.field === 'topic')).toBe(true);
  });
});

describe('demo profile: university networking + alternative-credit learner', () => {
  const answers: OnboardingAnswers = {
    learnerType: 'university',
    studyArea: null,
    careerInterest: 'technology',
    goal: 'explore-credit',
    budget: null,
    institutionName: '',
  };

  it('produces at least one result', () => {
    const filters = filtersFromSession(answers);
    const results = filterAndRank(CATALOG, filters);
    expect(results.length).toBeGreaterThan(0);
  });

  it('contains a networking record', () => {
    const filters = filtersFromSession(answers);
    const results = filterAndRank(CATALOG, filters);
    expect(results.some((r) => r.opportunity.topics.includes('networking'))).toBe(true);
  });

  it('contains an alternative-credit record', () => {
    const filters = filtersFromSession(answers);
    const results = filterAndRank(CATALOG, filters);
    expect(results.some((r) => r.opportunity.topics.includes('alternative-credit'))).toBe(true);
  });

  it('CLEP record uses possible-institution-approval (not verified-institution-policy)', () => {
    const filters = filtersFromSession(answers);
    const results = filterAndRank(CATALOG, filters);
    const clep = results.find((r) => r.opportunity.id === 'clep-exam-program');
    if (clep) {
      expect(clep.opportunity.creditRecognition.kind).toBe('possible-institution-approval');
    }
  });

  it('Louisiana RV record is excluded (no LA filter, different topic)', () => {
    const filters = filtersFromSession(answers);
    // University technology + explore-credit derives cybersecurity/networking/IT/alternative-credit topics
    // responsible-vendor is not derived for university technology learner
    expect(filters.topics).not.toContain('responsible-vendor');
  });
});

describe('demo profile: Louisiana adult responsible-vendor learner', () => {
  const answers: OnboardingAnswers = {
    learnerType: 'adult',
    careerGoal: null,
    careerGoalOther: '',
    goal: null,
    budget: null,
    stateRegion: 'LA',
  };

  it('produces at least one result', () => {
    const filters = filtersFromSession(answers);
    const results = filterAndRank(CATALOG, filters);
    expect(results.length).toBeGreaterThan(0);
  });

  it('louisiana-atc-responsible-vendor is in results', () => {
    const filters = filtersFromSession(answers);
    const results = filterAndRank(CATALOG, filters);
    expect(results.some((r) => r.opportunity.id === 'louisiana-atc-responsible-vendor')).toBe(true);
  });

  it('louisianaOnly flag is set', () => {
    const filters = filtersFromSession(answers);
    expect(filters.louisianaOnly).toBe(true);
  });

  it('responsible-vendor topic is derived', () => {
    const filters = filtersFromSession(answers);
    expect(filters.topics).toContain('responsible-vendor');
  });
});

// ─── Format helpers ───────────────────────────────────────────────────────────

describe('formatPrice', () => {
  it('free', () => expect(formatPrice({ kind: 'free', currency: 'USD', amount: 0, evidenceUrl: 'https://x.com' })).toBe('Free'));
  it('known', () => expect(formatPrice({ kind: 'known', currency: 'USD', amount: 97, evidenceUrl: 'https://x.com' })).toBe('$97'));
  it('unknown', () => expect(formatPrice({ kind: 'unknown', currency: null, amount: null, reason: 'r' })).toBe('Price not confirmed'));
});

describe('formatDuration', () => {
  it('known', () => expect(formatDuration({ kind: 'known', value: 90, unit: 'minutes', evidenceUrl: 'https://x.com' })).toBe('90 minutes'));
  it('self-paced with estimate', () => expect(formatDuration({ kind: 'self-paced', estimate: '~6 hrs', evidenceUrl: 'https://x.com' })).toBe('Self-paced (~6 hrs)'));
  it('self-paced no estimate', () => expect(formatDuration({ kind: 'self-paced', estimate: null, evidenceUrl: 'https://x.com' })).toBe('Self-paced'));
  it('unknown', () => expect(formatDuration({ kind: 'unknown', reason: 'r' })).toBe('Duration not confirmed'));
});

describe('creditLabel', () => {
  it('verified-institution-policy', () => {
    expect(creditLabel({ kind: 'verified-institution-policy', institution: 'x', policyUrl: 'https://x', policyCheckedOn: '2026-1-1', conditions: 'c' })).toBe('Verified published credit policy');
  });
  it('possible-institution-approval', () => {
    expect(creditLabel({
      kind: 'possible-institution-approval',
      disclaimer: 'Credit is not guaranteed. Confirm the current policy and degree applicability with your institution.',
      examOrPathway: null,
    })).toBe('Potential credit — confirm with institution/advisor');
  });
  it('certification-or-required-training', () => {
    expect(creditLabel({ kind: 'certification-or-required-training', disclaimer: 'd', outcome: null })).toBe('Certification / Required training');
  });
  it('skills-only', () => {
    expect(creditLabel({ kind: 'skills-only', disclaimer: 'Skills learning only; no academic credit or credential is promised.' })).toBe('Skills only');
  });
});

describe('categoryLabel', () => {
  it('course', () => expect(categoryLabel('course')).toBe('Course'));
  it('exam', () => expect(categoryLabel('exam')).toBe('Exam'));
  it('exam-preparation', () => expect(categoryLabel('exam-preparation')).toBe('Exam preparation'));
  it('required-training', () => expect(categoryLabel('required-training')).toBe('Required training'));
});

describe('topicLabel', () => {
  it('cybersecurity', () => expect(topicLabel('cybersecurity')).toBe('Cybersecurity'));
  it('responsible-vendor', () => expect(topicLabel('responsible-vendor')).toBe('Responsible Vendor'));
  it('unknown topic falls through to identity', () => expect(topicLabel('anything-else')).toBe('anything-else'));
});

// ─── filtersFromSession ───────────────────────────────────────────────────────

describe('filtersFromSession', () => {
  it('high-school technology derives cybersecurity topic', () => {
    const answers: OnboardingAnswers = { learnerType: 'high-school', grade: '10th', careerInterest: 'technology', goal: null, budget: null };
    const f = filtersFromSession(answers);
    expect(f.topics).toContain('cybersecurity');
    expect(f.learnerCategories).toContain('high-school');
  });

  it('budget free is forwarded', () => {
    const answers: OnboardingAnswers = { learnerType: 'high-school', grade: '10th', careerInterest: null, goal: null, budget: 'free' };
    const f = filtersFromSession(answers);
    expect(f.budget).toBe('free');
  });

  it('adult with LA adds louisianaOnly and responsible-vendor topic', () => {
    const answers: OnboardingAnswers = { learnerType: 'adult', careerGoal: null, careerGoalOther: '', goal: null, budget: null, stateRegion: 'LA' };
    const f = filtersFromSession(answers);
    expect(f.louisianaOnly).toBe(true);
    expect(f.topics).toContain('responsible-vendor');
  });

  it('adult with non-LA state does not set louisianaOnly', () => {
    const answers: OnboardingAnswers = { learnerType: 'adult', careerGoal: null, careerGoalOther: '', goal: null, budget: null, stateRegion: 'TX' };
    const f = filtersFromSession(answers);
    expect(f.louisianaOnly).toBe(false);
  });

  it('explore-credit goal adds alternative-credit topic', () => {
    const answers: OnboardingAnswers = { learnerType: 'university', studyArea: null, careerInterest: null, goal: 'explore-credit', budget: null, institutionName: '' };
    const f = filtersFromSession(answers);
    expect(f.topics).toContain('alternative-credit');
  });

  it('Louisiana adult with specific career goal does NOT get responsible-vendor topic injected', () => {
    const answers: OnboardingAnswers = { learnerType: 'adult', careerGoal: 'technology', careerGoalOther: '', goal: null, budget: null, stateRegion: 'LA' };
    const f = filtersFromSession(answers);
    expect(f.louisianaOnly).toBe(true);
    expect(f.topics).not.toContain('responsible-vendor');
    expect(f.topics).toContain('cybersecurity');
  });

  it('Louisiana adult with no career goal gets responsible-vendor topic', () => {
    const answers: OnboardingAnswers = { learnerType: 'adult', careerGoal: null, careerGoalOther: '', goal: null, budget: null, stateRegion: 'LA' };
    const f = filtersFromSession(answers);
    expect(f.louisianaOnly).toBe(true);
    expect(f.topics).toContain('responsible-vendor');
  });
});

// ─── Factual invariant regression tests (T3-B1, T3-B2, T3-B3 remediation) ───

describe('catalog factual invariants', () => {
  it('all verification dates use normalized YYYY-MM-DD format', () => {
    const isoDate = /^\d{4}-\d{2}-\d{2}$/;
    for (const opp of CATALOG) {
      expect(opp.verification.checkedOn).toMatch(isoDate);
    }
  });

  it('cisco-intro-cybersecurity has known duration of 6 hours', () => {
    const opp = CATALOG.find((o) => o.id === 'cisco-intro-cybersecurity');
    expect(opp?.duration.kind).toBe('known');
    if (opp?.duration.kind === 'known') {
      expect(opp.duration.value).toBe(6);
      expect(opp.duration.unit).toBe('hours');
    }
  });

  it('cisco-networking-basics has known duration of 22 hours', () => {
    const opp = CATALOG.find((o) => o.id === 'cisco-networking-basics');
    expect(opp?.duration.kind).toBe('known');
    if (opp?.duration.kind === 'known') {
      expect(opp.duration.value).toBe(22);
      expect(opp.duration.unit).toBe('hours');
    }
  });

  it('clep-exam-program has unknown duration (exam-specific, not universal)', () => {
    const opp = CATALOG.find((o) => o.id === 'clep-exam-program');
    expect(opp?.duration.kind).toBe('unknown');
  });

  it('clep-exam-program has hybrid availability (remote proctoring + test centers)', () => {
    const opp = CATALOG.find((o) => o.id === 'clep-exam-program');
    expect(opp?.availability.mode).toBe('hybrid');
  });

  it('louisiana-atc-responsible-vendor has hybrid availability (provider-dependent delivery)', () => {
    const opp = CATALOG.find((o) => o.id === 'louisiana-atc-responsible-vendor');
    expect(opp?.availability.mode).toBe('hybrid');
  });

  it('no Cisco record claims duration was not stated in evidence notes', () => {
    const cisco = CATALOG.filter((o) => o.id.startsWith('cisco-'));
    for (const opp of cisco) {
      expect(opp.verification.evidenceNotes.toLowerCase()).not.toContain('not stated on page');
    }
  });

  it('louisiana RV provider field does not identify ATC as the training provider', () => {
    const opp = CATALOG.find((o) => o.id === 'louisiana-atc-responsible-vendor');
    // Provider should reference approved providers, not ATC as the training provider
    expect(opp?.provider).not.toBe('Louisiana Office of Alcohol and Tobacco Control (ATC)');
    expect(opp?.provider.toLowerCase()).toContain('approved');
  });
});

// ─── Validator improvements (T3-B1 date, cross-field) ────────────────────────

describe('validator: improved date and cross-field checks', () => {
  it('rejects single-digit day in checkedOn (YYYY-MM-D is invalid)', () => {
    const bad = [
      {
        ...CATALOG[0],
        verification: { ...CATALOG[0].verification, checkedOn: '2026-11-4' },
      },
    ] as unknown as readonly Opportunity[];
    const errors = validateCatalog(bad);
    expect(errors.some((e) => e.field === 'verification.checkedOn')).toBe(true);
  });

  it('rejects single-digit month in checkedOn (YYYY-M-DD is invalid)', () => {
    const bad = [
      {
        ...CATALOG[0],
        verification: { ...CATALOG[0].verification, checkedOn: '2026-1-04' },
      },
    ] as unknown as readonly Opportunity[];
    const errors = validateCatalog(bad);
    expect(errors.some((e) => e.field === 'verification.checkedOn')).toBe(true);
  });

  it('rejects impossible month (month 13)', () => {
    const bad = [
      {
        ...CATALOG[0],
        verification: { ...CATALOG[0].verification, checkedOn: '2026-13-04' },
      },
    ] as unknown as readonly Opportunity[];
    const errors = validateCatalog(bad);
    expect(errors.some((e) => e.field === 'verification.checkedOn')).toBe(true);
  });

  it('rejects negative minimumAge', () => {
    const bad = [
      { ...CATALOG[0], learnerEligibility: { ...CATALOG[0].learnerEligibility, minimumAge: -1 } },
    ] as unknown as readonly Opportunity[];
    const errors = validateCatalog(bad);
    expect(errors.some((e) => e.field === 'learnerEligibility.minimumAge')).toBe(true);
  });

  it('accepts non-negative minimumAge', () => {
    const ok = [
      { ...CATALOG[0], learnerEligibility: { ...CATALOG[0].learnerEligibility, minimumAge: 0 } },
    ] as unknown as readonly Opportunity[];
    const errors = validateCatalog(ok);
    expect(errors.filter((e) => e.field === 'learnerEligibility.minimumAge')).toEqual([]);
  });
});
