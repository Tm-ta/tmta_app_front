import React from 'react';
import { Pressable, View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../constants';
import type { ConfirmCase } from '../../constants/confirmCases';

type Props = {
  visible: boolean;
  data: ConfirmCase | null;
  onClose: () => void;
  onLeftPress?: () => void;
  onRightPress?: () => void;
};

export function ConfirmOverlay({
  visible,
  data,
  onClose,
  onLeftPress,
  onRightPress,
}: Props) {
  if (!visible || !data) return null;

  const { width } = Dimensions.get('window');
  const modalWidth = Math.round(width * 0.9);

  const handleLeft = () => {
    onLeftPress?.();
    onClose();
  };

  const handleRight = () => {
    onRightPress?.();
    onClose();
  };

  return (
    <View style={styles.root} pointerEvents="box-none">
      {/* dim */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* modal */}
      <View style={styles.centerWrap} pointerEvents="box-none">
        <View style={[styles.modal, { width: modalWidth }]}>
          <View style={styles.textArea}>
            <Text style={styles.title}>{data.title}</Text>
            <Text style={styles.body}>{data.body}</Text>
          </View>

          <View style={styles.buttonsRow}>
            <Pressable style={styles.leftBtn} onPress={handleLeft}>
              <Text style={styles.btnText}>{data.leftText}</Text>
            </Pressable>

            <Pressable style={styles.rightBtn} onPress={handleRight}>
              <Text style={styles.btnText}>{data.rightText}</Text>
            </Pressable>
          </View>
        </View>
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
    backgroundColor: 'rgba(0,0,0,0.5)', // 뒤 검정 50%
  },
  centerWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    height: 187,
    backgroundColor: COLORS.white,
    borderRadius: 12, // 필요 없으면 6으로
    padding: 20,
    justifyContent: 'space-between',
  },

  textArea: {
    gap: 8,
  },
  title: {
    fontSize: FONT_SIZES.title1,
    fontFamily: FONTS.pretendard.bold,
    color: COLORS.text.primary,
  },
  body: {
    fontSize: FONT_SIZES.body1,
    fontFamily: FONTS.pretendard.regular,
    color: COLORS.text.secondary,
  },

  buttonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  leftBtn: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray['500'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightBtn: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    backgroundColor: COLORS.main.normal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: FONT_SIZES.heading3,
    fontFamily: FONTS.pretendard.bold,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
});