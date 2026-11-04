import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { BrandColors } from '@/constants/theme';

const MAX_LENGTH = 100;

type TextFieldProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  maxLength?: number;
  error?: string;
  hint?: string;
  optional?: boolean;
  testID?: string;
};

export function TextField({
  value,
  onChange,
  label,
  placeholder,
  maxLength = MAX_LENGTH,
  error,
  hint,
  optional = false,
  testID,
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const remaining = maxLength - value.length;
  const nearLimit = remaining <= 20;
  const errorId = testID ? `${testID}-error` : undefined;
  const hintId = testID ? `${testID}-hint` : undefined;

  return (
    <View testID={testID}>
      <View style={styles.labelRow}>
        <Text style={styles.label} nativeID={testID ? `${testID}-label` : undefined}>
          {label}
        </Text>
        {optional && <Text style={styles.optionalTag}>(optional)</Text>}
      </View>
      {hint != null && hint !== '' && (
        <Text nativeID={hintId} style={styles.hint}>
          {hint}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={BrandColors.textSecondary}
        maxLength={maxLength}
        multiline={false}
        style={[styles.input, focused && styles.inputFocused, error != null && error !== '' && styles.inputError]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={label}
        accessibilityHint={hint}
        aria-describedby={error ? errorId : hintId}
        testID={testID ? `${testID}-input` : undefined}
      />
      <View style={styles.footer}>
        {error != null && error !== '' ? (
          <Text nativeID={errorId} role="alert" style={styles.error}>
            {error}
          </Text>
        ) : (
          <View />
        )}
        {nearLimit && (
          <Text style={[styles.counter, remaining <= 0 && styles.counterOver]}>
            {remaining} left
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.textPrimary,
  },
  optionalTag: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    fontWeight: '400',
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
    color: BrandColors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: BrandColors.cardBg,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: BrandColors.cardBorderDefault,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: BrandColors.textPrimary,
    minHeight: 44,
  },
  inputFocused: {
    borderColor: BrandColors.primary,
  },
  inputError: {
    borderColor: '#C0392B',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 4,
    minHeight: 18,
  },
  error: {
    fontSize: 13,
    lineHeight: 18,
    color: '#C0392B',
    fontWeight: '500',
    flex: 1,
  },
  counter: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    marginLeft: 8,
  },
  counterOver: {
    color: '#C0392B',
    fontWeight: '600',
  },
});
