import React from 'react';
import {
  Modal,
  Pressable,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../constants';

type ErrorPopupProps = {
  visible: boolean;
  message: string;
  icon?: React.ReactNode; 
  onClose: () => void;
};

export function ErrorPopup({ visible, message, icon, onClose }: ErrorPopupProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      {/* 화면 어디든 터치하면 닫힘 */}
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Pressable 터치가 내부 컨텐츠에 전달되지 않게 */}
        <Pressable style={styles.popup} onPress={() => {}}>
          <View style={styles.content}>
            <View style={styles.iconBox}>
              {icon}
            </View>
            <Text style={styles.text}>{message}</Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: '70%',
    borderRadius: 6,
    backgroundColor: 'rgba(31,31,31,0.9)',
    paddingVertical: 16,
    paddingHorizontal: 12,
  } as ViewStyle,
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