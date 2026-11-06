import type { OnboardingAnswers } from '@/types/onboarding';
import type { HealthcareProgram, LearnerPathway, PathwayMilestone, EducationRoute } from './types';
import type { LearnerCategory } from '@/catalog/types';
import { getCareerById } from './careers';

// ─── Milestone sets keyed by careerId:learnerCategory ────────────────────────

const MILESTONES: Partial<Record<string, readonly PathwayMilestone[]>> = {
  // ─── RN ──────────────────────────────────────────────────────────────────

  'rn:high-school': [
    {
      id: 'rn-hs-1',
      kind: 'preparation',
      title: 'Build your science and math foundation',
      description:
        'Take biology, chemistry, and math in high school. Strong science grades support nursing program admission.',
      requiresConfirmation: false,
    },
    {
      id: 'rn-hs-2',
      kind: 'preparation',
      title: 'Earn your high school diploma or GED',
      description: 'A high school diploma or GED is required for all nursing program applications.',
      requiresConfirmation: false,
    },
    {
      id: 'rn-hs-3',
      kind: 'preparation',
      title: 'Research LSBN-approved nursing programs',
      description:
        'Review ADN and BSN programs approved by the Louisiana State Board of Nursing. Verify current approval status at lsbn.state.la.us before enrolling.',
      requiresConfirmation: true,
    },
    {
      id: 'rn-hs-4',
      kind: 'preparation',
      title: 'Complete prerequisite coursework',
      description:
        'Most programs require science prerequisites (biology, chemistry, microbiology) before the nursing curriculum begins. Verify exact current prerequisites directly with each program.',
      requiresConfirmation: true,
    },
    {
      id: 'rn-hs-5',
      kind: 'education',
      title: 'Apply to an LSBN-approved nursing program',
      description:
        'Submit your application. Admission is competitive; meeting minimum published requirements does not guarantee admission.',
      requiresConfirmation: true,
    },
    {
      id: 'rn-hs-6',
      kind: 'clinical',
      title: 'Complete nursing education and supervised clinical hours',
      description:
        'Complete all required coursework and supervised clinical rotations in approved healthcare facilities.',
      requiresConfirmation: false,
    },
    {
      id: 'rn-hs-7',
      kind: 'examination',
      title: 'Apply for NCLEX-RN authorization through LSBN',
      description:
        'After graduation, apply for authorization to test through the Louisiana State Board of Nursing. Verify current procedures and fees with LSBN.',
      requiresConfirmation: true,
    },
    {
      id: 'rn-hs-8',
      kind: 'examination',
      title: 'Pass the NCLEX-RN exam',
      description:
        'The NCLEX-RN is the national licensure examination for registered nurses. Passing is required before licensure can be issued.',
      requiresConfirmation: false,
    },
    {
      id: 'rn-hs-9',
      kind: 'licensure',
      title: 'Apply for your Louisiana RN license',
      description:
        'Submit a licensure application to LSBN with your passing NCLEX-RN results. Completing a nursing program does not automatically grant an RN license.',
      requiresConfirmation: true,
    },
  ],

  'rn:university': [
    {
      id: 'rn-univ-1',
      kind: 'preparation',
      title: 'Review existing coursework for prerequisite equivalency',
      description:
        'Check whether completed college science courses satisfy nursing program prerequisites. Policies vary by program; contact admissions directly.',
      requiresConfirmation: true,
    },
    {
      id: 'rn-univ-2',
      kind: 'preparation',
      title: 'Identify remaining prerequisite courses',
      description:
        'Most programs require biology, chemistry, and microbiology. Verify the exact current prerequisite list with each target program before enrolling.',
      requiresConfirmation: true,
    },
    {
      id: 'rn-univ-3',
      kind: 'preparation',
      title: 'Compare ADN, BSN, and accelerated BSN routes',
      description:
        'If you are completing or already hold a bachelor\'s degree, an Accelerated BSN (ABSN) may be an option. Confirm eligibility requirements with each program.',
      requiresConfirmation: true,
    },
    {
      id: 'rn-univ-4',
      kind: 'preparation',
      title: 'Confirm transfer-credit and admission policies',
      description:
        'Contact target programs to verify how existing college credits are evaluated. Transfer policies vary and are not guaranteed.',
      requiresConfirmation: true,
    },
    {
      id: 'rn-univ-5',
      kind: 'education',
      title: 'Apply to an LSBN-approved nursing program',
      description:
        'Submit your application. Confirm current admission criteria, deadlines, and application cycles before applying.',
      requiresConfirmation: true,
    },
    {
      id: 'rn-univ-6',
      kind: 'clinical',
      title: 'Complete nursing education and supervised clinical hours',
      description:
        'Complete all required coursework and supervised clinical rotations in approved healthcare facilities.',
      requiresConfirmation: false,
    },
    {
      id: 'rn-univ-7',
      kind: 'examination',
      title: 'Apply for NCLEX-RN authorization through LSBN',
      description:
        'After graduation, apply for authorization to test through the Louisiana State Board of Nursing.',
      requiresConfirmation: true,
    },
    {
      id: 'rn-univ-8',
      kind: 'examination',
      title: 'Pass the NCLEX-RN exam',
      description:
        'The NCLEX-RN is the national licensure examination for registered nurses. Passing is required before licensure can be issued.',
      requiresConfirmation: false,
    },
    {
      id: 'rn-univ-9',
      kind: 'licensure',
      title: 'Apply for your Louisiana RN license',
      description:
        'Submit a licensure application to LSBN with your passing NCLEX-RN results. Completing a nursing program does not automatically grant an RN license.',
      requiresConfirmation: true,
    },
  ],

  'rn:adult': [
    {
      id: 'rn-adult-1',
      kind: 'preparation',
      title: 'Review your education background for prerequisite equivalency',
      description:
        'Determine whether prior college courses satisfy program prerequisites. Contact target programs directly to confirm equivalency policies.',
      requiresConfirmation: true,
    },
    {
      id: 'rn-adult-2',
      kind: 'preparation',
      title: 'Confirm prerequisite requirements',
      description:
        'Verify which science courses are required and whether you need to complete them before applying. Requirements vary by program.',
      requiresConfirmation: true,
    },
    {
      id: 'rn-adult-3',
      kind: 'preparation',
      title: 'Compare ADN and BSN routes; consider LPN-to-RN if applicable',
      description:
        'If you hold an active Louisiana LPN license, an LPN-to-RN bridge program may shorten your path. Confirm bridge program credit recognition policies with each institution.',
      requiresConfirmation: true,
    },
    {
      id: 'rn-adult-4',
      kind: 'education',
      title: 'Apply to an LSBN-approved nursing program',
      description:
        'Admission is selective. Confirm current requirements, deadlines, and application cycles with the program before applying.',
      requiresConfirmation: true,
    },
    {
      id: 'rn-adult-5',
      kind: 'clinical',
      title: 'Complete nursing education and supervised clinical hours',
      description:
        'Complete all required coursework and supervised clinical rotations in approved healthcare facilities.',
      requiresConfirmation: false,
    },
    {
      id: 'rn-adult-6',
      kind: 'examination',
      title: 'Apply for NCLEX-RN authorization through LSBN',
      description:
        'After graduation, apply for authorization to test through the Louisiana State Board of Nursing.',
      requiresConfirmation: true,
    },
    {
      id: 'rn-adult-7',
      kind: 'examination',
      title: 'Pass the NCLEX-RN exam',
      description:
        'The NCLEX-RN is the national licensure examination for registered nurses. Passing is required before licensure can be issued.',
      requiresConfirmation: false,
    },
    {
      id: 'rn-adult-8',
      kind: 'licensure',
      title: 'Apply for your Louisiana RN license',
      description:
        'Submit a licensure application to LSBN with your passing NCLEX-RN results. Completing a nursing program does not automatically grant an RN license.',
      requiresConfirmation: true,
    },
  ],

  // ─── LPN ─────────────────────────────────────────────────────────────────

  'lpn:high-school': [
    {
      id: 'lpn-hs-1',
      kind: 'preparation',
      title: 'Earn your high school diploma or GED',
      description: 'A diploma or GED is required for PN program admission.',
      requiresConfirmation: false,
    },
    {
      id: 'lpn-hs-2',
      kind: 'preparation',
      title: 'Research LSBPNE-approved PN programs',
      description:
        'Only programs approved by the Louisiana State Board of Practical Nurse Examiners qualify graduates to sit for the NCLEX-PN. Verify current approval status at lsbpne.la.gov before enrolling.',
      requiresConfirmation: true,
    },
    {
      id: 'lpn-hs-3',
      kind: 'preparation',
      title: 'Review prerequisites and admission requirements',
      description:
        'PN programs have specific prerequisite and admission requirements. Verify requirements with each program directly before applying.',
      requiresConfirmation: true,
    },
    {
      id: 'lpn-hs-4',
      kind: 'education',
      title: 'Apply to an LSBPNE-approved PN program',
      description:
        'Admission is competitive. Confirm current application cycles, deadlines, and selection criteria before applying.',
      requiresConfirmation: true,
    },
    {
      id: 'lpn-hs-5',
      kind: 'clinical',
      title: 'Complete PN curriculum and supervised clinical hours',
      description:
        'Complete required coursework and clinical training under supervision of registered nurses and physicians.',
      requiresConfirmation: false,
    },
    {
      id: 'lpn-hs-6',
      kind: 'examination',
      title: 'Apply for NCLEX-PN authorization through LSBPNE',
      description:
        'Apply through LSBPNE after graduation to receive authorization to take the NCLEX-PN. Verify current procedures with LSBPNE.',
      requiresConfirmation: true,
    },
    {
      id: 'lpn-hs-7',
      kind: 'examination',
      title: 'Pass the NCLEX-PN exam',
      description:
        'The NCLEX-PN is the national licensure examination for practical nurses. Passing is required before licensure can be issued.',
      requiresConfirmation: false,
    },
    {
      id: 'lpn-hs-8',
      kind: 'licensure',
      title: 'Apply for your Louisiana LPN license',
      description:
        'Submit a licensure application to LSBPNE with your passing NCLEX-PN results. Louisiana LPN licenses renew annually (November 1 through January 31); verify renewal requirements with LSBPNE.',
      requiresConfirmation: true,
    },
    {
      id: 'lpn-hs-9',
      kind: 'employment',
      title: 'Consider future LPN-to-RN pathway',
      description:
        'An LPN license can serve as a foundation for a future RN-level bridge program. LPN coursework does not automatically transfer into RN programs; confirm bridge program eligibility and credit recognition policies with each institution.',
      requiresConfirmation: false,
    },
  ],

  'lpn:university': [
    {
      id: 'lpn-univ-1',
      kind: 'preparation',
      title: 'Review existing coursework for prerequisite equivalency',
      description:
        'Prior college coursework may satisfy PN program prerequisites. Verify credit equivalency and transfer policies with each program.',
      requiresConfirmation: true,
    },
    {
      id: 'lpn-univ-2',
      kind: 'preparation',
      title: 'Research LSBPNE-approved PN programs',
      description:
        'Verify LSBPNE approval status at lsbpne.la.gov before enrolling. Only approved programs qualify graduates for Louisiana LPN licensure.',
      requiresConfirmation: true,
    },
    {
      id: 'lpn-univ-3',
      kind: 'preparation',
      title: 'Confirm admission requirements and prerequisites',
      description:
        'Confirm what prerequisites remain and what the current admission criteria are for each target program.',
      requiresConfirmation: true,
    },
    {
      id: 'lpn-univ-4',
      kind: 'education',
      title: 'Apply to an LSBPNE-approved PN program',
      description:
        'Confirm current application cycles and deadlines before applying. Admission is competitive.',
      requiresConfirmation: true,
    },
    {
      id: 'lpn-univ-5',
      kind: 'clinical',
      title: 'Complete PN curriculum and supervised clinical hours',
      description:
        'Complete required coursework and clinical training under supervision.',
      requiresConfirmation: false,
    },
    {
      id: 'lpn-univ-6',
      kind: 'examination',
      title: 'Apply for NCLEX-PN authorization through LSBPNE',
      description:
        'After graduation, apply through LSBPNE for authorization to test.',
      requiresConfirmation: true,
    },
    {
      id: 'lpn-univ-7',
      kind: 'examination',
      title: 'Pass the NCLEX-PN exam',
      description:
        'The NCLEX-PN is the national licensure examination for practical nurses. Passing is required before licensure is issued.',
      requiresConfirmation: false,
    },
    {
      id: 'lpn-univ-8',
      kind: 'licensure',
      title: 'Apply for your Louisiana LPN license',
      description:
        'Submit a licensure application to LSBPNE with your passing NCLEX-PN results.',
      requiresConfirmation: true,
    },
    {
      id: 'lpn-univ-9',
      kind: 'employment',
      title: 'Consider future LPN-to-RN pathway',
      description:
        'An LPN license can support future applications to RN-level bridge programs. Confirm credit recognition policies with each institution before beginning.',
      requiresConfirmation: false,
    },
  ],

  'lpn:adult': [
    {
      id: 'lpn-adult-1',
      kind: 'preparation',
      title: 'Review your education background',
      description:
        'Prior college credits may satisfy program prerequisites. Contact programs to confirm transfer or equivalency policies.',
      requiresConfirmation: true,
    },
    {
      id: 'lpn-adult-2',
      kind: 'preparation',
      title: 'Research LSBPNE-approved PN programs',
      description:
        'Verify LSBPNE approval status at lsbpne.la.gov before enrolling. Only approved programs qualify graduates for Louisiana LPN licensure.',
      requiresConfirmation: true,
    },
    {
      id: 'lpn-adult-3',
      kind: 'preparation',
      title: 'Confirm prerequisites, background check requirements, and scheduling',
      description:
        'Many PN programs require a criminal background check as part of the application process. Verify all current admission requirements before applying.',
      requiresConfirmation: true,
    },
    {
      id: 'lpn-adult-4',
      kind: 'education',
      title: 'Apply to an LSBPNE-approved PN program',
      description:
        'Confirm current application cycles and deadlines before applying.',
      requiresConfirmation: true,
    },
    {
      id: 'lpn-adult-5',
      kind: 'clinical',
      title: 'Complete the PN curriculum and clinical hours',
      description:
        'PN programs are typically approximately 12 months. Complete all required coursework and supervised clinical training.',
      requiresConfirmation: false,
    },
    {
      id: 'lpn-adult-6',
      kind: 'examination',
      title: 'Apply for NCLEX-PN authorization through LSBPNE',
      description:
        'After graduation, apply through LSBPNE for authorization to test.',
      requiresConfirmation: true,
    },
    {
      id: 'lpn-adult-7',
      kind: 'examination',
      title: 'Pass the NCLEX-PN exam',
      description:
        'The NCLEX-PN is the national licensure examination for practical nurses. Passing is required before licensure is issued.',
      requiresConfirmation: false,
    },
    {
      id: 'lpn-adult-8',
      kind: 'licensure',
      title: 'Apply for your Louisiana LPN license',
      description:
        'Submit a licensure application to LSBPNE. Louisiana LPN licenses renew annually (November 1 through January 31); verify renewal requirements with LSBPNE.',
      requiresConfirmation: true,
    },
  ],

  // ─── CNA ─────────────────────────────────────────────────────────────────

  'cna:high-school': [
    {
      id: 'cna-hs-1',
      kind: 'preparation',
      title: 'Verify minimum age requirements',
      description:
        'CNA training programs set their own minimum age requirements. Confirm the minimum age directly with the program before applying.',
      requiresConfirmation: true,
    },
    {
      id: 'cna-hs-2',
      kind: 'preparation',
      title: 'Find an LDH-approved CNA training program',
      description:
        'Louisiana requires completion of a state-approved training program. Confirm LDH approval status directly with LDH or the institution before enrolling.',
      requiresConfirmation: true,
    },
    {
      id: 'cna-hs-3',
      kind: 'education',
      title: 'Complete required CNA training',
      description:
        'Louisiana NATCEP rules require a minimum 80-hour core curriculum. The clinical-site orientation is a separate minimum requirement not counted toward the 80-hour core. Confirm current hour requirements and program schedule with LDH and the program.',
      requiresConfirmation: true,
    },
    {
      id: 'cna-hs-4',
      kind: 'examination',
      title: 'Pass the nurse aide competency evaluation',
      description:
        'After training, complete the competency evaluation administered through the Louisiana Department of Health. Verify current evaluation procedures and fees with LDH.',
      requiresConfirmation: true,
    },
    {
      id: 'cna-hs-5',
      kind: 'registry',
      title: 'Confirm Louisiana nurse aide registry placement',
      description:
        'Registry placement is administered by LDH. Verify the current placement process at ldh.la.gov. CNA certification expires two years from certification date.',
      requiresConfirmation: true,
    },
    {
      id: 'cna-hs-6',
      kind: 'employment',
      title: 'Consider career progression (LPN, RN)',
      description:
        'CNA experience supports applications to LPN and RN programs. Registry placement is distinct from professional licensure and does not substitute for it.',
      requiresConfirmation: false,
    },
  ],

  'cna:university': [
    {
      id: 'cna-univ-1',
      kind: 'preparation',
      title: 'Find an LDH-approved CNA training program',
      description:
        'Confirm LDH approval status directly with LDH or the institution before enrolling.',
      requiresConfirmation: true,
    },
    {
      id: 'cna-univ-2',
      kind: 'preparation',
      title: 'Confirm training hours, cost, and scheduling',
      description:
        'Programs are typically brief (1–2 months). Verify current cost, schedule compatibility with your coursework, and required clinical hours.',
      requiresConfirmation: true,
    },
    {
      id: 'cna-univ-3',
      kind: 'education',
      title: 'Complete required CNA training (minimum 80-hour core)',
      description:
        'Louisiana NATCEP rules require a minimum 80-hour core curriculum. The clinical-site orientation is a separate requirement not counted toward the core. Confirm current requirements with LDH and the program.',
      requiresConfirmation: true,
    },
    {
      id: 'cna-univ-4',
      kind: 'examination',
      title: 'Pass the nurse aide competency evaluation',
      description:
        'Complete the competency evaluation administered through LDH after training.',
      requiresConfirmation: true,
    },
    {
      id: 'cna-univ-5',
      kind: 'registry',
      title: 'Confirm Louisiana nurse aide registry placement',
      description:
        'Verify the current placement process at ldh.la.gov. CNA certification expires two years from certification date.',
      requiresConfirmation: true,
    },
    {
      id: 'cna-univ-6',
      kind: 'employment',
      title: 'CNA experience as clinical exposure',
      description:
        'CNA work provides direct patient care experience that may strengthen applications to nursing programs.',
      requiresConfirmation: false,
    },
  ],

  'cna:adult': [
    {
      id: 'cna-adult-1',
      kind: 'preparation',
      title: 'Find an LDH-approved CNA training program',
      description:
        'Confirm LDH approval status directly with LDH or the institution before enrolling. Only LDH-approved programs qualify graduates for the competency evaluation.',
      requiresConfirmation: true,
    },
    {
      id: 'cna-adult-2',
      kind: 'preparation',
      title: 'Confirm cost, schedule, and minimum requirements',
      description:
        'Verify current tuition, class schedule, and any minimum age or education requirements with the program.',
      requiresConfirmation: true,
    },
    {
      id: 'cna-adult-3',
      kind: 'education',
      title: 'Complete required CNA training (minimum 80-hour core)',
      description:
        'Louisiana NATCEP rules require a minimum 80-hour core curriculum. The clinical-site orientation is a separate requirement not counted toward the core. Confirm current requirements with LDH and the program.',
      requiresConfirmation: true,
    },
    {
      id: 'cna-adult-4',
      kind: 'examination',
      title: 'Pass the nurse aide competency evaluation',
      description:
        'Complete the competency evaluation administered through LDH after training. Verify current procedures and fees with LDH.',
      requiresConfirmation: true,
    },
    {
      id: 'cna-adult-5',
      kind: 'registry',
      title: 'Confirm Louisiana nurse aide registry placement',
      description:
        'Verify the current placement process at ldh.la.gov. CNA certification expires two years from certification date; confirm renewal requirements with LDH.',
      requiresConfirmation: true,
    },
    {
      id: 'cna-adult-6',
      kind: 'employment',
      title: 'Seek CNA employment',
      description:
        'Hospitals, nursing homes, and home care agencies employ CNAs. Registry placement is distinct from RN or LPN professional licensure.',
      requiresConfirmation: false,
    },
  ],

  // ─── Medical Assistant ────────────────────────────────────────────────────

  'medical-assistant:high-school': [
    {
      id: 'ma-hs-1',
      kind: 'preparation',
      title: 'Complete high school requirements',
      description:
        'A high school diploma or GED is required by most Medical Assistant programs.',
      requiresConfirmation: false,
    },
    {
      id: 'ma-hs-2',
      kind: 'preparation',
      title: 'Research accredited Medical Assistant programs',
      description:
        'Look for programs accredited by CAAHEP or ABHES. Accreditation is typically required to sit for major national certification exams (CMA via AAMA, RMA via AMT). Confirm accreditation status before enrolling.',
      requiresConfirmation: true,
    },
    {
      id: 'ma-hs-3',
      kind: 'preparation',
      title: 'Compare Medical Assistant certificate and associate degree options',
      description:
        'Both lead to entry-level MA roles. Certificate programs offer faster entry; associate degrees provide broader preparation. Program duration varies by provider — confirm the current schedule directly with each institution.',
      requiresConfirmation: true,
    },
    {
      id: 'ma-hs-4',
      kind: 'preparation',
      title: 'Confirm employer certification preferences in your area',
      description:
        'Louisiana does not require a state license for medical assistants. Requirements are set by employers and vary by clinical setting.',
      requiresConfirmation: true,
    },
    {
      id: 'ma-hs-5',
      kind: 'education',
      title: 'Complete an accredited MA program',
      description:
        'Program coursework covers both clinical skills (vital signs, injections, specimen collection) and administrative tasks (scheduling, billing).',
      requiresConfirmation: false,
    },
    {
      id: 'ma-hs-6',
      kind: 'examination',
      title: 'Consider pursuing national certification (CMA or RMA)',
      description:
        'The CMA (AAMA) and RMA (AMT) credentials are voluntary but often preferred or required by employers. Confirm eligibility and exam requirements with AAMA (aama-ntl.org) or AMT.',
      requiresConfirmation: true,
    },
    {
      id: 'ma-hs-7',
      kind: 'employment',
      title: 'Confirm scope-of-practice before accepting duties',
      description:
        'Permitted procedures vary by employer and state. Verify what is authorized in your specific setting before performing clinical duties.',
      requiresConfirmation: true,
    },
  ],

  'medical-assistant:university': [
    {
      id: 'ma-univ-1',
      kind: 'preparation',
      title: 'Research accredited Medical Assistant programs',
      description:
        'Look for CAAHEP- or ABHES-accredited programs. Accreditation is typically required to sit for the CMA (AAMA) or RMA (AMT) exams. Confirm accreditation before enrolling.',
      requiresConfirmation: true,
    },
    {
      id: 'ma-univ-2',
      kind: 'preparation',
      title: 'Compare Medical Assistant certificate and associate degree options',
      description:
        'Certificate programs offer faster entry; associate degrees offer broader preparation. Program duration varies by provider — confirm the current schedule directly with each institution.',
      requiresConfirmation: true,
    },
    {
      id: 'ma-univ-3',
      kind: 'preparation',
      title: 'Confirm employer certification preferences in your area',
      description:
        'Louisiana does not require a state license for medical assistants. Employer requirements vary by setting.',
      requiresConfirmation: true,
    },
    {
      id: 'ma-univ-4',
      kind: 'education',
      title: 'Complete an accredited MA program',
      description:
        'Coursework covers both clinical and administrative skills.',
      requiresConfirmation: false,
    },
    {
      id: 'ma-univ-5',
      kind: 'examination',
      title: 'Consider pursuing national certification (CMA or RMA)',
      description:
        'The CMA (AAMA) and RMA (AMT) credentials are voluntary but often preferred or required by employers.',
      requiresConfirmation: true,
    },
    {
      id: 'ma-univ-6',
      kind: 'employment',
      title: 'Confirm scope-of-practice before accepting duties',
      description:
        'Permitted procedures vary by employer and state. Verify what is authorized in your specific setting.',
      requiresConfirmation: true,
    },
  ],

  'medical-assistant:adult': [
    {
      id: 'ma-adult-1',
      kind: 'preparation',
      title: 'Research accredited Medical Assistant programs',
      description:
        'Look for CAAHEP- or ABHES-accredited programs. Confirm accreditation status before enrolling, as it affects eligibility for national certification exams.',
      requiresConfirmation: true,
    },
    {
      id: 'ma-adult-2',
      kind: 'preparation',
      title: 'Compare Medical Assistant certificate and associate degree options',
      description:
        'Both lead to entry-level MA roles. Certificate programs offer faster entry; associate degrees offer broader preparation. Program duration varies by provider — confirm the current schedule directly with each institution.',
      requiresConfirmation: true,
    },
    {
      id: 'ma-adult-3',
      kind: 'preparation',
      title: 'Confirm employer certification preferences in your area',
      description:
        'Louisiana does not require a state license for medical assistants. Requirements are employer-driven and vary by clinical setting.',
      requiresConfirmation: true,
    },
    {
      id: 'ma-adult-4',
      kind: 'education',
      title: 'Complete an accredited MA program',
      description:
        'Coursework covers both clinical skills and administrative tasks.',
      requiresConfirmation: false,
    },
    {
      id: 'ma-adult-5',
      kind: 'examination',
      title: 'Consider pursuing national certification (CMA or RMA)',
      description:
        'The CMA (AAMA) and RMA (AMT) credentials are voluntary but often preferred or required by employers. Confirm eligibility with AAMA (aama-ntl.org) or AMT.',
      requiresConfirmation: true,
    },
    {
      id: 'ma-adult-6',
      kind: 'employment',
      title: 'Confirm scope-of-practice before accepting duties',
      description:
        'Permitted procedures vary by employer and state. Verify what is authorized in your specific setting before performing clinical duties.',
      requiresConfirmation: true,
    },
  ],

  // ─── Phlebotomy ──────────────────────────────────────────────────────────

  'phlebotomy:high-school': [
    {
      id: 'phleb-hs-1',
      kind: 'preparation',
      title: 'Complete high school requirements',
      description:
        'A high school diploma or GED is required by most phlebotomy training programs.',
      requiresConfirmation: false,
    },
    {
      id: 'phleb-hs-2',
      kind: 'preparation',
      title: 'Research phlebotomy training programs',
      description:
        'Look for programs that include supervised clinical (practicum) hours. Confirm that the program provides required clinical hours before enrolling.',
      requiresConfirmation: true,
    },
    {
      id: 'phleb-hs-3',
      kind: 'education',
      title: 'Complete phlebotomy training',
      description:
        'Training includes classroom instruction on venipuncture technique, specimen handling, infection control, and supervised practice. Program duration varies by provider — confirm the current schedule and required hours directly with the institution.',
      requiresConfirmation: true,
    },
    {
      id: 'phleb-hs-4',
      kind: 'clinical',
      title: 'Complete required practicum hours',
      description:
        'Clinical placement in a laboratory or healthcare setting is typically required. Verify that the program provides clinical placement support before enrolling.',
      requiresConfirmation: true,
    },
    {
      id: 'phleb-hs-5',
      kind: 'examination',
      title: 'Consider national certification (NHA, ASCP, or NPA)',
      description:
        'National certification is voluntary but may be preferred or required by hospitals and laboratories. Confirm target employer requirements before choosing a certification body.',
      requiresConfirmation: true,
    },
    {
      id: 'phleb-hs-6',
      kind: 'employment',
      title: 'Confirm employer requirements before applying',
      description:
        'Requirements vary by setting (hospital lab, blood bank, clinic). Verify specific requirements with target employers.',
      requiresConfirmation: true,
    },
  ],

  'phlebotomy:university': [
    {
      id: 'phleb-univ-1',
      kind: 'preparation',
      title: 'Research phlebotomy training programs',
      description:
        'Confirm that the program includes supervised clinical hours. Verify scheduling compatibility with your coursework before enrolling.',
      requiresConfirmation: true,
    },
    {
      id: 'phleb-univ-2',
      kind: 'education',
      title: 'Complete phlebotomy training',
      description:
        'Training includes classroom instruction and supervised venipuncture practice. Program duration varies by provider — confirm the current schedule and required hours directly with the institution.',
      requiresConfirmation: true,
    },
    {
      id: 'phleb-univ-3',
      kind: 'clinical',
      title: 'Complete required practicum hours',
      description:
        'Clinical placement in a laboratory or healthcare setting is typically required. Confirm clinical placement support with the program before enrolling.',
      requiresConfirmation: true,
    },
    {
      id: 'phleb-univ-4',
      kind: 'examination',
      title: 'Consider national certification (NHA, ASCP, or NPA)',
      description:
        'National certification is voluntary but may be preferred or required by hospitals and laboratories.',
      requiresConfirmation: true,
    },
    {
      id: 'phleb-univ-5',
      kind: 'employment',
      title: 'Confirm employer requirements before applying',
      description:
        'Requirements vary by setting. Verify specific requirements with target employers.',
      requiresConfirmation: true,
    },
  ],

  'phlebotomy:adult': [
    {
      id: 'phleb-adult-1',
      kind: 'preparation',
      title: 'Research phlebotomy training programs',
      description:
        'Look for programs that include supervised clinical hours. Confirm clinical placement support with the program before enrolling.',
      requiresConfirmation: true,
    },
    {
      id: 'phleb-adult-2',
      kind: 'education',
      title: 'Complete phlebotomy training',
      description:
        'Training includes classroom instruction and supervised venipuncture practice. Program duration varies by provider — confirm the current schedule and required hours directly with the institution.',
      requiresConfirmation: true,
    },
    {
      id: 'phleb-adult-3',
      kind: 'clinical',
      title: 'Complete required practicum hours',
      description:
        'Clinical placement in a laboratory or healthcare setting is typically required. Verify that the program provides this before enrolling.',
      requiresConfirmation: true,
    },
    {
      id: 'phleb-adult-4',
      kind: 'examination',
      title: 'Consider national certification (NHA, ASCP, or NPA)',
      description:
        'National certification is voluntary but may be required by hospitals and laboratories. Confirm target employer requirements.',
      requiresConfirmation: true,
    },
    {
      id: 'phleb-adult-5',
      kind: 'employment',
      title: 'Confirm employer requirements before applying',
      description:
        'Requirements vary by setting (hospital lab, blood bank, clinic). Verify specific requirements with target employers.',
      requiresConfirmation: true,
    },
  ],

  // ─── Patient Care Technician ──────────────────────────────────────────────

  'patient-care-technician:high-school': [
    {
      id: 'pct-hs-1',
      kind: 'preparation',
      title: 'Complete high school requirements',
      description:
        'A high school diploma or GED is required by most PCT programs.',
      requiresConfirmation: false,
    },
    {
      id: 'pct-hs-2',
      kind: 'preparation',
      title: 'Consider obtaining CNA certification first',
      description:
        'Many PCT roles require CNA certification as a prerequisite. Confirm whether target employers require it before enrolling in a PCT-only program.',
      requiresConfirmation: true,
    },
    {
      id: 'pct-hs-3',
      kind: 'preparation',
      title: 'Research PCT programs',
      description:
        'Programs typically include CNA, EKG, and phlebotomy components. Confirm scope of training and employer recognition before enrolling.',
      requiresConfirmation: true,
    },
    {
      id: 'pct-hs-4',
      kind: 'education',
      title: 'Complete PCT training',
      description:
        'Training covers patient care skills, EKG interpretation, and phlebotomy procedures. Program duration varies by provider — confirm the current schedule directly with the institution.',
      requiresConfirmation: true,
    },
    {
      id: 'pct-hs-5',
      kind: 'examination',
      title: 'Consider pursuing PCT certification (CPCT/A via NHA)',
      description:
        'The CPCT/A credential from NHA is optional but may be preferred by employers. Confirm eligibility and exam requirements at nhanow.com.',
      requiresConfirmation: true,
    },
    {
      id: 'pct-hs-6',
      kind: 'employment',
      title: 'Confirm employer requirements before applying',
      description:
        'No single universal PCT certification exists. Requirements vary significantly by employer and care setting. Verify specific requirements before applying.',
      requiresConfirmation: true,
    },
  ],

  'patient-care-technician:university': [
    {
      id: 'pct-univ-1',
      kind: 'preparation',
      title: 'Consider obtaining CNA certification first',
      description:
        'Many PCT roles require CNA certification as a prerequisite. Confirm whether target employers require it before enrolling in a PCT program.',
      requiresConfirmation: true,
    },
    {
      id: 'pct-univ-2',
      kind: 'preparation',
      title: 'Research PCT programs',
      description:
        'Confirm scope of training (patient care, EKG, phlebotomy) and employer recognition before enrolling.',
      requiresConfirmation: true,
    },
    {
      id: 'pct-univ-3',
      kind: 'preparation',
      title: 'Confirm scope, duties, and employer requirements',
      description:
        'PCT scope of practice varies by employer and care setting. Verify what procedures are permitted in your target setting before enrolling.',
      requiresConfirmation: true,
    },
    {
      id: 'pct-univ-4',
      kind: 'education',
      title: 'Complete PCT training',
      description:
        'Training covers patient care skills, EKG interpretation, and phlebotomy procedures. Program duration varies by provider — confirm the current schedule directly with the institution.',
      requiresConfirmation: true,
    },
    {
      id: 'pct-univ-5',
      kind: 'examination',
      title: 'Consider pursuing PCT certification (CPCT/A via NHA)',
      description:
        'The CPCT/A credential is optional but may be preferred by employers. Confirm requirements at nhanow.com.',
      requiresConfirmation: true,
    },
    {
      id: 'pct-univ-6',
      kind: 'employment',
      title: 'Confirm employer requirements before applying',
      description:
        'No single universal PCT certification exists. Requirements vary significantly by employer and care setting.',
      requiresConfirmation: true,
    },
  ],

  'patient-care-technician:adult': [
    {
      id: 'pct-adult-1',
      kind: 'preparation',
      title: 'Consider obtaining CNA certification first',
      description:
        'Many PCT roles require CNA certification as a foundation. Confirm whether target employers require it before enrolling in a PCT-only program.',
      requiresConfirmation: true,
    },
    {
      id: 'pct-adult-2',
      kind: 'preparation',
      title: 'Research PCT programs',
      description:
        'Confirm scope of training and employer recognition before enrolling. Programs vary significantly in content and depth.',
      requiresConfirmation: true,
    },
    {
      id: 'pct-adult-3',
      kind: 'preparation',
      title: 'Confirm scope, duties, and employer requirements',
      description:
        'PCT scope of practice varies by employer and care setting. Verify what procedures are permitted in your target setting.',
      requiresConfirmation: true,
    },
    {
      id: 'pct-adult-4',
      kind: 'education',
      title: 'Complete PCT training',
      description:
        'Training covers patient care skills, EKG interpretation, and phlebotomy. Program duration varies by provider — confirm the current schedule directly with the institution.',
      requiresConfirmation: true,
    },
    {
      id: 'pct-adult-5',
      kind: 'examination',
      title: 'Consider pursuing PCT certification (CPCT/A via NHA)',
      description:
        'The CPCT/A credential from NHA is optional but may be preferred by employers.',
      requiresConfirmation: true,
    },
    {
      id: 'pct-adult-6',
      kind: 'employment',
      title: 'Confirm employer requirements before applying',
      description:
        'No single universal PCT certification exists. Requirements vary by employer and care setting.',
      requiresConfirmation: true,
    },
  ],
};

