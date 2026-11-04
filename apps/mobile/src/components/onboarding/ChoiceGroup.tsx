import { useRef, useState } from 'react';
import {
  type KeyDownEvent,
  Platform,
  Pressable,
  type PressableInstance,
  StyleSheet,
  Text,
  type ViewStyle,
  View,
} from 'react-native';

import { BrandColors } from '@/constants/theme';

export type ChoiceOption = {
  value: string;
  label: string;
  qualifier?: string;
};

type ChoiceGroupProps = {
  options: ChoiceOption[];
  selected: string | null;
  onSelect: (value: string) => void;
  label: string;
  error?: string;
  testID?: string;
};

// Web-only outline focus ring; cast to avoid TypeScript rejecting non-RN CSS props.
const webFocusRing =
  Platform.OS === 'web'
    ? ({ boxShadow: '0 0 0 3px #6C5CE7, 0 0 0 5px #fff' } as unknown as ViewStyle)
    : {};

type OptionCardProps = {
  option: ChoiceOption;
  selected: boolean;
  onSelect: () => void;
  onNavigate: (dir: 'prev' | 'next') => void;
  ref?: React.Ref<PressableInstance>;
};

function OptionCard({ option, selected, onSelect, onNavigate, ref }: OptionCardProps) {
  const [focused, setFocused] = useState(false);

  function handleKeyDown(e: KeyDownEvent) {
    switch (e.nativeEvent.key) {
      case ' ':
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
      role="radio"
      aria-checked={selected}
      tabIndex={selected ? 0 : -1}
      accessibilityLabel={option.label}
      accessibilityHint={option.qualifier}
      onPress={onSelect}
      onKeyDown={handleKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        focused && styles.cardFocused,
        focused && webFocusRing,
        pressed && styles.cardPressed,
      ]}>
      <View style={styles.cardRow}>
        <View
          style={[styles.radio, selected && styles.radioSelected]}
          accessibilityElementsHidden
          importantForAccessibility="no">
          {selected && <View style={styles.radioDot} />}
        </View>
        <View style={styles.cardText}>
          <Text style={[styles.cardLabel, selected && styles.cardLabelSelected]}>
            {option.label}
          </Text>
          {option.qualifier != null && (
            <Text style={styles.qualifier}>{option.qualifier}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export function ChoiceGroup({
  options,
  selected,
  onSelect,
  label,
  error,
  testID,
}: ChoiceGroupProps) {
  const refs = useRef<(PressableInstance | null)[]>(options.map(() => null));

  function handleNavigate(currentValue: string, dir: 'prev' | 'next') {
    const idx = options.findIndex((o) => o.value === currentValue);
    const len = options.length;
    const newIdx = dir === 'next' ? (idx + 1) % len : (idx - 1 + len) % len;
    onSelect(options[newIdx].value);
    refs.current[newIdx]?.focus();
  }

  const errorId = testID ? `${testID}-error` : undefined;

  return (
    <View testID={testID}>
      <View
        role="radiogroup"
        accessibilityLabel={label}
        aria-describedby={error ? errorId : undefined}
        style={styles.group}>
        {options.map((option, idx) => (
          <OptionCard
            key={option.value}
            ref={(r) => {
              refs.current[idx] = r;
            }}
            option={option}
            selected={selected === option.value}
            onSelect={() => {
              onSelect(option.value);
              refs.current[idx]?.focus();
            }}
            onNavigate={(dir) => handleNavigate(option.value, dir)}
          />
        ))}
      </View>
      {error != null && error !== '' && (
        <Text
          nativeID={errorId}
          role="alert"
          style={styles.error}
          testID={testID ? `${testID}-error-text` : undefined}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 10,
  },
  card: {
    backgroundColor: BrandColors.cardBg,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: BrandColors.cardBorderDefault,
    padding: 16,
    minHeight: 44,
  },
  cardSelected: {
    borderColor: BrandColors.cardBorderSelected,
    backgroundColor: '#FDFCFF',
  },
  cardFocused: {
    borderColor: BrandColors.primary,
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: BrandColors.cardBorderDefault,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  radioSelected: {
    borderColor: BrandColors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: BrandColors.primary,
  },
  cardText: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: BrandColors.textPrimary,
    lineHeight: 22,
  },
  cardLabelSelected: {
    fontWeight: '700',
    color: BrandColors.primary,
  },
  qualifier: {
    fontSize: 12,
    lineHeight: 18,
    color: BrandColors.textSecondary,
    fontStyle: 'italic',
  },
  error: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    color: '#C0392B',
    fontWeight: '500',
  },
});
