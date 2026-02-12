import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../constants';

type ErrorPopupProps = {
  visible: boolean;
  message: string;
  icon?: React.ReactNode;
  onClose: () => void;
};

export function ErrorPopup({ visible, message, icon, onClose }: ErrorPopupProps) {
  if (!visible) return null;

  return (
    <View style={styles.root} pointerEvents="box-none">
      {/* dim overlay */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* popup */}
      <View style={styles.popupWrap} pointerEvents="box-none">
        <Pressable style={styles.popup} onPress={() => {}}>
          <View style={styles.content}>
            <View style={styles.iconBox}>{icon}</View>
            <Text style={styles.text}>{message}</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999999,
    elevation: 999999,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent', // 에러팝업은 딤 없어도 되면 투명
  },
  popupWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: '70%',
    borderRadius: 6,
    backgroundColor: 'rgba(31,31,31,0.9)',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  content: {
    alignItems: 'center',
    gap: 6,
  },
  iconBox: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: FONT_SIZES.title3,
    fontFamily: FONTS.pretendard.bold,
    color: COLORS.white,
  },
});