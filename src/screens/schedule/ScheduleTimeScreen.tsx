import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../constants';
import { Button } from '../../components';

const TIME_PRESETS = ['하루종일', '9시~18시', '12시~24시', '18시~24시'];
const ITEM_HEIGHT = 44;
const HOURS = Array.from({ length: 25 }, (_, i) => i); // 0-24시

export function ScheduleTimeScreen({ navigation, route }: any) {
  const { groupId, selectedDates } = route.params || {};
  const [startTime, setStartTime] = useState(9);
  const [endTime, setEndTime] = useState(18);
  const [selectedPreset, setSelectedPreset] = useState('');
  const startScrollRef = useRef<ScrollView | null>(null);
  const endScrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    // 초기 스크롤 위치 설정 (초기 마운트시에만 실행)
    setTimeout(() => {
      startScrollRef.current?.scrollTo({
        y: startTime * ITEM_HEIGHT,
        animated: false,
      });
      endScrollRef.current?.scrollTo({
        y: endTime * ITEM_HEIGHT,
        animated: false,
      });
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToTime = (ref: React.RefObject<ScrollView | null>, time: number) => {
    ref.current?.scrollTo({ y: time * ITEM_HEIGHT, animated: true });
  };

  const presetIgnoreCountRef = useRef(0);
  const handlePresetPress = (preset: string) => {
    setSelectedPreset(preset);

    let newStartTime = 0;
    let newEndTime = 24;

    switch (preset) {
      case '하루종일':
        newStartTime = 0;
        newEndTime = 24;
        break;
      case '9시~18시':
        newStartTime = 9;
        newEndTime = 18;
        break;
      case '12시~24시':
        newStartTime = 12;
        newEndTime = 24;
        break;
      case '18시~24시':
        newStartTime = 18;
        newEndTime = 24;
        break;
    }

    setStartTime(newStartTime);
    setEndTime(newEndTime);

    // start/end 스크롤 각각 onMomentumScrollEnd 1번씩 총 2번 무시
    presetIgnoreCountRef.current = 2;

    scrollToTime(startScrollRef, newStartTime);
    scrollToTime(endScrollRef, newEndTime);
  };

  const handleScroll = (event: any, isStart: boolean) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(24, index));

    if (isStart) setStartTime(clampedIndex);
    else setEndTime(clampedIndex);

    // 프리셋으로 인해 발생한 스크롤 이벤트는 무시
    if (presetIgnoreCountRef.current > 0) {
      presetIgnoreCountRef.current -= 1;
      return;
    }

    // 유저가 직접 스크롤한 경우만 프리셋 해제
    setSelectedPreset('');
  };

  const handleNext = () => {
    navigation.navigate('ScheduleSettings', {
      groupId,
      selectedDates,
      timeRange: { start: `${startTime}:00`, end: `${endTime}:00` },
    });
  };

  const renderTimePicker = (
    value: number,
    scrollRef: React.RefObject<ScrollView | null>,
    isStart: boolean,
    label: string,
  ) => (
    <View style={styles.timePickerContainer}>
      <View style={styles.timePickerHighlight} />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={e => handleScroll(e, isStart)}
        contentContainerStyle={styles.scrollContent}
        style={styles.timePicker}
      >
        <View style={styles.spacer} />
        {HOURS.map(hour => (
          <View key={hour} style={styles.timeItem}>
            <Text
              style={[
                styles.timeItemText,
                hour === value && styles.timeItemTextActive,
              ]}
            >
              {String(hour).padStart(2, '0')}:00
            </Text>
            {hour === value && (
              <Text style={styles.timeItemLabel}> {label}</Text>
            )}
          </View>
        ))}
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color={COLORS.text.primary} size={36} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>원하는 약속 시간을</Text>
          <Text style={styles.title}>선택해주세요</Text>
        </View>

        {/* Time Range Display */}
        <View style={styles.timeDisplay}>
          <View style={styles.timePickersRow}>
            {renderTimePicker(startTime, startScrollRef, true, '부터')}
            {renderTimePicker(endTime, endScrollRef, false, '까지')}
          </View>
        </View>

        {/* Preset Filters */}
        <View style={styles.filters}>
          {TIME_PRESETS.map(preset => (
            <TouchableOpacity
              key={preset}
              style={[
                styles.filterChip,
                selectedPreset === preset && styles.filterChipActive,
              ]}
              onPress={() => handlePresetPress(preset)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedPreset === preset && styles.filterTextActive,
                ]}
              >
                {preset}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button title="다음" onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.main.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleContainer: {
    marginLeft: 5,
    marginBottom: 40,
  },
  title: {
    fontSize: FONT_SIZES.heading,
    fontFamily: FONTS.pretendard.extraBold,
    color: COLORS.text.primary,
  },
  timeDisplay: {
    marginBottom: 60,
  },
  timePickersRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 20,
  },
  timePickerContainer: {
    flex: 1,
    height: ITEM_HEIGHT * 3,
    position: 'relative',
    alignItems: 'center',
  },
  timePickerHighlight: {
    position: 'absolute',
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: COLORS.main.light,
    borderRadius: 6,
    zIndex: 0,
  },
  timePicker: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
  },
  spacer: {
    height: ITEM_HEIGHT,
  },
  timeItem: {
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeItemText: {
    fontSize: FONT_SIZES.title2,
    fontFamily: FONTS.pretendard.medium,
    color: COLORS.text.tertiary,
  },
  timeItemTextActive: {
    fontSize: FONT_SIZES.title1,
    fontFamily: FONTS.pretendard.semiBold,
    color: COLORS.main.point,
  },
  timeItemLabel: {
    fontSize: FONT_SIZES.title3,
    fontFamily: FONTS.pretendard.regular,
    color: COLORS.text.primary,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 65,
    borderWidth: 0.7,
    borderColor: COLORS.gray['300'],
    backgroundColor: COLORS.white,
  },
  filterChipActive: {
    backgroundColor: COLORS.main.normal,
  },
  filterText: {
    fontSize: FONT_SIZES.title5,
    fontFamily: FONTS.pretendard.medium,
    color: COLORS.text.primary,
  },
  filterTextActive: {
    // color: COLORS.white,s
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 34,
  },
});
