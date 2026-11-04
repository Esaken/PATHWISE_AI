/**
 * Integration tests for the OnboardingWizard component covering all three learner
 * pathways, required-field validation, back/next navigation, edit-from-review
 * answer preservation, review summary accuracy, safe completion, and the invalid
 * learner type fallback.
 *
 * Notes:
 * - @testing-library/react-native v14 render() is async (returns Promise)
 * - userEvent is used instead of fireEvent for reliable act() flushing with React 19
 */
import React from 'react';
import { act, render, userEvent } from '@testing-library/react-native';
import { useLocalSearchParams } from 'expo-router';
import OnboardingWizard from '@/app/onboarding/[type]';

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  router: {
    back: jest.fn(),
    replace: jest.fn(),
    canGoBack: jest.fn(() => true),
  },
}));

jest.mock('react-native-safe-area-context', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, ...rest }: { children: React.ReactNode }) => (
      <View {...rest}>{children}</View>
    ),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

jest.mock('expo-status-bar', () => ({ StatusBar: () => null }));

const mockedRouter = (jest.requireMock('expo-router') as {
  router: { back: jest.Mock; replace: jest.Mock; canGoBack: jest.Mock };
}).router;

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Api = Awaited<ReturnType<typeof render>>;

function setLearnerType(type: string) {
  (useLocalSearchParams as jest.Mock).mockReturnValue({ type });
}

async function renderWizard(): Promise<Api> {
  return render(<OnboardingWizard />);
}

function setupUser() {
  return userEvent.setup();
}

beforeEach(() => {
  mockedRouter.canGoBack.mockReturnValue(true);
  setLearnerType('high-school');
});

afterEach(() => jest.clearAllMocks());

// ─── Invalid learner type ─────────────────────────────────────────────────────

describe('invalid learner type', () => {
  beforeEach(() => setLearnerType('not-valid'));

  it('renders a fallback screen without crashing', async () => {
    const api = await renderWizard();
    expect(api.getByText(/something went wrong/i)).toBeTruthy();
  });

  it('shows a recovery action', async () => {
    const api = await renderWizard();
    expect(api.getByTestId('fallback-return-button')).toBeTruthy();
  });

  it('calls router.back when the recovery button is pressed', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByTestId('fallback-return-button'));
    expect(mockedRouter.back).toHaveBeenCalled();
  });
});

// ─── High-school happy path ───────────────────────────────────────────────────

describe('high-school happy path', () => {
  beforeEach(() => setLearnerType('high-school'));

  it('renders step 1 with grade choices', async () => {
    const api = await renderWizard();
    expect(api.getByText('10th grade')).toBeTruthy();
  });

  it('shows step progress Step 1 of 3', async () => {
    const api = await renderWizard();
    expect(api.getAllByText(/step 1 of 3/i).length).toBeGreaterThan(0);
  });

  it('requires grade before advancing', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByTestId('step-next-button'));
    expect(api.getByText(/please select your current grade/i)).toBeTruthy();
  });

  it('advances to step 2 after selecting grade', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('10th grade'));
    await user.press(api.getByTestId('step-next-button'));
    expect(api.getByText(/what is your primary goal/i)).toBeTruthy();
  });

  it('requires goal before advancing from step 2', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('10th grade'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByTestId('step-next-button'));
    expect(api.getByText(/please select a primary goal/i)).toBeTruthy();
  });

  it('advances to step 3 after selecting goal', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('10th grade'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Prepare for college'));
    await user.press(api.getByTestId('step-next-button'));
    expect(api.getByText(/your preferences/i)).toBeTruthy();
  });

  it('requires careerInterest before advancing from step 3', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('10th grade'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Prepare for college'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByTestId('step-next-button'));
    expect(api.getByText(/please select a career or field of interest/i)).toBeTruthy();
  });

  it('requires budget before advancing from step 3', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('10th grade'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Prepare for college'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Technology & Computing'));
    await user.press(api.getByTestId('step-next-button'));
    expect(api.getByText(/please select a budget preference/i)).toBeTruthy();
  });

  it('advances to review after completing step 3', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('10th grade'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Prepare for college'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Technology & Computing'));
    await user.press(api.getByText('Free only'));
    await user.press(api.getByTestId('step-next-button'));
    expect(api.getByText(/review your answers/i)).toBeTruthy();
  });

  it('review shows correct grade', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('10th grade'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Prepare for college'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Technology & Computing'));
    await user.press(api.getByText('Free only'));
    await user.press(api.getByTestId('step-next-button'));
    expect(api.getByTestId('review-grade')).toBeTruthy();
    expect(api.getByText('10th grade')).toBeTruthy();
  });

  it('review shows correct goal', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('10th grade'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Prepare for college'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Technology & Computing'));
    await user.press(api.getByText('Free only'));
    await user.press(api.getByTestId('step-next-button'));
    expect(api.getByText('Prepare for college')).toBeTruthy();
  });

  it('review shows correct budget', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('10th grade'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Prepare for college'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Technology & Computing'));
    await user.press(api.getByText('Free only'));
    await user.press(api.getByTestId('step-next-button'));
    expect(api.getByText('Free only')).toBeTruthy();
  });

  it('submitting from review shows completion screen', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('10th grade'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Prepare for college'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Technology & Computing'));
    await user.press(api.getByText('Free only'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByTestId('submit-button'));
    expect(api.getByText(/you're all set/i)).toBeTruthy();
  });

  it('completion screen does not fabricate a roadmap', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('10th grade'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Prepare for college'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Technology & Computing'));
    await user.press(api.getByText('Free only'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByTestId('submit-button'));
    expect(api.getByText(/not yet available/i)).toBeTruthy();
  });
});

