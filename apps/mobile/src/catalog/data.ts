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
      summary: 'Open to all learners with an internet connection; no prerequisites required. Confirm current enrollment requirements on the official course page.',
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
      kind: 'known',
      value: 6,
      unit: 'hours',
      evidenceUrl: 'https://www.netacad.com/courses/introduction-to-cybersecurity',
    },
    availability: {
      mode: 'online',
      jurisdictions: null,
    },
    verification: {
      status: 'verified-official-source',
      checkedOn: '2026-11-04',
      sourceUrls: ['https://www.netacad.com/courses/introduction-to-cybersecurity'],
      evidenceNotes:
        'Official Cisco Networking Academy / Skills for All course page confirms: free, self-paced, 6 hours, online delivery. Title, provider, and free-price claim supported by page title and content. Duration of 6 hours confirmed from the official course page. Reviewed 2026-11-04.',
    },
    creditRecognition: {
      kind: 'skills-only',
      disclaimer: 'Skills learning only; no academic credit or credential is promised.',
    },
    searchTags: ['cisco', 'cybersecurity', 'free', 'beginner', 'online', 'self-paced', '6 hours'],
  },

  {
    id: 'cisco-networking-basics',
    title: 'Networking Basics',
    provider: 'Cisco Networking Academy (Skills for All)',
    description:
      'A free, self-paced online course introducing computer networking concepts: network types, the internet, IP addressing, common network protocols, and how data is transmitted across networks.',
    learnerEligibility: {
      categories: ['high-school', 'university', 'adult'],
      summary: 'Open to all learners with an internet connection; no prerequisites required. Confirm current enrollment requirements on the official course page.',
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
      kind: 'known',
      value: 22,
      unit: 'hours',
      evidenceUrl: 'https://www.netacad.com/courses/networking-basics',
    },
    availability: {
      mode: 'online',
      jurisdictions: null,
    },
    verification: {
      status: 'verified-official-source',
      checkedOn: '2026-11-04',
      sourceUrls: ['https://www.netacad.com/courses/networking-basics'],
      evidenceNotes:
        'Official Cisco Networking Academy / Skills for All course page confirms: free, self-paced, 22 hours, online delivery. Title, provider, and free-price claim supported by page title and content. Duration of 22 hours confirmed from the official course page. Reviewed 2026-11-04.',
    },
    creditRecognition: {
      kind: 'skills-only',
      disclaimer: 'Skills learning only; no academic credit or credential is promised.',
    },
    searchTags: ['cisco', 'networking', 'free', 'beginner', 'online', 'self-paced', '22 hours', 'IP', 'protocols'],
  },

  {
    id: 'modern-states-clep-prep',
    title: 'Modern States — Free CLEP Exam Preparation',
    provider: 'Modern States Education Alliance',
    description:
      'Modern States offers free online college courses taught by professors from leading universities, designed to prepare learners for College Board CLEP exams. The organization also provides a program to help cover CLEP exam registration fees for eligible participants. Potential academic credit depends entirely on each institution\'s current CLEP acceptance policy, which must be confirmed directly with the institution.',
    learnerEligibility: {
      categories: ['university', 'high-school'],
      summary: 'Open to learners preparing for CLEP exams. Eligibility for the exam-voucher program may have additional criteria — check the Modern States website for current requirements.',
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
      checkedOn: '2026-11-04',
      sourceUrls: ['https://modernstates.org'],
      evidenceNotes:
        'Modern States homepage confirms free, self-paced course offering and CLEP exam voucher program. Disclaimer text sourced from site: "CLEP credit policies vary by institution. Before scheduling an exam, confirm with your college or university which CLEP exams they accept, the scores required, and how the credit applies to your degree." Reviewed 2026-11-04.',
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
      'The College-Level Examination Program (CLEP) allows learners to demonstrate college-level mastery on standardized subject exams. 34 exam subjects are available across mathematics, science, social sciences, history, composition, and the humanities. Exam duration varies by subject. All 34 exams are available through remote proctoring for eligible test takers in addition to authorized test centers. Whether credit is awarded, and the amount, depends entirely on each institution\'s current CLEP acceptance policy. Confirm with your institution and check College Board eligibility requirements before registering.',
    learnerEligibility: {
      categories: ['university', 'high-school'],
      summary: 'No prerequisites stated at the program level by College Board. Individual test centers, remote proctoring providers, and institutions may have additional requirements. Confirm current eligibility with College Board before registering.',
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
      kind: 'unknown',
      reason:
        'Exam duration varies by subject — for example, College Composition is 125 minutes and Spanish with Writing is 110 minutes. There is no single program-wide duration. Check the official page for the specific exam you plan to take.',
    },
    availability: {
      mode: 'hybrid',
      jurisdictions: ['United States'],
      locationSummary:
        'Available at authorized CLEP test centers across the United States and through College Board remote proctoring. Remote proctoring is available for all 34 exams for eligible test takers; check eligibility requirements at the College Board website before registering.',
    },
    verification: {
      status: 'verified-official-source',
      checkedOn: '2026-11-04',
      sourceUrls: [
        'https://clep.collegeboard.org',
        'https://clep.collegeboard.org/clep-exams',
        'https://clep.collegeboard.org/about-remote-proctoring/take-clep-exam-remote-proctoring',
      ],
      evidenceNotes:
        'College Board CLEP homepage and exam listing page confirm 34 available exams and $97 registration fee (additional test center fees may apply). Exam durations are exam-specific, not universal; College Composition is 125 minutes and Spanish with Writing is 110 minutes per official exam pages. Remote proctoring page confirms all 34 exams are available through remote proctoring for eligible test takers. Credit policies confirmed to vary by institution. Reviewed 2026-11-04.',
    },
    creditRecognition: {
      kind: 'possible-institution-approval',
      disclaimer:
        'Credit is not guaranteed. Confirm the current policy and degree applicability with your institution.',
      examOrPathway: 'CLEP (College-Level Examination Program)',
    },
    searchTags: ['CLEP', 'college board', 'alternative credit', 'exam', 'college credit', 'standardized test', 'remote proctoring'],
  },

  {
    id: 'louisiana-atc-responsible-vendor',
    title: 'Louisiana Responsible Vendor Training',
    provider: 'ATC-Approved Responsible Vendor Training Providers',
    description:
      'Louisiana law requires alcohol beverage servers and sellers to complete a Responsible Vendor (RV) training course delivered by a provider currently approved by the Louisiana Office of Alcohol and Tobacco Control (ATC). The ATC administers and regulates the program; actual training is delivered by independent ATC-approved providers. After completing an approved training course, participants must also pass a separate exam to obtain a Responsible Vendor server permit card. The training course, the exam, the server permit card, vendor certification, and any employer requirements are separate steps — completing one does not automatically fulfill the others. Provider-specific details including course availability, delivery method, price, and schedule are managed by each individual provider and must be confirmed directly. The official ATC-approved provider list must be consulted to identify currently approved providers.',
    learnerEligibility: {
      categories: ['adult'],
      summary:
        'Required for alcohol beverage servers and sellers in Louisiana under Louisiana law. Age and other requirements are set by Louisiana law and individual employers; confirm current requirements with your employer and the Louisiana ATC.',
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
      mode: 'hybrid',
      jurisdictions: ['Louisiana'],
      locationSummary:
        'Delivery method varies by provider — some ATC-approved providers offer online-only training; others offer in-person classroom sessions or both. Consult the current ATC-approved provider list for each provider\'s delivery options, locations, and schedules.',
    },
    verification: {
      status: 'verified-official-source',
      checkedOn: '2026-11-04',
      sourceUrls: [
        'https://atc.louisiana.gov/responsible-vendors/responsible-vendor-information/',
        'https://atc.louisiana.gov/media/5e4bsyim/responsible-vendor-provider-list-updated-11-7-25.pdf',
      ],
      evidenceNotes:
        'Louisiana ATC Responsible Vendor information page confirms the program\'s legal basis, that training must be completed through an ATC-approved provider, and that a separate exam and server permit card are part of the process. The ATC maintains an approved provider list (last updated 2025-11-07 per filename) which lists providers offering online-only, classroom, or both delivery modes — confirming delivery is provider-dependent, not exclusively in-person. Provider-specific price, duration, and schedule details are not stated on the ATC program page. Reviewed 2026-11-04.',
    },
    creditRecognition: {
      kind: 'certification-or-required-training',
      disclaimer:
        'Completing an ATC-approved Responsible Vendor training course does not by itself fulfill all requirements. A separate exam, a Responsible Vendor server permit card, and employer requirements are distinct steps. Requirements are set by Louisiana law. Confirm all current requirements with the Louisiana ATC and your employer.',
      outcome: 'Completion certificate from an ATC-approved Responsible Vendor training course. A separate exam and server permit card are required by Louisiana law; confirm all steps with the Louisiana ATC.',
    },
    searchTags: ['Louisiana', 'responsible vendor', 'ATC', 'alcohol', 'server training', 'required', 'hybrid'],
  },
] satisfies readonly Opportunity[];
