import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../../constants';
import { getAvatarUrl } from '../../../utils';
import type { Member } from '../../../types';

import Dots from '../../../assets/icons/Dots.svg';

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
              {/* <Text style={styles.joinDate}>{member.joinDate}</Text> */}
              <Text style={styles.joinDate}>모임장</Text>
            </View>

            {/* 오른쪽 끝 Dots 아이콘 - 모임지기만 보여야 함 */}
            <TouchableOpacity
              style={styles.moreButton}
              activeOpacity={0.7}
              onPress={() => {
                // TODO: 나중에 팝업/액션시트 - 추방
                // openMemberMenu(member)
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Dots width={24} height={24} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: FONT_SIZES.title2,
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
    flex: 1,
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

  moreButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // (B) Image 방식일 때만 필요
  // moreIcon: { width: 24, height: 24 },
});