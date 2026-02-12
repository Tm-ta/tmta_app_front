/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Modal, Pressable, View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../constants';

type TestModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function TestModal({ visible, onClose }: TestModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose} // android back
      onShow={() => console.log('[TestModal] onShow fired')}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>테스트 모달</Text>
          <Text style={styles.body}>이게 안 뜨면 Modal</Text>

          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>닫기</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    height: 187,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: FONT_SIZES.title2,
    fontFamily: FONTS.pretendard.bold,
    color: COLORS.text.primary,
  },
  body: {
    fontSize: FONT_SIZES.body1,
    fontFamily: FONTS.pretendard.regular,
    color: COLORS.text.secondary,
  },
  button: {
    height: 48,
    borderRadius: 10,
    backgroundColor: COLORS.main.normal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: FONT_SIZES.heading3,
    fontFamily: FONTS.pretendard.bold,
    color: COLORS.text.primary,
  },
});