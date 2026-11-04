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
  const [homeFocused, setHomeFocused] = useState(false);

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
              <Text style={styles.pathwayHighlight}>{learnerLabel}</Text> onboarding is on its way.
            </Text>

            <View style={styles.previewCard}>
              <Text style={styles.previewIcon}>🗺️</Text>
              <Text style={styles.previewTitle}>What to expect</Text>
              <Text style={styles.previewBody}>
                We&apos;ll help you discover verified, affordable learning resources and career
                opportunities matched to your goals — no account or personal data required.
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.backHome,
                homeFocused && styles.backHomeFocused,
                pressed && styles.backHomePressed,
              ]}
              onPress={handleBack}
              onFocus={() => setHomeFocused(true)}
              onBlur={() => setHomeFocused(false)}
              accessibilityRole="button"
              accessibilityLabel="Back to welcome screen">
              <Text style={styles.backHomeText}>← Back to welcome</Text>
            </Pressable>
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
  scroll: {
    flexGrow: 1,
    maxWidth: 720,
    alignSelf: 'center',
    width: '100%',
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
  backHome: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: BrandColors.heroBg,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backHomeFocused: {
    shadowColor: BrandColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  backHomePressed: {
    opacity: 0.8,
  },
  backHomeText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
