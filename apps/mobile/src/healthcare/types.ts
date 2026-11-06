import type { LearnerCategory } from '@/catalog/types';

// ─── Career model ─────────────────────────────────────────────────────────────

export type HealthcareCareerCategory = 'nursing' | 'allied-health';

// Distinguishes how a role is credentialed. Does NOT imply that completing
// education automatically grants the credential — each has its own process.
export type CredentialClass =
  | 'professional-license'   // RN, LPN — state board examination + licensure required
  | 'registry-certification' // CNA — state nurse aide registry after competency evaluation
  | 'national-certification' // MA, Phlebotomy — national cert available, not always required
  | 'employer-preference';   // PCT — no universal standard; employer-driven

export type EducationRouteKind =
  | 'degree'       // ADN, BSN
  | 'diploma'      // LPN diploma / PN programs
  | 'certificate'  // CNA training, short certificates
  | 'accelerated'  // Accelerated BSN (requires prior bachelor's degree)
  | 'bridge';      // LPN-to-RN, CNA-to-LPN

export type EducationRoute = {
  routeId: string;
  kind: EducationRouteKind;
  label: string;
  description: string;
  typicalDurationMonths: { min: number; max: number } | null;
  minimumEducationPrerequisite: string | null;
  notes: string;
};

export type OfficialSource = {
  title: string;
  url: string;
  organization: string;
  jurisdiction: string;
  verificationStatus: 'official-regulator' | 'official-institution' | 'accreditor' | 'secondary';
};

export type HealthcareCareer = {
  id: string;
  title: string;
  shortDescription: string;
  credentialLabel: string;
  credentialClass: CredentialClass;
  category: HealthcareCareerCategory;
  typicalResponsibilities: readonly string[];
  educationRoutes: readonly EducationRoute[];
  eligibleLearnerCategories: readonly LearnerCategory[];
  officialSources: readonly OfficialSource[];
  relatedCareerIds: readonly string[];
  warnings: readonly string[];
};

// ─── Pathway types (output of the pathway engine) ─────────────────────────────

export type MilestoneKind =
  | 'preparation'
  | 'education'
  | 'clinical'
  | 'examination'
  | 'licensure'
  | 'registry'
  | 'employment';

export type PathwayMilestone = {
  id: string;
  kind: MilestoneKind;
  title: string;
  description: string;
  requiresConfirmation: boolean;
};

export type LearnerPathway = {
  careerId: string;
  learnerCategory: LearnerCategory;
  milestones: readonly PathwayMilestone[];
  relevantRoutes: readonly EducationRoute[];
  verifyWithProvider: readonly string[];
  linkedProgramIds: readonly string[];
  disclaimer: string;
};

// ─── Healthcare program catalog ───────────────────────────────────────────────
//
// Separate from the general Opportunity catalog. Healthcare programs are
// degree/diploma/certificate-level education, not short courses.
// Use explicit null for any field that could not be verified from official sources.

export type ProgramApprovalKind =
  | 'state-board-approved'
  | 'regionally-accredited'
  | 'programmatically-accredited'
  | 'needs-verification';

export type ProgramApproval = {
  kind: ProgramApprovalKind;
  approver: string;
  evidenceUrl: string | null;
  notes: string;
};

export type HealthcareProgram = {
  id: string;
  institution: string;
  programTitle: string;
  careerId: string;
  credentialAwarded: string;
  state: string;
  locationSummary: string;
  deliveryFormat: 'in-person' | 'online' | 'hybrid' | 'unknown';
  durationNote: string | null;
  tuitionNote: string | null;
  applicationRequirements: readonly string[];
  prerequisites: readonly string[];
  approvals: readonly ProgramApproval[];
  officialUrl: string;
  verifiedOn: string;
  verificationStatus: 'verified-official-source' | 'needs-recheck';
  warnings: readonly string[];
};
