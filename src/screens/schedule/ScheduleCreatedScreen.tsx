import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, FONT_SIZES } from '../../constants';
import { Button } from '../../components';

import CreatedIcon from '../../assets/icons/Flower.svg';

export function ScheduleCreatedScreen({ navigation, route }: any) {
  // scheduleId는 나중에 실제 생성 API 붙이면 받아야
  const { scheduleId, groupId, selectedDates, timeRange } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>약속을 만들었어요</Text>

        <View style={styles.iconWrap}>
          <CreatedIcon width={147} height={192} />
        </View>

        <Text style={styles.desc}>
          일정을 등록해{'\n'}시간을 정해요!
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          title="일정 등록하러 가기"
          onPress={() =>
            navigation.navigate('Vote', {
              scheduleId,
              groupId,
              selectedDates,
              timeRange,
            })
          }
          variant="primary"
        />
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 100,
    gap: 30
  },
  title: {
    fontSize: FONT_SIZES.title1,
    fontFamily: FONTS.pretendard.extraBold,
    color: COLORS.text.primary,
    marginBottom: 40,
    textAlign: 'center',
  },
  iconWrap: {
    marginBottom: 28,
  },
  desc: {
    fontSize: FONT_SIZES.title2,
    fontFamily: FONTS.pretendard.bold,
    color: COLORS.text.primary,
    textAlign: 'center',
    lineHeight: 30
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 34,
  },
});