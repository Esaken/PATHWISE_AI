import { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  type ViewStyle,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/theme';
import { ProgressIndicator } from './ProgressIndicator';

const webFocusRing =
  Platform.OS === 'web'
    ? ({ boxShadow: '0 0 0 3px #6C5CE7, 0 0 0 5px #fff' } as unknown as ViewStyle)
    : {};

type StepLayoutProps = {
  step: number;
  totalSteps: number;
  heading: string;
  onBack: () => void;
  backLabel?: string;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  children: React.ReactNode;
};

export function StepLayout({
  step,
  totalSteps,
  heading,
  onBack,
  backLabel = 'Back',
  onNext,
  nextLabel = 'Next',
  nextDisabled = false,
  children,
}: StepLayoutProps) {
  const [backFocused, setBackFocused] = useState(false);
  const [nextFocused, setNextFocused] = useState(false);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.headerBar}>
          <View style={styles.centerRow}>
            <View style={styles.headerContent}>
              <Pressable
                onPress={onBack}
                onFocus={() => setBackFocused(true)}
                onBlur={() => setBackFocused(false)}
                accessibilityRole="button"
                accessibilityLabel={backLabel}
                style={[
                  styles.backButton,
                  backFocused && styles.backButtonFocused,
                  backFocused && webFocusRing,
                ]}>
                <Text style={styles.backArrow}>←</Text>
                <Text style={styles.backLabel}>{backLabel}</Text>
              </Pressable>
              <ProgressIndicator step={step} totalSteps={totalSteps} />
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.centerRow}>
            <View style={styles.content}>
              <Text accessibilityRole="header" style={styles.heading}>
                {heading}
              </Text>
              {children}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footerBar}>
          <View style={styles.centerRow}>
            <View style={styles.footerContent}>
              <Pressable
                onPress={nextDisabled ? undefined : onNext}
                onFocus={() => setNextFocused(true)}
                onBlur={() => setNextFocused(false)}
                accessibilityRole="button"
                accessibilityLabel={nextLabel}
                disabled={nextDisabled}
                aria-disabled={nextDisabled}
                style={[
                  styles.nextButton,
                  nextDisabled && styles.nextButtonDisabled,
                  nextFocused && !nextDisabled && styles.nextButtonFocused,
                  nextFocused && !nextDisabled && webFocusRing,
                ]}
                testID="step-next-button">
                <Text style={[styles.nextText, nextDisabled && styles.nextTextDisabled]}>
                  {nextLabel}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BrandColors.surface,
  },
  safe: {
    flex: 1,
  },
  headerBar: {
    backgroundColor: BrandColors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.cardBorderDefault,
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  centerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    maxWidth: 720,
    minWidth: 0,
    paddingHorizontal: 20,
    gap: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: BrandColors.cardBorderDefault,
    backgroundColor: BrandColors.surface,
    minHeight: 44,
    minWidth: 44,
  },
  backButtonFocused: {
    borderColor: BrandColors.primary,
  },
  backArrow: {
    fontSize: 15,
    color: BrandColors.textPrimary,
    fontWeight: '600',
  },
  backLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.textPrimary,
  },
  scroll: {
    flexGrow: 1,
    width: '100%',
  },
  content: {
    flex: 1,
    maxWidth: 720,
    minWidth: 0,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: BrandColors.textPrimary,
    letterSpacing: -0.4,
  },
  footerBar: {
    backgroundColor: BrandColors.cardBg,
    borderTopWidth: 1,
    borderTopColor: BrandColors.cardBorderDefault,
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  footerContent: {
    flex: 1,
    maxWidth: 720,
    minWidth: 0,
    paddingHorizontal: 20,
  },
  nextButton: {
    backgroundColor: BrandColors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  nextButtonDisabled: {
    backgroundColor: BrandColors.primaryDisabled,
  },
  nextButtonFocused: {
    backgroundColor: BrandColors.primaryDark,
  },
  nextText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  nextTextDisabled: {
    color: 'rgba(255,255,255,0.7)',
  },
});
