import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

import { useSession } from '@/context/SessionContext';
import {
  BackHandler,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  type ViewStyle,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ADULT_CAREER_GOALS,
  ADULT_GOALS,
  BUDGET_OPTIONS,
  CAREER_INTERESTS,
  HIGH_SCHOOL_GRADES,
  HIGH_SCHOOL_GOALS,
  UNIVERSITY_GOALS,
  UNIVERSITY_STUDY_AREAS,
  US_STATES,
} from '@/constants/onboardingOptions';
import { BrandColors } from '@/constants/theme';
import type {
  AdultAnswers,
  BudgetPreference,
  HighSchoolAnswers,
  LearnerType,
  OnboardingAnswers,
  StepErrors,
  UniversityAnswers,
  WizardState,
  WizardStep,
} from '@/types/onboarding';
import { hasErrors, trimText, validateStep } from '@/utils/onboardingValidation';
import { ChoiceGroup } from '@/components/onboarding/ChoiceGroup';
import { ReviewRow } from '@/components/onboarding/ReviewRow';
import { StepLayout } from '@/components/onboarding/StepLayout';
import { TextField } from '@/components/onboarding/TextField';

// ─── Web-only focus ring ─────────────────────────────────────────────────────

const webFocusRing =
  Platform.OS === 'web'
    ? ({ boxShadow: '0 0 0 3px #6C5CE7, 0 0 0 5px #fff' } as unknown as ViewStyle)
    : {};

// ─── Browser history helpers (T2-B2) ─────────────────────────────────────────

const STEP_ORDER: WizardStep[] = [1, 2, 3, 'review', 'complete'];

function isForwardStep(from: WizardStep, to: WizardStep): boolean {
  return STEP_ORDER.indexOf(to) > STEP_ORDER.indexOf(from);
}

function isWebHistoryAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.history?.pushState;
}

function isValidWizardStep(v: unknown): v is WizardStep {
  return v === 1 || v === 2 || v === 3 || v === 'review' || v === 'complete';
}

// Call history.back() on web to keep the browser index in sync with wizard Back.
// Falls back to dispatching BACK on native (no browser history API there).
function webHistoryBack(fallback: () => void): void {
  if (isWebHistoryAvailable()) {
    window.history.back();
  } else {
    fallback();
  }
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_FIELD'; field: string; value: string | null }
  | { type: 'NEXT'; errors: StepErrors }
  | { type: 'BACK' }
  | { type: 'EDIT_FROM_REVIEW'; step: 1 | 2 | 3 }
  | { type: 'SUBMIT' }
  | { type: 'SET_ERRORS'; errors: StepErrors }
  | { type: 'NAV_TO_STEP'; step: WizardStep };

function makeInitialAnswers(learnerType: LearnerType): OnboardingAnswers {
  if (learnerType === 'high-school') {
    return {
      learnerType,
      grade: null,
      careerInterest: null,
      goal: null,
      budget: null,
    } satisfies HighSchoolAnswers;
  }
  if (learnerType === 'university') {
    return {
      learnerType,
      studyArea: null,
      careerInterest: null,
      goal: null,
      budget: null,
      institutionName: '',
    } satisfies UniversityAnswers;
  }
  return {
    learnerType,
    careerGoal: null,
    careerGoalOther: '',
    goal: null,
    budget: null,
    stateRegion: null,
  } satisfies AdultAnswers;
}

function wizardReducer(state: WizardState, action: Action): WizardState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        answers: { ...state.answers, [action.field]: action.value } as OnboardingAnswers,
        errors: { ...state.errors, [action.field]: undefined },
      };

    case 'SET_ERRORS':
      return { ...state, errors: action.errors };

    case 'NEXT': {
      if (hasErrors(action.errors)) {
        return { ...state, errors: action.errors };
      }
      if (state.editingFromReview) {
        // Save: commit the edited answers (already in state.answers) and clear snapshot.
        return { ...state, step: 'review', editingFromReview: false, errors: {}, answerSnapshot: null };
      }
      const nextMap: Record<WizardStep, WizardStep> = {
        1: 2,
        2: 3,
        3: 'review',
        review: 'complete',
        complete: 'complete',
      };
      return { ...state, step: nextMap[state.step], errors: {} };
    }

    case 'BACK': {
      if (state.editingFromReview) {
        // Cancel: restore answers from the snapshot taken when edit mode opened.
        return {
          ...state,
          step: 'review',
          editingFromReview: false,
          errors: {},
          answers: state.answerSnapshot ?? state.answers,
          answerSnapshot: null,
        };
      }
      const backMap: Partial<Record<WizardStep, WizardStep>> = { 2: 1, 3: 2, review: 3 };
      const prevStep = backMap[state.step];
      return { ...state, step: prevStep ?? state.step, errors: {} };
    }

    case 'EDIT_FROM_REVIEW':
      // Snapshot current answers so Cancel can restore them.
      return { ...state, step: action.step, editingFromReview: true, errors: {}, answerSnapshot: state.answers };

    case 'SUBMIT':
      return { ...state, step: 'complete', errors: {} };

    case 'NAV_TO_STEP':
      // Browser Back/Forward. If editing, treat as implicit Cancel and restore snapshot.
      return {
        ...state,
        step: action.step,
        editingFromReview: false,
        errors: {},
        answers: state.answerSnapshot ?? state.answers,
        answerSnapshot: null,
      };

    default:
      return state;
  }
}

