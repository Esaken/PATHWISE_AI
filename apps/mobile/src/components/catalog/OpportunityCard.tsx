import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { RankedOpportunity } from '@/catalog/types';
import { formatDelivery, formatDuration, formatPrice, categoryLabel, topicLabel } from '@/catalog/format';
import { BrandColors } from '@/constants/theme';
import { StatusBadge } from './StatusBadge';

type Props = {
  ranked: RankedOpportunity;
  onPress: () => void;
};

export function OpportunityCard({ ranked, onPress }: Props) {
  const { opportunity: opp, matchReasons } = ranked;
  const topicLabels = opp.topics.map(topicLabel).join(' · ');

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${opp.title} by ${opp.provider}`}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      testID={`opportunity-card-${opp.id}`}>
      <View style={styles.header}>
        <Text style={styles.provider} numberOfLines={1}>{opp.provider}</Text>
        <Text style={styles.category}>{categoryLabel(opp.category)}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>{opp.title}</Text>

      <View style={styles.badgeRow}>
        <StatusBadge creditRecognition={opp.creditRecognition} />
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>{topicLabels}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detail}>{formatPrice(opp.price)}</Text>
        <Text style={styles.dot}>·</Text>
        <Text style={styles.detail}>{formatDuration(opp.duration)}</Text>
        <Text style={styles.dot}>·</Text>
        <Text style={styles.detail}>{formatDelivery(opp)}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.verifiedDate}>
          {opp.verification.status === 'verified-official-source'
            ? `Verified ${opp.verification.checkedOn}`
            : `Needs recheck — last reviewed ${opp.verification.checkedOn}`}
        </Text>
        {matchReasons.length > 0 && (
          <Text style={styles.matchHint} numberOfLines={1}>
            {matchReasons.map((r) => r.label).join(' · ')}
          </Text>
        )}
      </View>

      <Text style={styles.viewDetails} accessibilityElementsHidden>
        View details →
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    minWidth: 0,
  },
  provider: {
    flex: 1,
    fontSize: 12,
    color: BrandColors.textSecondary,
    marginRight: 8,
  },
  category: {
    fontSize: 11,
    color: BrandColors.textSecondary,
    backgroundColor: BrandColors.surface,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.textPrimary,
    marginBottom: 10,
    lineHeight: 22,
  },
  badgeRow: {
    marginBottom: 10,
  },
  metaRow: {
    marginBottom: 6,
  },
  meta: {
    fontSize: 12,
    color: BrandColors.primary,
    fontWeight: '500',
  },
  detailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  detail: {
    fontSize: 13,
    color: BrandColors.textSecondary,
  },
  dot: {
    fontSize: 13,
    color: BrandColors.textSecondary,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: BrandColors.cardBorderDefault,
    paddingTop: 8,
    gap: 2,
  },
  verifiedDate: {
    fontSize: 11,
    color: BrandColors.textSecondary,
  },
  matchHint: {
    fontSize: 11,
    color: BrandColors.primary,
    fontStyle: 'italic',
  },
  viewDetails: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: BrandColors.primary,
    alignSelf: 'flex-end',
  },
});
