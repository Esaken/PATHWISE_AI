import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors, MaxContentWidth } from '@/constants/theme';
import { useSession } from '@/context/SessionContext';
import { getCareerById } from '@/healthcare/careers';
import { buildHealthcarePathway } from '@/healthcare/pathways';
import { getProgramById, HEALTHCARE_PROGRAMS } from '@/healthcare/programs';
import type { MilestoneKind, PathwayMilestone, HealthcareProgram } from '@/healthcare/types';

const webFocusRing =
  Platform.OS === 'web'
    ? ({ boxShadow: '0 0 0 3px #6C5CE7, 0 0 0 5px #fff' } as unknown as ViewStyle)
    : {};

// ─── Milestone kind labels ────────────────────────────────────────────────────

const KIND_LABELS: Record<MilestoneKind, string> = {
  preparation: 'Prepare',
  education: 'Education',
  clinical: 'Clinical',
  examination: 'Exam',
  licensure: 'License',
  registry: 'Registry',
  employment: 'Career',
};

const KIND_COLORS: Record<MilestoneKind, string> = {
  preparation: '#7B8FA6',
  education: BrandColors.primary,
  clinical: '#00897B',
  examination: '#E67E22',
  licensure: '#27AE60',
  registry: '#27AE60',
  employment: '#8E44AD',
};

// ─── Milestone step ───────────────────────────────────────────────────────────

function MilestoneStep({
  milestone,
  index,
  total,
}: {
  milestone: PathwayMilestone;
  index: number;
  total: number;
}) {
  const kindColor = KIND_COLORS[milestone.kind];
  return (
    <View
      style={styles.step}
      accessibilityLabel={`Step ${index + 1} of ${total}: ${milestone.title}`}>
      <View style={styles.stepLeft}>
        <View style={[styles.stepDot, { backgroundColor: kindColor }]}>
          <Text style={styles.stepNumber}>{index + 1}</Text>
        </View>
        {index < total - 1 && <View style={[styles.stepLine, { backgroundColor: kindColor + '40' }]} />}
      </View>
      <View style={styles.stepContent}>
        <View style={styles.stepHeader}>
          <Text style={[styles.stepKind, { color: kindColor }]}>
            {KIND_LABELS[milestone.kind]}
          </Text>
          {milestone.requiresConfirmation && (
            <Text style={styles.confirmBadge}>Verify with provider</Text>
          )}
        </View>
        <Text style={styles.stepTitle}>{milestone.title}</Text>
        <Text style={styles.stepDesc}>{milestone.description}</Text>
      </View>
    </View>
  );
}

// ─── Program card ─────────────────────────────────────────────────────────────

