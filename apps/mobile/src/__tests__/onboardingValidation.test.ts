import {
  hasErrors,
  trimText,
  validateStep,
  validateStep1,
  validateStep2,
  validateStep3,
} from '@/utils/onboardingValidation';
import type { AdultAnswers, HighSchoolAnswers, UniversityAnswers } from '@/types/onboarding';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const hs = (overrides: Partial<HighSchoolAnswers> = {}): HighSchoolAnswers => ({
  learnerType: 'high-school',
  grade: '10th',
  careerInterest: 'technology',
  goal: 'prepare-college',
  budget: 'free',
  ...overrides,
});

const uni = (overrides: Partial<UniversityAnswers> = {}): UniversityAnswers => ({
  learnerType: 'university',
  studyArea: 'engineering',
  careerInterest: 'technology',
  goal: 'build-job-skills',
  budget: 'up-to-25',
  institutionName: '',
  ...overrides,
});

const adult = (overrides: Partial<AdultAnswers> = {}): AdultAnswers => ({
  learnerType: 'adult',
  careerGoal: 'technology',
  careerGoalOther: '',
  goal: 'build-general-skills',
  budget: 'flexible',
  stateRegion: null,
  ...overrides,
});

// ─── hasErrors ────────────────────────────────────────────────────────────────

describe('hasErrors', () => {
  it('returns false for empty errors', () => {
    expect(hasErrors({})).toBe(false);
  });
  it('returns false when all values are undefined', () => {
    expect(hasErrors({ grade: undefined })).toBe(false);
  });
  it('returns true when any error is set', () => {
    expect(hasErrors({ grade: 'Please select a grade.' })).toBe(true);
  });
});

// ─── trimText ─────────────────────────────────────────────────────────────────

describe('trimText', () => {
  it('trims leading and trailing whitespace', () => {
    expect(trimText('  hello  ')).toBe('hello');
  });
  it('returns empty string unchanged', () => {
    expect(trimText('')).toBe('');
  });
});

// ─── validateStep1 — high school ─────────────────────────────────────────────

describe('validateStep1 — high school', () => {
  it('passes with a valid grade', () => {
    expect(hasErrors(validateStep1(hs()))).toBe(false);
  });

  it('fails when grade is null', () => {
    const errors = validateStep1(hs({ grade: null }));
    expect(errors.grade).toBeTruthy();
    expect(hasErrors(errors)).toBe(true);
  });

  it('error message does not blame the user', () => {
    const errors = validateStep1(hs({ grade: null }));
    expect(errors.grade).not.toMatch(/you (didn|must|should|failed)/i);
  });
});

// ─── validateStep1 — university ───────────────────────────────────────────────

describe('validateStep1 — university', () => {
  it('passes with a valid study area', () => {
    expect(hasErrors(validateStep1(uni()))).toBe(false);
  });

  it('fails when studyArea is null', () => {
    const errors = validateStep1(uni({ studyArea: null }));
    expect(errors.studyArea).toBeTruthy();
  });
});

// ─── validateStep1 — adult ────────────────────────────────────────────────────

describe('validateStep1 — adult', () => {
  it('passes with a valid career goal', () => {
    expect(hasErrors(validateStep1(adult()))).toBe(false);
  });

  it('fails when careerGoal is null', () => {
    const errors = validateStep1(adult({ careerGoal: null }));
    expect(errors.careerGoal).toBeTruthy();
  });

  it('fails when careerGoal is something-else and careerGoalOther is empty', () => {
    const errors = validateStep1(adult({ careerGoal: 'something-else', careerGoalOther: '' }));
    expect(errors.careerGoalOther).toBeTruthy();
  });

  it('fails when careerGoal is something-else and careerGoalOther is whitespace only', () => {
    const errors = validateStep1(adult({ careerGoal: 'something-else', careerGoalOther: '   ' }));
    expect(errors.careerGoalOther).toBeTruthy();
  });

  it('fails when careerGoalOther exceeds 100 characters', () => {
    const longText = 'a'.repeat(101);
    const errors = validateStep1(adult({ careerGoal: 'something-else', careerGoalOther: longText }));
    expect(errors.careerGoalOther).toBeTruthy();
  });

  it('passes when careerGoal is something-else and careerGoalOther is valid', () => {
    const errors = validateStep1(adult({ careerGoal: 'something-else', careerGoalOther: 'Learning art' }));
    expect(hasErrors(errors)).toBe(false);
  });

  it('passes with exactly 100 characters in careerGoalOther', () => {
    const exactly100 = 'a'.repeat(100);
    const errors = validateStep1(adult({ careerGoal: 'something-else', careerGoalOther: exactly100 }));
    expect(hasErrors(errors)).toBe(false);
  });
});

