import type { MatchReason, Opportunity } from '@/catalog/types';

export type EligibilityStatus = 'eligible' | 'unknown';

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
