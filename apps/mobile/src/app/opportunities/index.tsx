import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CATALOG } from '@/catalog/data';
import { EMPTY_FILTERS } from '@/catalog/types';
import type { CatalogFilters, RankedOpportunity } from '@/catalog/types';
import { filterAndRank, filtersFromSession } from '@/catalog/selectors';
import { useSession } from '@/context/SessionContext';
import { FilterBar } from '@/components/catalog/FilterBar';
import { OpportunityCard } from '@/components/catalog/OpportunityCard';
import { EmptyState } from '@/components/catalog/EmptyState';
import { BrandColors, MaxContentWidth } from '@/constants/theme';

const webFocusRing =
  Platform.OS === 'web'
    ? ({ boxShadow: '0 0 0 3px #6C5CE7, 0 0 0 5px #fff' } as unknown as ViewStyle)
    : {};

function hasAnyFilter(f: CatalogFilters): boolean {
  return (
    f.learnerCategories.length > 0 ||
    f.topics.length > 0 ||
    f.opportunityCategories.length > 0 ||
    f.creditClasses.length > 0 ||
    f.budget !== null ||
    f.deliveryMode !== null ||
    f.louisianaOnly
  );
}

export default function OpportunitiesScreen() {
  const { answers } = useSession();

  const derivedFilters = useMemo(
    () => (answers ? filtersFromSession(answers) : EMPTY_FILTERS),
    [answers],
  );

  const [filters, setFilters] = useState<CatalogFilters>(derivedFilters);

  const isPersonalized = answers !== null;
  const isFiltered = hasAnyFilter(filters);

  const results: RankedOpportunity[] = useMemo(
    () => filterAndRank(CATALOG, filters),
    [filters],
  );

  const handleClearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
  }, []);

  const handlePersonalize = useCallback(() => {
    router.push('/');
  }, []);

  const [personalizeFocused, setPersonalizeFocused] = useState(false);
  const [clearFocused, setClearFocused] = useState(false);

  function renderItem({ item }: { item: RankedOpportunity }) {
    return (
      <OpportunityCard
        ranked={item}
        onPress={() => (router.push as any)(`/opportunities/${item.opportunity.id}`)}
      />
    );
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.headerBar}>
          <View style={styles.headerInner}>
            <Text accessibilityRole="header" style={styles.heading}>
              Learning Opportunities
            </Text>
            <Text
              style={styles.resultCount}
              accessibilityLiveRegion="polite"
              accessibilityLabel={`${results.length} result${results.length !== 1 ? 's' : ''}`}>
              {results.length} result{results.length !== 1 ? 's' : ''}
            </Text>
          </View>

          {isPersonalized ? (
            <Text style={styles.sessionBanner}>
              Matches based on your selections
            </Text>
          ) : (
            <Pressable
              onPress={handlePersonalize}
              onFocus={() => setPersonalizeFocused(true)}
              onBlur={() => setPersonalizeFocused(false)}
              accessibilityRole="button"
              accessibilityLabel="Personalize results by completing onboarding"
              style={[styles.personalizeButton, personalizeFocused && webFocusRing]}
              testID="personalize-button">
              <Text style={styles.personalizeText}>Personalize results</Text>
            </Pressable>
          )}

          {isFiltered && (
            <Pressable
              onPress={handleClearFilters}
              onFocus={() => setClearFocused(true)}
              onBlur={() => setClearFocused(false)}
              accessibilityRole="button"
              accessibilityLabel="Clear all active filters"
              style={[styles.clearButton, clearFocused && webFocusRing]}
              testID="clear-filters-button">
              <Text style={styles.clearText}>Clear filters</Text>
            </Pressable>
          )}
        </View>

        <FilterBar filters={filters} onFiltersChange={setFilters} />
      </SafeAreaView>

      {results.length === 0 ? (
        <EmptyState hasFilters={isFiltered} onClearFilters={handleClearFilters} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.opportunity.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          accessibilityLabel="Opportunity list"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BrandColors.surface,
  },
  safe: {
    backgroundColor: BrandColors.heroBg,
  },
  headerBar: {
    backgroundColor: BrandColors.heroBg,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    gap: 6,
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    minWidth: 0,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: BrandColors.textOnPurple,
    flex: 1,
    minWidth: 0,
  },
  resultCount: {
    fontSize: 13,
    color: BrandColors.textSubtleOnPurple,
    fontWeight: '500',
  },
  sessionBanner: {
    fontSize: 12,
    color: BrandColors.textSubtleOnPurple,
    fontStyle: 'italic',
  },
  personalizeButton: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BrandColors.textSubtleOnPurple,
    paddingHorizontal: 14,
    paddingVertical: 0,
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
  },
  personalizeText: {
    color: BrandColors.textSubtleOnPurple,
    fontSize: 12,
    fontWeight: '500',
  },
  clearButton: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 0,
    backgroundColor: 'rgba(255,255,255,0.15)',
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
  },
  clearText: {
    color: BrandColors.textOnPurple,
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
});
