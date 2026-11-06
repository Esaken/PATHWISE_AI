/**
 * Deterministic, rule-based recommendation engine.
 * Accepts validated onboarding answers and the verified opportunity catalog.
 * Returns a ranked list of recommendations with match reasons and eligibility
 * caveats derived from catalog data only — nothing is invented.
 *
 * Scoring weights (sum = 100):
 *   GOAL     40  — opportunity topics match the learner's stated goal
 *   CAREER   25  — opportunity topics match career/subject interest
 *   EDUCATION 15 — baseline awarded to every learner-eligible item
 *   BUDGET   10  — opportunity price fits the stated budget preference
 *   LOCATION 10  — opportunity is jurisdiction-specific to learner's state
 *
 * Hard constraint: an opportunity whose learnerEligibility.categories does not
 * include the learner's type is excluded before scoring. A high score never
 * overrides this constraint.
 *
 * Future AI integration: replace or augment scoreGoal() / scoreCareer() with
 * embedding similarity while keeping the hard filter and sort contract intact.
 */

import type { LearnerCategory, MatchReason, Opportunity, Topic } from '@/catalog/types';
import type {
  AdultAnswers,
  BudgetPreference,
  HighSchoolAnswers,
  OnboardingAnswers,
  UniversityAnswers,
} from '@/types/onboarding';
import type { EligibilityCaveat, Recommendation } from './types';

// ─── Score weights ────────────────────────────────────────────────────────────

const W = { GOAL: 40, CAREER: 25, EDUCATION: 15, BUDGET: 10, LOCATION: 10 } as const;

// ─── Goal → catalog topic mapping ────────────────────────────────────────────
// Only goals that have a clear match to current catalog topics are mapped.
// Goals that rely on career interest for topic derivation are left empty here;
// their relevance is captured in the CAREER scoring component.

const GOAL_TOPICS: Partial<Record<string, readonly Topic[]>> = {
  'prepare-college': ['alternative-credit'],
  'explore-credit': ['alternative-credit'],
  'job-training': ['responsible-vendor'],
};

// ─── Career interest → catalog topic mapping ─────────────────────────────────

const CAREER_TOPICS: Partial<Record<string, readonly Topic[]>> = {
  technology: ['cybersecurity', 'networking', 'information-technology'],
  engineering: ['networking', 'information-technology'],
};

// ─── University study area → catalog topic mapping ───────────────────────────