// ─── Verification checklists keyed by careerId ────────────────────────────────

const VERIFY_WITH_PROVIDER: Record<string, readonly string[]> = {
  rn: [
    'Confirm current LSBN program approval status at lsbn.state.la.us before enrolling.',
    'Verify exact prerequisite and admission requirements directly with each program.',
    'Confirm transfer-credit policies with target programs before completing prerequisites elsewhere.',
    'Verify current NCLEX-RN authorization and licensure procedures with LSBN.',
  ],
  lpn: [
    'Confirm current LSBPNE program approval status at lsbpne.la.gov before enrolling.',
    'Verify exact prerequisite and admission requirements directly with each program.',
    'Confirm current NCLEX-PN authorization procedures and fees with LSBPNE.',
    'Verify current annual license renewal requirements (November 1 – January 31) with LSBPNE.',
  ],
  cna: [
    'Confirm LDH state-approval status for the program before enrolling (ldh.la.gov).',
    'Verify minimum age requirements directly with the program.',
    'Confirm current competency evaluation procedures and fees with LDH.',
    'Verify CNA certification renewal requirements (certification expires after two years) with LDH.',
  ],
  'medical-assistant': [
    'Verify CAAHEP or ABHES accreditation status before enrolling.',
    'Confirm employer certification preferences (CMA, RMA) in your target setting.',
    'Verify permitted scope-of-practice procedures with your specific employer before performing clinical duties.',
  ],
  phlebotomy: [
    'Confirm that the program includes supervised clinical (practicum) hours before enrolling.',
    'Verify employer certification preferences (NHA, ASCP, NPA) with target employers.',
    'Confirm clinical placement support with the program before enrolling.',
  ],
  'patient-care-technician': [
    'Confirm whether target employers require CNA certification before enrolling in a PCT program.',
    'Verify scope-of-practice and permitted duties with your specific employer before performing procedures.',
    'Confirm employer recognition of CPCT/A or other PCT credentials before pursuing certification.',
  ],
};

