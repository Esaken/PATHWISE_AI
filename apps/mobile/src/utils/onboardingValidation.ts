import type { OnboardingAnswers, StepErrors } from '@/types/onboarding';

export function validateStep1(answers: OnboardingAnswers): StepErrors {
  const errors: StepErrors = {};
  switch (answers.learnerType) {
    case 'high-school':
      if (!answers.grade) {
        errors.grade = 'Please select your current grade to continue.';
      }
      break;
    case 'university':
      if (!answers.studyArea) {
        errors.studyArea = 'Please select your area of study to continue.';
      }
      break;
    case 'adult':
      if (!answers.careerGoal) {
        errors.careerGoal = 'Please select a career or skill goal to continue.';
      } else if (answers.careerGoal === 'something-else') {
        const trimmed = answers.careerGoalOther.trim();
        if (!trimmed) {
          errors.careerGoalOther = 'Please describe your goal to continue.';
        } else if (trimmed.length > 100) {
          errors.careerGoalOther = 'Please keep your response to 100 characters or fewer.';
        }
      }
      break;
  }
  return errors;
}

export function validateStep2(answers: OnboardingAnswers): StepErrors {
  const errors: StepErrors = {};
  if (!answers.goal) {
    errors.goal = 'Please select a primary goal to continue.';
  }
  return errors;
}

export function validateStep3(answers: OnboardingAnswers): StepErrors {
  const errors: StepErrors = {};
  switch (answers.learnerType) {
    case 'high-school':
      if (!answers.careerInterest) {
        errors.careerInterest = 'Please select a career or field of interest to continue.';
      }
      if (!answers.budget) {
        errors.budget = 'Please select a budget preference to continue.';
      }
      break;
    case 'university':
      if (!answers.careerInterest) {
        errors.careerInterest = 'Please select a career or skill interest to continue.';
      }
      if (!answers.budget) {
        errors.budget = 'Please select a budget preference to continue.';
      }
      if (answers.institutionName.trim().length > 100) {
        errors.institutionName = 'Institution name must be 100 characters or fewer.';
      }
      break;
    case 'adult':
      if (!answers.budget) {
        errors.budget = 'Please select a budget preference to continue.';
      }
      break;
  }
  return errors;
}

export function validateStep(step: 1 | 2 | 3, answers: OnboardingAnswers): StepErrors {
  if (step === 1) return validateStep1(answers);
  if (step === 2) return validateStep2(answers);
  return validateStep3(answers);
}

export function hasErrors(errors: StepErrors): boolean {
  return Object.values(errors).some((v) => v !== undefined && v !== '');
}

export function trimText(value: string): string {
  return value.trim();
}
