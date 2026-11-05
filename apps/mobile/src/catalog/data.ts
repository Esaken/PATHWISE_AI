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
      'Modern States offers free online college courses taught by professors from leading universities, designed to prepare learners for College Board CLEP exams. After completing a course and its practice questions, qualified participants may receive a voucher code that covers the CLEP exam registration fee when entered at College Board registration. Potential academic credit depends entirely on each institution\'s current CLEP acceptance policy, which must be confirmed directly with the institution before scheduling an exam.',
    learnerEligibility: {
      categories: ['university', 'high-school'],
      summary: 'Open to learners preparing for CLEP exams. Voucher eligibility requires course and practice-question completion; check the Modern States website for current qualification criteria.',
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
      sourceUrls: [
        'https://modernstates.org',
        'https://helpdesk.modernstates.org/support/solutions/articles/151000233533-can-i-start-earning-college-credit-with-clep-',
      ],
      evidenceNotes:
        'Modern States homepage confirms free, self-paced course offering. Official Modern States helpdesk article "Can I start earning college credit with CLEP?" confirms: (1) qualified students receive "a code to enter when you register for your exam with the College Board, and it covers the full cost" after completing a course and practice questions; (2) institutional-policy disclaimer: "CLEP credit policies vary by institution. Before scheduling an exam, confirm with your college or university which CLEP exams they accept, the scores required, and how the credit applies to your degree." Both sources reviewed 2026-11-04.',
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
        'https://clep.collegeboard.org/clep-exams/college-composition',
        'https://clep.collegeboard.org/prepare-for-an-exam/study-resources-by-exam/spanish-with-writing',
      ],
      evidenceNotes:
        'College Board CLEP homepage and exam listing page confirm 34 available exams and $97 registration fee (additional test center fees may apply). Exam durations are exam-specific: official College Composition page states 125 minutes; official Spanish with Writing page states 110 minutes — confirming no universal duration applies. Remote proctoring page confirms all 34 exams available through remote proctoring for eligible test takers. Credit policies confirmed to vary by institution via College Board guidance. All sources reviewed 2026-11-04.',
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
      'Louisiana R.S. 26:933 establishes the Louisiana Responsible Vendor Program to educate vendors and their employees on the responsible sale and service of alcoholic beverages and tobacco products. Required training must be completed through providers approved by the program administrator (R.S. 26:932) within 45 days of employment commencement (R.S. 26:934). Training covers alcohol classification, drug interactions, absorption rates, recognizing intoxicated or underage customers, applicable state and local alcohol laws, and tobacco regulations. Upon successful completion, servers receive a server permit valid for four years, which remains the property of the server and is valid statewide (R.S. 26:934). The Louisiana Office of Alcohol and Tobacco Control (ATC) administers the program and maintains the official list of currently approved providers. Provider-specific details — including availability, delivery method (online, in-person, or both), price, and schedule — are set by each individual provider and must be confirmed directly with that provider.',
    learnerEligibility: {
      categories: ['adult'],
      summary:
        'Required for servers (employees authorized to sell or serve alcoholic beverages, tobacco products, alternative nicotine products, or vapor products) and security personnel employed by eligible Louisiana vendors (Class A General, Class A Restaurant, Class B retail, or Retail Dealer permit holders), per R.S. 26:932 and R.S. 26:934. Training must be completed within 45 days of employment commencement through an ATC-approved provider. Confirm current requirements with the Louisiana ATC and your employer.',
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
        'Delivery method varies by provider — the ATC-approved provider list includes online-only providers and in-person classroom providers. Consult the current list for each provider\'s delivery options, locations, and schedules.',
    },
    verification: {
      status: 'verified-official-source',
      checkedOn: '2026-11-05',
      sourceUrls: [
        'https://atc.louisiana.gov/responsible-vendors/responsible-vendor-information/',
        'https://atc.louisiana.gov/media/5e4bsyim/rv-list_9-23-26.pdf',
        'https://atc.louisiana.gov/media/dx4bcx25/2026-atc-lawbook.pdf',
      ],
      evidenceNotes:
        '2026 ATC lawbook (atc.louisiana.gov/media/dx4bcx25/2026-atc-lawbook.pdf), Chapter 8 — Responsible Vendor Program: R.S. 26:932 (lawbook p. 188) defines "server" as an employee authorized to sell or serve alcoholic beverages, tobacco products, alternative nicotine products, or vapor products (excluding temporary hotel/motel banquet staff), and "approved provider" as an individual, association, partnership, or corporation authorized by the program administrator to deliver training courses. R.S. 26:933 establishes the Louisiana Responsible Vendor Program and specifies server training course content: alcohol classification, drug interactions, absorption rates, identifying intoxicated or underage persons, state/local alcohol laws, and tobacco regulations. R.S. 26:934 (lawbook p. 191) requires training completion within 45 days of employment commencement through an approved provider; the resulting server permit is valid for four years, is the property of the server, and is valid statewide. ATC Responsible Vendor information page (atc.louisiana.gov) confirms ATC administers the program and maintains the approved provider list; page does not state the statutory requirements cited above. Official ATC-approved provider list (rv-list_9-23-26.pdf, updated 2026-09-23) confirms hybrid delivery: online-only, in-person, and combined-mode providers are listed — delivery is provider-dependent. Provider-specific price, duration, and schedule are not published by ATC. Reviewed 2026-11-05.',
    },
    creditRecognition: {
      kind: 'certification-or-required-training',
      disclaimer:
        'Completion of required training courses through an ATC-approved provider results in a server permit valid for four years, statewide (R.S. 26:934). Server permit issuance is one component of responsible vendor certification; additional requirements under R.S. 26:934 (including vendor handbook acknowledgment and training record maintenance) also apply to vendor certification. Confirm all current requirements — including employer conditions and applicable law — with the Louisiana ATC and your employer.',
      outcome: 'Server permit (four years, statewide; R.S. 26:934)',
    },
    searchTags: ['Louisiana', 'responsible vendor', 'ATC', 'alcohol', 'server training', 'required', 'hybrid', 'R.S. 26:933', 'R.S. 26:934'],
  },
] satisfies readonly Opportunity[];
