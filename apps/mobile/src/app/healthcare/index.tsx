import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type KeyDownEvent,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors, MaxContentWidth } from '@/constants/theme';
import { useSession } from '@/context/SessionContext';
import { HEALTHCARE_CAREERS } from '@/healthcare/careers';
import type { HealthcareCareer } from '@/healthcare/types';

const webFocusRing =
  Platform.OS === 'web'
    ? ({ boxShadow: '0 0 0 3px #6C5CE7, 0 0 0 5px #fff' } as unknown as ViewStyle)
    : {};

// ─── Category labels ──────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  nursing: 'Nursing',
  'allied-health': 'Allied Health',
};

const CREDENTIAL_CLASS_LABELS: Record<string, string> = {
  'professional-license': 'Professional License',
  'registry-certification': 'Registry Certification',
  'national-certification': 'National Certification',
  'employer-preference': 'Employer Preference',
};

// ─── Learner context ──────────────────────────────────────────────────────────

const LEARNER_LABELS: Record<string, string> = {
  'high-school': 'high school',
  university: 'university',
  adult: 'adult',
};

// ─── Career card ──────────────────────────────────────────────────────────────

function CareerCard({
  career,
  onPress,
}: {
  career: HealthcareCareer;
  onPress: () => void;
}) {
  const [focused, setFocused] = useState(false);

  // React Native Web renders Pressable as div[role=button]; browsers only fire
  // click on Enter for native <button> elements, not divs. RNW handles Space
  // natively for role="button". Handle Enter explicitly to avoid missing both.
  function handleKeyDown(e: KeyDownEvent) {
    if (e.nativeEvent.key === 'Enter') {
      e.preventDefault();
      onPress();
    }
  }

  return (
    <Pressable
      onPress={onPress}
      onKeyDown={handleKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      accessibilityRole="button"
      accessibilityLabel={`View ${career.title} pathway`}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed, focused && webFocusRing]}
      testID={`career-card-${career.id}`}>
      <View style={styles.cardHeader}>
        <Text style={styles.categoryTag}>
          {CATEGORY_LABELS[career.category] ?? career.category}
        </Text>
        <Text style={styles.credentialTag}>
          {CREDENTIAL_CLASS_LABELS[career.credentialClass] ?? career.credentialClass}
        </Text>
      </View>

      <Text style={styles.cardTitle}>{career.title}</Text>
      <Text style={styles.cardDescription} numberOfLines={3}>
        {career.shortDescription}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={styles.credentialLabel}>{career.credentialLabel}</Text>
        <Text style={styles.arrow} accessibilityElementsHidden>
          →
        </Text>
      </View>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HealthcareScreen() {
  const { answers } = useSession();

  useEffect(() => {
    if (!answers) {
      router.replace('/');
    }
  }, [answers]);

  const [catalogLinkFocused, setCatalogLinkFocused] = useState(false);
  const [recLinkFocused, setRecLinkFocused] = useState(false);

  if (!answers) return null;

  const learnerLabel = LEARNER_LABELS[answers.learnerType] ?? answers.learnerType;

  function handleRecLinkKeyDown(e: KeyDownEvent) {
    if (e.nativeEvent.key === 'Enter') {
      e.preventDefault();
      (router.push as any)('/recommendations');
    }
  }

  function handleCatalogLinkKeyDown(e: KeyDownEvent) {
    if (e.nativeEvent.key === 'Enter') {
      e.preventDefault();
      (router.push as any)('/opportunities');
    }
  }

  function renderItem({ item }: { item: HealthcareCareer }) {
    return (
      <CareerCard
        career={item}
        onPress={() =>
          (router.push as any)(`/healthcare/pathways/${item.id}`)
        }
      />
    );
  }

  return (
    <View style={styles.root} testID="healthcare-screen">
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerInner}>
            <Text accessibilityRole="header" style={styles.heading}>
              Healthcare Pathways
            </Text>
          </View>
          <Text style={styles.subtitle}>
            Personalized pathways for {learnerLabel} learners. Select a career to see your steps.
          </Text>

          <View style={styles.navRow}>
            <Pressable
              onPress={() => (router.push as any)('/recommendations')}
              onKeyDown={handleRecLinkKeyDown}
              onFocus={() => setRecLinkFocused(true)}
              onBlur={() => setRecLinkFocused(false)}
              accessibilityRole="link"
              accessibilityLabel="View opportunity recommendations"
              style={[styles.navLink, recLinkFocused && webFocusRing]}
              testID="hc-rec-link">
              <Text style={styles.navLinkText}>Opportunity recommendations →</Text>
            </Pressable>

            <Pressable
              onPress={() => (router.push as any)('/opportunities')}
              onKeyDown={handleCatalogLinkKeyDown}
              onFocus={() => setCatalogLinkFocused(true)}
              onBlur={() => setCatalogLinkFocused(false)}
              accessibilityRole="link"
              accessibilityLabel="Browse the full opportunity catalog"
              style={[styles.navLink, catalogLinkFocused && webFocusRing]}
              testID="hc-catalog-link">
              <Text style={styles.navLinkText}>Browse full catalog →</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <FlatList
        data={HEALTHCARE_CAREERS as HealthcareCareer[]}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        accessibilityLabel="Healthcare careers list"
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BrandColors.surface,
  },
  safe: {
    backgroundColor: BrandColors.heroBg,
  },
  header: {
    backgroundColor: BrandColors.heroBg,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerInner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    minWidth: 0,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: BrandColors.textOnPurple,
    letterSpacing: -0.5,
  },
  subtitle: {
    width: '100%',
    maxWidth: MaxContentWidth,
    fontSize: 14,
    color: BrandColors.textSubtleOnPurple,
    lineHeight: 20,
    marginBottom: 14,
  },
  navRow: {
    width: '100%',
    maxWidth: MaxContentWidth,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  navLink: {
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: 4,
    minHeight: 44,
    justifyContent: 'center',
  },
  navLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: BrandColors.textSubtleOnPurple,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  // ─── Career card ─────────────────────────────────────────────────────────────
  card: {
    backgroundColor: BrandColors.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BrandColors.cardBorderDefault,
    padding: 16,
    marginBottom: 12,
  },
  cardPressed: {
    borderColor: BrandColors.primary,
    backgroundColor: BrandColors.surface,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    minWidth: 0,
  },
  categoryTag: {
    fontSize: 11,
    fontWeight: '600',
    color: BrandColors.primary,
    backgroundColor: BrandColors.iconBg,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  credentialTag: {
    fontSize: 11,
    color: BrandColors.textSecondary,
    backgroundColor: BrandColors.surface,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.textPrimary,
    marginBottom: 6,
    lineHeight: 24,
  },
  cardDescription: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: BrandColors.cardBorderDefault,
    paddingTop: 10,
    minWidth: 0,
  },
  credentialLabel: {
    flex: 1,
    fontSize: 12,
    color: BrandColors.textSecondary,
    marginRight: 8,
  },
  arrow: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.primary,
  },
});