// ─── High-school back navigation ──────────────────────────────────────────────

describe('high-school back navigation', () => {
  beforeEach(() => setLearnerType('high-school'));

  it('back on step 1 calls router.back when canGoBack is true', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('Back to welcome'));
    expect(mockedRouter.back).toHaveBeenCalled();
  });

  it('back on step 2 returns to step 1', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('10th grade'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Back'));
    expect(api.getByText(/tell us about yourself/i)).toBeTruthy();
  });
});

// ─── High-school edit from review ─────────────────────────────────────────────

describe('high-school edit from review', () => {
  beforeEach(() => setLearnerType('high-school'));

  async function reachReview(): Promise<[Api, ReturnType<typeof setupUser>]> {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('10th grade'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Prepare for college'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Technology & Computing'));
    await user.press(api.getByText('Free only'));
    await user.press(api.getByTestId('step-next-button'));
    return [api, user];
  }

  it('edit grade returns to step 1', async () => {
    const [api, user] = await reachReview();
    await user.press(api.getByTestId('review-grade-edit'));
    expect(api.getByText(/tell us about yourself/i)).toBeTruthy();
  });

  it('after editing grade and saving, returns to review', async () => {
    const [api, user] = await reachReview();
    await user.press(api.getByTestId('review-grade-edit'));
    await user.press(api.getByText('12th grade'));
    await user.press(api.getByTestId('step-next-button'));
    expect(api.getByText(/review your answers/i)).toBeTruthy();
  });

  it('changed grade is reflected in review after edit', async () => {
    const [api, user] = await reachReview();
    await user.press(api.getByTestId('review-grade-edit'));
    await user.press(api.getByText('12th grade'));
    await user.press(api.getByTestId('step-next-button'));
    expect(api.getByText('12th grade')).toBeTruthy();
  });

  it('other answers preserved when only grade is edited', async () => {
    const [api, user] = await reachReview();
    await user.press(api.getByTestId('review-grade-edit'));
    await user.press(api.getByText('12th grade'));
    await user.press(api.getByTestId('step-next-button'));
    expect(api.getByText('Free only')).toBeTruthy();
    expect(api.getByText('Technology & Computing')).toBeTruthy();
  });
});

// ─── University happy path ────────────────────────────────────────────────────

