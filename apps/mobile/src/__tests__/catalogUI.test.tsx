/**
 * Regression tests for catalog UI interactive target sizes (T3-B4) and
 * keyboard activation (T3-B5). Browser-level DOM measurements and Chromium AX
 * verification are required for full acceptance; these tests guard against
 * StyleSheet and event-handler regressions using the React Native KeyDownEvent
 * shape (nativeEvent.key, e.preventDefault()).
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FilterBar } from '@/components/catalog/FilterBar';
import { EMPTY_FILTERS, type CatalogFilters } from '@/catalog/types';

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

// Minimal KeyDownEvent-compatible event object matching React Native Web's
// nativeEvent shape used by KeyDownEvent handlers (e.nativeEvent.key, e.preventDefault()).
function keyEvent(key: string): { nativeEvent: { key: string }; preventDefault: jest.Mock } {
  return { nativeEvent: { key }, preventDefault: jest.fn() };
}

describe('FilterBar interactive target sizes', () => {
  it('filter chips have minHeight >= 44', async () => {
    const api = await render(
      <FilterBar filters={EMPTY_FILTERS} onFiltersChange={() => {}} />,
    );
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

describe('FilterBar keyboard activation — Space (T3-B5)', () => {
  it('Space toggles an inactive chip on and calls preventDefault', async () => {
    let captured: CatalogFilters = EMPTY_FILTERS;
    const api = await render(
      <FilterBar
        filters={EMPTY_FILTERS}
        onFiltersChange={(f) => { captured = f; }}
      />,
    );
    const chip = api.getByTestId('filter-high-school');
    const evt = keyEvent(' ');
    fireEvent(chip, 'keyDown', evt);
    expect(captured.learnerCategories).toContain('high-school');
    expect(evt.preventDefault).toHaveBeenCalledTimes(1);
  });

  it('Space toggles an active chip off', async () => {
    const activeFilters: CatalogFilters = {
      ...EMPTY_FILTERS,
      learnerCategories: ['high-school'],
    };
    let captured: CatalogFilters = activeFilters;
    const api = await render(
      <FilterBar
        filters={activeFilters}
        onFiltersChange={(f) => { captured = f; }}
      />,
    );
    const chip = api.getByTestId('filter-high-school');
    fireEvent(chip, 'keyDown', keyEvent(' '));
    expect(captured.learnerCategories).not.toContain('high-school');
  });

  it('Enter, Tab, and Escape keyDown do not trigger onFiltersChange', async () => {
    // Enter is handled by native onPress (React Native Web fires press on Enter);
    // it must not double-fire from our keyDown handler.
    let callCount = 0;
    const api = await render(
      <FilterBar
        filters={EMPTY_FILTERS}
        onFiltersChange={() => { callCount++; }}
      />,
    );
    const chip = api.getByTestId('filter-high-school');
    fireEvent(chip, 'keyDown', keyEvent('Enter'));
    fireEvent(chip, 'keyDown', keyEvent('Tab'));
    fireEvent(chip, 'keyDown', keyEvent('Escape'));
    expect(callCount).toBe(0);
  });
});
