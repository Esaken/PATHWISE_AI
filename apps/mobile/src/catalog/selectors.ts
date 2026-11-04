import type {
  Opportunity,
  CatalogFilters,
  RankedOpportunity,
  MatchReason,
  LearnerCategory,
  Topic,
  BudgetFilter,
} from './types';
import type { OnboardingAnswers } from '../types/onboarding';

// ─── Budget compatibility ─────────────────────────────────────────────────────

function priceWithinBudget(opp: Opportunity, budget: BudgetFilter): boolean {
  const price = opp.price;
  // Unknown price is never within any numeric or free budget.
  if (price.kind === 'unknown') return budget === 'flexible';
  if (budget === 'flexible') return true;
  if (budget === 'free') return price.kind === 'free';
  if (budget === 'up-to-25') return price.amount <= 25;
  if (budget === 'up-to-100') return price.amount <= 100;
  return false;
}

// ─── Single-opportunity filter ────────────────────────────────────────────────

function passesFilters(opp: Opportunity, filters: CatalogFilters): boolean {
  const { learnerCategories, topics, opportunityCategories, creditClasses, budget, deliveryMode, louisianaOnly } = filters;

  if (learnerCategories.length > 0) {
    const hasCategory = learnerCategories.some((c) => opp.learnerEligibility.categories.includes(c));
    if (!hasCategory) return false;
  }

  if (topics.length > 0) {
    const hasTopic = topics.some((t) => opp.topics.includes(t));
    if (!hasTopic) return false;
  }

  if (opportunityCategories.length > 0 && !opportunityCategories.includes(opp.category)) return false;

  if (creditClasses.length > 0 && !creditClasses.includes(opp.creditRecognition.kind)) return false;

  if (budget !== null && !priceWithinBudget(opp, budget)) return false;

  if (deliveryMode !== null && opp.availability.mode !== deliveryMode) return false;

  if (louisianaOnly) {
    const juris = opp.availability.mode === 'online'
      ? opp.availability.jurisdictions
      : opp.availability.jurisdictions;
    if (juris !== null && !juris.includes('Louisiana') && !juris.includes('LA')) return false;
  }

  return true;
}

// ─── Scoring (deterministic) ──────────────────────────────────────────────────

function scoreOpportunity(
  opp: Opportunity,
  filters: CatalogFilters,
  reasons: MatchReason[],
): number {
  let score = 0;

  // Verified sources rank above needs-recheck
  if (opp.verification.status === 'verified-official-source') score += 100;

  for (const cat of filters.learnerCategories) {
    if (opp.learnerEligibility.categories.includes(cat)) {
      score += 20;
      reasons.push({ field: 'learnerCategory', label: `Matches ${cat} learner` });
      break;
    }
  }

  for (const topic of filters.topics) {
    if (opp.topics.includes(topic)) {
      score += 15;
      reasons.push({ field: 'topic', label: `Covers ${topic.replace(/-/g, ' ')}` });
      break;
    }
  }

  if (filters.budget !== null && priceWithinBudget(opp, filters.budget)) {
    score += 10;
    reasons.push({ field: 'budget', label: 'Fits your budget' });
  }

  if (filters.louisianaOnly && opp.topics.includes('responsible-vendor')) {
    score += 25;
    reasons.push({ field: 'location', label: 'Louisiana-relevant training' });
  }

  return score;
}

// ─── Main selector ────────────────────────────────────────────────────────────

export function filterAndRank(
  catalog: readonly Opportunity[],
  filters: CatalogFilters,
): RankedOpportunity[] {
  const results: RankedOpportunity[] = [];

  for (const opp of catalog) {
    if (!passesFilters(opp, filters)) continue;
    const matchReasons: MatchReason[] = [];
    const score = scoreOpportunity(opp, filters, matchReasons);
    results.push({ opportunity: opp, score, matchReasons });
  }

  // Deterministic: verified before needs-recheck, then by score desc, then title asc, then id asc
  return results.sort((a, b) => {
    const aVerified = a.opportunity.verification.status === 'verified-official-source' ? 0 : 1;
    const bVerified = b.opportunity.verification.status === 'verified-official-source' ? 0 : 1;
    if (aVerified !== bVerified) return aVerified - bVerified;
    if (b.score !== a.score) return b.score - a.score;
    const titleCmp = a.opportunity.title.localeCompare(b.opportunity.title);
    if (titleCmp !== 0) return titleCmp;
    return a.opportunity.id.localeCompare(b.opportunity.id);
  });
}

// ─── Onboarding → filters translation ────────────────────────────────────────

const CAREER_TO_TOPICS: Partial<Record<string, Topic[]>> = {
  technology: ['cybersecurity', 'networking', 'information-technology'],
  engineering: ['networking', 'information-technology'],
  business: ['career-skills'],
  healthcare: ['career-skills'],
  education: ['career-skills'],
  legal: ['career-skills'],
  environment: ['career-skills'],
  trades: ['career-skills'],
  sports: ['career-skills'],
  arts: ['career-skills'],
};

const GOAL_TO_TOPICS: Partial<Record<string, Topic[]>> = {
  'explore-credit': ['alternative-credit'],
  'explore-possible-credit': ['alternative-credit'],
};

function deriveTopics(answers: OnboardingAnswers): Topic[] {
  const topics = new Set<Topic>();

  if (answers.learnerType === 'high-school' || answers.learnerType === 'university') {
    const careerInterest = answers.careerInterest;
    if (careerInterest) {
      for (const t of CAREER_TO_TOPICS[careerInterest] ?? []) topics.add(t);
    }
    const goal = answers.goal ?? '';
    for (const t of GOAL_TO_TOPICS[goal] ?? []) topics.add(t);
  } else {
    // adult
    const careerGoal = answers.careerGoal;
    if (careerGoal && careerGoal !== 'something-else') {
      for (const t of CAREER_TO_TOPICS[careerGoal] ?? []) topics.add(t);
    }
    const goal = answers.goal ?? '';
    for (const t of GOAL_TO_TOPICS[goal] ?? []) topics.add(t);
  }

  return [...topics];
}

function deriveLearnerCategory(answers: OnboardingAnswers): LearnerCategory {
  return answers.learnerType;
}

function deriveBudget(answers: OnboardingAnswers): BudgetFilter | null {
  const b = answers.budget;
  if (!b) return null;
  if (b === 'free') return 'free';
  if (b === 'up-to-25') return 'up-to-25';
  if (b === 'up-to-100') return 'up-to-100';
  if (b === 'flexible') return 'flexible';
  return null;
}

function deriveLouisianaOnly(answers: OnboardingAnswers): boolean {
  if (answers.learnerType === 'adult') {
    return answers.stateRegion === 'LA';
  }
  return false;
}

export function filtersFromSession(answers: OnboardingAnswers): CatalogFilters {
  const learnerCategory = deriveLearnerCategory(answers);
  const topics = deriveTopics(answers);
  const louisianaOnly = deriveLouisianaOnly(answers);

  // For Louisiana adult with responsible-vendor affinity, add topic explicitly
  if (louisianaOnly && !topics.includes('responsible-vendor')) {
    topics.push('responsible-vendor');
  }

  return {
    learnerCategories: [learnerCategory],
    topics,
    opportunityCategories: [],
    creditClasses: [],
    budget: deriveBudget(answers),
    deliveryMode: null,
    louisianaOnly,
  };
}