const STUDY_TOPICS: Partial<Record<string, readonly Topic[]>> = {
  'computer-science': ['cybersecurity', 'networking', 'information-technology'],
  engineering: ['networking', 'information-technology'],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function topicsIntersect(oppTopics: readonly Topic[], expected: readonly Topic[]): boolean {
  return expected.some((t) => oppTopics.includes(t));
}

function goalTopicsFor(answers: OnboardingAnswers): readonly Topic[] {
  return GOAL_TOPICS[answers.goal ?? ''] ?? [];
}

function careerTopicsFor(answers: OnboardingAnswers): readonly Topic[] {
  if (answers.learnerType === 'adult') {
    const cg = (answers as AdultAnswers).careerGoal;
    if (!cg || cg === 'something-else') return [];
    return CAREER_TOPICS[cg] ?? [];
  }
  if (answers.learnerType === 'university') {
    const a = answers as UniversityAnswers;
    const ci = new Set<Topic>([
      ...(CAREER_TOPICS[a.careerInterest ?? ''] ?? []),
      ...(STUDY_TOPICS[a.studyArea ?? ''] ?? []),
    ]);
    return [...ci];
  }
  const a = answers as HighSchoolAnswers;
  return CAREER_TOPICS[a.careerInterest ?? ''] ?? [];
}

function isInBudget(opp: Opportunity, budget: BudgetPreference | null): boolean {
  if (!budget) return false;
  const { price } = opp;
  if (price.kind === 'unknown') return budget === 'flexible';
  if (budget === 'flexible') return true;
  if (budget === 'free') return price.kind === 'free';
  if (budget === 'up-to-25') return price.amount <= 25;
  if (budget === 'up-to-100') return price.amount <= 100;
  return false;
}

function isLouisiana(answers: OnboardingAnswers): boolean {
  return answers.learnerType === 'adult' && (answers as AdultAnswers).stateRegion === 'LA';
}

function isLouisianaSpecific(opp: Opportunity): boolean {
  const { availability } = opp;
  const juris = availability.jurisdictions;
  if (juris === null) return false;
  return juris.includes('Louisiana') || juris.includes('LA');
}

// ─── Human-readable label helpers (for match reason text) ────────────────────

const GOAL_LABELS: Record<string, string> = {
  'prepare-college': 'prepare for college',
  'explore-credit': 'explore potential college-credit options',
  'build-career-skills': 'build career skills',
  'explore-career-pathways': 'explore career pathways',
  'prepare-certification': 'prepare for a professional certification',
  'build-job-skills': 'build job-relevant skills',
  'prepare-internships': 'prepare for internships',
  'job-training': 'complete job-related training',
  'build-general-skills': 'build general skills',
  'change-career': 'change or advance a career pathway',
};

const CAREER_LABELS: Record<string, string> = {
  technology: 'technology and computing',
  engineering: 'engineering and architecture',
  healthcare: 'healthcare and medicine',
  business: 'business and finance',
  arts: 'arts, design, and media',
  education: 'education and social services',
  legal: 'legal and public policy',
  environment: 'environment and science',
  trades: 'trades and manufacturing',
  sports: 'sports and recreation',
  'computer-science': 'computer science',
  creative: 'creative work',
  leadership: 'leadership and management',
};

function goalLabel(answers: OnboardingAnswers): string {
  return GOAL_LABELS[answers.goal ?? ''] ?? 'your selected goal';
}

function careerLabel(answers: OnboardingAnswers): string {
  if (answers.learnerType === 'adult') {
    return CAREER_LABELS[(answers as AdultAnswers).careerGoal ?? ''] ?? 'your career interest';
  }
  if (answers.learnerType === 'university') {
    const a = answers as UniversityAnswers;
    return (
      CAREER_LABELS[a.careerInterest ?? ''] ??
      CAREER_LABELS[a.studyArea ?? ''] ??
      'your area of interest'
    );
  }
  return CAREER_LABELS[(answers as HighSchoolAnswers).careerInterest ?? ''] ?? 'your career interest';
}

// ─── Eligibility caveats ──────────────────────────────────────────────────────

function buildCaveats(opp: Opportunity, inLA: boolean): readonly EligibilityCaveat[] {
  const caveats: EligibilityCaveat[] = [];
  const { creditRecognition } = opp;

  if (creditRecognition.kind === 'possible-institution-approval') {
    caveats.push({ kind: 'credit-not-guaranteed', label: creditRecognition.disclaimer });
  }

  if (
    creditRecognition.kind === 'certification-or-required-training' &&
    opp.topics.includes('responsible-vendor')
  ) {
    caveats.push({ kind: 'confirm-with-employer', label: creditRecognition.disclaimer });
  }

  // Louisiana-specific opportunity surfaced to a non-Louisiana learner
  if (isLouisianaSpecific(opp) && !inLA) {
    caveats.push({
      kind: 'location-dependent',
      label:
        'This training is specific to Louisiana-based employment. Confirm that you are ' +
        'working for a Louisiana ATC-permitted vendor before enrolling.',
    });
  }

  return caveats;
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function recommend(
  answers: OnboardingAnswers,
  catalog: readonly Opportunity[],
): Recommendation[] {
  const inLA = isLouisiana(answers);
  const gt = goalTopicsFor(answers);
  const ct = careerTopicsFor(answers);
  const learnerCat: LearnerCategory = answers.learnerType;

  const results: Recommendation[] = [];

  for (const opp of catalog) {
    // Hard eligibility constraint: learner category must be explicitly listed.
    if (!opp.learnerEligibility.categories.includes(learnerCat)) continue;

    let score = W.EDUCATION; // baseline for every learner-eligible item
    const matchReasons: MatchReason[] = [];

    // Goal alignment (40 pts)
    if (gt.length > 0 && topicsIntersect(opp.topics, gt)) {
      score += W.GOAL;
      matchReasons.push({
        field: 'goal',
        label: `Aligns with your goal to ${goalLabel(answers)}`,
      });
    }

    // Career/subject interest alignment (25 pts)
    if (ct.length > 0 && topicsIntersect(opp.topics, ct)) {
      score += W.CAREER;
      matchReasons.push({
        field: 'careerInterest',
        label: `Matches your interest in ${careerLabel(answers)}`,
      });
    }

    // Budget compatibility (10 pts)
    if (isInBudget(opp, answers.budget)) {
      score += W.BUDGET;
      matchReasons.push({ field: 'budget', label: 'Fits your budget preference' });
    }

    // Location relevance (10 pts)
    if (inLA && isLouisianaSpecific(opp)) {
      score += W.LOCATION;
      matchReasons.push({ field: 'location', label: 'Available in Louisiana' });
    }

    results.push({
      opportunity: opp,
      score,
      matchReasons,
      eligibilityStatus: 'eligible',
      eligibilityCaveats: buildCaveats(opp, inLA),
    });
  }

  // Deterministic sort: score desc → verified before needs-recheck → title asc → id asc
  return results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const av = a.opportunity.verification.status === 'verified-official-source' ? 0 : 1;
    const bv = b.opportunity.verification.status === 'verified-official-source' ? 0 : 1;
    if (av !== bv) return av - bv;
    const tc = a.opportunity.title.localeCompare(b.opportunity.title);
    if (tc !== 0) return tc;
    return a.opportunity.id.localeCompare(b.opportunity.id);
  });
}
