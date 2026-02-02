/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, MoreVertical } from 'lucide-react-native';
import { COLORS, FONTS, FONT_SIZES } from '../constants';
import ListIcon from '../assets/icons/List.svg';

type HeaderProps = {
  title?: string;
  onBackPress?: () => void;
  onMenuPress?: () => void;
  showBack?: boolean;
  showMenu?: boolean;
};

export function Header({
  title,
  onBackPress,
  onMenuPress,
  showBack = true,
  showMenu = false,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
            <ChevronLeft color={COLORS.text.primary} size={24} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerSection}>
        {title && <Text style={styles.title}>{title}</Text>}
      </View>

      <View style={styles.rightSection}>
        {showMenu && (
          <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
            {/* <MoreVertical color={COLORS.text.primary} size={24} /> */}
            <ListIcon width={24} height={24} fill={COLORS.text.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: COLORS.main.background,
  },
  leftSection: {
    width: 40,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: 8,
  },
  title: {
    fontSize: FONT_SIZES.title2,
    fontFamily: FONTS.pretendard.bold,
    color: COLORS.text.primary,
  },
});