describe('university happy path', () => {
  beforeEach(() => setLearnerType('university'));

  it('renders step 1 with study area choices', async () => {
    const api = await renderWizard();
    expect(api.getByText('Engineering')).toBeTruthy();
  });

  it('requires study area before advancing', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByTestId('step-next-button'));
    expect(api.getByText(/please select your area of study/i)).toBeTruthy();
  });

  it('advances to step 2 after selecting study area', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('Engineering'));
    await user.press(api.getByTestId('step-next-button'));
    expect(api.getByText(/what is your primary goal/i)).toBeTruthy();
  });

  it('shows certification qualifier on goal step', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('Engineering'));
    await user.press(api.getByTestId('step-next-button'));
    expect(api.getByText(/do not guarantee eligibility/i)).toBeTruthy();
  });

  it('requires careerInterest on step 3', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('Engineering'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Build job-relevant skills'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByTestId('step-next-button'));
    expect(api.getByText(/please select a career or skill interest/i)).toBeTruthy();
  });

  it('institution name is optional — step 3 passes without it', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('Engineering'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Build job-relevant skills'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Technology & Computing'));
    await user.press(api.getByText('Up to $25'));
    await user.press(api.getByTestId('step-next-button'));
    expect(api.getByText(/review your answers/i)).toBeTruthy();
  });

  it('review shows institution row', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('Engineering'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Build job-relevant skills'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Technology & Computing'));
    await user.press(api.getByText('Up to $25'));
    await user.press(api.getByTestId('step-next-button'));
    expect(api.getByTestId('review-institution')).toBeTruthy();
  });

  it('submitting reaches completion', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('Engineering'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Build job-relevant skills'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Technology & Computing'));
    await user.press(api.getByText('Up to $25'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByTestId('submit-button'));
    expect(api.getByText(/you're all set/i)).toBeTruthy();
  });
});

// ─── Adult happy path ─────────────────────────────────────────────────────────

describe('adult happy path', () => {
  beforeEach(() => setLearnerType('adult'));

  it('renders step 1 with career goal choices', async () => {
    const api = await renderWizard();
    expect(api.getByText('Technology or computing skills')).toBeTruthy();
  });

  it('requires career goal before advancing', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByTestId('step-next-button'));
    expect(api.getByText(/please select a career or skill goal/i)).toBeTruthy();
  });

  it('shows something-else text field when that option is selected', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('Something else'));
    expect(api.getByTestId('career-goal-other-input')).toBeTruthy();
  });

  it('requires non-empty text for something-else goal', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('Something else'));
    await user.press(api.getByTestId('step-next-button'));
    expect(api.getByText(/please describe your goal/i)).toBeTruthy();
  });

  it('advances from step 1 when something-else has valid text', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('Something else'));
    await user.type(api.getByTestId('career-goal-other-input'), 'Learning to paint');
    await user.press(api.getByTestId('step-next-button'));
    expect(api.getByText(/what is your primary goal/i)).toBeTruthy();
  });

  it('requires budget before advancing from step 3', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('Technology or computing skills'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Build general skills'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByTestId('step-next-button'));
    expect(api.getByText(/please select a budget preference/i)).toBeTruthy();
  });

  it('stateRegion is optional — step 3 passes without it', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('Technology or computing skills'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Build general skills'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Flexible / show all options'));
    await user.press(api.getByTestId('step-next-button'));
    expect(api.getByText(/review your answers/i)).toBeTruthy();
  });

  it('review shows state row', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('Technology or computing skills'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Build general skills'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Flexible / show all options'));
    await user.press(api.getByTestId('step-next-button'));
    expect(api.getByTestId('review-state')).toBeTruthy();
  });

  it('submitting reaches completion', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('Technology or computing skills'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Build general skills'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Flexible / show all options'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByTestId('submit-button'));
    expect(api.getByText(/you're all set/i)).toBeTruthy();
  });
});

// ─── No double-submission ─────────────────────────────────────────────────────

describe('no double submission', () => {
  beforeEach(() => setLearnerType('high-school'));

  it('completion screen does not show submit button again', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('10th grade'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Prepare for college'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Technology & Computing'));
    await user.press(api.getByText('Free only'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByTestId('submit-button'));
    expect(api.queryByTestId('submit-button')).toBeNull();
  });
});

// ─── Privacy: no prohibited fields in rendered output ─────────────────────────

