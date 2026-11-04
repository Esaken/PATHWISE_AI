export type LabeledOption = {
  value: string;
  label: string;
  qualifier?: string;
};

export const HIGH_SCHOOL_GRADES: LabeledOption[] = [
  { value: '9th', label: '9th grade' },
  { value: '10th', label: '10th grade' },
  { value: '11th', label: '11th grade' },
  { value: '12th', label: '12th grade' },
];

export const HIGH_SCHOOL_GOALS: LabeledOption[] = [
  { value: 'prepare-college', label: 'Prepare for college' },
  {
    value: 'explore-credit',
    label: 'Explore courses that may be eligible for college credit',
    qualifier:
      'Eligibility and transfer of credit depend on the institution and should be confirmed with an advisor.',
  },
  { value: 'build-career-skills', label: 'Build career skills' },
  { value: 'explore-career-pathways', label: 'Explore career pathways' },
];

export const CAREER_INTERESTS: LabeledOption[] = [
  { value: 'technology', label: 'Technology & Computing' },
  { value: 'healthcare', label: 'Healthcare & Medicine' },
  { value: 'business', label: 'Business & Finance' },
  { value: 'arts', label: 'Arts, Design & Media' },
  { value: 'engineering', label: 'Engineering & Architecture' },
  { value: 'education', label: 'Education & Social Services' },
  { value: 'legal', label: 'Legal & Public Policy' },
  { value: 'environment', label: 'Environment & Science' },
  { value: 'trades', label: 'Trades & Manufacturing' },
  { value: 'sports', label: 'Sports & Recreation' },
  { value: 'not-sure', label: 'Not sure yet' },
];

export const UNIVERSITY_STUDY_AREAS: LabeledOption[] = [
  { value: 'computer-science', label: 'Computer Science & IT' },
  { value: 'business', label: 'Business & Management' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'health-medicine', label: 'Health & Medicine' },
  { value: 'arts-humanities', label: 'Arts & Humanities' },
  { value: 'social-sciences', label: 'Social Sciences' },
  { value: 'education', label: 'Education' },
  { value: 'natural-sciences', label: 'Natural Sciences' },
  { value: 'law-politics', label: 'Law & Political Science' },
  { value: 'architecture-design', label: 'Architecture & Design' },
  { value: 'communications', label: 'Communications & Media' },
  { value: 'undecided', label: 'Undecided / Exploring' },
];

export const UNIVERSITY_GOALS: LabeledOption[] = [
  {
    value: 'explore-credit',
    label: 'Explore possible college-credit options',
    qualifier:
      'Credit transfer eligibility depends on your institution and should be confirmed with an advisor.',
  },
  {
    value: 'prepare-certification',
    label: 'Prepare for a professional certification',
    qualifier:
      'Courses help you prepare and build skills; they do not guarantee eligibility, passing, or an official credential.',
  },
  { value: 'build-job-skills', label: 'Build job-relevant skills' },
  { value: 'prepare-internships', label: 'Prepare for internships' },
  { value: 'explore-career-pathways', label: 'Explore career pathways' },
];

export const ADULT_CAREER_GOALS: LabeledOption[] = [
  { value: 'technology', label: 'Technology or computing skills' },
  { value: 'healthcare', label: 'Healthcare or medical field' },
  { value: 'business', label: 'Business operations or management' },
  { value: 'creative', label: 'Creative work (design, writing, media)' },
  { value: 'trades', label: 'Skilled trades or manufacturing' },
  { value: 'education', label: 'Education or teaching' },
  { value: 'legal', label: 'Legal, compliance, or policy work' },
  { value: 'environment', label: 'Environmental or scientific research' },
  { value: 'leadership', label: 'Leadership or management development' },
  { value: 'something-else', label: 'Something else' },
];

export const ADULT_GOALS: LabeledOption[] = [
  {
    value: 'prepare-certification',
    label: 'Prepare for a professional certification',
    qualifier:
      'Courses help you prepare and build skills; they do not guarantee eligibility, passing, or an official credential.',
  },
  { value: 'job-training', label: 'Complete job-related training' },
  { value: 'build-general-skills', label: 'Build general skills' },
  { value: 'change-career', label: 'Change or advance a career pathway' },
];

export const BUDGET_OPTIONS: LabeledOption[] = [
  { value: 'free', label: 'Free only' },
  { value: 'up-to-25', label: 'Up to $25' },
  { value: 'up-to-100', label: 'Up to $100' },
  { value: 'flexible', label: 'Flexible / show all options' },
];

export const US_STATES: LabeledOption[] = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'DC', label: 'Washington, D.C.' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
  { value: 'outside-us', label: 'Outside the United States' },
];
