import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/theme';

type LearnerType = 'high-school' | 'university' | 'adult';

const PATHWAYS: {
  id: LearnerType;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    id: 'high-school',
    label: 'High school',
    description: 'Explore free and affordable resources to prepare for college and career.',
    icon: '🏫',
  },
  {
    id: 'university',
    label: 'College/University',
    description: 'Find courses, certifications, and skill-building programs.',
    icon: '🎓',
  },
  {
    id: 'adult',
    label: 'Adult learner',
    description: 'Discover flexible learning paths to build new skills at your own pace.',
    icon: '💼',
  },
];

function PathwayCard({
  pathway,
  selected,
  onSelect,
}: {
  pathway: (typeof PATHWAYS)[number];
  selected: boolean;
  onSelect: () => void;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        focused && styles.cardFocused,
        pressed && styles.cardPressed,
      ]}
      onPress={onSelect}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={pathway.label}
      accessibilityHint={pathway.description}>
      <View style={styles.cardTop}>
        <View
          style={styles.iconCircle}
          accessibilityElementsHidden
          importantForAccessibility="no">
          <Text style={styles.iconEmoji}>{pathway.icon}</Text>
        </View>
        <View
          style={[styles.checkCircle, selected && styles.checkCircleSelected]}
          accessibilityElementsHidden
          importantForAccessibility="no">
          {selected && <Text style={styles.checkMark}>✓</Text>}
        </View>
      </View>
      <Text style={styles.cardLabel}>{pathway.label}</Text>
      <Text style={styles.cardDescription}>{pathway.description}</Text>
    </Pressable>
  );
}

export default function WelcomeScreen() {
  const [selected, setSelected] = useState<LearnerType>('high-school');
  const [ctaFocused, setCtaFocused] = useState(false);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  function handleGetStarted() {
    router.push({ pathname: '/onboarding/[type]', params: { type: selected } });
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <SafeAreaView edges={['top']} style={styles.heroInner}>
            <View style={styles.brandRow} accessibilityRole="header">
              <View
                style={styles.logoCircle}
                accessibilityElementsHidden
                importantForAccessibility="no">
                <Text style={styles.logoEmoji}>🎓</Text>
              </View>
              <Text style={styles.brandName}>Pathwise AI</Text>
            </View>
            <Text style={styles.missionText}>
              Find affordable learning and career opportunities.
            </Text>
          </SafeAreaView>
        </View>

        {/* Selection */}
        <View style={[styles.selectionSection, isDesktop && styles.selectionSectionDesktop]}>
          <Text style={styles.sectionHeading}>Choose your path</Text>

          <View
            style={[styles.cardsContainer, isDesktop && styles.cardsDesktop]}
            accessibilityRole="radiogroup"
            accessibilityLabel="Choose your learning path">
            {PATHWAYS.map((pathway) => (
              <PathwayCard
                key={pathway.id}
                pathway={pathway}
                selected={selected === pathway.id}
                onSelect={() => setSelected(pathway.id)}
              />
            ))}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.ctaButton,
              ctaFocused && styles.ctaButtonFocused,
              pressed && styles.ctaButtonPressed,
            ]}
            onPress={handleGetStarted}
            onFocus={() => setCtaFocused(true)}
            onBlur={() => setCtaFocused(false)}
            accessibilityRole="button"
            accessibilityLabel="Get started">
            <Text style={styles.ctaText}>Get started</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BrandColors.surface,
  },
  scroll: {
    flexGrow: 1,
  },
  hero: {
    backgroundColor: BrandColors.heroBg,
    paddingBottom: 48,
  },
  heroInner: {
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 16,
    maxWidth: 960,
    alignSelf: 'center',
    width: '100%',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 22,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '700',
    color: BrandColors.textOnPurple,
    letterSpacing: -0.3,
  },
  missionText: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '500',
    color: BrandColors.textSubtleOnPurple,
    maxWidth: 480,
  },
  selectionSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 48,
    gap: 20,
    maxWidth: 960,
    alignSelf: 'center',
    width: '100%',
  },
  selectionSectionDesktop: {
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 64,
  },
  sectionHeading: {
    fontSize: 22,
    fontWeight: '700',
    color: BrandColors.textPrimary,
    letterSpacing: -0.2,
  },
  cardsContainer: {
    gap: 14,
  },
  cardsDesktop: {
    flexDirection: 'row',
    gap: 18,
  },
  card: {
    backgroundColor: BrandColors.cardBg,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: BrandColors.cardBorderDefault,
    padding: 20,
    gap: 10,
    shadowColor: '#1A0F3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 44,
  },
  cardSelected: {
    borderColor: BrandColors.cardBorderSelected,
    backgroundColor: '#FDFCFF',
  },
  cardFocused: {
    borderColor: BrandColors.primary,
    shadowOpacity: 0.14,
  },
  cardPressed: {
    opacity: 0.88,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: BrandColors.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 22,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: BrandColors.cardBorderDefault,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkCircleSelected: {
    borderColor: BrandColors.checkBg,
    backgroundColor: BrandColors.checkBg,
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
  },
  cardLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: BrandColors.textPrimary,
    letterSpacing: -0.1,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: BrandColors.textSecondary,
    fontWeight: '500',
  },
  ctaButton: {
    backgroundColor: BrandColors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    alignSelf: 'stretch',
    shadowColor: BrandColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  ctaButtonFocused: {
    shadowOpacity: 0.5,
    shadowRadius: 14,
  },
  ctaButtonPressed: {
    backgroundColor: BrandColors.primaryDark,
    shadowOpacity: 0.15,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});
