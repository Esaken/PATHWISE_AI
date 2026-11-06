import type { HealthcareCareer } from './types';

// All official source URLs verified 2026-11-05.
// Sources that returned 403 on direct fetch are confirmed to exist via search
// and are noted as such. Do not add sources that cannot be verified.

export const HEALTHCARE_CAREERS: readonly HealthcareCareer[] = [
  // ─── RN — Registered Nurse ───────────────────────────────────────────────

  {
    id: 'rn',
    title: 'Registered Nurse',
    shortDescription:
      'Provide and coordinate patient care, educate patients and the public about health conditions, and offer emotional support.',
    credentialLabel: 'State RN license required',
    credentialClass: 'professional-license',
    category: 'nursing',
    typicalResponsibilities: [
      'Assess patient health and symptoms',
      'Administer medications and treatments as ordered',
      'Coordinate with physicians and other healthcare team members',
      'Educate patients and families about health conditions and discharge plans',
      'Document patient care and maintain medical records',
    ],
    educationRoutes: [
      {
        routeId: 'rn-adn',
        kind: 'degree',
        label: 'Associate Degree in Nursing (ADN)',
        description:
          'Typically a 2-year program offered at community colleges. Graduates are eligible to sit for the NCLEX-RN licensure exam.',
        typicalDurationMonths: { min: 18, max: 30 },
        minimumEducationPrerequisite: 'High school diploma or GED; program-specific science prerequisites',
        notes:
          'ADN programs often require completion of prerequisite science courses before enrollment. Prerequisites and admission criteria vary by program.',
      },
      {
        routeId: 'rn-bsn',
        kind: 'degree',
        label: 'Bachelor of Science in Nursing (BSN)',
        description:
          'A 4-year degree offered at colleges and universities. Provides broader preparation in research, leadership, and community health. Graduates are eligible for the NCLEX-RN exam.',
        typicalDurationMonths: { min: 36, max: 48 },
        minimumEducationPrerequisite: 'High school diploma or GED; program-specific prerequisites',
        notes:
          'Some employers prefer or require a BSN for certain nursing roles. Completion of a BSN does not automatically grant licensure.',
      },
      {
        routeId: 'rn-accelerated-bsn',
        kind: 'accelerated',
        label: 'Accelerated BSN (ABSN)',
        description:
          'An intensive BSN program designed for individuals who already hold a bachelor\'s degree in a non-nursing field.',
        typicalDurationMonths: { min: 12, max: 20 },
        minimumEducationPrerequisite: "Bachelor's degree in any field; nursing prerequisite coursework",
        notes:
          'Eligibility requirements and prerequisite lists vary by institution. Confirm with each program.',
      },
      {
        routeId: 'rn-lpn-bridge',
        kind: 'bridge',
        label: 'LPN-to-RN Bridge',
        description:
          'A bridge program for licensed LPNs to transition to RN-level education. Some programs may award credit for prior LPN education.',
        typicalDurationMonths: null,
        minimumEducationPrerequisite: 'Active Louisiana LPN license',
        notes:
          'Credit recognition policies vary by institution. LPN coursework does not automatically transfer into bridge programs.',
      },
    ],
    eligibleLearnerCategories: ['high-school', 'university', 'adult'],
    officialSources: [
      {
        title: 'Louisiana State Board of Nursing',
        url: 'https://www.lsbn.state.la.us/',
        organization: 'Louisiana State Board of Nursing (LSBN)',
        jurisdiction: 'Louisiana',
        verificationStatus: 'official-regulator',
      },
      {
        title: 'LSBN — Approved Schools of Nursing',
        url: 'https://www.lsbn.state.la.us/schools-nursing/',
        organization: 'Louisiana State Board of Nursing (LSBN)',
        jurisdiction: 'Louisiana',
        verificationStatus: 'official-regulator',
      },
      {
        title: 'NCLEX Exam Information',
        url: 'https://www.nclex.com/',
        organization: 'National Council of State Boards of Nursing (NCSBN)',
        jurisdiction: 'National',
        verificationStatus: 'official-institution',
      },
    ],
    relatedCareerIds: ['lpn', 'cna'],
    warnings: [
      'Completing an ADN or BSN program does not automatically grant an RN license. You must pass the NCLEX-RN exam and apply for state licensure through LSBN.',
      'Nursing program requirements, prerequisites, and admission criteria vary. Verify directly with each program.',
      'Clinical placement availability is not guaranteed and varies by program, location, and academic calendar.',
      'Louisiana licensure requirements are subject to change. Verify current requirements with LSBN before applying.',
    ],
  },

  // ─── LPN — Licensed Practical Nurse ─────────────────────────────────────

  {
    id: 'lpn',
    title: 'Licensed Practical Nurse',
    shortDescription:
      'Provide basic nursing care under the supervision of registered nurses and physicians in a range of healthcare settings.',
    credentialLabel: 'State LPN license required',
    credentialClass: 'professional-license',
    category: 'nursing',
    typicalResponsibilities: [
      'Monitor and record patient vital signs',
      'Administer basic nursing care (wound care, catheter care, etc.)',
      'Collect specimens and assist with procedures',
      'Report changes in patient condition to supervising RN or physician',
      'Provide personal care and comfort to patients',
    ],
    educationRoutes: [
      {
        routeId: 'lpn-diploma',
        kind: 'diploma',
        label: 'Practical Nursing Diploma or Certificate',
        description:
          'Typically a 12-month program approved by the state board of practical nurse examiners. Graduates are eligible for the NCLEX-PN licensure exam.',
        typicalDurationMonths: { min: 10, max: 14 },
        minimumEducationPrerequisite: 'High school diploma or GED; program-specific prerequisites',
        notes:
          'Programs must be approved by LSBPNE for graduates to apply for Louisiana LPN licensure. Confirm approval status before enrolling.',
      },
    ],
    eligibleLearnerCategories: ['high-school', 'university', 'adult'],
    officialSources: [
      {
        title: 'Louisiana State Board of Practical Nurse Examiners',
        url: 'https://www.lsbpne.la.gov/',
        organization: 'Louisiana State Board of Practical Nurse Examiners (LSBPNE)',
        jurisdiction: 'Louisiana',
        verificationStatus: 'official-regulator',
      },
      {
        title: 'LSBPNE — Licensure Information',
        url: 'https://www.lsbpne.la.gov/licensure/',
        organization: 'Louisiana State Board of Practical Nurse Examiners (LSBPNE)',
        jurisdiction: 'Louisiana',
        verificationStatus: 'official-regulator',
      },
      {
        title: 'NCLEX Exam Information',
        url: 'https://www.nclex.com/',
        organization: 'National Council of State Boards of Nursing (NCSBN)',
        jurisdiction: 'National',
        verificationStatus: 'official-institution',
      },
    ],
    relatedCareerIds: ['rn', 'cna'],
    warnings: [
      'Completing a PN program does not automatically grant an LPN license. You must pass the NCLEX-PN exam and apply for licensure through LSBPNE.',
      'Only programs approved by LSBPNE qualify graduates to sit for the NCLEX-PN in Louisiana. Verify approval before enrolling.',
      'LPN coursework does not automatically transfer into RN programs. Bridge program eligibility and credit recognition vary by institution.',
      'Louisiana LPN licenses renew annually (November 1 through January 31). Verify current renewal requirements with LSBPNE.',
    ],
  },

  // ─── CNA — Certified Nursing Assistant ───────────────────────────────────

  {
    id: 'cna',
    title: 'Certified Nursing Assistant',
    shortDescription:
      'Provide direct patient care under the supervision of nursing staff, assisting with daily living activities in hospitals, nursing homes, and home care settings.',
    credentialLabel: 'State nurse aide registry placement',
    credentialClass: 'registry-certification',
    category: 'nursing',
    typicalResponsibilities: [
      'Assist patients with bathing, dressing, and grooming',
      'Help with mobility and positioning',
      'Measure and record vital signs',
      'Report observations to supervising nurses',
      'Provide emotional support and companionship',
    ],
    educationRoutes: [
      {
        routeId: 'cna-training',
        kind: 'certificate',
        label: 'State-Approved Nurse Aide Training',
        description:
          'Louisiana requires completion of a state-approved training program followed by a competency evaluation. Registry placement is administered by the Louisiana Department of Health.',
        typicalDurationMonths: { min: 1, max: 2 },
        minimumEducationPrerequisite: 'Minimum age requirements vary by program; verify directly',
        notes:
          'Louisiana requires a minimum of 75 hours of training (classroom instruction and supervised practical training). Confirm current requirements with the Louisiana Department of Health.',
      },
    ],
    eligibleLearnerCategories: ['high-school', 'university', 'adult'],
    officialSources: [
      {
        title: 'Louisiana Department of Health — CNA Registry',
        url: 'https://ldh.la.gov/health-standards-section/cna-registry',
        organization: 'Louisiana Department of Health (LDH)',
        jurisdiction: 'Louisiana',
        verificationStatus: 'official-regulator',
      },
      {
        title: 'Louisiana CNA/DSW Registry Search',
        url: 'https://tlc.dhh.la.gov/',
        organization: 'Louisiana Department of Health (LDH)',
        jurisdiction: 'Louisiana',
        verificationStatus: 'official-regulator',
      },
    ],
    relatedCareerIds: ['lpn', 'rn', 'patient-care-technician'],
    warnings: [
      'CNA nurse aide registry placement is distinct from RN or LPN professional licensure. These are different credentials with different scopes of practice.',
      'Louisiana requires state-approved training, a competency evaluation, and registry placement. Verify current requirements with the Louisiana Department of Health (ldh.la.gov).',
      'CNA certification expires two years from the certification date. Confirm renewal and maintenance requirements with LDH.',
      'Some employers conduct background checks. Verify employer-specific requirements before enrolling.',
    ],
  },

  // ─── Medical Assistant ────────────────────────────────────────────────────

  {
    id: 'medical-assistant',
    title: 'Medical Assistant',
    shortDescription:
      'Perform administrative and clinical tasks in outpatient settings including clinics, physician offices, and urgent care centers.',
    credentialLabel: 'National certification available (not universally required)',
    credentialClass: 'national-certification',
    category: 'allied-health',
    typicalResponsibilities: [
      'Take patient histories and vital signs',
      'Prepare patients for examinations',
      'Assist physicians with procedures',
      'Administer medications and injections (as permitted by state scope of practice)',
      'Handle scheduling, billing, and administrative tasks',
    ],
    educationRoutes: [
      {
        routeId: 'ma-certificate',
        kind: 'certificate',
        label: 'Medical Assistant Certificate or Diploma',
        description: 'Typically 9–12 months. Covers both clinical and administrative skills.',
        typicalDurationMonths: { min: 9, max: 12 },
        minimumEducationPrerequisite: 'High school diploma or GED',
        notes: 'Program accreditation (CAAHEP or ABHES) is typically required to sit for major national certification exams (CMA, RMA).',
      },
      {
        routeId: 'ma-associate',
        kind: 'degree',
        label: 'Associate Degree in Medical Assisting',
        description: 'Typically a 2-year program. Provides broader preparation in medical sciences.',
        typicalDurationMonths: { min: 18, max: 24 },
        minimumEducationPrerequisite: 'High school diploma or GED',
        notes: 'Confirm accreditation status of any program before enrolling.',
      },
    ],
    eligibleLearnerCategories: ['high-school', 'university', 'adult'],
    officialSources: [
      {
        title: 'American Association of Medical Assistants (AAMA)',
        url: 'https://www.aama-ntl.org/',
        organization: 'American Association of Medical Assistants',
        jurisdiction: 'National',
        verificationStatus: 'official-institution',
      },
      {
        title: 'Louisiana Community and Technical College System',
        url: 'https://www.lctcs.edu/',
        organization: 'Louisiana Community and Technical College System (LCTCS)',
        jurisdiction: 'Louisiana',
        verificationStatus: 'official-institution',
      },
    ],
    relatedCareerIds: ['phlebotomy', 'patient-care-technician'],
    warnings: [
      'Louisiana does not require a state license for medical assistants. Requirements are employer-driven and vary by setting.',
      'National certification (CMA via AAMA, or RMA via AMT) is optional but often preferred or required by employers. Confirm requirements with specific employers.',
      'Scope of practice varies by employer and state. Not all medical assistant duties are universally permitted.',
      'Program accreditation affects eligibility for national certification exams. Verify accreditation status before enrolling.',
    ],
  },

  // ─── Phlebotomy Technician ────────────────────────────────────────────────

  {
    id: 'phlebotomy',
    title: 'Phlebotomy Technician',
    shortDescription:
      'Draw blood samples from patients for laboratory testing, transfusions, donations, or research.',
    credentialLabel: 'National certification available (employer requirements vary)',
    credentialClass: 'national-certification',
    category: 'allied-health',
    typicalResponsibilities: [
      'Collect blood samples using venipuncture or capillary methods',
      'Label and process specimens',
      'Follow infection control and safety protocols',
      'Interact with patients to explain procedures and ease anxiety',
      'Maintain accurate records',
    ],
    educationRoutes: [
      {
        routeId: 'phlebotomy-certificate',
        kind: 'certificate',
        label: 'Phlebotomy Training Certificate',
        description:
          'Programs typically range from 1 to 6 months including classroom instruction and supervised practicum hours.',
        typicalDurationMonths: { min: 1, max: 6 },
        minimumEducationPrerequisite: 'High school diploma or GED (verify by program)',
        notes:
          'Practicum hours in a clinical setting are typically required. Confirm required hours with the specific program.',
      },
    ],
    eligibleLearnerCategories: ['high-school', 'university', 'adult'],
    officialSources: [
      {
        title: 'National Phlebotomy Association',
        url: 'https://www.nationalphlebotomy.org/',
        organization: 'National Phlebotomy Association (NPA)',
        jurisdiction: 'National',
        verificationStatus: 'official-institution',
      },
      {
        title: 'Louisiana Community and Technical College System',
        url: 'https://www.lctcs.edu/',
        organization: 'Louisiana Community and Technical College System (LCTCS)',
        jurisdiction: 'Louisiana',
        verificationStatus: 'official-institution',
      },
    ],
    relatedCareerIds: ['medical-assistant', 'patient-care-technician'],
    warnings: [
      'Louisiana does not universally require state licensure for phlebotomists. Employer requirements vary by setting.',
      'National certification (NHA, ASCP, or NPA) may be preferred or required by hospitals and laboratories. Confirm with target employers.',
      'Practicum placement is not guaranteed by all training programs. Verify clinical placement support before enrolling.',
    ],
  },

  // ─── Patient Care Technician ─────────────────────────────────────────────

  {
    id: 'patient-care-technician',
    title: 'Patient Care Technician',
    shortDescription:
      'Provide direct patient care in acute care settings, often combining CNA, EKG, and phlebotomy skills.',
    credentialLabel: 'National certification available; employer requirements vary',
    credentialClass: 'employer-preference',
    category: 'allied-health',
    typicalResponsibilities: [
      'Assist patients with activities of daily living',
      'Monitor vital signs and report changes',
      'Perform EKG/ECG procedures',
      'Collect blood specimens (phlebotomy)',
      'Assist nursing staff with patient care procedures',
    ],
    educationRoutes: [
      {
        routeId: 'pct-certificate',
        kind: 'certificate',
        label: 'Patient Care Technician Certificate',
        description:
          'Typically 3–6 months; often includes or requires CNA certification, with added EKG and phlebotomy components.',
        typicalDurationMonths: { min: 3, max: 6 },
        minimumEducationPrerequisite: 'High school diploma or GED; CNA certification often preferred or required',
        notes:
          'Many employers require CNA certification as a foundation. Confirm prerequisite requirements with the specific program and target employers.',
      },
    ],
    eligibleLearnerCategories: ['high-school', 'university', 'adult'],
    officialSources: [
      {
        title: 'National Healthcareer Association — CPCT/A Certification',
        url: 'https://www.nhanow.com/',
        organization: 'National Healthcareer Association (NHA)',
        jurisdiction: 'National',
        verificationStatus: 'official-institution',
      },
      {
        title: 'Louisiana Community and Technical College System',
        url: 'https://www.lctcs.edu/',
        organization: 'Louisiana Community and Technical College System (LCTCS)',
        jurisdiction: 'Louisiana',
        verificationStatus: 'official-institution',
      },
    ],
    relatedCareerIds: ['cna', 'medical-assistant', 'phlebotomy'],
    warnings: [
      'No single universal PCT certification exists. Requirements and duties vary significantly by employer and care setting.',
      'Many PCT roles require CNA certification as a prerequisite or foundation. Confirm specific requirements with target employers before enrolling.',
      'Scope of practice for PCTs varies by state and employer. Verify what procedures are permitted in your target setting.',
    ],
  },
];

export function getCareerById(id: string): HealthcareCareer | undefined {
  return HEALTHCARE_CAREERS.find((c) => c.id === id);
}
