import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components';
import { COLORS, FONTS, FONT_SIZES } from '../../constants';
import { getAvatarUrl } from '../../utils';
import { getTeamDetail, leaveTeam, type TeamDetail } from '../../api/teams';
import { useConfirm } from '../../components/popup/ConfirmProvider';
import { useErrorPopup } from '../../components/popup/ErrorPopupProvider';

export function GroupSettingScreen({ navigation, route }: any) {
  const { groupId } = route.params || {};
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const { showConfirm } = useConfirm();
  const { showErrorPopup } = useErrorPopup();

  useEffect(() => {
    if (!groupId) return;
    (async () => {
      try {
        const detail = await getTeamDetail(String(groupId));
        setTeam(detail);
      } catch (e) {
        console.log('FAIL /api/v1/teams/{teamId}', e);
      }
    })();
  }, [groupId]);

  const handleLeaveGroup = () => {
    if (!groupId) return;
    showConfirm('leaveGroup', {
      onLeftPress: async () => {
        try {
          await leaveTeam(String(groupId));
          navigation.navigate('GroupList');
        } catch (err: any) {
          if (err?.response?.status === 400) {
            showErrorPopup('CANNOT_LEAVE_BEFORE_TRANSFER_OWNER');
          } else {
            showErrorPopup('GROUP_LEAVE_FAILED');
          }
        }
      },
    });
  };

  const name = team?.groupName ?? '';

  return (
    <SafeAreaView style={styles.container}>
      <Header
        showMenu={false}
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <Image
          source={{ uri: getAvatarUrl(100, String(groupId)) }}
          style={styles.groupImage}
        />
        <Text style={styles.groupName}>{name}</Text>
      </View>

      <View style={styles.footer}>
        <Pressable onPress={handleLeaveGroup}>
          <Text style={styles.leaveText}>모임 나가기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.main.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  groupImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.gray['300'],
    marginBottom: 16,
  },
  groupName: {
    fontSize: FONT_SIZES.heading,
    fontFamily: FONTS.pretendard.extraBold,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 34,
    alignItems: 'flex-start',
  },
  leaveText: {
    fontSize: FONT_SIZES.body2,
    fontFamily: FONTS.pretendard.semiBold,
    color: COLORS.black['500'],
  },
});

