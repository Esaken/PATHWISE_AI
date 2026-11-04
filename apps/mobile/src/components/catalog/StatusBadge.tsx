import { StyleSheet, Text, View } from 'react-native';
import type { CreditRecognition } from '@/catalog/types';
import { creditLabel } from '@/catalog/format';
import { BrandColors } from '@/constants/theme';

type Props = { creditRecognition: CreditRecognition };

const BADGE_COLORS: Record<CreditRecognition['kind'], { bg: string; text: string }> = {
  'verified-institution-policy': { bg: '#D1FAE5', text: '#065F46' },
  'possible-institution-approval': { bg: '#FEF3C7', text: '#92400E' },
  'certification-or-required-training': { bg: '#EDE9FF', text: BrandColors.primaryDark },
  'skills-only': { bg: '#F3F4F6', text: '#374151' },
};

export function StatusBadge({ creditRecognition }: Props) {
  const colors = BADGE_COLORS[creditRecognition.kind];
  return (
    <View
      accessibilityRole="text"
      style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.label, { color: colors.text }]}>
        {creditLabel(creditRecognition)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