// ─── Label helpers ────────────────────────────────────────────────────────────

function findLabel(options: { value: string; label: string }[], value: string | null): string {
  if (!value) return '';
  return options.find((o) => o.value === value)?.label ?? value;
}

const LEARNER_LABELS: Record<LearnerType, string> = {
  'high-school': 'High school',
  university: 'College/University',
  adult: 'Adult learner',
};

// ─── Invalid type fallback ────────────────────────────────────────────────────

function InvalidTypeFallback() {
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.fallbackContent}>
          <Text accessibilityRole="header" style={styles.fallbackHeading}>
            Something went wrong
          </Text>
          <Text style={styles.fallbackBody}>
            We could not find a valid learner path. Please go back and choose one to continue.
          </Text>
          <Pressable
            style={styles.fallbackButton}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/');
              }
            }}
            accessibilityRole="button"
            accessibilityLabel="Return to pathway selection"
            testID="fallback-return-button">
            <Text style={styles.fallbackButtonText}>Return to pathway selection</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────

type StepProps = {
  answers: OnboardingAnswers;
  errors: StepErrors;
  editingFromReview: boolean;
  dispatch: React.Dispatch<Action>;
  onBack: () => void;
};

function Step1({ answers, errors, editingFromReview, dispatch, onBack }: StepProps) {
  function handleNext() {
    const stepErrors = validateStep(1, answers);
    dispatch({ type: 'NEXT', errors: stepErrors });
  }

  const backLabel = editingFromReview ? 'Cancel' : 'Back to welcome';
  const nextLabel = editingFromReview ? 'Save' : 'Next';

  if (answers.learnerType === 'high-school') {
    return (
      <StepLayout
        step={1}
        totalSteps={3}
        heading="Tell us about yourself"
        onBack={onBack}
        backLabel={backLabel}
        onNext={handleNext}
        nextLabel={nextLabel}>
        <ChoiceGroup
          options={HIGH_SCHOOL_GRADES}
          selected={answers.grade}
          onSelect={(v) => dispatch({ type: 'SET_FIELD', field: 'grade', value: v })}
          label="Current grade"
          error={errors.grade}
          testID="grade-choice"
        />
      </StepLayout>
    );
  }

  if (answers.learnerType === 'university') {
    return (
      <StepLayout
        step={1}
        totalSteps={3}
        heading="Tell us about yourself"
        onBack={onBack}
        backLabel={backLabel}
        onNext={handleNext}
        nextLabel={nextLabel}>
        <ChoiceGroup
          options={UNIVERSITY_STUDY_AREAS}
          selected={answers.studyArea}
          onSelect={(v) => dispatch({ type: 'SET_FIELD', field: 'studyArea', value: v })}
          label="Academic program or area of study"
          error={errors.studyArea}
          testID="study-area-choice"
        />
      </StepLayout>
    );
  }

  // adult
  const isOther = answers.careerGoal === 'something-else';
  return (
    <StepLayout
      step={1}
      totalSteps={3}
      heading="Tell us about yourself"
      onBack={onBack}
      backLabel={backLabel}
      onNext={handleNext}
      nextLabel={nextLabel}>
      <ChoiceGroup
        options={ADULT_CAREER_GOALS}
        selected={answers.careerGoal}
        onSelect={(v) => {
          dispatch({ type: 'SET_FIELD', field: 'careerGoal', value: v });
          if (v !== 'something-else') {
            dispatch({ type: 'SET_FIELD', field: 'careerGoalOther', value: '' });
          }
        }}
        label="Career or skill goal"
        error={errors.careerGoal}
        testID="career-goal-choice"
      />
      {isOther && (
        <TextField
          value={answers.careerGoalOther}
          onChange={(v) => dispatch({ type: 'SET_FIELD', field: 'careerGoalOther', value: v })}
          label="Describe your goal"
          placeholder="e.g. Learning a new language"
          maxLength={100}
          error={errors.careerGoalOther}
          testID="career-goal-other"
        />
      )}
    </StepLayout>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────

function Step2({ answers, errors, editingFromReview, dispatch, onBack }: StepProps) {
  function handleNext() {
    const stepErrors = validateStep(2, answers);
    dispatch({ type: 'NEXT', errors: stepErrors });
  }

  const goals =
    answers.learnerType === 'high-school'
      ? HIGH_SCHOOL_GOALS
      : answers.learnerType === 'university'
        ? UNIVERSITY_GOALS
        : ADULT_GOALS;

  return (
    <StepLayout
      step={2}
      totalSteps={3}
      heading="What is your primary goal?"
      onBack={onBack}
      onNext={handleNext}
      nextLabel={editingFromReview ? 'Save' : 'Next'}>
      <ChoiceGroup
        options={goals}
        selected={answers.goal}
        onSelect={(v) => dispatch({ type: 'SET_FIELD', field: 'goal', value: v })}
        label="Primary goal"
        error={errors.goal}
        testID="goal-choice"
      />
    </StepLayout>
  );
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────

function Step3({ answers, errors, editingFromReview, dispatch, onBack }: StepProps) {
  function handleNext() {
    // Trim optional text before validation
    if (answers.learnerType === 'university') {
      const trimmed = trimText(answers.institutionName);
      if (trimmed !== answers.institutionName) {
        dispatch({ type: 'SET_FIELD', field: 'institutionName', value: trimmed });
      }
    }
    const stepErrors = validateStep(3, answers);
    dispatch({ type: 'NEXT', errors: stepErrors });
  }

  if (answers.learnerType === 'high-school') {
    return (
      <StepLayout
        step={3}
        totalSteps={3}
        heading="Your preferences"
        onBack={onBack}
        onNext={handleNext}
        nextLabel={editingFromReview ? 'Save' : 'Next'}>
        <ChoiceGroup
          options={CAREER_INTERESTS}
          selected={answers.careerInterest}
          onSelect={(v) => dispatch({ type: 'SET_FIELD', field: 'careerInterest', value: v })}
          label="Career or field of interest"
          error={errors.careerInterest}
          testID="career-interest-choice"
        />
        <ChoiceGroup
          options={BUDGET_OPTIONS}
          selected={answers.budget}
          onSelect={(v) =>
            dispatch({ type: 'SET_FIELD', field: 'budget', value: v as BudgetPreference })
          }
          label="Budget preference"
          error={errors.budget}
          testID="budget-choice"
        />
      </StepLayout>
    );
  }

  if (answers.learnerType === 'university') {
    return (
      <StepLayout
        step={3}
        totalSteps={3}
        heading="Your preferences"
        onBack={onBack}
        onNext={handleNext}
        nextLabel={editingFromReview ? 'Save' : 'Next'}>
        <ChoiceGroup
          options={CAREER_INTERESTS}
          selected={answers.careerInterest}
          onSelect={(v) => dispatch({ type: 'SET_FIELD', field: 'careerInterest', value: v })}
          label="Career or skill interest"
          error={errors.careerInterest}
          testID="career-interest-choice"
        />
        <ChoiceGroup
          options={BUDGET_OPTIONS}
          selected={answers.budget}
          onSelect={(v) =>
            dispatch({ type: 'SET_FIELD', field: 'budget', value: v as BudgetPreference })
          }
          label="Budget preference"
          error={errors.budget}
          testID="budget-choice"
        />
        <TextField
          value={answers.institutionName}
          onChange={(v) => dispatch({ type: 'SET_FIELD', field: 'institutionName', value: v })}
          label="Institution name"
          placeholder="e.g. University of California"
          maxLength={100}
          optional
          error={errors.institutionName}
          hint="Optional. Never stored or transmitted. Enter a name or leave blank."
          testID="institution-name"
        />
      </StepLayout>
    );
  }

  // adult
  return (
    <StepLayout
      step={3}
      totalSteps={3}
      heading="Your preferences"
      onBack={onBack}
      onNext={handleNext}
      nextLabel={editingFromReview ? 'Save' : 'Next'}>
      <ChoiceGroup
        options={BUDGET_OPTIONS}
        selected={answers.budget}
        onSelect={(v) =>
          dispatch({ type: 'SET_FIELD', field: 'budget', value: v as BudgetPreference })
        }
        label="Budget preference"
        error={errors.budget}
        testID="budget-choice"
      />
      <View style={styles.optionalSection}>
        <Text style={styles.optionalSectionLabel}>State or region (optional)</Text>
        <Text style={styles.optionalSectionHint}>
          Some learning resources and training requirements vary by state. Sharing your general
          region may help surface more relevant options. This is never stored or transmitted.
        </Text>
        <ChoiceGroup
          options={US_STATES}
          selected={answers.stateRegion}
          onSelect={(v) =>
            dispatch({
              type: 'SET_FIELD',
              field: 'stateRegion',
              value: v === answers.stateRegion ? null : v,
            })
          }
          label="State or region"
          testID="state-choice"
        />
      </View>
    </StepLayout>
  );
}

// ─── Review screen ────────────────────────────────────────────────────────────

type ReviewProps = {
  answers: OnboardingAnswers;
  dispatch: React.Dispatch<Action>;
  onBack: () => void;
};

function ReviewScreen({ answers, dispatch, onBack }: ReviewProps) {
  const [submitFocused, setSubmitFocused] = useState(false);

  type ReviewRowDef = {
    label: string;
    value: string;
    step: 1 | 2 | 3;
    optional?: boolean;
    testID: string;
  };

  function getRows(): ReviewRowDef[] {
    if (answers.learnerType === 'high-school') {
      return [
        { label: 'Grade', value: findLabel(HIGH_SCHOOL_GRADES, answers.grade), step: 1, testID: 'review-grade' },
        { label: 'Primary goal', value: findLabel(HIGH_SCHOOL_GOALS, answers.goal), step: 2, testID: 'review-goal' },
        { label: 'Career or field of interest', value: findLabel(CAREER_INTERESTS, answers.careerInterest), step: 3, testID: 'review-career-interest' },
        { label: 'Budget preference', value: findLabel(BUDGET_OPTIONS, answers.budget), step: 3, testID: 'review-budget' },
      ];
    }
    if (answers.learnerType === 'university') {
      return [
        { label: 'Area of study', value: findLabel(UNIVERSITY_STUDY_AREAS, answers.studyArea), step: 1, testID: 'review-study-area' },
        { label: 'Primary goal', value: findLabel(UNIVERSITY_GOALS, answers.goal), step: 2, testID: 'review-goal' },
        { label: 'Career or skill interest', value: findLabel(CAREER_INTERESTS, answers.careerInterest), step: 3, testID: 'review-career-interest' },
        { label: 'Budget preference', value: findLabel(BUDGET_OPTIONS, answers.budget), step: 3, testID: 'review-budget' },
        { label: 'Institution name', value: answers.institutionName.trim() || '—', step: 3, optional: true, testID: 'review-institution' },
      ];
    }
    // adult
    const careerGoalLabel =
      answers.careerGoal === 'something-else'
        ? trimText(answers.careerGoalOther) || 'Something else'
        : findLabel(ADULT_CAREER_GOALS, answers.careerGoal);
    return [
      { label: 'Career or skill goal', value: careerGoalLabel, step: 1, testID: 'review-career-goal' },
      { label: 'Primary goal', value: findLabel(ADULT_GOALS, answers.goal), step: 2, testID: 'review-goal' },
      { label: 'Budget preference', value: findLabel(BUDGET_OPTIONS, answers.budget), step: 3, testID: 'review-budget' },
      { label: 'State or region', value: answers.stateRegion ? findLabel(US_STATES, answers.stateRegion) : '—', step: 3, optional: true, testID: 'review-state' },
    ];
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.centerRow}>
            <View style={styles.reviewContent}>
              <View style={styles.reviewHeader}>
                <Text accessibilityRole="header" style={styles.reviewHeading}>
                  Review your answers
                </Text>
                <Text style={styles.reviewSubheading}>
                  Check your selections before you finish. Use Edit to change any answer.
                </Text>
              </View>

              <View style={styles.reviewCard}>
                {getRows().map((row) => (
                  <ReviewRow
                    key={row.testID}
                    label={row.label}
                    value={row.value}
                    optional={row.optional}
                    onEdit={() => dispatch({ type: 'EDIT_FROM_REVIEW', step: row.step })}
                    testID={row.testID}
                  />
                ))}
              </View>

              <View style={styles.reviewActions}>
                <Pressable
                  onPress={() => dispatch({ type: 'SUBMIT' })}
                  onFocus={() => setSubmitFocused(true)}
                  onBlur={() => setSubmitFocused(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Submit and finish onboarding"
                  style={[
                    styles.submitButton,
                    submitFocused && styles.submitButtonFocused,
                    submitFocused && webFocusRing,
                  ]}
                  testID="submit-button">
                  <Text style={styles.submitText}>Looks good — finish</Text>
                </Pressable>
                <Pressable
                  onPress={onBack}
                  accessibilityRole="button"
                  accessibilityLabel="Back to step 3"
                  style={styles.reviewBackButton}>
                  <Text style={styles.reviewBackText}>← Back</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Completion screen ────────────────────────────────────────────────────────

function CompletionScreen({ learnerType }: { learnerType: LearnerType }) {
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.centerRow}>
            <View style={styles.completionContent}>
              <View style={styles.completionIcon}>
                <Text style={styles.completionEmoji}>🎉</Text>
              </View>
              <Text accessibilityRole="header" style={styles.completionHeading}>
                {"You're all set!"}
              </Text>
              <Text style={styles.completionBody}>
                Your {LEARNER_LABELS[learnerType]} profile is ready. No account was created and
                none of your answers have been stored or transmitted.
              </Text>
              <View style={styles.completionCard}>
                <Text style={styles.completionCardTitle}>What comes next</Text>
                <Text style={styles.completionCardBody}>
                  Pathwise AI will now show personalized healthcare career pathways and
                  opportunity recommendations based on your selections. You can browse the full
                  catalog at any time.
                </Text>
              </View>
              <Pressable
                onPress={() => router.replace('/')}
                accessibilityRole="button"
                accessibilityLabel="Return to pathway selection"
                style={styles.completionButton}
                testID="completion-return-button">
                <Text style={styles.completionButtonText}>Return to pathway selection</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Wizard root ──────────────────────────────────────────────────────────────

const VALID_TYPES: LearnerType[] = ['high-school', 'university', 'adult'];

export function generateStaticParams() {
  return VALID_TYPES.map((type) => ({ type }));
}

export default function OnboardingWizard() {
  const { type } = useLocalSearchParams<{ type: string }>();

  const learnerType: LearnerType | null = VALID_TYPES.includes(type as LearnerType)
    ? (type as LearnerType)
    : null;

  const [state, dispatch] = useReducer(wizardReducer, {
    step: 1 as WizardStep,
    answers: makeInitialAnswers(learnerType ?? 'high-school'),
    errors: {},
    editingFromReview: false,
    answerSnapshot: null,
  });

  const { setAnswers } = useSession();

  const handleBackStep1 = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }, []);

  // ─── T2-B2: Browser history synchronization ───────────────────────────────

  // Stamp the initial history entry with the wizard step so browser Back can
  // return to previous steps without exposing answers in the URL.
  useEffect(() => {
    if (!isWebHistoryAvailable()) return;
    window.history.replaceState({ ...(window.history.state ?? {}), pwStep: 1 }, '');
  }, []);

  // True while processing a popstate event. Suppresses pushState in the
  // step-change effect so browser-driven transitions never create extra entries.
  const isFromPopStateRef = useRef(false);

  // Push a forward history entry when the wizard step advances.
  // Skip when returning from edit-from-review (wasEditing) to avoid duplicates.
  // Skip entirely when the step change originated from a popstate event.
  const prevStateRef = useRef({ step: state.step as WizardStep, editingFromReview: false });
  useEffect(() => {
    if (!isWebHistoryAvailable()) return;
    const { step: prevStep, editingFromReview: wasEditing } = prevStateRef.current;
    prevStateRef.current = { step: state.step, editingFromReview: state.editingFromReview };
    if (prevStep === state.step) return;
    if (isFromPopStateRef.current) {
      isFromPopStateRef.current = false;
      return;
    }
    if (isForwardStep(prevStep, state.step) && !wasEditing) {
      window.history.pushState({ ...(window.history.state ?? {}), pwStep: state.step }, '');
    }
  }, [state.step, state.editingFromReview]);

  // Intercept browser Back/Forward: if the target history entry has a pwStep
  // marker we placed, navigate the wizard to that step instead of leaving.
  useEffect(() => {
    if (!isWebHistoryAvailable()) return;
    function handlePopState(e: PopStateEvent) {
      const raw = (e.state as Record<string, unknown> | null)?.pwStep;
      if (isValidWizardStep(raw)) {
        isFromPopStateRef.current = true;
        dispatch({ type: 'NAV_TO_STEP', step: raw });
      }
    }
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Android hardware Back: dispatch BACK within the wizard; only let it
  // propagate on step 1 (exits onboarding to the welcome screen).
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (state.step === 1 && !state.editingFromReview) return false;
      dispatch({ type: 'BACK' });
      return true;
    });
    return () => sub.remove();
  }, [state.step, state.editingFromReview]);

  // On completion, store answers in session and open catalog results.
  useEffect(() => {
    if (state.step === 'complete') {
      setAnswers(state.answers);
      router.replace('/healthcare' as any);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.step]);

  // Unified in-app Back handler.
  // - Step 1 (non-editing): exit onboarding via router.
  // - Edit-cancel (editingFromReview): return to Review without touching browser history
  //   (edit paths don't push history, so there's nothing to sync).
  // - All other steps on web: call history.back() so the browser index moves in
  //   lockstep with the wizard; the resulting popstate will dispatch NAV_TO_STEP.
  // - All other steps on native: dispatch BACK directly (no browser history API).
  const handleBack = useCallback(() => {
    if (state.step === 1 && !state.editingFromReview) {
      handleBackStep1();
      return;
    }
    if (state.editingFromReview) {
      dispatch({ type: 'BACK' });
      return;
    }
    webHistoryBack(() => dispatch({ type: 'BACK' }));
  }, [state.step, state.editingFromReview, handleBackStep1]);

  if (!learnerType) return <InvalidTypeFallback />;

  if (state.step === 'complete') {
    return <CompletionScreen learnerType={learnerType} />;
  }

  if (state.step === 'review') {
    return (
      <ReviewScreen
        answers={state.answers}
        dispatch={dispatch}
        onBack={handleBack}
      />
    );
  }

  const stepProps: StepProps = {
    answers: state.answers,
    errors: state.errors,
    editingFromReview: state.editingFromReview,
    dispatch,
    onBack: handleBack,
  };

  if (state.step === 1) return <Step1 {...stepProps} />;
  if (state.step === 2) return <Step2 {...stepProps} />;
  return <Step3 {...stepProps} />;
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BrandColors.surface,
  },
  safe: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    width: '100%',
  },
  centerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  fallbackContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    gap: 20,
    alignItems: 'flex-start',
  },
  fallbackHeading: {
    fontSize: 26,
    fontWeight: '800',
    color: BrandColors.textPrimary,
  },
  fallbackBody: {
    fontSize: 16,
    lineHeight: 24,
    color: BrandColors.textSecondary,
  },
  fallbackButton: {
    backgroundColor: BrandColors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  reviewContent: {
    flex: 1,
    maxWidth: 720,
    minWidth: 0,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
    gap: 24,
  },
  reviewHeader: {
    gap: 8,
  },
  reviewHeading: {
    fontSize: 26,
    fontWeight: '800',
    color: BrandColors.textPrimary,
    letterSpacing: -0.4,
  },
  reviewSubheading: {
    fontSize: 15,
    lineHeight: 22,
    color: BrandColors.textSecondary,
  },
  reviewCard: {
    backgroundColor: BrandColors.cardBg,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: BrandColors.cardBorderDefault,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  reviewActions: {
    gap: 12,
  },
  submitButton: {
    backgroundColor: BrandColors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  submitButtonFocused: {
    backgroundColor: BrandColors.primaryDark,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  reviewBackButton: {
    paddingVertical: 12,
    alignItems: 'center',
    minHeight: 44,
  },
  reviewBackText: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.textSecondary,
  },
  completionContent: {
    flex: 1,
    maxWidth: 720,
    minWidth: 0,
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 48,
    gap: 20,
    alignItems: 'flex-start',
  },
  completionIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: BrandColors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionEmoji: {
    fontSize: 36,
  },
  completionHeading: {
    fontSize: 30,
    fontWeight: '800',
    color: BrandColors.textPrimary,
    letterSpacing: -0.4,
  },
  completionBody: {
    fontSize: 16,
    lineHeight: 24,
    color: BrandColors.textSecondary,
  },
  completionCard: {
    backgroundColor: BrandColors.cardBg,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: BrandColors.cardBorderDefault,
    padding: 20,
    gap: 10,
    alignSelf: 'stretch',
  },
  completionCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.textPrimary,
  },
  completionCardBody: {
    fontSize: 14,
    lineHeight: 22,
    color: BrandColors.textSecondary,
  },
  completionButton: {
    backgroundColor: BrandColors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    alignSelf: 'stretch',
  },
  completionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  optionalSection: {
    gap: 8,
  },
  optionalSectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.textPrimary,
  },
  optionalSectionHint: {
    fontSize: 13,
    lineHeight: 18,
    color: BrandColors.textSecondary,
  },
});
