import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../../constants';
import { getAvatarUrl } from '../../../utils';
import type { Member } from '../../../types';

type MembersTabProps = {
  members: Member[];
};

export function MembersTab({ members }: MembersTabProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        멤버 <Text style={styles.count}>{members.length}</Text>
      </Text>

      <View style={styles.memberList}>
        {members.map((member) => (
          <View key={member.id} style={styles.memberItem}>
            <Image 
              source={{ uri: getAvatarUrl(50, member.id) }} 
              style={styles.avatar}
            />
            <View style={styles.memberInfo}>
              <Text style={styles.nickname}>{member.nickname}</Text>
              <Text style={styles.joinDate}>{member.joinDate}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontFamily: FONTS.pretendard.bold,
    color: COLORS.text.primary,
    marginBottom: 20,
  },
  count: {
    color: COLORS.main.normal,
  },
  memberList: {
    gap: 0,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.gray['300'],
  },
  memberInfo: {
    gap: 5,
  },
  nickname: {
    fontSize: FONT_SIZES.title3,
    fontFamily: FONTS.pretendard.semiBold,
    color: COLORS.text.primary,
  },
  joinDate: {
    fontSize: FONT_SIZES.body4,
    fontFamily: FONTS.pretendard.regular,
    color: COLORS.text.secondary,
  },
});

