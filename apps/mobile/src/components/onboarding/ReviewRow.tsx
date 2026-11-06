import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, type ViewStyle, View } from 'react-native';

import { BrandColors } from '@/constants/theme';

const webFocusRing =
  Platform.OS === 'web'
    ? ({ boxShadow: '0 0 0 3px #6C5CE7, 0 0 0 5px #fff' } as unknown as ViewStyle)
    : {};

type ReviewRowProps = {
  label: string;
  value: string;
  onEdit: () => void;
  optional?: boolean;
  testID?: string;
};

export function ReviewRow({ label, value, onEdit, optional = false, testID }: ReviewRowProps) {
  const [focused, setFocused] = useState(false);
  const isEmpty = value === '' || value === '—';

  return (
    <View style={styles.row} testID={testID}>
      <View style={styles.textCol}>
        <Text style={styles.label}>
          {label}
          {optional && <Text style={styles.optionalTag}> (optional)</Text>}
        </Text>
        <Text style={[styles.value, isEmpty && styles.valueEmpty]}>{isEmpty ? '—' : value}</Text>
      </View>
      <Pressable
        onPress={onEdit}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityRole="button"
        accessibilityLabel={`Edit ${label}`}
        style={[styles.editButton, focused && styles.editButtonFocused, focused && webFocusRing]}
        testID={testID ? `${testID}-edit` : undefined}>
        <Text style={styles.editText}>Edit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.cardBorderDefault,
    gap: 12,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: BrandColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionalTag: {
    textTransform: 'none',
    letterSpacing: 0,
    fontWeight: '400',
    fontSize: 12,
    color: BrandColors.textSecondary,
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
    color: BrandColors.textPrimary,
  },
  valueEmpty: {
    color: BrandColors.textSecondary,
    fontStyle: 'italic',
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: BrandColors.cardBorderDefault,
    backgroundColor: BrandColors.cardBg,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  editButtonFocused: {
    borderColor: BrandColors.primary,
  },
  editText: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.primary,
  },
});
