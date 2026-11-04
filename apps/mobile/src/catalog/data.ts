import type { Opportunity } from './types';

export const CATALOG: readonly Opportunity[] = [
  {
    id: 'cisco-intro-cybersecurity',
    title: 'Introduction to Cybersecurity',
    provider: 'Cisco Networking Academy (Skills for All)',
    description:
      'A free, self-paced online course covering the basics of cybersecurity: common threats and attacks, the importance of protecting personal data, security frameworks, and career pathways in cybersecurity.',
    learnerEligibility: {
      categories: ['high-school', 'university', 'adult'],
      summary: 'Open to all learners; no prerequisites required.',
      minimumAge: null,
      prerequisites: [],
    },
    topics: ['cybersecurity'],
    category: 'course',
    officialUrl: 'https://www.netacad.com/courses/introduction-to-cybersecurity',
    price: {
      kind: 'free',
      currency: 'USD',
      amount: 0,
      evidenceUrl: 'https://www.netacad.com/courses/introduction-to-cybersecurity',
    },
    duration: {
      kind: 'unknown',
      reason:
        'Duration was not stated on the official course page at time of review (2026-11-04). Check the course page for the current estimate.',
    },
    availability: {
      mode: 'online',
      jurisdictions: null,
    },
    verification: {
      status: 'verified-official-source',
      checkedOn: '2026-11-4',
      sourceUrls: ['https://www.netacad.com/courses/introduction-to-cybersecurity'],
      evidenceNotes:
        'Course page title and content confirm free self-paced offering under Cisco Networking Academy / Skills for All. Page reviewed 2026-11-04; duration not stated on page.',
    },
    creditRecognition: {
      kind: 'skills-only',
      disclaimer: 'Skills learning only; no academic credit or credential is promised.',
    },
    searchTags: ['cisco', 'cybersecurity', 'free', 'beginner', 'online', 'self-paced'],
  },

  {
    id: 'cisco-networking-basics',
    title: 'Networking Basics',
    provider: 'Cisco Networking Academy (Skills for All)',
    description:
      'A free, self-paced online course introducing computer networking concepts: network types, the internet, IP addressing, common network protocols, and how data is transmitted across networks.',
    learnerEligibility: {
      categories: ['high-school', 'university', 'adult'],
      summary: 'Open to all learners; no prerequisites required.',
      minimumAge: null,
      prerequisites: [],
    },
    topics: ['networking', 'information-technology'],
    category: 'course',
    officialUrl: 'https://www.netacad.com/courses/networking-basics',
    price: {
      kind: 'free',
      currency: 'USD',
      amount: 0,
      evidenceUrl: 'https://www.netacad.com/courses/networking-basics',
    },
    duration: {
      kind: 'unknown',
      reason:
        'Duration was not stated on the official course page at time of review (2026-11-04). Check the course page for the current estimate.',
    },
    availability: {
      mode: 'online',
      jurisdictions: null,
    },
    verification: {
      status: 'verified-official-source',
      checkedOn: '2026-11-4',
      sourceUrls: ['https://www.netacad.com/courses/networking-basics'],
      evidenceNotes:
        'Course page title and content confirm free self-paced offering under Cisco Networking Academy / Skills for All. Page reviewed 2026-11-04; duration not stated on page.',
    },
    creditRecognition: {
      kind: 'skills-only',
      disclaimer: 'Skills learning only; no academic credit or credential is promised.',
    },
    searchTags: ['cisco', 'networking', 'free', 'beginner', 'online', 'self-paced', 'IP', 'protocols'],
  },

  {
    id: 'modern-states-clep-prep',
    title: 'Modern States — Free CLEP Exam Preparation',
    provider: 'Modern States Education Alliance',
    description:
      'Modern States offers free online college courses taught by professors from leading universities, designed to prepare learners for College Board CLEP exams. The organization also provides a program to help cover CLEP exam registration fees for eligible participants. Potential academic credit depends entirely on each institution\'s current CLEP acceptance policy, which must be confirmed directly with the institution.',
    learnerEligibility: {
      categories: ['university', 'high-school'],
      summary: 'Open to learners preparing for CLEP exams. Eligibility for the exam-voucher program may have additional criteria—check the Modern States website.',
      minimumAge: null,
      prerequisites: [],
    },
    topics: ['alternative-credit'],
    category: 'exam-preparation',
    officialUrl: 'https://modernstates.org',
    price: {
      kind: 'free',
      currency: 'USD',
      amount: 0,
      evidenceUrl: 'https://modernstates.org',
    },
    duration: {
      kind: 'self-paced',
      estimate: null,
      evidenceUrl: 'https://modernstates.org',
    },
    availability: {
      mode: 'online',
      jurisdictions: null,
    },
    verification: {
      status: 'verified-official-source',
      checkedOn: '2026-11-4',
      sourceUrls: ['https://modernstates.org'],
      evidenceNotes:
        'Modern States homepage confirms free course offering and CLEP exam voucher program. Disclaimer text sourced from site: "CLEP credit policies vary by institution. Before scheduling an exam, confirm with your college or university which CLEP exams they accept, the scores required, and how the credit applies to your degree." Reviewed 2026-11-04.',
    },
    creditRecognition: {
      kind: 'possible-institution-approval',
      disclaimer:
        'Credit is not guaranteed. Confirm the current policy and degree applicability with your institution.',
      examOrPathway: 'CLEP (College-Level Examination Program)',
    },
    searchTags: ['modern states', 'CLEP', 'alternative credit', 'free', 'exam prep', 'college credit', 'online'],
  },

  {
    id: 'clep-exam-program',
    title: 'CLEP — College-Level Examination Program',
    provider: 'College Board',
    description:
      'The College-Level Examination Program (CLEP) allows learners to earn college credit by scoring sufficiently on standardized subject exams. 34 exam subjects are available across mathematics, science, social sciences, history, and the humanities. Whether credit is awarded, and the amount, depends entirely on each institution\'s current CLEP acceptance policy. Confirm with your institution before registering.',
    learnerEligibility: {
      categories: ['university', 'high-school'],
      summary: 'Open to anyone who registers and pays the exam fee. Academic credit is at each institution\'s sole discretion.',
      minimumAge: null,
      prerequisites: [],
    },
    topics: ['alternative-credit'],
    category: 'exam',
    officialUrl: 'https://clep.collegeboard.org',
    price: {
      kind: 'known',
      currency: 'USD',
      amount: 97,
      evidenceUrl: 'https://clep.collegeboard.org/clep-exams',
    },
    duration: {
      kind: 'known',
      value: 90,
      unit: 'minutes',
      evidenceUrl: 'https://clep.collegeboard.org/clep-exams',
    },
    availability: {
      mode: 'in-person',
      jurisdictions: ['United States'],
      locationSummary: 'Administered at authorized CLEP test centers across the United States.',
    },
    verification: {
      status: 'verified-official-source',
      checkedOn: '2026-11-4',
      sourceUrls: [
        'https://clep.collegeboard.org',
        'https://clep.collegeboard.org/clep-exams',
      ],
      evidenceNotes:
        'College Board CLEP homepage and exam listing page confirm 34 available exams. Exam fee of $97 per exam confirmed from the official exam page (additional test center fees may apply). Exam duration of 90 minutes confirmed from exam page. Credit policies confirmed to vary by institution via College Board guidance. Reviewed 2026-11-04.',
    },
    creditRecognition: {
      kind: 'possible-institution-approval',
      disclaimer:
        'Credit is not guaranteed. Confirm the current policy and degree applicability with your institution.',
      examOrPathway: 'CLEP (College-Level Examination Program)',
    },
    searchTags: ['CLEP', 'college board', 'alternative credit', 'exam', 'college credit', 'standardized test'],
  },

  {
    id: 'louisiana-atc-responsible-vendor',
    title: 'Louisiana Responsible Vendor Training',
    provider: 'Louisiana Office of Alcohol and Tobacco Control (ATC)',
    description:
      'Louisiana law requires alcohol beverage servers and sellers to complete a Responsible Vendor training program approved by the Louisiana Office of Alcohol and Tobacco Control (ATC). Completion of an ATC-approved program, combined with passing an exam, may allow a permit holder to reduce penalties for certain violations. Courses must be delivered by a currently ATC-approved Responsible Vendor training provider. The official ATC provider list must be consulted to identify current approved providers, as approval status, course availability, prices, and schedules are managed by individual providers and may change.',
    learnerEligibility: {
      categories: ['adult'],
      summary:
        'Required for alcohol beverage servers and sellers in Louisiana. Minimum age requirements are set by Louisiana law and individual employers.',
      minimumAge: null,
      prerequisites: [],
    },
    topics: ['responsible-vendor'],
    category: 'required-training',
    officialUrl: 'https://atc.louisiana.gov/responsible-vendors/responsible-vendor-information/',
    price: {
      kind: 'unknown',
      currency: null,
      amount: null,
      reason:
        'Prices are set by individual ATC-approved training providers and are not published on the official ATC program page. Consult the current ATC-approved provider list for provider contact information.',
    },
    duration: {
      kind: 'unknown',
      reason:
        'Duration is set by individual ATC-approved training providers and is not stated on the official ATC program page. Consult the current ATC-approved provider list for provider details.',
    },
    availability: {
      mode: 'in-person',
      jurisdictions: ['Louisiana'],
      locationSummary:
        'Training is delivered by individual ATC-approved providers across Louisiana. Consult the current ATC-approved provider list for locations and schedules.',
    },
    verification: {
      status: 'verified-official-source',
      checkedOn: '2026-11-4',
      sourceUrls: [
        'https://atc.louisiana.gov/responsible-vendors/responsible-vendor-information/',
        'https://atc.louisiana.gov/media/5e4bsyim/responsible-vendor-provider-list-updated-11-7-25.pdf',
      ],
      evidenceNotes:
        'Louisiana ATC Responsible Vendor information page confirms the program exists, its legal basis, and that training must be completed through an ATC-approved provider. The ATC maintains a provider list (last updated 2025-11-07 per filename). Price, duration, and specific provider details are not stated on the ATC program page and are managed by individual providers. Provider approval status, course details, and permit implications are separate claims. Reviewed 2026-11-04.',
    },
    creditRecognition: {
      kind: 'certification-or-required-training',
      disclaimer:
        'Completion of an ATC-approved Responsible Vendor program does not independently guarantee penalty reduction, permit issuance, or employment. Requirements are set by Louisiana law and individual permit conditions. Confirm current requirements with the Louisiana ATC and your employer.',
      outcome: 'ATC Responsible Vendor program completion certificate; may support permit penalty reduction per Louisiana law when combined with passing an exam.',
    },
    searchTags: ['Louisiana', 'responsible vendor', 'ATC', 'alcohol', 'server training', 'required', 'in-person'],
  },
] satisfies readonly Opportunity[];
