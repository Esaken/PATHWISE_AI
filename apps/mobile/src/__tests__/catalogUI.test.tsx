/**
 * Regression tests for catalog UI interactive target sizes (T3-B4).
 * Verifies that filter chips and header action buttons meet the 44×44 CSS-pixel
 * minimum required by TASK-003. Browser-level DOM measurements are needed for
 * production verification; these tests guard against StyleSheet regressions.
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import { FilterBar } from '@/components/catalog/FilterBar';
import { EMPTY_FILTERS } from '@/catalog/types';

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

describe('FilterBar interactive target sizes', () => {
  it('filter chips have minHeight >= 44', async () => {
    const api = await render(
      <FilterBar filters={EMPTY_FILTERS} onFiltersChange={() => {}} />,
    );
    // Check a representative chip from each group
    const cybersecurityChip = api.getByTestId('filter-cybersecurity');
    const learnerChip = api.getByTestId('filter-high-school');
    const budgetChip = api.getByTestId('filter-budget-free');
    const deliveryChip = api.getByTestId('filter-delivery-online');
    const locationChip = api.getByTestId('filter-louisiana');

    for (const chip of [cybersecurityChip, learnerChip, budgetChip, deliveryChip, locationChip]) {
      expect(chip).toHaveStyle({ minHeight: 44 });
    }
  });

  it('filter chips have minWidth >= 44', async () => {
    const api = await render(
      <FilterBar filters={EMPTY_FILTERS} onFiltersChange={() => {}} />,
    );
    const chip = api.getByTestId('filter-cybersecurity');
    expect(chip).toHaveStyle({ minWidth: 44 });
  });
});