describe('privacy', () => {
  it('high-school flow does not ask for school name', async () => {
    const user = setupUser();
    setLearnerType('high-school');
    const api = await renderWizard();
    await user.press(api.getByText('10th grade'));
    await user.press(api.getByTestId('step-next-button'));
    await user.press(api.getByText('Prepare for college'));
    await user.press(api.getByTestId('step-next-button'));
    expect(api.queryByText(/school name/i)).toBeNull();
  });

  it('no email field in any flow', async () => {
    setLearnerType('adult');
    const api = await renderWizard();
    expect(api.queryByText(/email/i)).toBeNull();
  });
});

// ─── T2-B1: ChoiceGroup roving tabIndex ──────────────────────────────────────
// RNTL notes:
//  - tabIndex appears in r.props.tabIndex (passed through, no native mapping)
//  - aria-checked is mapped to accessibilityState.checked by React Native

describe('ChoiceGroup roving tabIndex (T2-B1)', () => {
  beforeEach(() => setLearnerType('high-school'));

  it('first radio has tabIndex=0 when no option is selected', async () => {
    const api = await renderWizard();
    const radios = api.getAllByRole('radio');
    expect(radios[0].props.tabIndex).toBe(0);
  });

  it('non-first radios have tabIndex=-1 when no option is selected', async () => {
    const api = await renderWizard();
    const radios = api.getAllByRole('radio');
    expect(radios.slice(1).every((r) => r.props.tabIndex === -1)).toBe(true);
  });

  it('selected radio gets tabIndex=0', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('10th grade'));
    const radios = api.getAllByRole('radio');
    // aria-checked is mapped to accessibilityState.checked in RNTL
    const selectedIdx = radios.findIndex((r) => r.props.accessibilityState?.checked === true);
    expect(selectedIdx).toBeGreaterThanOrEqual(0);
    expect(radios[selectedIdx].props.tabIndex).toBe(0);
  });

  it('unselected radios have tabIndex=-1 after a selection is made', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('10th grade'));
    const radios = api.getAllByRole('radio');
    const unselected = radios.filter((r) => r.props.accessibilityState?.checked !== true);
    expect(unselected.every((r) => r.props.tabIndex === -1)).toBe(true);
  });
});

// ─── T2-B2: Browser history synchronization ──────────────────────────────────
// The React Native test environment has no window.history or PopStateEvent, so
// we install minimal mocks. The component's history effects gate on
// isWebHistoryAvailable() — once window.history.pushState is defined, the
// effects run and we can verify they call the mocks, and trigger popstate by
// calling the captured listener directly.

