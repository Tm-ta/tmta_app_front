import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Platform} from 'react-native';
import { COLORS } from '../../../constants';

const ICONS = {
  google: require('../../../assets/icons/google.png'),
  apple: require('../../../assets/icons/apple.png'),
  naver: require('../../../assets/icons/naver.png'),
};

type Props = {
  onGooglePress: () => void;
  onNaverPress: () => void;
  onApplePress?: () => void;
};

export function LoginButtons({
  onGooglePress,
  onNaverPress,
  onApplePress,
}: Props) {
  return (
    <View style={styles.socialRow}>
      <TouchableOpacity
        style={[styles.button]}
        onPress={onGooglePress}
      >
        <Image source={ICONS.google} style={styles.icon} />
      </TouchableOpacity>

      {Platform.OS === 'ios' && onApplePress && (
        <TouchableOpacity
          style={[styles.button]}
          onPress={onApplePress}
        >
          <Image source={ICONS.apple} style={styles.icon} />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button]}
        onPress={onNaverPress}
      >
        <Image source={ICONS.naver} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  socialRow: {
    flexDirection: 'row',
    gap : 14,
    alignItems: 'center',
  },
  button: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    resizeMode: 'contain',
  },
});