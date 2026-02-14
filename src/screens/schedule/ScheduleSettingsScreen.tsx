/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChevronLeft from '../../assets/icons/Chevron-left.svg';
import CalendarIcon from '../../assets/icons/Calendar.svg';
import CheckCircleIcon from '../../assets/icons/Check-circle.svg';
import MapPinIcon from '../../assets/icons/Map-pin.svg';
import GroupIcon from '../../assets/icons/Group.svg';
import { COLORS, FONTS, FONT_SIZES } from '../../constants';
import { Button } from '../../components';
import { useErrorPopup } from '../../components/popup/ErrorPopupProvider';

const TOGGLE_WIDTH = 48;
const TOGGLE_HEIGHT = 28;
const THUMB_SIZE = 24;
const THUMB_MARGIN = 2;

interface CustomToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

function CustomToggle({ value, onValueChange }: CustomToggleProps) {
  const translateX = useRef(
    new Animated.Value(
      value ? TOGGLE_WIDTH - THUMB_SIZE - THUMB_MARGIN * 2 : 0,
    ),
  ).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? TOGGLE_WIDTH - THUMB_SIZE - THUMB_MARGIN * 2 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value, translateX]);

  const handlePress = () => {
    onValueChange(!value);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={[
        styles.toggleContainer,
        { backgroundColor: value ? COLORS.main.normal : COLORS.gray['300'] },
      ]}
    >
      <Animated.View
        style={[styles.toggleThumb, { transform: [{ translateX }] }]}
      />
    </TouchableOpacity>
  );
}

export function ScheduleSettingsScreen({ navigation, route }: any) {
  const { groupId, selectedDates, timeRange } = route.params || {};
  const [title, setTitle] = useState('');
  const [hasVote, setHasVote] = useState(true);
  const [location, setLocation] = useState('길음역 4번출구');
  const [maxParticipants, setMaxParticipants] = useState('최대 10명');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { showErrorPopup } = useErrorPopup();

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardWillHide = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const formatDateRange = () => {
    if (!selectedDates || selectedDates.length === 0) {
      return '날짜를 선택해주세요';
    }

    const sortedDates = [...selectedDates].sort();
    const startDate = new Date(sortedDates[0]);
    const endDate = new Date(sortedDates[sortedDates.length - 1]);

    const formatDate = (date: Date) => {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}월 ${day}일`;
    };

    return `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
  };

  const calculateDuration = () => {
    if (!selectedDates || selectedDates.length === 0) {
      return '';
    }

    const sortedDates = [...selectedDates].sort();
    const startDate = new Date(sortedDates[0]);
    const endDate = new Date(sortedDates[sortedDates.length - 1]);

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return `${diffDays}일간`;
  };

  const handleNext = () => {
    if (!title.trim()) {
      showErrorPopup('APPOINTMENT_NAME_REQUIRED');
      return;
    }

    // TODO: 약속 생성 API 붙이면 여기서 호출하고 실패 시 SAVE_FAILED 사용
    const scheduleId = 'temp_schedule_id';

    navigation.navigate('ScheduleCreated', {
      scheduleId,
      groupId,
      selectedDates,
      timeRange,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color={COLORS.text.primary} width={24} height={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TextInput
          style={styles.titleInput}
          placeholder="제목을 입력해주세요"
          placeholderTextColor={COLORS.text.placeholder}
          value={title}
          onChangeText={setTitle}
          autoFocus
        />

        <View style={styles.settingsList}>
          {/* Date & Time */}
          <View style={styles.settingItemColumn}>
            <View style={styles.settingHeader}>
              <CalendarIcon width={24} height={24} />
              <Text style={styles.settingLabel}>날짜 및 시간</Text>
            </View>
            <View style={styles.dateValueContainer}>
              <Text style={styles.valueText}>{formatDateRange()}</Text>
              <Text style={styles.valueText}>{calculateDuration()}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Vote Toggle */}
          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <CheckCircleIcon width={24} height={24} />
              <Text style={styles.settingLabel}>투표</Text>
            </View>
            <CustomToggle value={hasVote} onValueChange={setHasVote} />
          </View>

          <View style={styles.divider} />

          {/* Location */}
          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <MapPinIcon width={24} height={24} />
              <Text style={styles.settingLabel}>장소</Text>
            </View>
            <Text style={styles.valueText}>{location}</Text>
          </View>

          <View style={styles.divider} />

          {/* Participants */}
          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <GroupIcon width={24} height={24} />
              <Text style={styles.settingLabel}>참여 인원</Text>
            </View>
            <Text style={styles.valueText}>{maxParticipants}</Text>
          </View>

          <View style={styles.divider} />
        </View>
      </ScrollView>

      {!isKeyboardVisible && (
        <View style={styles.footer}>
          <Button title="다음" onPress={handleNext} disabled={!title.trim()} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleInput: {
    fontSize: FONT_SIZES.heading,
    fontFamily: FONTS.pretendard.extraBold,
    color: COLORS.black['500'],
    paddingVertical: 16,
    marginBottom: 20,
  },
  settingsList: {
    gap: 0,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 6,
  },
  settingItemColumn: {
    flexDirection: 'column',
    paddingVertical: 16,
    paddingHorizontal: 6,
    gap: 12,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingLabel: {
    fontSize: FONT_SIZES.body1,
    fontFamily: FONTS.pretendard.regular,
    color: COLORS.black['500'],
  },
  settingValue: {
    alignItems: 'flex-end',
  },
  dateValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 24,
  },
  valueText: {
    fontSize: FONT_SIZES.body1,
    fontFamily: FONTS.pretendard.regular,
    color: COLORS.text.primary,
  },
  toggleContainer: {
    width: TOGGLE_WIDTH,
    height: TOGGLE_HEIGHT,
    borderRadius: TOGGLE_HEIGHT / 2,
    padding: THUMB_MARGIN,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: COLORS.white,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray['300'],
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 34,
  },
});