// ─── Disclaimers keyed by careerId ────────────────────────────────────────────

const DISCLAIMERS: Record<string, string> = {
  rn:
    'This pathway is a general guide based on publicly available information as of November 2026. It does not constitute professional career advice. Requirements, prerequisites, admission criteria, and licensing procedures are subject to change. Always verify current requirements directly with LSBN, your target programs, and relevant accrediting bodies before making enrollment or financial decisions.',
  lpn:
    'This pathway is a general guide based on publicly available information as of November 2026. It does not constitute professional career advice. Requirements, prerequisites, and licensing procedures are subject to change. Always verify current requirements directly with LSBPNE, your target programs, and relevant accrediting bodies before making enrollment or financial decisions.',
  cna:
    'This pathway is a general guide based on publicly available information as of November 2026. It does not constitute professional career advice. CNA registry placement is distinct from RN or LPN professional licensure. Requirements and procedures are subject to change; always verify with the Louisiana Department of Health and your target training program before enrolling.',
  'medical-assistant':
    'This pathway is a general guide based on publicly available information as of November 2026. It does not constitute professional career advice. Louisiana does not require a state license for medical assistants. Employer requirements, program accreditation, and certification eligibility are subject to change; verify current requirements with specific employers, programs, and certifying bodies before enrolling.',
  phlebotomy:
    'This pathway is a general guide based on publicly available information as of November 2026. It does not constitute professional career advice. Requirements vary by employer and setting. Verify current program content, clinical hours requirements, and employer expectations before enrolling.',
  'patient-care-technician':
    'This pathway is a general guide based on publicly available information as of November 2026. It does not constitute professional career advice. No single universal PCT standard exists; requirements vary by employer, care setting, and state. Verify specific requirements with target employers and programs before enrolling.',
};

// ─── Public API ───────────────────────────────────────────────────────────────

export function buildHealthcarePathway(
  answers: OnboardingAnswers,
  careerId: string,
  programs: readonly HealthcareProgram[],
): LearnerPathway | null {
  const career = getCareerById(careerId);
  if (!career) return null;

  const learnerCategory: LearnerCategory = answers.learnerType;
  const key = `${careerId}:${learnerCategory}`;
  const milestones = MILESTONES[key];

  if (!milestones) return null;

  const linkedPrograms = programs.filter((p) => p.careerId === careerId);
  const relevantRoutes: readonly EducationRoute[] = career.educationRoutes;
  const verifyWithProvider = VERIFY_WITH_PROVIDER[careerId] ?? [];
  const disclaimer = DISCLAIMERS[careerId] ?? DISCLAIMERS['rn'];

  return {
    careerId,
    learnerCategory,
    milestones,
    relevantRoutes,
    verifyWithProvider,
    linkedProgramIds: linkedPrograms.map((p) => p.id),
    disclaimer,
  };
}
