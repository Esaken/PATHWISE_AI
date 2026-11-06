import type { HealthcareProgram } from './types';

// All program records verified from official institution websites on 2026-11-05.
// Fields that could not be confirmed from official sources are set to null.
// Do not modify fields to claim tuition, deadlines, or eligibility that have
// not been independently verified.
//
// Verified source URLs:
//   Delgado Community College (Charity School of Nursing):
//     https://www.dcc.edu/academics/charity-school-nursing/
//   Baton Rouge Community College (ASN):
//     https://mybrcc.edu/academics/nursing-and-allied-health/asnursing.php
//   Baton Rouge Community College (Practical Nursing):
//     https://mybrcc.edu/academics/nursing-and-allied-health/tdpracticalnursing.php
//   LSU Health Sciences Center School of Nursing (BSN):
//     https://nursing.lsuhsc.edu/bsn/
//   LSU Health BSN Admission Criteria:
//     https://nursing.lsuhsc.edu/bsn/admission.aspx

export const HEALTHCARE_PROGRAMS: readonly HealthcareProgram[] = [
  // ─── RN programs ─────────────────────────────────────────────────────────

  {
    id: 'delgado-adn',
    institution: 'Delgado Community College',
    programTitle: 'Associate Degree in Nursing (ADN)',
    careerId: 'rn',
    credentialAwarded:
      'Associate Degree in Nursing (ADN). Graduates are eligible to apply to sit for the NCLEX-RN licensure exam.',
    state: 'LA',
    locationSummary: 'New Orleans, LA (Charity School of Nursing)',
    deliveryFormat: 'in-person',
    durationNote:
      'Duration not confirmed on verified source. Typical ADN programs are approximately 2 years following prerequisite completion.',
    tuitionNote: null,
    applicationRequirements: [
      'High school diploma or equivalent (verify current requirement with program)',
      'Completion of program-specific prerequisite science courses (verify requirements with program)',
      'Criminal background check as required by Louisiana State Board of Nursing',
      'Health requirements (verify current requirements with program)',
    ],
    prerequisites: [
      'Program-specific science and general education prerequisites. Verify current prerequisites directly with Delgado Community College.',
    ],
    approvals: [
      {
        kind: 'programmatically-accredited',
        approver: 'Accreditation Commission for Education in Nursing (ACEN)',
        evidenceUrl: 'https://www.dcc.edu/academics/charity-school-nursing/',
        notes:
          'ACEN accreditation stated on official Charity School of Nursing program page. Confirm current accreditation status with ACEN (acenursing.org).',
      },
    ],
    officialUrl: 'https://www.dcc.edu/academics/charity-school-nursing/',
    verifiedOn: '2026-11-05',
    verificationStatus: 'verified-official-source',
    warnings: [
      'Admission is competitive. Meeting published minimum requirements does not guarantee admission.',
      'Verify current admission requirements, prerequisites, application deadlines, and program availability directly with Delgado Community College.',
      'ACEN accreditation status should be confirmed directly with ACEN for current standing.',
    ],
  },

  {
    id: 'brcc-asn',
    institution: 'Baton Rouge Community College',
    programTitle: 'Associate of Science in Nursing (ASN)',
    careerId: 'rn',
    credentialAwarded:
      'Associate of Science in Nursing (ASN). Graduates are eligible to apply to sit for the NCLEX-RN licensure exam.',
    state: 'LA',
    locationSummary: 'Baton Rouge, LA',
    deliveryFormat: 'in-person',
    durationNote: '5 semesters; 72 credit hours. Exact calendar duration varies.',
    tuitionNote:
      'Published tuition not confirmed on verified source. Described as affordable on official program page. Verify current tuition with BRCC.',
    applicationRequirements: [
      'Minimum cumulative GPA of 2.8 on 16 prerequisite credit hours, with grade C or better in all prerequisite courses',
      'Minimum 65% on TEAS (Test of Essential Academic Skills) entrance exam',
      'Criminal background check as required by Louisiana State Board of Nursing',
      'Current health and immunization requirements (verify with program)',
    ],
    prerequisites: [
      '16 credit hours of prerequisite coursework with minimum GPA 2.8 and grade C or better in each course. Verify exact prerequisite list with BRCC.',
    ],
    approvals: [
      {
        kind: 'programmatically-accredited',
        approver: 'Accreditation Commission for Education in Nursing (ACEN)',
        evidenceUrl: 'https://mybrcc.edu/academics/nursing-and-allied-health/asnursing.php',
        notes:
          'ACEN "Continuing Accreditation with Removal of Conditions" status stated on official BRCC ASN program page. Confirm current accreditation status with ACEN (acenursing.org).',
      },
    ],
    officialUrl: 'https://mybrcc.edu/academics/nursing-and-allied-health/asnursing.php',
    verifiedOn: '2026-11-05',
    verificationStatus: 'verified-official-source',
    warnings: [
      'Admission is selective. Applications open twice yearly (Spring and Fall). Most recently reported application window: January 11–30, 2027. Verify the current application cycle with BRCC.',
      'Meeting minimum requirements does not guarantee admission.',
      'NCLEX-RN pass rate of 83.8% reported on official program page; verify current rate with BRCC.',
      'ACEN accreditation status should be confirmed directly with ACEN for current standing.',
    ],
  },

  {
    id: 'lsuhsc-bsn',
    institution: 'LSU Health Sciences Center School of Nursing',
    programTitle: 'Bachelor of Science in Nursing (BSN)',
    careerId: 'rn',
    credentialAwarded:
      'Bachelor of Science in Nursing (BSN). Prepares graduates to apply to sit for the NCLEX-RN licensure exam.',
    state: 'LA',
    locationSummary: 'New Orleans, LA (also off-campus site in Baton Rouge)',
    deliveryFormat: 'in-person',
    durationNote:
      '3-year program of study following prerequisite completion. Verify current program structure with LSUHSC.',
    tuitionNote: null,
    applicationRequirements: [
      'Minimum cumulative GPA of 3.0 on a 4.0 scale',
      'Grade B- or better in all required science prerequisite courses (Biology Lecture + Lab, Chemistry, Microbiology)',
      'HESI Admission Assessment exam',
      'Criminal background check',
      'Additional requirements: verify current application requirements at nursing.lsuhsc.edu/bsn/admission.aspx',
    ],
    prerequisites: [
      'Biology Lecture and Lab, Chemistry, Microbiology — each with grade B- or minimum. Statistics at 300-level or above may be required. Verify current full prerequisite list with LSUHSC.',
    ],
    approvals: [
      {
        kind: 'programmatically-accredited',
        approver: 'Commission on Collegiate Nursing Education (CCNE)',
        evidenceUrl: 'https://nursing.lsuhsc.edu/bsn/',
        notes:
          'CCNE full accreditation stated on official BSN program page. Confirm current accreditation status with CCNE (ccneaccreditation.org).',
      },
      {
        kind: 'state-board-approved',
        approver: 'Louisiana State Board of Nursing (LSBN)',
        evidenceUrl: 'https://nursing.lsuhsc.edu/bsn/',
        notes: 'LSBN approval stated on official BSN program page.',
      },
    ],
    officialUrl: 'https://nursing.lsuhsc.edu/bsn/',
    verifiedOn: '2026-11-05',
    verificationStatus: 'verified-official-source',
    warnings: [
      'Admission is limited and competitive. Verify current requirements with LSUHSC School of Nursing.',
      'Pre-nursing prerequisite coursework can be completed at any accredited institution. Confirm transfer credit policies with LSUHSC before beginning prerequisites elsewhere.',
      'CCNE accreditation status should be confirmed directly with CCNE for current standing.',
    ],
  },

  // ─── LPN programs ─────────────────────────────────────────────────────────

  {
    id: 'delgado-pn',
    institution: 'Delgado Community College',
    programTitle: 'Practical Nursing (PN) Program',
    careerId: 'lpn',
    credentialAwarded:
      'Practical Nursing credential. Graduates are eligible to apply to sit for the NCLEX-PN licensure exam.',
    state: 'LA',
    locationSummary: 'New Orleans, LA (Charity School of Nursing)',
    deliveryFormat: 'in-person',
    durationNote:
      'Duration not confirmed on verified source. Typical PN programs are approximately 12 months.',
    tuitionNote: null,
    applicationRequirements: [
      'Verify current admission requirements, prerequisites, and application schedule directly with Delgado Community College',
    ],
    prerequisites: [
      'Program-specific prerequisites. Verify current requirements directly with Delgado Community College.',
    ],
    approvals: [
      {
        kind: 'state-board-approved',
        approver: 'Louisiana State Board of Practical Nurse Examiners (LSBPNE)',
        evidenceUrl: 'https://www.dcc.edu/academics/charity-school-nursing/',
        notes:
          'LSBPNE approval stated on the official Charity School of Nursing program page. Confirm current approval status with LSBPNE (lsbpne.la.gov).',
      },
    ],
    officialUrl: 'https://www.dcc.edu/academics/charity-school-nursing/',
    verifiedOn: '2026-11-05',
    verificationStatus: 'verified-official-source',
    warnings: [
      'Verify current admission requirements, prerequisites, application deadlines, and program availability directly with Delgado Community College.',
      'Only programs approved by LSBPNE qualify graduates to sit for the NCLEX-PN in Louisiana. Confirm current approval status with LSBPNE.',
    ],
  },

  {
    id: 'brcc-pn',
    institution: 'Baton Rouge Community College',
    programTitle: 'Technical Diploma in Practical Nursing',
    careerId: 'lpn',
    credentialAwarded:
      'Technical Diploma in Practical Nursing. Graduates are eligible to apply to sit for the NCLEX-PN licensure exam.',
    state: 'LA',
    locationSummary: 'Baton Rouge, LA (Acadian campus)',
    deliveryFormat: 'in-person',
    durationNote: '5 semesters; 59 credit hours.',
    tuitionNote: null,
    applicationRequirements: [
      'Verify current admission requirements, prerequisites, and application schedule directly with BRCC',
    ],
    prerequisites: [
      'Program-specific prerequisites. Verify current requirements directly with BRCC.',
    ],
    approvals: [
      {
        kind: 'needs-verification',
        approver: 'Louisiana State Board of Practical Nurse Examiners (LSBPNE)',
        evidenceUrl: null,
        notes:
          'Approval by LSBPNE is required for graduates to sit for the NCLEX-PN in Louisiana. Confirm current approval status with LSBPNE (lsbpne.la.gov) and with BRCC directly.',
      },
    ],
    officialUrl: 'https://mybrcc.edu/academics/nursing-and-allied-health/tdpracticalnursing.php',
    verifiedOn: '2026-11-05',
    verificationStatus: 'verified-official-source',
    warnings: [
      'Verify current admission requirements, prerequisites, and application schedule with BRCC directly.',
      'Confirm LSBPNE approval status for this program before enrolling.',
    ],
  },

  // ─── CNA programs ─────────────────────────────────────────────────────────

  {
    id: 'delgado-cna',
    institution: 'Delgado Community College',
    programTitle: 'Certified Nursing Assistant (CNA) Program',
    careerId: 'cna',
    credentialAwarded:
      'Completion leads to eligibility for Louisiana nurse aide competency evaluation and registry placement administered by the Louisiana Department of Health.',
    state: 'LA',
    locationSummary: 'New Orleans, LA (Charity School of Nursing)',
    deliveryFormat: 'in-person',
    durationNote:
      'Louisiana requires a minimum of 75 hours of training (classroom instruction and supervised practical training). Actual program schedule confirmed by institution.',
    tuitionNote: null,
    applicationRequirements: [
      'Verify current admission requirements, minimum age requirements, and scheduling directly with Delgado Community College',
    ],
    prerequisites: [
      'Minimum age and education requirements vary. Verify directly with the program.',
    ],
    approvals: [
      {
        kind: 'needs-verification',
        approver: 'Louisiana Department of Health (LDH)',
        evidenceUrl: null,
        notes:
          'Louisiana CNA training programs must be state-approved by LDH. The Charity School of Nursing page lists CNA training as an offering. Confirm current LDH approval status directly with LDH or the institution.',
      },
    ],
    officialUrl: 'https://www.dcc.edu/academics/charity-school-nursing/',
    verifiedOn: '2026-11-05',
    verificationStatus: 'needs-recheck',
    warnings: [
      'CNA nurse aide registry placement is not equivalent to RN or LPN professional licensure.',
      'Confirm current LDH state-approval status for this program before enrolling. Only LDH-approved programs qualify graduates for the competency evaluation.',
      'Confirm current program availability, schedule, cost, and minimum age requirements with Delgado Community College directly.',
    ],
  },
];

export function getProgramsByCareer(careerId: string): readonly HealthcareProgram[] {
  return HEALTHCARE_PROGRAMS.filter((p) => p.careerId === careerId);
}

export function getProgramById(id: string): HealthcareProgram | undefined {
  return HEALTHCARE_PROGRAMS.find((p) => p.id === id);
}
