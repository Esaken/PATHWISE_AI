import { StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/theme';

type ProgressIndicatorProps = {
  step: number;
  totalSteps: number;
};

export function ProgressIndicator({ step, totalSteps }: ProgressIndicatorProps) {
  const pct = Math.min(100, Math.round((step / totalSteps) * 100));

  return (
    <View style={styles.container} accessibilityRole="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={totalSteps}>
      <Text style={styles.label} accessibilityElementsHidden importantForAccessibility="no">
        Step {step} of {totalSteps}
      </Text>
      <View
        style={styles.track}
        accessibilityElementsHidden
        importantForAccessibility="no">
        <View style={[styles.fill, { width: `${pct}%` as unknown as number }]} />
      </View>
      {/* Screen-reader-only label — hidden from sighted users */}
      <Text aria-hidden={false} style={styles.srOnly}>
        Step {step} of {totalSteps}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: BrandColors.textSecondary,
  },
  track: {
    height: 4,
    backgroundColor: BrandColors.cardBorderDefault,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: 4,
    backgroundColor: BrandColors.primary,
    borderRadius: 2,
  },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'hidden',
    opacity: 0,
  },
});
