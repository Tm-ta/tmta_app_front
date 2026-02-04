import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { Users } from 'lucide-react-native';
import { COLORS, FONTS, FONT_SIZES, MOCK_VOTED_MEMBERS, MOCK_SCHEDULES } from '../../constants';
import { Header, Button } from '../../components';
import { getAvatarUrl } from '../../utils';
import PeopleIcon from '../../assets/icons/People.svg';

export function ScheduleDetailScreen({ navigation, route }: any) {
  const { scheduleId } = route.params || {};
  
  // scheduleId로 해당 일정 찾기
  const schedule = MOCK_SCHEDULES.find(s => s.id === scheduleId) || MOCK_SCHEDULES[0];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="일정" onBackPress={() => navigation.goBack()} showBack />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{schedule.title}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {schedule.isRecruiting ? '모집 중' : '모집 완료'}
              </Text>
            </View>
          </View>

          <View style={styles.details}>
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>주최자</Text> {schedule.organizerName}
            </Text>
            <View style={styles.detailRow}>
              {/* <Users color={COLORS.text.primary} size={16} /> */}
              <PeopleIcon width={16} height={16} fill={COLORS.text.primary} />
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>인원수</Text> {schedule.memberCount}명
              </Text>
            </View>
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>날짜</Text> {schedule.date} 중 {schedule.dateRange}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>장소</Text> {schedule.location}
            </Text>
          </View>
        </View>

        {/* <View style={styles.divider} /> */}

        <View style={styles.section}>
          {/* <Text style={styles.sectionTitle}>설명</Text> */}
          <Text style={styles.description}>
            {schedule.description}
          </Text>
        </View>

        {/* <View style={styles.divider} /> */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            투표한 멤버{' '}
            <Text style={styles.count}>{MOCK_VOTED_MEMBERS.length}</Text>
          </Text>
          <View style={styles.memberList}>
            {MOCK_VOTED_MEMBERS.map(member => (
              <View key={member.id} style={styles.memberItem}>
                <Image 
                  source={{ uri: getAvatarUrl(50, member.id) }} 
                  style={styles.avatar}
                />
                <Text style={styles.memberName}>{member.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="투표하러 가기"
          onPress={() => navigation.navigate('Vote', { scheduleId })}
          variant="outline"
        />
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
  section: {
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: FONT_SIZES.title2,
    fontFamily: FONTS.pretendard.bold,
    color: COLORS.text.primary,
  },
  badge: {
    backgroundColor: COLORS.main.light,
    borderWidth: 0.2,
    borderColor: COLORS.main.normal,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: FONT_SIZES.title5,
    fontFamily: FONTS.pretendard.medium,
    color: COLORS.main.normal,
  },
  details: {
    gap: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: FONT_SIZES.title5,
    fontFamily: FONTS.pretendard.regular,
    color: COLORS.text.primary,
  },
  detailLabel: {
    fontFamily: FONTS.pretendard.bold,
  },
  divider: {
    height: 8,
    backgroundColor: COLORS.gray['300'],
  },
  sectionTitle: {
    fontSize: FONT_SIZES.title2,
    fontFamily: FONTS.pretendard.bold,
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  count: {
    color: COLORS.main.normal,
  },
  description: {
    fontSize: FONT_SIZES.title5,
    fontFamily: FONTS.pretendard.regular,
    color: '#2C2C2C',
    lineHeight: 21,
  },
  memberList: {
    flexDirection: 'row',
    gap: 16,
  },
  memberItem: {
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.gray['600'],
  },
  memberName: {
    fontSize: FONT_SIZES.title3,
    fontFamily: FONTS.pretendard.regular,
    color: COLORS.text.primary,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});
