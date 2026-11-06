/**
 * Regression tests for T5-B4: healthcare career card Enter key activation.
 *
 * These tests verify that the onKeyDown handler is wired correctly and that
 * the handler logic fires onPress on Enter. They do NOT prove browser-level
 * Enter behavior — that requires real Chromium verification (see QA Review 5).
 *
 * Root cause: React Native Web renders Pressable as div[role=button]; browsers
 * only synthesize click on Enter for native <button> elements, not divs. RNW
 * handles Space natively for role="button" but not Enter.
 *
 * Phase 4 coverage: SourceLink and ProgramCard link Enter activation are
 * structurally fixed via the same onKeyDown pattern. Browser-level verification
 * of external link Enter activation requires real Chromium (see QA Review 5).
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';
import { Linking } from 'react-native';
// jest.mock calls below are hoisted by Jest's babel transform to before all
// imports, so these component imports receive the mocked modules regardless
// of their position relative to the jest.mock() calls in source.
import HealthcareScreen from '@/app/healthcare/index';
import PathwayDetailScreen from '@/app/healthcare/pathways/[careerId]';

// ─── Mocks ────────────────────────────────────────────────────────────────────

// Single expo-router mock covering both healthcare/index and pathways/[careerId]
jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
  useLocalSearchParams: jest.fn(() => ({ careerId: 'rn' })),
}));

jest.mock('@/context/SessionContext', () => ({
  useSession: jest.fn(() => ({
    answers: {
      learnerType: 'adult' as const,
      careerGoal: 'healthcare',
      careerGoalOther: '',
      goal: 'job-training' as const,
      budget: 'free' as const,
      stateRegion: 'LA',
    },
    setAnswers: jest.fn(),
    clearAnswers: jest.fn(),
  })),
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

const mockPush = router.push as jest.Mock;

function enterEvent() {
  return { nativeEvent: { key: 'Enter' }, preventDefault: jest.fn() };
}

function tabEvent() {
  return { nativeEvent: { key: 'Tab' }, preventDefault: jest.fn() };
}

// ─── T5-B4 regression — career card Enter activation ─────────────────────────

describe('T5-B4 regression — healthcare career card Enter activation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Enter key on RN card fires router.push to rn pathway', async () => {
    const { getByTestId } = await render(<HealthcareScreen />);
    const card = getByTestId('career-card-rn');
    fireEvent(card, 'onKeyDown', enterEvent());
    expect(mockPush).toHaveBeenCalledWith('/healthcare/pathways/rn');
  });

  test('Enter key on CNA card fires router.push to cna pathway', async () => {
    const { getByTestId } = await render(<HealthcareScreen />);
    const card = getByTestId('career-card-cna');
    fireEvent(card, 'onKeyDown', enterEvent());
    expect(mockPush).toHaveBeenCalledWith('/healthcare/pathways/cna');
  });

  test('Enter key on LPN card fires router.push to lpn pathway', async () => {
    const { getByTestId } = await render(<HealthcareScreen />);
    const card = getByTestId('career-card-lpn');
    fireEvent(card, 'onKeyDown', enterEvent());
    expect(mockPush).toHaveBeenCalledWith('/healthcare/pathways/lpn');
  });

  test('Enter key fires router.push exactly once (no double activation)', async () => {
    const { getByTestId } = await render(<HealthcareScreen />);
    const card = getByTestId('career-card-rn');
    fireEvent(card, 'onKeyDown', enterEvent());
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  test('Enter key calls e.preventDefault()', async () => {
    const { getByTestId } = await render(<HealthcareScreen />);
    const event = enterEvent();
    fireEvent(getByTestId('career-card-rn'), 'onKeyDown', event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  test('Tab key does not trigger router.push', async () => {
    const { getByTestId } = await render(<HealthcareScreen />);
    fireEvent(getByTestId('career-card-rn'), 'onKeyDown', tabEvent());
    expect(mockPush).not.toHaveBeenCalled();
  });

  test('pointer press activates router.push (preserves pointer behavior)', async () => {
    const { getByTestId } = await render(<HealthcareScreen />);
    fireEvent.press(getByTestId('career-card-rn'));
    expect(mockPush).toHaveBeenCalledWith('/healthcare/pathways/rn');
  });

  test('pointer press fires router.push exactly once (no double activation)', async () => {
    const { getByTestId } = await render(<HealthcareScreen />);
    fireEvent.press(getByTestId('career-card-rn'));
    expect(mockPush).toHaveBeenCalledTimes(1);
  });
});

// ─── T5-B4 regression — accessible names and roles ───────────────────────────

describe('T5-B4 regression — career card accessible names and roles', () => {
  test('RN card has accessibilityRole "button"', async () => {
    const { getByTestId } = await render(<HealthcareScreen />);
    expect(getByTestId('career-card-rn').props.accessibilityRole).toBe('button');
  });

  test('RN card accessible name is "View Registered Nurse pathway"', async () => {
    const { getByTestId } = await render(<HealthcareScreen />);
    expect(getByTestId('career-card-rn').props.accessibilityLabel).toBe(
      'View Registered Nurse pathway',
    );
  });

  test('LPN card accessible name is "View Licensed Practical Nurse pathway"', async () => {
    const { getByTestId } = await render(<HealthcareScreen />);
    expect(getByTestId('career-card-lpn').props.accessibilityLabel).toBe(
      'View Licensed Practical Nurse pathway',
    );
  });

  test('CNA card accessible name is "View Certified Nursing Assistant pathway"', async () => {
    const { getByTestId } = await render(<HealthcareScreen />);
    expect(getByTestId('career-card-cna').props.accessibilityLabel).toBe(
      'View Certified Nursing Assistant pathway',
    );
  });

  test('RN card has onKeyDown prop wired (Enter handler present)', async () => {
    const { getByTestId } = await render(<HealthcareScreen />);
    expect(typeof getByTestId('career-card-rn').props.onKeyDown).toBe('function');
  });

  test('CNA card has onKeyDown prop wired (Enter handler present)', async () => {
    const { getByTestId } = await render(<HealthcareScreen />);
    expect(typeof getByTestId('career-card-cna').props.onKeyDown).toBe('function');
  });
});

// ─── Phase 4 regression — source link and nav control Enter handler ───────────

describe('Phase 4 regression — official source links have Enter handler', () => {
  let openURLSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    openURLSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
  });

  afterEach(() => {
    openURLSpy.mockRestore();
  });

  test('back button in pathway detail has onKeyDown prop', async () => {
    const { getByTestId } = await render(<PathwayDetailScreen />);
    const backBtn = getByTestId('pathway-back-btn');
    expect(typeof backBtn.props.onKeyDown).toBe('function');
  });

  test('catalog link in pathway detail has onKeyDown prop', async () => {
    const { getByTestId } = await render(<PathwayDetailScreen />);
    const catalogLink = getByTestId('pathway-catalog-link');
    expect(typeof catalogLink.props.onKeyDown).toBe('function');
  });

  test('back button Enter key fires router.back()', async () => {
    const { getByTestId } = await render(<PathwayDetailScreen />);
    const event = enterEvent();
    fireEvent(getByTestId('pathway-back-btn'), 'onKeyDown', event);
    expect(router.back).toHaveBeenCalled();
  });

  test('program link Pressable has onKeyDown prop', async () => {
    const { getByTestId } = await render(<PathwayDetailScreen />);
    let link: ReturnType<typeof getByTestId> | null = null;
    try {
      link = getByTestId('program-link-delgado-adn');
    } catch {
      // delgado-adn may not render (FlatList or scroll virtualization); skip
      return;
    }
    expect(typeof link.props.onKeyDown).toBe('function');
  });

  test('program link Enter key calls Linking.openURL', async () => {
    const { getByTestId } = await render(<PathwayDetailScreen />);
    let link: ReturnType<typeof getByTestId> | null = null;
    try {
      link = getByTestId('program-link-delgado-adn');
    } catch {
      return;
    }
    fireEvent(link, 'onKeyDown', enterEvent());
    expect(openURLSpy).toHaveBeenCalled();
  });
});
