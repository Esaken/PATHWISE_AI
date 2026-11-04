export type LearnerType = 'high-school' | 'university' | 'adult';

export type HighSchoolGrade = '9th' | '10th' | '11th' | '12th';

export type HighSchoolGoal =
  | 'prepare-college'
  | 'explore-credit'
  | 'build-career-skills'
  | 'explore-career-pathways';

export type UniversityGoal =
  | 'explore-credit'
  | 'prepare-certification'
  | 'build-job-skills'
  | 'prepare-internships'
  | 'explore-career-pathways';

export type AdultGoal =
  | 'prepare-certification'
  | 'job-training'
  | 'build-general-skills'
  | 'change-career';

export type BudgetPreference = 'free' | 'up-to-25' | 'up-to-100' | 'flexible';

export type HighSchoolAnswers = {
  learnerType: 'high-school';
  grade: HighSchoolGrade | null;
  careerInterest: string | null;
  goal: HighSchoolGoal | null;
  budget: BudgetPreference | null;
};

export type UniversityAnswers = {
  learnerType: 'university';
  studyArea: string | null;
  careerInterest: string | null;
  goal: UniversityGoal | null;
  budget: BudgetPreference | null;
  institutionName: string;
};

export type AdultAnswers = {
  learnerType: 'adult';
  careerGoal: string | null;
  careerGoalOther: string;
  goal: AdultGoal | null;
  budget: BudgetPreference | null;
  stateRegion: string | null;
};

export type OnboardingAnswers = HighSchoolAnswers | UniversityAnswers | AdultAnswers;

export type StepErrors = Partial<Record<string, string>>;

export type WizardStep = 1 | 2 | 3 | 'review' | 'complete';

export type WizardState = {
  step: WizardStep;
  answers: OnboardingAnswers;
  errors: StepErrors;
  editingFromReview: boolean;
  answerSnapshot: OnboardingAnswers | null;
};
