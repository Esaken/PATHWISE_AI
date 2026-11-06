import { router, useLocalSearchParams } from 'expo-router';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CATALOG } from '@/catalog/data';
import {
  categoryLabel,
  creditDisclaimer,
  creditLabel,
  formatDelivery,
  formatDuration,
  formatPrice,
  topicLabel,
} from '@/catalog/format';
import { StatusBadge } from '@/components/catalog/StatusBadge';
import { BrandColors, MaxContentWidth } from '@/constants/theme';

function openUrl(url: string) {
  if (Platform.OS === 'web') {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    Linking.openURL(url);
  }
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function SourceLink({ url }: { url: string }) {
  return (
    <Pressable
      onPress={() => openUrl(url)}
      accessibilityRole="link"
      accessibilityLabel={`Open official source: ${url} (opens in new tab)`}
      style={styles.sourceLink}>
      <Text style={styles.sourceLinkText} numberOfLines={1}>
        {url}
      </Text>
      <Text style={styles.externalNote}> (external link — requires internet)</Text>
    </Pressable>
  );
}

function InvalidIdScreen() {
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.invalidContent}>
          <Text accessibilityRole="header" style={styles.invalidHeading}>
            Opportunity not found
          </Text>
          <Text style={styles.invalidBody}>
            No verified opportunity with this ID exists in the catalog. The link may be outdated.
          </Text>
          <Pressable
            onPress={() => { (router.replace as any)('/opportunities'); }}
            accessibilityRole="button"
            accessibilityLabel="Browse all opportunities"
            style={styles.backButton}
            testID="invalid-id-back-button">
            <Text style={styles.backButtonText}>Browse all opportunities</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default function OpportunityDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const opp = CATALOG.find((o) => o.id === id);

  if (!opp) return <InvalidIdScreen />;

  const topicLabels = opp.topics.map(topicLabel).join(', ');

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeHeader} edges={['top']}>
        <View style={styles.headerBar}>
          <Pressable
            onPress={() => {
              if (router.canGoBack()) router.back();
              else (router.replace as any)('/opportunities');
            }}
            accessibilityRole="button"
            accessibilityLabel="Back to opportunities list"
            style={styles.backNav}
            testID="detail-back-button">
            <Text style={styles.backNavText}>← Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.provider}>{opp.provider}</Text>
            <Text accessibilityRole="header" style={styles.title}>
              {opp.title}
            </Text>
            <Text style={styles.categoryChip}>{categoryLabel(opp.category)}</Text>
          </View>

          <View style={styles.badgeSection}>
            <StatusBadge creditRecognition={opp.creditRecognition} />
            <Text style={styles.disclaimer}>{creditDisclaimer(opp.creditRecognition)}</Text>
          </View>

          <Text style={styles.description}>{opp.description}</Text>

          <View style={styles.card}>
            <Text style={styles.cardHeading}>Details</Text>
            <DetailRow label="Topic(s)" value={topicLabels} />
            <DetailRow label="Price" value={formatPrice(opp.price)} />
            {opp.price.kind === 'unknown' && (
              <Text style={styles.unknownReason}>{opp.price.reason}</Text>
            )}
            <DetailRow label="Duration" value={formatDuration(opp.duration)} />
            {opp.duration.kind === 'unknown' && (
              <Text style={styles.unknownReason}>{opp.duration.reason}</Text>
            )}
            <DetailRow label="Delivery" value={formatDelivery(opp)} />
            {opp.availability.mode === 'in-person' && (
              <Text style={styles.unknownReason}>{opp.availability.locationSummary}</Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardHeading}>Eligibility</Text>
            <Text style={styles.eligibilitySummary}>{opp.learnerEligibility.summary}</Text>
            {opp.learnerEligibility.minimumAge !== null && (
              <Text style={styles.eligibilityDetail}>
                Minimum age: {opp.learnerEligibility.minimumAge}
              </Text>
            )}
            {opp.learnerEligibility.prerequisites.length > 0 && (
              <Text style={styles.eligibilityDetail}>
                Prerequisites: {opp.learnerEligibility.prerequisites.join(', ')}
              </Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardHeading}>Classification</Text>
            <Text style={styles.classLabel}>{creditLabel(opp.creditRecognition)}</Text>
            <Text style={styles.classDisclaimer}>{creditDisclaimer(opp.creditRecognition)}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardHeading}>Verification</Text>
            <Text style={styles.verificationStatus}>
              {opp.verification.status === 'verified-official-source'
                ? 'Verified from official source'
                : 'Needs recheck — information may have changed'}
            </Text>
            <Text style={styles.verificationDate}>
              Last reviewed: {opp.verification.checkedOn}
            </Text>
            <Text style={styles.verificationNotes}>{opp.verification.evidenceNotes}</Text>
            <Text style={styles.sourcesHeading}>Official sources</Text>
            {opp.verification.sourceUrls.map((url) => (
              <SourceLink key={url} url={url} />
            ))}
          </View>

          <View style={styles.officialLinkSection}>
            <Pressable
              onPress={() => openUrl(opp.officialUrl)}
              accessibilityRole="link"
              accessibilityLabel={`Visit official page for ${opp.title} (opens in new tab)`}
              style={styles.officialButton}
              testID="detail-official-link">
              <Text style={styles.officialButtonText}>Visit official page</Text>
              <Text style={styles.officialButtonNote}>Opens externally — requires internet</Text>
            </Pressable>
          </View>
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
  safe: {
    flex: 1,
    backgroundColor: BrandColors.heroBg,
  },
  safeHeader: {
    backgroundColor: BrandColors.heroBg,
  },
  headerBar: {
    backgroundColor: BrandColors.heroBg,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  backNav: {
    alignSelf: 'flex-start',
    minHeight: 44,
    justifyContent: 'center',
    paddingRight: 16,
  },
  backNavText: {
    color: BrandColors.textOnPurple,
    fontSize: 15,
    fontWeight: '600',
  },
  scroll: {
    paddingBottom: 48,
  },
  content: {
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 16,
  },
  titleSection: {
    gap: 6,
  },
  provider: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: BrandColors.textPrimary,
    lineHeight: 30,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    fontSize: 11,
    color: BrandColors.textSecondary,
    backgroundColor: BrandColors.cardBg,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: BrandColors.cardBorderDefault,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeSection: {
    gap: 8,
    backgroundColor: BrandColors.cardBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BrandColors.cardBorderDefault,
    padding: 14,
  },
  disclaimer: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    lineHeight: 18,
  },
  description: {
    fontSize: 15,
    color: BrandColors.textPrimary,
    lineHeight: 22,
  },
  card: {
    backgroundColor: BrandColors.cardBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BrandColors.cardBorderDefault,
    padding: 16,
    gap: 8,
  },
  cardHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: BrandColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    minWidth: 0,
    flexWrap: 'wrap',
  },
  detailLabel: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    fontWeight: '600',
    flexShrink: 0,
  },
  detailValue: {
    fontSize: 13,
    color: BrandColors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  unknownReason: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  eligibilitySummary: {
    fontSize: 14,
    color: BrandColors.textPrimary,
    lineHeight: 20,
  },
  eligibilityDetail: {
    fontSize: 13,
    color: BrandColors.textSecondary,
  },
  classLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: BrandColors.textPrimary,
  },
  classDisclaimer: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    lineHeight: 18,
  },
  verificationStatus: {
    fontSize: 13,
    fontWeight: '600',
    color: BrandColors.textPrimary,
  },
  verificationDate: {
    fontSize: 12,
    color: BrandColors.textSecondary,
  },
  verificationNotes: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    lineHeight: 18,
  },
  sourcesHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: BrandColors.textSecondary,
    marginTop: 4,
  },
  sourceLink: {
    paddingVertical: 4,
    minHeight: 44,
    justifyContent: 'center',
    gap: 2,
  },
  sourceLinkText: {
    fontSize: 13,
    color: BrandColors.primary,
    textDecorationLine: 'underline',
  },
  externalNote: {
    fontSize: 11,
    color: BrandColors.textSecondary,
  },
  officialLinkSection: {
    marginTop: 8,
  },
  officialButton: {
    backgroundColor: BrandColors.primary,
    borderRadius: 10,
    padding: 16,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  officialButtonText: {
    color: BrandColors.textOnPurple,
    fontSize: 16,
    fontWeight: '700',
  },
  officialButtonNote: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
  },
  invalidContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  invalidHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: BrandColors.textPrimary,
    textAlign: 'center',
  },
  invalidBody: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  backButton: {
    backgroundColor: BrandColors.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  backButtonText: {
    color: BrandColors.textOnPurple,
    fontWeight: '600',
    fontSize: 14,
  },
});