describe('browser history synchronization (T2-B2)', () => {
  const mockPushState = jest.fn();
  const mockReplaceState = jest.fn();
  const mockRemoveEventListener = jest.fn();
  let capturedPopstateHandler: ((e: { state: unknown }) => void) | null = null;
  const g = globalThis as unknown as Record<string, unknown>;

  beforeEach(() => {
    setLearnerType('high-school');
    capturedPopstateHandler = null;
    mockPushState.mockClear();
    mockReplaceState.mockClear();

    g.history = {
      state: null as unknown,
      pushState: mockPushState,
      replaceState: mockReplaceState,
    };
    g.addEventListener = jest.fn().mockImplementation(
      (event: string, handler: (e: { state: unknown }) => void) => {
        if (event === 'popstate') capturedPopstateHandler = handler;
      }
    );
    g.removeEventListener = mockRemoveEventListener;
  });

  afterEach(() => {
    delete g.history;
    delete g.addEventListener;
    // Keep removeEventListener alive until afterAll — RNTL's cleanup (afterEach)
    // runs after ours and still needs it to unmount the component cleanly.
    mockRemoveEventListener.mockClear();
  });

  afterAll(() => {
    delete g.removeEventListener;
  });

  it('stamps initial history entry with pwStep: 1 on mount', async () => {
    await renderWizard();
    expect(mockReplaceState).toHaveBeenCalledWith(
      expect.objectContaining({ pwStep: 1 }),
      ''
    );
  });

  it('pushes history entry with pwStep: 2 when advancing to step 2', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('10th grade'));
    await user.press(api.getByTestId('step-next-button'));
    expect(mockPushState).toHaveBeenCalledWith(
      expect.objectContaining({ pwStep: 2 }),
      ''
    );
  });

  it('does not push history when Next is blocked by validation', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByTestId('step-next-button')); // no selection → fails
    expect(mockPushState).not.toHaveBeenCalled();
  });

  it('does not push history when using in-app Back', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('10th grade'));
    await user.press(api.getByTestId('step-next-button')); // step 2
    mockPushState.mockClear();
    await user.press(api.getByText('Back')); // in-app back → no push
    expect(mockPushState).not.toHaveBeenCalled();
  });

  it('popstate with pwStep: 1 returns wizard to step 1 from step 2', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('10th grade'));
    await user.press(api.getByTestId('step-next-button')); // reach step 2
    await act(async () => {
      capturedPopstateHandler?.({ state: { pwStep: 1 } });
    });
    expect(api.getByText(/tell us about yourself/i)).toBeTruthy();
  });

  it('grade selection is preserved after popstate back to step 1', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('10th grade'));
    await user.press(api.getByTestId('step-next-button'));
    await act(async () => {
      capturedPopstateHandler?.({ state: { pwStep: 1 } });
    });
    const radios = api.getAllByRole('radio');
    const checked = radios.find((r) => r.props.accessibilityState?.checked === true);
    expect(checked).toBeTruthy();
  });

  it('popstate without pwStep does not change wizard state', async () => {
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('10th grade'));
    await user.press(api.getByTestId('step-next-button')); // step 2
    await act(async () => {
      capturedPopstateHandler?.({ state: { someOtherKey: true } });
    });
    expect(api.getByText(/what is your primary goal/i)).toBeTruthy();
  });
});

// ─── T2-B3: Accessibility semantics ──────────────────────────────────────────
// getByRole('radiogroup') is not supported in RNTL (no native mapping for
// radiogroup); use getByTestId('*-group') added to the radiogroup View.

describe('accessibility semantics (T2-B3)', () => {
  it('choice group radiogroup has aria-required', async () => {
    setLearnerType('high-school');
    const api = await renderWizard();
    const group = api.getByTestId('grade-choice-group');
    expect(group.props['aria-required']).toBe(true);
  });

  it('choice group has no aria-invalid before any interaction', async () => {
    setLearnerType('high-school');
    const api = await renderWizard();
    const group = api.getByTestId('grade-choice-group');
    expect(group.props['aria-invalid']).toBeFalsy();
  });

  it('choice group has aria-invalid=true after attempted Next with no selection', async () => {
    setLearnerType('high-school');
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByTestId('step-next-button'));
    const group = api.getByTestId('grade-choice-group');
    expect(group.props['aria-invalid']).toBe(true);
  });

  it('aria-invalid clears once a valid selection is made', async () => {
    setLearnerType('high-school');
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByTestId('step-next-button')); // trigger error
    await user.press(api.getByText('10th grade'));          // clear by selecting
    const group = api.getByTestId('grade-choice-group');
    expect(group.props['aria-invalid']).toBeFalsy();
  });

  it('error text nativeID matches radiogroup aria-describedby', async () => {
    setLearnerType('high-school');
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByTestId('step-next-button'));
    const group = api.getByTestId('grade-choice-group');
    const describedById = group.props['aria-describedby'] as string | undefined;
    expect(describedById).toBeTruthy();
    const errorText = api.getByTestId('grade-choice-error-text');
    expect(errorText.props.nativeID).toBe(describedById);
  });

  it('something-else textfield has aria-required', async () => {
    setLearnerType('adult');
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('Something else'));
    const input = api.getByTestId('career-goal-other-input');
    expect(input.props['aria-required']).toBe(true);
  });

  it('something-else textfield has aria-invalid after failed validation', async () => {
    setLearnerType('adult');
    const user = setupUser();
    const api = await renderWizard();
    await user.press(api.getByText('Something else'));
    await user.press(api.getByTestId('step-next-button'));
    const input = api.getByTestId('career-goal-other-input');
    expect(input.props['aria-invalid']).toBe(true);
  });
});
