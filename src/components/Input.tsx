import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../constants';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  maxLength?: number;
  showCount?: boolean;
  variant?: 'default' | 'auth'; //로그인 input 스타일 추가
};

export function Input({
  label,
  error,
  containerStyle,
  maxLength,
  showCount,
  value,
  variant = 'default',
  ...props
}: InputProps) {

   const placeholderColor =
    variant === 'auth' ? COLORS.gray['400'] : COLORS.text.placeholder;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            variant === 'auth' && styles.inputAuth,
            error && styles.inputError,
            showCount && styles.inputWithCount,
          ]}
          placeholderTextColor={COLORS.text.placeholder}
          maxLength={maxLength}
          value={value}
          {...props}
        />
        {showCount && maxLength && (
          <Text style={styles.count}>
            ({value?.length || 0}/{maxLength})
          </Text>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  label: {
    fontSize: FONT_SIZES.title5,
    fontFamily: FONTS.pretendard.bold,
    color: COLORS.text.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.gray['300'],
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: FONT_SIZES.body1,
    fontFamily: FONTS.pretendard.regular,
    color: COLORS.text.primary,
  },
  inputAuth: {
    height: 56,
    backgroundColor: COLORS.gray['100'],
    borderWidth: 0,
    color: COLORS.black['600'],
  },
  inputWithCount: {
    paddingRight: 60,
  },
  inputError: {
    borderColor: '#FF0000',
  },
  count: {
    position: 'absolute',
    right: 10,
    fontSize: FONT_SIZES.body1,
    fontFamily: FONTS.pretendard.regular,
    color: COLORS.text.placeholder,
  },
  errorText: {
    fontSize: FONT_SIZES.body4,
    fontFamily: FONTS.pretendard.regular,
    color: '#FF0000',
  },
});

