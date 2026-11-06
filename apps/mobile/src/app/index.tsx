import { useSyncExternalStore, useRef, useState } from 'react';
import { router } from 'expo-router';
import {
  Dimensions,
  type KeyDownEvent,
  Platform,
  Pressable,
  type PressableInstance,
  ScrollView,
  StyleSheet,
  Text,
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

const webCardFocusRing =
  Platform.OS === 'web'
    ? ({ boxShadow: '0 0 0 2px #FFFFFF, 0 0 0 4px #6C5CE7' } as unknown as object)
    : {};

type PathwayCardProps = {
  pathway: (typeof PATHWAYS)[number];
  selected: boolean;
  onSelect: () => void;
  /** Arrow-key callback: move selection to the prev or next radio (ARIA radio-group pattern). */
  onNavigate: (direction: 'prev' | 'next') => void;
  extraStyle?: object;
  // React 19: ref is a regular prop — no forwardRef wrapper required.
  ref?: React.Ref<PressableInstance>;
};

function PathwayCard({ pathway, selected, onSelect, onNavigate, extraStyle, ref }: PathwayCardProps) {
  const [focused, setFocused] = useState(false);

  function handleKeyDown(e: KeyDownEvent) {
    switch (e.nativeEvent.key) {
      case ' ':
        // div[role=radio] does not receive Space as a click automatically; handle explicitly.
        e.preventDefault();
        onSelect();
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        onNavigate('next');
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        onNavigate('prev');
        break;
    }
  }

  return (
    <Pressable
      ref={ref}
      // role + aria-checked are the RN 0.70+ preferred API and map directly to
      // ARIA attributes in React Native Web. The older accessibilityRole +
      // accessibilityState.checked failed to produce aria-checked in the DOM
      // for this RN version (confirmed by QA4 accessibility tree inspection).
      role="radio"
      aria-checked={selected}
      // Roving tabIndex: selected card stays in the natural tab order;
      // others are skipped by Tab but remain focusable via arrow keys.
      tabIndex={selected ? 0 : -1}
      accessibilityLabel={pathway.label}
      accessibilityHint={pathway.description}
      onPress={onSelect}
      onKeyDown={handleKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={({ pressed }) => [
        styles.card,
        extraStyle,
        selected && styles.cardSelected,
        focused && styles.cardFocused,
        focused && webCardFocusRing,
        pressed && styles.cardPressed,
      ]}>
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

// useSyncExternalStore helpers — defined at module level so their identities
// are stable across renders (no re-subscription on every render).
// getIsDesktopServerSnapshot returns false so the SSR output (mobile layout)
// matches the initial client render at any viewport, eliminating hydration
// error #418 that occurred with useWindowDimensions() returning {width:0} on
// the server but the actual viewport width on the first client render.
function subscribeToDimensions(callback: () => void) {
  const sub = Dimensions.addEventListener('change', callback);
  return () => sub.remove();
}

function getIsDesktopSnapshot() {
  return Dimensions.get('window').width >= 768;
}

function getIsDesktopServerSnapshot() {
  return false;
}

export default function WelcomeScreen() {
  const [selected, setSelected] = useState<LearnerType>('high-school');
  const [ctaFocused, setCtaFocused] = useState(false);

  const isDesktop = useSyncExternalStore(
    subscribeToDimensions,
    getIsDesktopSnapshot,
    getIsDesktopServerSnapshot,
  );

  // One ref per card; used to move DOM focus when arrow keys change selection.
  const cardRefs = useRef<(PressableInstance | null)[]>([null, null, null]);

  function handleGetStarted() {
    router.push({ pathname: '/onboarding/[type]', params: { type: selected } });
  }

  function handleNavigate(currentId: LearnerType, direction: 'prev' | 'next') {
    const idx = PATHWAYS.findIndex((p) => p.id === currentId);
    const len = PATHWAYS.length;
    const newIdx = direction === 'next' ? (idx + 1) % len : (idx - 1 + len) % len;
    setSelected(PATHWAYS[newIdx].id);
    // Move DOM focus to the newly selected card so keyboard navigation is visible.
    cardRefs.current[newIdx]?.focus();
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        {/* Hero — purple band spans full width; content is centered via a row wrapper */}
        <View style={styles.hero}>
          <SafeAreaView edges={['top']}>
            <View style={styles.heroRow}>
              <View style={styles.heroContent}>
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
              </View>
            </View>
          </SafeAreaView>
        </View>

        {/* Pathway selection — row wrapper centers content without width: '100%' */}
        <View style={styles.selectionRow}>
          <View style={[styles.selectionContent, isDesktop && styles.selectionContentDesktop]}>
            <Text style={styles.sectionHeading}>Choose your path</Text>

            <View
              role="radiogroup"
              accessibilityLabel="Choose your learning path"
              style={[styles.cardsContainer, isDesktop && styles.cardsDesktop]}>
              {PATHWAYS.map((pathway, idx) => (
                <PathwayCard
                  key={pathway.id}
                  ref={(r) => {
                    cardRefs.current[idx] = r;
                  }}
                  pathway={pathway}
                  selected={selected === pathway.id}
                  onSelect={() => setSelected(pathway.id)}
                  onNavigate={(dir) => handleNavigate(pathway.id, dir)}
                  extraStyle={isDesktop ? styles.cardDesktop : undefined}
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
  // ScrollView content: width: '100%' gives children a defined width anchor on web so
  // text wraps correctly and flex: 1 in row wrappers has a real size to fill.
  scroll: {
    flexGrow: 1,
    width: '100%',
  },
  // Hero purple band: stretches to full scroll width by default (column-direction stretch)
  hero: {
    backgroundColor: BrandColors.heroBg,
    paddingBottom: 48,
  },
  // Row wrapper: centers heroContent without relying on width: '100%'
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  // Bounded content inside the hero; flex: 1 fills available row width up to maxWidth.
  // minWidth: 0 overrides the CSS default min-width: auto so this item can shrink below
  // its text content width at narrow viewports (320px, 390px) and text wraps correctly.
  heroContent: {
    flex: 1,
    maxWidth: 960,
    minWidth: 0,
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 16,
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
  // Row wrapper for the selection area; same centering pattern as heroRow
  selectionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexGrow: 1,
  },
  // Bounded selection content; flex: 1 fills row width up to maxWidth.
  // minWidth: 0 — same reason as heroContent.
  selectionContent: {
    flex: 1,
    maxWidth: 960,
    minWidth: 0,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 48,
    gap: 20,
  },
  selectionContentDesktop: {
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
  // flex:1 + flexBasis:0 gives equal widths; minWidth:0 allows shrinking below content size on web
  cardDesktop: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
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
