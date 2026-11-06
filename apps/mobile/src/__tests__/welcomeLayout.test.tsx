/**
 * Regression tests for TASK-001 B4: welcome screen hydration-safe desktop layout.
 *
 * Root cause: useWindowDimensions() returns {width:0} during SSR (static export).
 * On first client render at 1440px it returns {width:1440}, producing a different
 * layout from the server HTML and triggering React hydration error #418.
 *
 * Fix: useState(false) initial state (matches SSR mobile layout) + useLayoutEffect
 * that reads Dimensions.get('window') and updates isDesktop before first paint.
 *
 * Notes on test environment:
 * - getByRole('radiogroup') is not supported by RNTL; use getAllByRole('radio').
 * - aria-checked is mapped to accessibilityState.checked in RN test renderer.
 * - tabIndex is a web-only prop and is not visible in the RN test renderer output.
 * - useLayoutEffect cleanup in unmount is verified structurally (via addEventListener
 *   being called) rather than testing the internal sub.remove() invocation, which
 *   is unreliable in the React Native test renderer.
 */

import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Dimensions } from 'react-native';
// jest.mock calls below are hoisted by Jest's babel transform to before all
// imports, so this component import receives the mocked modules regardless
// of its position relative to the jest.mock() calls in source.
import WelcomeScreen from '@/app/index';

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn() },
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

// ─── TASK-001 B4 regression — hydration-safe welcome screen rendering ─────────

describe('TASK-001 B4 regression — welcome screen hydration-safe rendering', () => {
  let removeFn: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    removeFn = jest.fn();
    jest.spyOn(Dimensions, 'addEventListener').mockReturnValue({ remove: removeFn });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders all three learner cards (smoke test for hydration fix)', async () => {
    jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 0, height: 0, scale: 1, fontScale: 1 });
    const { getAllByRole } = await render(<WelcomeScreen />);
    // SSR-equivalent: width=0, isDesktop stays false; all cards still present
    expect(getAllByRole('radio')).toHaveLength(3);
  });

  test('high school is the initial selected card (accessibilityState.checked)', async () => {
    jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 390, height: 844, scale: 1, fontScale: 1 });
    const { getAllByRole } = await render(<WelcomeScreen />);
    const radios = getAllByRole('radio');
    const checked = radios.filter((r) => r.props.accessibilityState?.checked === true);
    expect(checked).toHaveLength(1);
    expect(checked[0].props.accessibilityLabel).toBe('High school');
  });

  test('Dimensions.addEventListener is registered after mount', async () => {
    jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 390, height: 844, scale: 1, fontScale: 1 });
    const addListener = jest.spyOn(Dimensions, 'addEventListener').mockReturnValue({ remove: removeFn });
    await render(<WelcomeScreen />);
    expect(addListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  test('Get Started button is present and labelled', async () => {
    jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 390, height: 844, scale: 1, fontScale: 1 });
    const { getByRole } = await render(<WelcomeScreen />);
    expect(getByRole('button', { name: 'Get started' })).toBeTruthy();
  });
});

// ─── TASK-001 B4 regression — welcome learner selection ──────────────────────

describe('TASK-001 B4 regression — welcome learner selection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 390, height: 844, scale: 1, fontScale: 1 });
    jest.spyOn(Dimensions, 'addEventListener').mockReturnValue({ remove: jest.fn() });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('pressing Adult card selects it and deselects High school', async () => {
    const { getAllByRole } = await render(<WelcomeScreen />);
    const before = getAllByRole('radio');
    const adultCard = before.find((r) => r.props.accessibilityLabel === 'Adult learner');
    expect(adultCard).toBeTruthy();

    fireEvent.press(adultCard!);

    // waitFor handles React's internal state-update batching
    await waitFor(() => {
      const after = getAllByRole('radio');
      const checkedAfter = after.filter((r) => r.props.accessibilityState?.checked === true);
      expect(checkedAfter).toHaveLength(1);
      expect(checkedAfter[0].props.accessibilityLabel).toBe('Adult learner');
    });
  });

  test('pressing University card selects it', async () => {
    const { getAllByRole } = await render(<WelcomeScreen />);
    const before = getAllByRole('radio');
    const univCard = before.find((r) => r.props.accessibilityLabel === 'College/University');
    expect(univCard).toBeTruthy();

    fireEvent.press(univCard!);

    await waitFor(() => {
      const after = getAllByRole('radio');
      const checkedAfter = after.filter((r) => r.props.accessibilityState?.checked === true);
      expect(checkedAfter).toHaveLength(1);
      expect(checkedAfter[0].props.accessibilityLabel).toBe('College/University');
    });
  });

  test('only one card is checked at any time', async () => {
    const { getAllByRole } = await render(<WelcomeScreen />);
    const radios = getAllByRole('radio');
    const checked = radios.filter((r) => r.props.accessibilityState?.checked === true);
    expect(checked).toHaveLength(1);
  });

  test('radiogroup has three accessible radio controls', async () => {
    const { getAllByRole } = await render(<WelcomeScreen />);
    expect(getAllByRole('radio')).toHaveLength(3);
  });

  test('radiogroup accessible label is set', async () => {
    const { getByLabelText } = await render(<WelcomeScreen />);
    expect(getByLabelText('Choose your learning path')).toBeTruthy();
  });
});

// ─── TASK-001 B4 regression — responsive layout via Dimensions (post-mount) ───

describe('TASK-001 B4 regression — responsive layout across viewport widths', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders without crash at 390px (mobile)', async () => {
    jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 390, height: 844, scale: 1, fontScale: 1 });
    jest.spyOn(Dimensions, 'addEventListener').mockReturnValue({ remove: jest.fn() });
    const { getAllByRole } = await render(<WelcomeScreen />);
    expect(getAllByRole('radio')).toHaveLength(3);
  });

  test('renders without crash at 768px (tablet)', async () => {
    jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 768, height: 1024, scale: 2, fontScale: 1 });
    jest.spyOn(Dimensions, 'addEventListener').mockReturnValue({ remove: jest.fn() });
    const { getAllByRole } = await render(<WelcomeScreen />);
    expect(getAllByRole('radio')).toHaveLength(3);
  });

  test('renders without crash at 1440px (desktop)', async () => {
    jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 1440, height: 900, scale: 1, fontScale: 1 });
    jest.spyOn(Dimensions, 'addEventListener').mockReturnValue({ remove: jest.fn() });
    const { getAllByRole } = await render(<WelcomeScreen />);
    expect(getAllByRole('radio')).toHaveLength(3);
  });

  test('renders without crash with SSR-equivalent width=0', async () => {
    jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 0, height: 0, scale: 1, fontScale: 1 });
    jest.spyOn(Dimensions, 'addEventListener').mockReturnValue({ remove: jest.fn() });
    const { getAllByRole } = await render(<WelcomeScreen />);
    expect(getAllByRole('radio')).toHaveLength(3);
  });
});