// ─── validateStep2 ────────────────────────────────────────────────────────────

describe('validateStep2', () => {
  it('passes for high school with goal', () => {
    expect(hasErrors(validateStep2(hs()))).toBe(false);
  });

  it('passes for university with goal', () => {
    expect(hasErrors(validateStep2(uni()))).toBe(false);
  });

  it('passes for adult with goal', () => {
    expect(hasErrors(validateStep2(adult()))).toBe(false);
  });

  it('fails when goal is null — high school', () => {
    expect(hasErrors(validateStep2(hs({ goal: null })))).toBe(true);
  });

  it('fails when goal is null — university', () => {
    expect(hasErrors(validateStep2(uni({ goal: null })))).toBe(true);
  });

  it('fails when goal is null — adult', () => {
    expect(hasErrors(validateStep2(adult({ goal: null })))).toBe(true);
  });
});

// ─── validateStep3 ────────────────────────────────────────────────────────────

describe('validateStep3 — high school', () => {
  it('passes with careerInterest and budget', () => {
    expect(hasErrors(validateStep3(hs()))).toBe(false);
  });

  it('fails when careerInterest is null', () => {
    const errors = validateStep3(hs({ careerInterest: null }));
    expect(errors.careerInterest).toBeTruthy();
  });

  it('fails when budget is null', () => {
    const errors = validateStep3(hs({ budget: null }));
    expect(errors.budget).toBeTruthy();
  });

  it('fails when both careerInterest and budget are null', () => {
    const errors = validateStep3(hs({ careerInterest: null, budget: null }));
    expect(errors.careerInterest).toBeTruthy();
    expect(errors.budget).toBeTruthy();
  });
});

describe('validateStep3 — university', () => {
  it('passes with careerInterest, budget, and empty institutionName', () => {
    expect(hasErrors(validateStep3(uni({ institutionName: '' })))).toBe(false);
  });

  it('passes with optional institution name provided', () => {
    expect(hasErrors(validateStep3(uni({ institutionName: 'MIT' })))).toBe(false);
  });

  it('fails when institutionName exceeds 100 characters', () => {
    const errors = validateStep3(uni({ institutionName: 'a'.repeat(101) }));
    expect(errors.institutionName).toBeTruthy();
  });

  it('institution at exactly 100 characters passes', () => {
    const errors = validateStep3(uni({ institutionName: 'a'.repeat(100) }));
    expect(hasErrors(errors)).toBe(false);
  });

  it('fails when careerInterest is null', () => {
    const errors = validateStep3(uni({ careerInterest: null }));
    expect(errors.careerInterest).toBeTruthy();
  });

  it('fails when budget is null', () => {
    const errors = validateStep3(uni({ budget: null }));
    expect(errors.budget).toBeTruthy();
  });
});

describe('validateStep3 — adult', () => {
  it('passes with budget set', () => {
    expect(hasErrors(validateStep3(adult()))).toBe(false);
  });

  it('fails when budget is null', () => {
    const errors = validateStep3(adult({ budget: null }));
    expect(errors.budget).toBeTruthy();
  });

  it('stateRegion is optional — does not cause failure when null', () => {
    const errors = validateStep3(adult({ stateRegion: null }));
    expect(hasErrors(errors)).toBe(false);
  });
});

// ─── validateStep dispatcher ──────────────────────────────────────────────────

describe('validateStep dispatcher', () => {
  it('dispatches step 1', () => {
    const errors = validateStep(1, hs({ grade: null }));
    expect(errors.grade).toBeTruthy();
  });

  it('dispatches step 2', () => {
    const errors = validateStep(2, hs({ goal: null }));
    expect(errors.goal).toBeTruthy();
  });

  it('dispatches step 3', () => {
    const errors = validateStep(3, hs({ budget: null }));
    expect(errors.budget).toBeTruthy();
  });
});