function ProgramCard({ program }: { program: HealthcareProgram }) {
  const [focused, setFocused] = useState(false);

  function handlePress() {
    Linking.openURL(program.officialUrl).catch(() => {});
  }

  return (
    <View style={styles.programCard}>
      <View style={styles.programHeader}>
        <Text style={styles.programInstitution}>{program.institution}</Text>
        <Text
          style={[
            styles.programStatus,
            program.verificationStatus === 'needs-recheck' && styles.programStatusRecheck,
          ]}>
          {program.verificationStatus === 'verified-official-source'
            ? `Verified ${program.verifiedOn}`
            : `Needs recheck — last reviewed ${program.verifiedOn}`}
        </Text>
      </View>

      <Text style={styles.programTitle}>{program.programTitle}</Text>

      {program.durationNote && (
        <Text style={styles.programMeta}>{program.durationNote}</Text>
      )}
      {program.locationSummary && (
        <Text style={styles.programMeta}>{program.locationSummary}</Text>
      )}

      {program.applicationRequirements.length > 0 && (
        <View style={styles.programSection}>
          <Text style={styles.programSectionLabel}>Key requirements</Text>
          {program.applicationRequirements.map((req, i) => (
            <Text key={i} style={styles.programBullet}>
              {'•'} {req}
            </Text>
          ))}
        </View>
      )}

      {program.warnings.length > 0 && (
        <View style={styles.programWarnings}>
          {program.warnings.map((w, i) => (
            <Text key={i} style={styles.programWarning}>
              {w}
            </Text>
          ))}
        </View>
      )}

      <Pressable
        onPress={handlePress}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityRole="link"
        accessibilityLabel={`Open official page for ${program.programTitle} at ${program.institution}`}
        style={[styles.programLink, focused && webFocusRing]}
        testID={`program-link-${program.id}`}>
        <Text style={styles.programLinkText}>Official program page →</Text>
      </Pressable>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function PathwayDetailScreen() {
  const { answers } = useSession();
  const { careerId } = useLocalSearchParams<{ careerId: string }>();

  useEffect(() => {
    if (!answers) {
      router.replace('/');
    }
  }, [answers]);

  const [backFocused, setBackFocused] = useState(false);
  const [catalogFocused, setCatalogFocused] = useState(false);

  const career = useMemo(
    () => (careerId ? getCareerById(careerId) : undefined),
    [careerId],
  );

  const pathway = useMemo(() => {
    if (!answers || !careerId) return null;
    return buildHealthcarePathway(answers, careerId, HEALTHCARE_PROGRAMS);
  }, [answers, careerId]);

  const linkedPrograms = useMemo(() => {
    if (!pathway) return [];
    return pathway.linkedProgramIds
      .map((id) => getProgramById(id))
      .filter((p): p is HealthcareProgram => p !== undefined);
  }, [pathway]);

  if (!answers) return null;

  if (!career || !pathway) {
    return (
      <View style={styles.root} testID="pathway-not-found">
        <SafeAreaView style={styles.safe} edges={['top']}>
          <View style={styles.header}>
            <View style={styles.headerInner}>
              <Pressable
                onPress={() => router.back()}
                accessibilityRole="button"
                accessibilityLabel="Go back to healthcare careers"
                style={styles.backButton}
                testID="pathway-back-btn">
                <Text style={styles.backText}>← Healthcare Pathways</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>
            Career pathway not found. Please go back and select a career.
          </Text>
          <Pressable
            onPress={() => router.replace('/healthcare' as any)}
            accessibilityRole="button"
            accessibilityLabel="Return to healthcare career selection"
            style={styles.notFoundButton}>
            <Text style={styles.notFoundButtonText}>Back to Healthcare Pathways</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const milestones = pathway.milestones;

  return (
    <View style={styles.root} testID={`pathway-screen-${careerId}`}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerInner}>
            <Pressable
              onPress={() => router.back()}
              onFocus={() => setBackFocused(true)}
              onBlur={() => setBackFocused(false)}
              accessibilityRole="button"
              accessibilityLabel="Go back to healthcare career selection"
              style={[styles.backButton, backFocused && webFocusRing]}
              testID="pathway-back-btn">
              <Text style={styles.backText}>← Healthcare Pathways</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/opportunities' as any)}
              onFocus={() => setCatalogFocused(true)}
              onBlur={() => setCatalogFocused(false)}
              accessibilityRole="link"
              accessibilityLabel="Browse the full opportunity catalog"
              style={[styles.catalogLink, catalogFocused && webFocusRing]}
              testID="pathway-catalog-link">
              <Text style={styles.catalogLinkText}>Browse catalog →</Text>
            </Pressable>
          </View>

          <View style={styles.careerInfo}>
            <Text style={styles.categoryLabel}>
              {career.category === 'nursing' ? 'Nursing' : 'Allied Health'}
            </Text>
            <Text accessibilityRole="header" style={styles.careerTitle}>
              {career.title}
            </Text>
            <Text style={styles.careerDesc}>{career.shortDescription}</Text>
            <Text style={styles.credentialLabel}>{career.credentialLabel}</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ─── Milestones ───────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Pathway Steps</Text>
          <Text style={styles.sectionSubtitle}>
            {milestones.length} steps for {answers.learnerType === 'high-school' ? 'high school' : answers.learnerType === 'university' ? 'university' : 'adult'} learners.
            Steps marked &quot;Verify with provider&quot; require direct confirmation.
          </Text>

          <View style={styles.stepList}>
            {milestones.map((m, i) => (
              <MilestoneStep
                key={m.id}
                milestone={m}
                index={i}
                total={milestones.length}
              />
            ))}
          </View>
        </View>

        {/* ─── Verify checklist ─────────────────────────────────────────── */}
        {pathway.verifyWithProvider.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Verify Before You Enroll</Text>
            {pathway.verifyWithProvider.map((item, i) => (
              <Text key={i} style={styles.verifyItem}>
                {'•'} {item}
              </Text>
            ))}
          </View>
        )}

        {/* ─── Louisiana programs ───────────────────────────────────────── */}
        {linkedPrograms.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Louisiana Programs</Text>
            <Text style={styles.sectionSubtitle}>
              Verified programs in Louisiana. Confirm current requirements directly with each institution.
            </Text>
            {linkedPrograms.map((p) => (
              <ProgramCard key={p.id} program={p} />
            ))}
          </View>
        )}

        {/* ─── Education routes ─────────────────────────────────────────── */}
        {pathway.relevantRoutes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education Routes</Text>
            {pathway.relevantRoutes.map((route) => (
              <View key={route.routeId} style={styles.routeCard}>
                <Text style={styles.routeLabel}>{route.label}</Text>
                <Text style={styles.routeDesc}>{route.description}</Text>
                {route.typicalDurationMonths && (
                  <Text style={styles.routeMeta}>
                    Typical duration: {route.typicalDurationMonths.min}–{route.typicalDurationMonths.max} months
                  </Text>
                )}
                {route.minimumEducationPrerequisite && (
                  <Text style={styles.routeMeta}>
                    Prerequisite: {route.minimumEducationPrerequisite}
                  </Text>
                )}
                {route.notes ? <Text style={styles.routeNote}>{route.notes}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {/* ─── Official sources ─────────────────────────────────────────── */}
        {career.officialSources.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Official Sources</Text>
            <Text style={styles.sectionSubtitle}>
              For the most current requirements, verify directly with the relevant regulatory body.
            </Text>
            {career.officialSources.map((src, i) => {
              return (
                <SourceLink key={i} title={src.title} url={src.url} organization={src.organization} />
              );
            })}
          </View>
        )}

        {/* ─── Career warnings ──────────────────────────────────────────── */}
        {career.warnings.length > 0 && (
          <View style={[styles.section, styles.warningsSection]}>
            <Text style={styles.sectionTitle}>Important Notes</Text>
            {career.warnings.map((w, i) => (
              <Text key={i} style={styles.warningText}>
                {'•'} {w}
              </Text>
            ))}
          </View>
        )}

        {/* ─── Disclaimer ───────────────────────────────────────────────── */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>{pathway.disclaimer}</Text>
        </View>

      </ScrollView>
    </View>
  );
}

// ─── Source link helper ───────────────────────────────────────────────────────

function SourceLink({
  title,
  url,
  organization,
}: {
  title: string;
  url: string;
  organization: string;
}) {
  const [focused, setFocused] = useState(false);

  function handlePress() {
    Linking.openURL(url).catch(() => {});
  }

  return (
    <Pressable
      onPress={handlePress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      accessibilityRole="link"
      accessibilityLabel={`Open ${title} — ${organization}`}
      style={[styles.sourceLink, focused && webFocusRing]}>
      <Text style={styles.sourceLinkTitle}>{title}</Text>
      <Text style={styles.sourceLinkOrg}>{organization}</Text>
    </Pressable>
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
    paddingTop: 12,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerInner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    minWidth: 0,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: 4,
    minHeight: 44,
    justifyContent: 'center',
  },
  backText: {
    fontSize: 14,
    color: BrandColors.textSubtleOnPurple,
    fontWeight: '500',
  },
  catalogLink: {
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: 4,
    minHeight: 44,
    justifyContent: 'center',
  },
  catalogLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: BrandColors.textSubtleOnPurple,
  },
  careerInfo: {
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: BrandColors.textSubtleOnPurple,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  careerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: BrandColors.textOnPurple,
    letterSpacing: -0.5,
    marginBottom: 8,
    lineHeight: 34,
  },
  careerDesc: {
    fontSize: 15,
    color: BrandColors.textSubtleOnPurple,
    lineHeight: 22,
    marginBottom: 8,
  },
  credentialLabel: {
    fontSize: 13,
    color: BrandColors.textSubtleOnPurple,
    fontStyle: 'italic',
  },
  scrollContent: {
    paddingBottom: 48,
    alignItems: 'center',
  },
  section: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.textPrimary,
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    lineHeight: 19,
    marginBottom: 14,
  },
  // ─── Steps ────────────────────────────────────────────────────────────────
  stepList: {
    gap: 0,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepLeft: {
    alignItems: 'center',
    width: 32,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  stepLine: {
    width: 2,
    flex: 1,
    minHeight: 16,
    marginTop: 4,
    marginBottom: 4,
  },
  stepContent: {
    flex: 1,
    paddingBottom: 20,
    minWidth: 0,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  stepKind: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  confirmBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: '#E67E22',
    backgroundColor: '#FEF3E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: BrandColors.textPrimary,
    lineHeight: 21,
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    lineHeight: 20,
  },
  // ─── Verify checklist ──────────────────────────────────────────────────────
  verifyItem: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    lineHeight: 20,
    marginBottom: 6,
    paddingLeft: 4,
  },
  // ─── Program card ──────────────────────────────────────────────────────────
  programCard: {
    backgroundColor: BrandColors.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BrandColors.cardBorderDefault,
    padding: 16,
    marginBottom: 12,
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
    minWidth: 0,
    flexWrap: 'wrap',
    gap: 4,
  },
  programInstitution: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    flex: 1,
  },
  programStatus: {
    fontSize: 11,
    color: BrandColors.primary,
  },
  programStatusRecheck: {
    color: '#E67E22',
  },
  programTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.textPrimary,
    marginBottom: 8,
    lineHeight: 22,
  },
  programMeta: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    marginBottom: 4,
  },
  programSection: {
    marginTop: 10,
    marginBottom: 4,
  },
  programSectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: BrandColors.textPrimary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  programBullet: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    lineHeight: 20,
    paddingLeft: 4,
  },
  programWarnings: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: BrandColors.cardBorderDefault,
    gap: 4,
  },
  programWarning: {
    fontSize: 12,
    color: '#7B6E8A',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  programLink: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    minHeight: 44,
    justifyContent: 'center',
  },
  programLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: BrandColors.primary,
  },
  // ─── Education routes ──────────────────────────────────────────────────────
  routeCard: {
    backgroundColor: BrandColors.cardBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BrandColors.cardBorderDefault,
    padding: 14,
    marginBottom: 10,
  },
  routeLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: BrandColors.textPrimary,
    marginBottom: 4,
  },
  routeDesc: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    lineHeight: 19,
    marginBottom: 6,
  },
  routeMeta: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    marginBottom: 2,
  },
  routeNote: {
    fontSize: 12,
    color: '#7B6E8A',
    lineHeight: 18,
    fontStyle: 'italic',
    marginTop: 4,
  },
  // ─── Official sources ──────────────────────────────────────────────────────
  sourceLink: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: BrandColors.cardBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BrandColors.cardBorderDefault,
    marginBottom: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  sourceLinkTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.primary,
    marginBottom: 2,
  },
  sourceLinkOrg: {
    fontSize: 12,
    color: BrandColors.textSecondary,
  },
  // ─── Warnings section ──────────────────────────────────────────────────────
  warningsSection: {
    backgroundColor: '#FFFBF0',
  },
  warningText: {
    fontSize: 13,
    color: '#5A4A00',
    lineHeight: 20,
    marginBottom: 6,
    paddingLeft: 4,
  },
  // ─── Disclaimer ────────────────────────────────────────────────────────────
  disclaimer: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  disclaimerText: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  // ─── Not found ─────────────────────────────────────────────────────────────
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  notFoundText: {
    fontSize: 16,
    color: BrandColors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  notFoundButton: {
    backgroundColor: BrandColors.primary,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});
