import { Platform, Pressable, ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useState } from 'react';
import type { CatalogFilters, LearnerCategory, Topic, OpportunityCategory, CreditClass, BudgetFilter, DeliveryMode } from '@/catalog/types';
import { BrandColors } from '@/constants/theme';

const webFocusRing =
  Platform.OS === 'web'
    ? ({ boxShadow: '0 0 0 3px #6C5CE7, 0 0 0 5px #fff' } as unknown as ViewStyle)
    : {};

type Props = {
  filters: CatalogFilters;
  onFiltersChange: (f: CatalogFilters) => void;
};

function Chip({
  label,
  active,
  onToggle,
  testID,
  accessibilityLabel,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
  testID?: string;
  accessibilityLabel: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      onPress={onToggle}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: active }}
      style={[styles.chip, active && styles.chipActive, focused && styles.chipFocused, focused && webFocusRing]}
      testID={testID}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

function ChipGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: { value: T; label: string }[];
  selected: readonly T[];
  onToggle: (value: T) => void;
}) {
  return (
    <View style={styles.chipGroup}>
      <Text style={styles.chipGroupLabel}>{label}</Text>
      <View style={styles.chipRow}>
        {options.map((opt) => (
          <Chip
            key={opt.value}
            label={opt.label}
            active={selected.includes(opt.value)}
            onToggle={() => onToggle(opt.value)}
            testID={`filter-${opt.value}`}
            accessibilityLabel={`${opt.label} filter`}
          />
        ))}
      </View>
    </View>
  );
}

const LEARNER_OPTIONS: { value: LearnerCategory; label: string }[] = [
  { value: 'high-school', label: 'High school' },
  { value: 'university', label: 'University' },
  { value: 'adult', label: 'Adult' },
];

const TOPIC_OPTIONS: { value: Topic; label: string }[] = [
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'networking', label: 'Networking' },
  { value: 'information-technology', label: 'IT' },
  { value: 'alternative-credit', label: 'Alt. credit' },
  { value: 'responsible-vendor', label: 'Resp. Vendor' },
  { value: 'career-skills', label: 'Career skills' },
];

const CATEGORY_OPTIONS: { value: OpportunityCategory; label: string }[] = [
  { value: 'course', label: 'Course' },
  { value: 'exam-preparation', label: 'Exam prep' },
  { value: 'exam', label: 'Exam' },
  { value: 'certification-preparation', label: 'Cert. prep' },
  { value: 'required-training', label: 'Required training' },
];

const CREDIT_OPTIONS: { value: CreditClass; label: string }[] = [
  { value: 'verified-institution-policy', label: 'Verified policy' },
  { value: 'possible-institution-approval', label: 'Potential credit' },
  { value: 'certification-or-required-training', label: 'Certification/training' },
  { value: 'skills-only', label: 'Skills only' },
];

const BUDGET_OPTIONS: { value: BudgetFilter; label: string }[] = [
  { value: 'free', label: 'Free' },
  { value: 'up-to-25', label: 'Up to $25' },
  { value: 'up-to-100', label: 'Up to $100' },
  { value: 'flexible', label: 'Flexible' },
];

const DELIVERY_OPTIONS: { value: DeliveryMode; label: string }[] = [
  { value: 'online', label: 'Online' },
  { value: 'in-person', label: 'In person' },
  { value: 'hybrid', label: 'Hybrid' },
];

export function FilterBar({ filters, onFiltersChange }: Props) {
  function toggleMulti<T extends string>(field: keyof CatalogFilters, value: T) {
    const current = filters[field] as readonly T[];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [field]: next });
  }

  function toggleBudget(value: BudgetFilter) {
    onFiltersChange({ ...filters, budget: filters.budget === value ? null : value });
  }

  function toggleDelivery(value: DeliveryMode) {
    onFiltersChange({ ...filters, deliveryMode: filters.deliveryMode === value ? null : value });
  }

  return (
    <View style={styles.container} accessibilityRole="group" accessibilityLabel="Catalog filters">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.inner}>
          <ChipGroup
            label="Learner"
            options={LEARNER_OPTIONS}
            selected={filters.learnerCategories}
            onToggle={(v) => toggleMulti('learnerCategories', v)}
          />
          <View style={styles.divider} />
          <ChipGroup
            label="Topic"
            options={TOPIC_OPTIONS}
            selected={filters.topics}
            onToggle={(v) => toggleMulti('topics', v)}
          />
          <View style={styles.divider} />
          <ChipGroup
            label="Type"
            options={CATEGORY_OPTIONS}
            selected={filters.opportunityCategories}
            onToggle={(v) => toggleMulti('opportunityCategories', v)}
          />
          <View style={styles.divider} />
          <ChipGroup
            label="Credit"
            options={CREDIT_OPTIONS}
            selected={filters.creditClasses}
            onToggle={(v) => toggleMulti('creditClasses', v)}
          />
          <View style={styles.divider} />
          <View style={styles.chipGroup}>
            <Text style={styles.chipGroupLabel}>Budget</Text>
            <View style={styles.chipRow}>
              {BUDGET_OPTIONS.map((opt) => (
                <Chip
                  key={opt.value}
                  label={opt.label}
                  active={filters.budget === opt.value}
                  onToggle={() => toggleBudget(opt.value)}
                  testID={`filter-budget-${opt.value}`}
                  accessibilityLabel={`${opt.label} budget filter`}
                />
              ))}
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.chipGroup}>
            <Text style={styles.chipGroupLabel}>Delivery</Text>
            <View style={styles.chipRow}>
              {DELIVERY_OPTIONS.map((opt) => (
                <Chip
                  key={opt.value}
                  label={opt.label}
                  active={filters.deliveryMode === opt.value}
                  onToggle={() => toggleDelivery(opt.value)}
                  testID={`filter-delivery-${opt.value}`}
                  accessibilityLabel={`${opt.label} delivery filter`}
                />
              ))}
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.chipGroup}>
            <Text style={styles.chipGroupLabel}>Location</Text>
            <View style={styles.chipRow}>
              <Chip
                label="Louisiana only"
                active={filters.louisianaOnly}
                onToggle={() => onFiltersChange({ ...filters, louisianaOnly: !filters.louisianaOnly })}
                testID="filter-louisiana"
                accessibilityLabel="Louisiana only filter"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.cardBorderDefault,
    backgroundColor: BrandColors.surface,
  },
  scroll: {
    flexShrink: 0,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 0,
  },
  divider: {
    width: 1,
    backgroundColor: BrandColors.cardBorderDefault,
    marginHorizontal: 12,
    alignSelf: 'stretch',
  },
  chipGroup: {
    minWidth: 0,
  },
  chipGroupLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: BrandColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 6,
  },
  chip: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BrandColors.cardBorderDefault,
    paddingHorizontal: 12,
    paddingVertical: 0,
    backgroundColor: BrandColors.cardBg,
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primary,
  },
  chipFocused: {
    borderColor: BrandColors.primary,
  },
  chipText: {
    fontSize: 12,
    color: BrandColors.textPrimary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: BrandColors.textOnPurple,
  },
});
