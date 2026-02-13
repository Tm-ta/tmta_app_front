/* eslint-disable @typescript-eslint/no-unused-vars */
//약속 없을 때 텍스트 띄워야 함
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Bell, Users, ChevronDown } from 'lucide-react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../../constants';
import type { Schedule } from '../../../types';
import SpeakerIcon from '../../../assets/icons/Speaker.svg';
import PeopleIcon from '../../../assets/icons/People.svg';

type SchedulesTabProps = {
  schedules: Schedule[];
  onSchedulePress: (scheduleId: string) => void;
};

export function SchedulesTab({
  schedules,
  onSchedulePress,
}: SchedulesTabProps) {
  const upcomingSchedules = schedules.filter(s => s.isRecruiting);
  const pastSchedules = schedules.filter(s => !s.isRecruiting);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Calendar View Button */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>일정</Text>
        {/* <TouchableOpacity style={styles.viewModeButton}>
          <Text style={styles.viewModeText}>캘린더형으로 보기</Text>
        </TouchableOpacity> */}
      </View>

      {/* Upcoming Schedules */}
      <View style={styles.section}>
        <Text style={styles.subsectionTitle}>
          예정된 약속{' '}
          <Text style={styles.count}>{upcomingSchedules.length}</Text>
        </Text>
        <View style={styles.scheduleList}>
          {upcomingSchedules.map(schedule => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              onPress={() => onSchedulePress(schedule.id)}
            />
          ))}
        </View>
      </View>

      {/* Past Schedules */}
      <View style={styles.section}>
        <Text style={styles.subsectionTitle}>
          진행된 약속 <Text style={styles.count}>{pastSchedules.length}</Text>
        </Text>
        <View style={styles.scheduleList}>
          {pastSchedules.map(schedule => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              onPress={() => onSchedulePress(schedule.id)}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreButtonText}>더보기</Text>
          <ChevronDown color={COLORS.text.primary} size={16} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function ScheduleCard({
  schedule,
  onPress,
}: {
  schedule: Schedule;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardTitle}>{schedule.title}</Text>
      <View style={styles.cardDetails}>
        <Text style={styles.cardDate}>{schedule.date}</Text>
        <View style={styles.cardMetaRow}>
          <Text style={styles.cardMeta}>{schedule.location}</Text>
          <View style={styles.dot} />
          <View style={styles.cardMeta}>
            {/* <Users color={COLORS.text.primary} size={16} /> */}
            <PeopleIcon width={16} height={16} fill={COLORS.text.primary} />
            <Text style={styles.cardMeta}>{schedule.memberCount}명</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray['300'],
  },
  noticeIcon: {
    fontSize: 16,
  },
  noticeText: {
    fontSize: FONT_SIZES.title5,
    fontFamily: FONTS.pretendard.medium,
    color: COLORS.text.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.title2,
    fontFamily: FONTS.pretendard.bold,
    color: COLORS.text.primary,
  },
  viewModeButton: {
    backgroundColor: '#FFE070',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 12,
  },
  viewModeText: {
    fontSize: FONT_SIZES.title5,
    fontFamily: FONTS.pretendard.regular,
    color: COLORS.text.primary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 26,
  },
  subsectionTitle: {
    fontSize: FONT_SIZES.title2,
    fontFamily: FONTS.pretendard.bold,
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  count: {
    color: COLORS.main.normal,
  },
  scheduleList: {
    gap: 10,
  },
  card: {
    padding: 20,
    gap: 12,
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
  cardTitle: {
    fontSize: FONT_SIZES.title2,
    fontFamily: FONTS.pretendard.bold,
    color: COLORS.text.primary,
  },
  cardDetails: {
    gap: 4,
  },
  cardDate: {
    fontSize: FONT_SIZES.title5,
    fontFamily: FONTS.pretendard.medium,
    color: COLORS.text.primary,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  moreButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 16,
  },
  moreButtonText: {
    fontSize: FONT_SIZES.title3,
    fontFamily: FONTS.pretendard.bold,
    color: COLORS.text.primary,
  },
});
