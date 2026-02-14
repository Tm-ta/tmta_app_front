import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../../constants';
import { getAvatarUrl } from '../../../utils';
import type { Member } from '../../../types';
import { useConfirm } from '../../../components/popup/ConfirmProvider';
import { kickMember } from '../../../api/team';
import { useErrorPopup } from '../../../components/popup/ErrorPopupProvider';

import Dots from '../../../assets/icons/Dots.svg';

type MembersTabProps = {
  members: Member[];
  memberCount?: number;
  groupId: string;
};

export function MembersTab({ members, memberCount, groupId }: MembersTabProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const { showConfirm } = useConfirm();
  const { showErrorPopup } = useErrorPopup();

  const countText = memberCount ?? members.length;

  const openMenu = (member: Member) => {
    setSelectedMember(member);
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setSelectedMember(null);
  };

  const handleKick = () => {
    if (!selectedMember) return;

    showConfirm('deleteMember', {
      onLeftPress: async () => {
        try {
          await kickMember(String(groupId), String(selectedMember.id));
        } catch {
          showErrorPopup('MEMBER_KICK_FAILED');
        }
      },
    });
    closeMenu();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        멤버 <Text style={styles.count}>{countText}</Text>
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
              onPress={() => openMenu(member)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Dots width={24} height={24} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {menuVisible && (
        <View style={styles.menuOverlay} pointerEvents="box-none">
          <Pressable style={styles.menuDim} onPress={closeMenu} />

          <View style={styles.menuSheet}>
            <TouchableOpacity style={styles.menuItem} onPress={handleKick}>
              <Text style={styles.menuItemTextDanger}>추방하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
              <Text style={styles.menuItemText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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

  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  menuDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuSheet: {
    width: '100%',
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  menuItem: {
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: FONT_SIZES.body2,
    fontFamily: FONTS.pretendard.medium,
    color: COLORS.text.primary,
  },
  menuItemTextDanger: {
    fontSize: FONT_SIZES.body2,
    fontFamily: FONTS.pretendard.medium,
    color: COLORS.black['500'],
  },
});