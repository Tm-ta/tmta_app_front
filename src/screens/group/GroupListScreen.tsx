import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import {
  COLORS,
  FONTS,
  FONT_SIZES,
  MOCK_GROUPS,
  CATEGORIES,
} from '../../constants';
import { GroupCard } from './components/GroupCard';

export function GroupListScreen({ navigation }: any) {
  const [selectedTab, setSelectedTab] = useState<'약속' | '모임'>('모임');
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const filteredGroups = MOCK_GROUPS.filter(group => {
    if (
      selectedFilter === '일정 모집 중인 그룹만' &&
      !group.isRecruitingSchedule
    ) {
      return false;
    }
    if (selectedCategory !== '전체' && group.category !== selectedCategory) {
      return false;
    }
    return group.type === selectedTab;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header Tabs */}
        <View style={styles.headerTabs}>
          <TouchableOpacity onPress={() => setSelectedTab('약속')}>
            <Text
              style={[
                styles.headerTab,
                selectedTab === '약속' && styles.headerTabActive,
              ]}
            >
              약속
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedTab('모임')}>
            <Text
              style={[
                styles.headerTab,
                selectedTab === '모임' && styles.headerTabActive,
              ]}
            >
              모임
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={styles.filterSection}>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedFilter === '전체' && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter('전체')}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === '전체' && styles.filterTextActive,
                ]}
              >
                전체
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedFilter === '일정 모집 중인 그룹만' &&
                  styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter('일정 모집 중인 그룹만')}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === '일정 모집 중인 그룹만' &&
                    styles.filterTextActive,
                ]}
              >
                일정 모집 중인 그룹만
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryRow}
          >
            {CATEGORIES.slice(1).map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Group List */}
        <ScrollView
          style={styles.groupList}
          showsVerticalScrollIndicator={false}
        >
          {filteredGroups.map(group => (
            <GroupCard
              key={group.id}
              group={group}
              onPress={() =>
                navigation.navigate('GroupDetail', { groupId: group.id })
              }
            />
          ))}
        </ScrollView>

        {/* FAB */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('GroupCreate')}
        >
          <Plus color={COLORS.white} size={32} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
  },
  headerTabs: {
    flexDirection: 'row',
    gap: 17,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTab: {
    fontSize: FONT_SIZES.heading,
    fontFamily: FONTS.pretendard.extraBold,
    color: COLORS.text.tertiary,
  },
  headerTabActive: {
    color: COLORS.text.primary,
  },
  filterSection: {
    paddingHorizontal: 20,
    gap: 15,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 7,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 65,
    borderWidth: 0.7,
    borderColor: COLORS.gray['300'],
    backgroundColor: COLORS.white,
  },
  filterChipActive: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray['300'],
  },
  filterText: {
    fontSize: FONT_SIZES.title5,
    fontFamily: FONTS.pretendard.bold,
    color: COLORS.text.primary,
  },
  filterTextActive: {
    color: COLORS.text.primary,
  },
  categoryRow: {
    flexDirection: 'row',
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 0.7,
    borderColor: COLORS.gray['300'],
    backgroundColor: COLORS.white,
    marginRight: 5,
  },
  categoryChipActive: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray['300'],
  },
  categoryText: {
    fontSize: FONT_SIZES.body4,
    fontFamily: FONTS.pretendard.medium,
    color: COLORS.text.primary,
  },
  categoryTextActive: {
    color: COLORS.text.primary,
  },
  groupList: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 30,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 34,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.main.normal,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
