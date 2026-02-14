/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import PeopleIcon from '../../../assets/icons/People-gray.svg';
import { COLORS, FONTS, FONT_SIZES } from '../../../constants';
import { getAvatarUrl } from '../../../utils';
import type { TeamListItem } from '../../../api/team';

type GroupCardProps = {
  team: TeamListItem;
  onPress: () => void;
};

export function GroupCard({ team, onPress }: GroupCardProps) {
  // 표시할 아바타 개수 (memberCount, memberProfiles 기준, 최대 3개)
  const displayCount = Math.min(
    3,
    team.memberCount,
    team.memberProfiles.length,
  );

  // "+N" 표시용 남은 멤버 수 (명시 요구사항: memberCount - 3)
  const remainingCount = team.memberCount - 3;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: getAvatarUrl(82, team.groupId) }}
        style={styles.imageContainer}
      />
      <View style={styles.contentContainer}>
        {team.state === 'RECRUITING' && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>약속 모집 중</Text>
          </View>
        )}
        <Text style={styles.name}>{team.groupName}</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <PeopleIcon width={16} height={16} fill={COLORS.text.primary} />
            <Text style={styles.infoText}>{team.memberCount}명</Text>
          </View>
          {displayCount > 0 && (
            <View style={styles.membersPreview}>
              <View style={styles.memberAvatars}>
                {team.memberProfiles.slice(0, displayCount).map((url, index) => {
                  const hasProfile = !!url;
                  return hasProfile ? (
                    <Image
                      key={`${url}-${index}`}
                      source={{ uri: url }}
                      style={[
                        styles.avatar,
                        {
                          marginLeft: index === 0 ? 0 : -8,
                        },
                      ]}
                    />
                  ) : (
                    <View
                      key={`placeholder-${index}`}
                      style={[
                        styles.avatar,
                        {
                          marginLeft: index === 0 ? 0 : -8,
                        },
                      ]}
                    />
                  );
                })}
              </View>
              {team.memberCount > 3 && remainingCount > 0 && (
                <Text style={styles.moreMembers}>+{remainingCount}</Text>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 124,
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 16,
    padding: 20,
    marginBottom: 12, // card gap
    // borderColor: COLORS.pink['300'],
    borderColor: '#FF9EB650',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: COLORS.white,

    // shadow (iOS)
    shadowColor: COLORS.pink['200'],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    // shadow (Android)
    elevation: 5,

  },
  imageContainer: {
    width: 88,
    height: 88,
    borderRadius: 12,
    backgroundColor: COLORS.gray['300'],
  },
  contentContainer: {
    flex: 1,
    gap: 4,
    justifyContent: 'center'
  },
  name: {
    fontSize: FONT_SIZES.title2,
    fontFamily: FONTS.pretendard.semiBold,
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
    color: COLORS.gray['700'], // 추후 수정 필요. 텍스트 색상 일괄 적용해야 함 
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
    backgroundColor: COLORS.gray['700'],
  },
  moreMembers: {
    fontSize: FONT_SIZES.body4,
    fontFamily: FONTS.pretendard.regular,
    color: COLORS.text.primary,
  },
  badge: {
    width: 62,
    alignItems: 'center',
    backgroundColor: COLORS.pink['75'],
    borderRadius: 20,
    padding: 2,
  },
  badgeText: {
    fontSize: FONT_SIZES.body5,
    fontFamily: FONTS.pretendard.semiBold,
    color: COLORS.black['500'],
  },
});
