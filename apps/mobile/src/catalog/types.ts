export type LearnerCategory = 'high-school' | 'university' | 'adult';
export type Topic =
  | 'cybersecurity'
  | 'networking'
  | 'information-technology'
  | 'alternative-credit'
  | 'responsible-vendor'
  | 'career-skills'
  | 'nursing'
  | 'practical-nursing'
  | 'nurse-aide'
  | 'allied-health';
export type OpportunityCategory =
  | 'course'
  | 'exam-preparation'
  | 'exam'
  | 'certification-preparation'
  | 'required-training';

export type Price =
  | { kind: 'free'; currency: 'USD'; amount: 0; evidenceUrl: string }
  | { kind: 'known'; currency: 'USD'; amount: number; evidenceUrl: string }
  | { kind: 'unknown'; currency: null; amount: null; reason: string };

export type Duration =
  | { kind: 'known'; value: number; unit: 'minutes' | 'hours' | 'days' | 'weeks' | 'months'; evidenceUrl: string }
  | { kind: 'self-paced'; estimate: string | null; evidenceUrl: string }
  | { kind: 'unknown'; reason: string };

export type Availability =
  | { mode: 'online'; jurisdictions: string[] | null }
  | { mode: 'in-person'; jurisdictions: string[]; locationSummary: string }
  | { mode: 'hybrid'; jurisdictions: string[] | null; locationSummary: string | null };

export type Verification = {
  status: 'verified-official-source' | 'needs-recheck';
  checkedOn: `${number}-${number}-${number}`;
  sourceUrls: readonly [string, ...string[]];
  evidenceNotes: string;
};

export type CreditRecognition =
  | {
      kind: 'verified-institution-policy';
      institution: string;
      policyUrl: string;
      policyCheckedOn: `${number}-${number}-${number}`;
      conditions: string;
    }
  | {
      kind: 'possible-institution-approval';
      disclaimer: 'Credit is not guaranteed. Confirm the current policy and degree applicability with your institution.';
      examOrPathway: string | null;
    }
  | {
      kind: 'certification-or-required-training';
      disclaimer: string;
      outcome: string | null;
    }
  | {
      kind: 'skills-only';
      disclaimer: 'Skills learning only; no academic credit or credential is promised.';
    };

export type Opportunity = {
  id: string;
  title: string;
  provider: string;
  description: string;
  learnerEligibility: {
    categories: readonly LearnerCategory[];
    summary: string;
    minimumAge: number | null;
    prerequisites: readonly string[];
  };
  topics: readonly Topic[];
  category: OpportunityCategory;
  officialUrl: string;
  price: Price;
  duration: Duration;
  availability: Availability;
  verification: Verification;
  creditRecognition: CreditRecognition;
  searchTags: readonly string[];
};

// ─── Filter and selector types ────────────────────────────────────────────────

export type CreditClass =
  | 'verified-institution-policy'
  | 'possible-institution-approval'
  | 'certification-or-required-training'
  | 'skills-only';

export type DeliveryMode = 'online' | 'in-person' | 'hybrid';

export type BudgetFilter = 'free' | 'up-to-25' | 'up-to-100' | 'flexible';

export type CatalogFilters = {
  learnerCategories: readonly LearnerCategory[];
  topics: readonly Topic[];
  opportunityCategories: readonly OpportunityCategory[];
  creditClasses: readonly CreditClass[];
  budget: BudgetFilter | null;
  deliveryMode: DeliveryMode | null;
  louisianaOnly: boolean;
};

export const EMPTY_FILTERS: CatalogFilters = {
  learnerCategories: [],
  topics: [],
  opportunityCategories: [],
  creditClasses: [],
  budget: null,
  deliveryMode: null,
  louisianaOnly: false,
};

export type MatchReason = {
  field: string;
  label: string;
};

export type RankedOpportunity = {
  opportunity: Opportunity;
  score: number;
  matchReasons: readonly MatchReason[];
};
