/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  COLORS,
  FONTS,
  FONT_SIZES,
  MOCK_MEMBERS,
  MOCK_SCHEDULES,
  MOCK_GROUPS,
} from '../../constants';
import { getAvatarUrl } from '../../utils';
import { Button, Header } from '../../components';
import { MembersTab } from './components/MembersTab';
import { SchedulesTab } from './components/SchedulesTab';
import PeopleIcon from '../../assets/icons/People.svg';
import CalendarPlusIcon from '../../assets/icons/Calendar-plus.svg';
import SettingIcon from '../../assets/icons/Setting.svg';
import { getTeamDetail, type TeamDetail } from '../../api/team';
import { useErrorPopup } from '../../components/popup/ErrorPopupProvider';
import { VoteTab } from './components/VoteTab';

type TabType = '멤버' | '일정' | '투표';

export function GroupDetailScreen({ navigation, route }: any) {
  const { groupId } = route.params || {};
  const [selectedTab, setSelectedTab] = useState<TabType>('일정');
  const insets = useSafeAreaInsets();

  const [team, setTeam] = useState<TeamDetail | null>(null);
  const { showErrorPopup } = useErrorPopup();

  useEffect(() => {
    if (!groupId) return;
    (async () => {
      try {
        const detail = await getTeamDetail(String(groupId));
        setTeam(detail);
      } catch {
        showErrorPopup('CHECK_NETWORK_AND_RETRY');
      }
    })();
  }, [groupId, showErrorPopup]);

  // 기존 MOCK 데이터는 fallback 용
  const group = MOCK_GROUPS.find(g => g.id === groupId) || MOCK_GROUPS[0];

  const renderTabContent = () => {
    switch (selectedTab) {
      case '멤버':
        return (
          <MembersTab
            members={MOCK_MEMBERS}
            memberCount={team?.memberCount}
            groupId={String(groupId)}
          />
        );
      case '일정':
        return (
          <SchedulesTab
            schedules={MOCK_SCHEDULES}
            onSchedulePress={scheduleId =>
              navigation.navigate('ScheduleDetail', { scheduleId })
            }
          />
        );
      case '투표':
        return (
          <VoteTab
            schedules={MOCK_SCHEDULES}
            onSchedulePress={scheduleId =>
              navigation.navigate('ScheduleDetail', { scheduleId })
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onBackPress={() => navigation.navigate('GroupList')}
        showMenu
        onMenuPress={() => {}}
      />

      {/* Group Info */}
      <View style={styles.groupInfo}>
        <Image
          source={{ uri: getAvatarUrl(100, String(groupId)) }}
          style={styles.groupImage}
        />
        <View style={styles.groupDetails}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupName}>
              {team?.groupName ?? group.name}
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('GroupSetting', { groupId: String(groupId) })
              }
            >
              <SettingIcon width={17} height={17} />
            </TouchableOpacity>
          </View>
          <View style={styles.groupMeta}>
            <View style={styles.metaItem}>
              <PeopleIcon width={16} height={16} fill={COLORS.text.primary} />
              <Text style={styles.metaText}>
                {(team?.memberCount ?? group.memberCount) + '명'}
              </Text>
            </View>
            {/* <View style={styles.dot} />
            <Text style={styles.metaText}>{group.category}</Text> */}
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {(['일정', '투표', '멤버'] as TabType[]).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.tabActive]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
            {selectedTab === tab && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: 34 + insets.bottom }]}
        onPress={() => navigation.navigate('ScheduleDate', { groupId })}
      >
        <CalendarPlusIcon />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.main.background,
  },
  groupInfo: {
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  groupImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: COLORS.gray['300'],
  },
  groupDetails: {
    flex: 1,
    gap: 6,
    justifyContent: 'center'
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  groupName: {
    fontSize: FONT_SIZES.title2,
    fontFamily: FONTS.pretendard.bold,
    color: COLORS.text.primary,
  },
  groupMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  metaText: {
    fontSize: FONT_SIZES.title5,
    fontFamily: FONTS.pretendard.medium,
    color: COLORS.text.primary,
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: COLORS.text.primary,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray['300'],
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabActive: {
    borderBottomWidth: 4,
    borderBottomColor: COLORS.main.normal,
  },
  tabText: {
    fontSize: FONT_SIZES.title3,
    fontFamily: FONTS.pretendard.semiBold,
    color: COLORS.gray['300'],
  },
  tabTextActive: {
    color: COLORS.main.normal,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: COLORS.main.normal,
  },
  content: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 34,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
