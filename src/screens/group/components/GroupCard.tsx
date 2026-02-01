/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import PeopleIcon from '../../../assets/icons/People.svg';
import { COLORS, FONTS, FONT_SIZES } from '../../../constants';
import { getAvatarUrl } from '../../../utils';
import type { Group } from '../../../types';

type GroupCardProps = {
  group: Group;
  onPress: () => void;
};

export function GroupCard({ group, onPress }: GroupCardProps) {
  // 표시할 아바타 개수 (최대 3개)
  const displayCount = Math.min(group.recentMembers.length, 3);

  // 남은 멤버 수 계산
  const remainingCount = group.memberCount - displayCount;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: getAvatarUrl(82, group.id) }}
        style={styles.imageContainer}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.name}>{group.name}</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <PeopleIcon width={16} height={16} fill={COLORS.text.primary} />
            <Text style={styles.infoText}>{group.memberCount}명</Text>
          </View>
          {group.recentMembers.length > 0 && (
            <View style={styles.membersPreview}>
              <View style={styles.memberAvatars}>
                {group.recentMembers.slice(0, 3).map((memberId, index) => (
                  <Image
                    key={index}
                    source={{ uri: getAvatarUrl(20, memberId) }}
                    style={[
                      styles.avatar,
                      {
                        marginLeft: index === 0 ? 0 : -8,
                      },
                    ]}
                  />
                ))}
              </View>
              {remainingCount > 0 && (
                <Text style={styles.moreMembers}>+{remainingCount}</Text>
              )}
            </View>
          )}
        </View>
        {group.isRecruitingSchedule && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>일정 모집 중</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 16,
  },
  imageContainer: {
    width: 82,
    height: 82,
    borderRadius: 4,
    backgroundColor: COLORS.gray['300'],
  },
  contentContainer: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: FONT_SIZES.title,
    fontFamily: FONTS.pretendard.bold,
    color: COLORS.text.primary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  infoText: {
    fontSize: FONT_SIZES.title5,
    fontFamily: FONTS.pretendard.medium,
    color: COLORS.text.primary,
  },
  membersPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  memberAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.white,
    backgroundColor: COLORS.gray['300'],
  },
  moreMembers: {
    fontSize: FONT_SIZES.body4,
    fontFamily: FONTS.pretendard.regular,
    color: COLORS.text.primary,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.main.light,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: FONT_SIZES.title5,
    fontFamily: FONTS.pretendard.medium,
    color: COLORS.main.normal,
  },
});
