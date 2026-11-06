import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BrandColors } from '@/constants/theme';

type Props = {
  hasFilters: boolean;
  onClearFilters: () => void;
};

export function EmptyState({ hasFilters, onClearFilters }: Props) {
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <Text style={styles.heading}>No matching opportunities found</Text>
      <Text style={styles.body}>
        {hasFilters
          ? 'No verified records match the active filters. Only real, verified opportunities are shown — results are never invented to fill the list.'
          : 'No verified opportunities are available in the catalog at this time.'}
      </Text>
      {hasFilters && (
        <Pressable
          onPress={onClearFilters}
          accessibilityRole="button"
          accessibilityLabel="Clear all filters and browse all opportunities"
          style={styles.button}
          testID="empty-clear-filters">
          <Text style={styles.buttonText}>Clear filters and browse all</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
    gap: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.textPrimary,
    textAlign: 'center',
  },
  body: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    marginTop: 8,
    backgroundColor: BrandColors.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  buttonText: {
    color: BrandColors.textOnPurple,
    fontWeight: '600',
    fontSize: 14,
  },
});
