import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/theme';

const LEARNER_LABELS: Record<string, string> = {
  'high-school': 'High school',
  university: 'College/University',
  adult: 'Adult learner',
};

export default function OnboardingPlaceholder() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const learnerLabel = (type && LEARNER_LABELS[type]) ?? 'learner';
  const [backFocused, setBackFocused] = useState(false);

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Row wrapper centers content without relying on width: '100%' */}
          <View style={styles.centerRow}>
            <View style={styles.centerContent}>
              {/* Header */}
              <View style={styles.header}>
                <Pressable
                  style={({ pressed }) => [
                    styles.backButton,
                    backFocused && styles.backButtonFocused,
                    pressed && styles.backButtonPressed,
                  ]}
                  onPress={handleBack}
                  onFocus={() => setBackFocused(true)}
                  onBlur={() => setBackFocused(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Back to welcome">
                  <Text style={styles.backArrow}>←</Text>
                  <Text style={styles.backLabel}>Back</Text>
                </Pressable>
              </View>

              {/* Content */}
              <View style={styles.content}>
                <View style={styles.badgeRow}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{learnerLabel}</Text>
                  </View>
                </View>

                <Text style={styles.heading}>Coming soon</Text>
                <Text style={styles.subheading}>
                  Your personalised{' '}
                  <Text style={styles.pathwayHighlight}>{learnerLabel}</Text> onboarding is on its
                  way.
                </Text>

                <View style={styles.previewCard}>
                  <Text style={styles.previewIcon}>🗺️</Text>
                  <Text style={styles.previewTitle}>What to expect</Text>
                  <Text style={styles.previewBody}>
                    This is a preview — full onboarding is coming soon. We&apos;ll help you
                    discover learning resources and career options matched to your goals, with no
                    account or personal data required.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
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
  // width: '100%' gives children a defined width anchor on web so text wraps correctly.
  scroll: {
    flexGrow: 1,
    width: '100%',
  },
  // Row wrapper: centers centerContent without width: '100%'
  centerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexGrow: 1,
  },
  // Bounded content column; flex: 1 fills row width up to maxWidth.
  // minWidth: 0 overrides CSS default min-width: auto so this item can shrink
  // below its text content width at narrow viewports and text wraps correctly.
  centerContent: {
    flex: 1,
    maxWidth: 720,
    minWidth: 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: BrandColors.cardBorderDefault,
    backgroundColor: BrandColors.cardBg,
    minHeight: 44,
    minWidth: 44,
  },
  backButtonFocused: {
    borderColor: BrandColors.primary,
  },
  backButtonPressed: {
    opacity: 0.75,
  },
  backArrow: {
    fontSize: 16,
    color: BrandColors.textPrimary,
    fontWeight: '600',
  },
  backLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.textPrimary,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
    gap: 20,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: '#EDE9FF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: BrandColors.primary,
    letterSpacing: 0.1,
  },
  heading: {
    fontSize: 34,
    fontWeight: '800',
    color: BrandColors.textPrimary,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 17,
    lineHeight: 26,
    color: BrandColors.textSecondary,
    fontWeight: '500',
  },
  pathwayHighlight: {
    color: BrandColors.primary,
    fontWeight: '700',
  },
  previewCard: {
    backgroundColor: BrandColors.cardBg,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: BrandColors.cardBorderDefault,
    padding: 24,
    gap: 12,
    shadowColor: '#1A0F3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  previewIcon: {
    fontSize: 32,
  },
  previewTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: BrandColors.textPrimary,
  },
  previewBody: {
    fontSize: 15,
    lineHeight: 23,
    color: BrandColors.textSecondary,
    fontWeight: '500',
  },
});
