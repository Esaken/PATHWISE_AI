import type { MatchReason, Opportunity } from '@/catalog/types';

// 'category-compatible' — the learner's type is listed in the opportunity's
// learnerEligibility.categories. No prerequisites, provider conditions,
// institutional policies, or employer requirements have been independently
// verified. This status does not imply the learner is fully eligible to enrol.
// 'eligibility-unconfirmed' — reserved for future records with explicit
// prerequisites that have not been verified as satisfied.
export type EligibilityStatus = 'category-compatible' | 'eligibility-unconfirmed';

export type EligibilityCaveatKind =
  | 'credit-not-guaranteed'
  | 'confirm-with-institution'
  | 'confirm-with-employer'
  | 'location-dependent';

export type EligibilityCaveat = {
  kind: EligibilityCaveatKind;
  label: string;
};

// Recommendation structurally extends RankedOpportunity (opportunity + score +
// matchReasons) so it can be passed directly to OpportunityCard without casting.
export type Recommendation = {
  opportunity: Opportunity;
  score: number; // 0–100; baseline 15 for learner-eligible items
  matchReasons: readonly MatchReason[];
  eligibilityStatus: EligibilityStatus;
  eligibilityCaveats: readonly EligibilityCaveat[];
};
