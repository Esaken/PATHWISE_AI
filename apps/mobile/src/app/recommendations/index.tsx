import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CATALOG } from '@/catalog/data';
import { OpportunityCard } from '@/components/catalog/OpportunityCard';
import { BrandColors, MaxContentWidth } from '@/constants/theme';
import { useSession } from '@/context/SessionContext';
import { recommend } from '@/matching/engine';
import type { Recommendation } from '@/matching/types';
import type { OnboardingAnswers } from '@/types/onboarding';

const webFocusRing =
  Platform.OS === 'web'
    ? ({ boxShadow: '0 0 0 3px #6C5CE7, 0 0 0 5px #fff' } as unknown as ViewStyle)
    : {};

// ─── Goal summary ─────────────────────────────────────────────────────────────

const LEARNER_LABELS: Record<string, string> = {
  'high-school': 'high school learner',
  university: 'university/college student',
  adult: 'adult learner',
};

const GOAL_LABELS: Record<string, string> = {
  'prepare-college': 'prepare for college',
  'explore-credit': 'explore potential college-credit options',
  'build-career-skills': 'build career skills',
  'explore-career-pathways': 'explore career pathways',
  'prepare-certification': 'prepare for a professional certification',
  'build-job-skills': 'build job-relevant skills',
  'prepare-internships': 'prepare for internships',
  'job-training': 'complete job-related training',
  'build-general-skills': 'build general skills',
  'change-career': 'change or advance a career pathway',
};

function goalSummary(answers: OnboardingAnswers): string {
  const learner = LEARNER_LABELS[answers.learnerType] ?? answers.learnerType;
  const goal = GOAL_LABELS[answers.goal ?? ''];
  if (!goal) return `Results for ${learner}`;
  return `Results for ${learner} aiming to ${goal}`;
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyRecommendations({ onBrowseAll }: { onBrowseAll: () => void }) {
  return (
    <View style={styles.empty} accessibilityLiveRegion="polite">
      <Text style={styles.emptyHeading}>No recommendations yet</Text>
      <Text style={styles.emptyBody}>
        No verified opportunities matched your selections. Only real, verified opportunities are
        shown — results are never invented to fill the list.
      </Text>
      <Pressable
        onPress={onBrowseAll}
        accessibilityRole="button"
        accessibilityLabel="Browse all opportunities in the catalog"
        style={styles.emptyButton}
        testID="rec-browse-all-empty">
        <Text style={styles.emptyButtonText}>Browse all opportunities</Text>
      </Pressable>
    </View>
  );
}

// ─── Caveat list ──────────────────────────────────────────────────────────────

function EligibilityCaveats({ item }: { item: Recommendation }) {
  if (item.eligibilityCaveats.length === 0) return null;
  return (
    <View style={styles.caveatBox} accessibilityLiveRegion="polite">
      {item.eligibilityCaveats.map((c) => (
        <Text key={c.kind} style={styles.caveatText}>
          {c.label}
        </Text>
      ))}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function RecommendationsScreen() {
  const { answers } = useSession();

  // Redirect to welcome if there is no session (e.g., deep link or refresh).
  useEffect(() => {
    if (!answers) {
      router.replace('/');
    }
  }, [answers]);

  const recommendations = useMemo(
    () => (answers ? recommend(answers, CATALOG) : []),
    [answers],
  );

  const [catalogLinkFocused, setCatalogLinkFocused] = useState(false);

  function handleBrowseAll() {
    router.push('/opportunities' as any);
  }

  if (!answers) return null;

  const summary = goalSummary(answers);

  function renderItem({ item }: { item: Recommendation }) {
    return (
      <View>
        <OpportunityCard
          ranked={item}
          onPress={() => (router.push as any)(`/opportunities/${item.opportunity.id}`)}
        />
        <EligibilityCaveats item={item} />
      </View>
    );
  }

  return (
    <View style={styles.root} testID="recommendations-screen">
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerInner}>
            <Text accessibilityRole="header" style={styles.heading}>
              Your Recommendations
            </Text>
            <Text
              style={styles.resultCount}
              accessibilityLiveRegion="polite"
              accessibilityLabel={`${recommendations.length} recommendation${recommendations.length !== 1 ? 's' : ''}`}>
              {recommendations.length} result{recommendations.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <Text style={styles.summary}>{summary}</Text>
          <Pressable
            onPress={handleBrowseAll}
            onFocus={() => setCatalogLinkFocused(true)}
            onBlur={() => setCatalogLinkFocused(false)}
            accessibilityRole="link"
            accessibilityLabel="Browse the full opportunity catalog"
            style={[styles.catalogLink, catalogLinkFocused && webFocusRing]}
            testID="rec-browse-catalog-link">
            <Text style={styles.catalogLinkText}>Browse full catalog →</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      {recommendations.length === 0 ? (
        <EmptyRecommendations onBrowseAll={handleBrowseAll} />
      ) : (
        <FlatList
          data={recommendations}
          keyExtractor={(item) => item.opportunity.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          accessibilityLabel="Personalized recommendations list"
        />
      )}
    </View>
  );
}

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
    paddingBottom: 14,
    gap: 6,
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    minWidth: 0,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: BrandColors.textOnPurple,
    flex: 1,
    minWidth: 0,
  },
  resultCount: {
    fontSize: 13,
    color: BrandColors.textSubtleOnPurple,
    fontWeight: '500',
  },
  summary: {
    fontSize: 12,
    color: BrandColors.textSubtleOnPurple,
    fontStyle: 'italic',
  },
  catalogLink: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 0,
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
  },
  catalogLinkText: {
    color: BrandColors.textSubtleOnPurple,
    fontSize: 12,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
    gap: 12,
  },
  emptyHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.textPrimary,
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 8,
    backgroundColor: BrandColors.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  emptyButtonText: {
    color: BrandColors.textOnPurple,
    fontWeight: '600',
    fontSize: 14,
  },
  caveatBox: {
    marginHorizontal: 0,
    marginTop: -8,
    marginBottom: 12,
    backgroundColor: BrandColors.surface,
    borderWidth: 1,
    borderColor: BrandColors.cardBorderDefault,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 4,
  },
  caveatText: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    lineHeight: 17,
  },
});
