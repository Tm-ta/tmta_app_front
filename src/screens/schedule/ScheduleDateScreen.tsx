import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  findNodeHandle,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { COLORS, FONTS, FONT_SIZES } from '../../constants';
import { Button } from '../../components';

// 한국어 설정
LocaleConfig.locales.kr = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'kr';

const PRESET_FILTERS = [
  '내일부터 7일',
  '내일부터 14일',
  '이번달 주말',
  '다음주 일요일까지',
];

// 커스텀 날짜 컴포넌트
const CustomDay = ({ date, state, marking, onLayout }: any) => {
  const isSelected = marking?.selected;
  const isDisabled = state === 'disabled';
  const isToday = state === 'today';
  const viewRef = useRef<View>(null);

  React.useEffect(() => {
    if (viewRef.current && onLayout) {
      const handle = findNodeHandle(viewRef.current);
      if (handle) {
        UIManager.measureInWindow(
          handle,
          (x: number, y: number, width: number, height: number) => {
            onLayout(date, { x, y, width, height });
          },
        );
      }
    }
  }, [date, onLayout]);

  return (
    <View
      ref={viewRef}
      style={[
        styles.dayContainer,
        isSelected && styles.selectedDay,
        isDisabled && styles.disabledDay,
      ]}
    >
      <View style={styles.dayTouchable}>
        <Text
          style={[
            styles.dayText,
            isSelected && styles.selectedDayText,
            isDisabled && styles.disabledDayText,
            isToday && !isSelected && styles.todayText,
          ]}
        >
          {date.day}
        </Text>
      </View>
    </View>
  );
};

// 선택된 날짜 스타일 (통일)
const SELECTED_DATE_STYLE = {
  selected: true,
};

export function ScheduleDateScreen({ navigation, route }: any) {
  const { groupId } = route.params || {};

  // 날짜를 YYYY-MM-DD 형식의 문자열로 변환
  const getDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 현재 날짜 가져오기 (시간 정보 제거)
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);
  const currentDateString = getDateString(today);

  const [selectedDates, setSelectedDates] = useState<{
    [key: string]: any;
  }>({});
  const [selectedFilter, setSelectedFilter] = useState('');
  const isDragging = useRef(false);
  const dragStartDate = useRef<string | null>(null);
  const draggedDates = useRef<Set<string>>(new Set());
  const dragMode = useRef<'select' | 'deselect'>('select');
  const initialSelectedDates = useRef<{ [key: string]: any }>({});
  const dateLayouts = useRef<
    Map<string, { x: number; y: number; width: number; height: number }>
  >(new Map());
  const gestureContainerRef = useRef<View>(null);
  const gestureOffset = useRef({ x: 0, y: 0 });

  // GestureDetector 컨테이너의 위치 측정
  const measureGestureContainer = useCallback(() => {
    if (gestureContainerRef.current) {
      const handle = findNodeHandle(gestureContainerRef.current);
      if (handle) {
        UIManager.measureInWindow(handle, (x: number, y: number) => {
          console.log('Gesture container offset:', x, y);
          gestureOffset.current = { x, y };
        });
      }
    }
  }, []);

  React.useEffect(() => {
    // 컴포넌트 마운트 후 측정 (여러 번 시도하여 레이아웃 완료 보장)
    const timer1 = setTimeout(measureGestureContainer, 100);
    const timer2 = setTimeout(measureGestureContainer, 300);
    const timer3 = setTimeout(measureGestureContainer, 500);
    const timer4 = setTimeout(measureGestureContainer, 1000);
    const timer5 = setTimeout(measureGestureContainer, 1500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [measureGestureContainer]);

  const handleNext = () => {
    const dates = Object.keys(selectedDates);
    navigation.navigate('ScheduleTime', { groupId, selectedDates: dates });
  };

  const isDateBeforeToday = useCallback(
    (dateString: string): boolean => {
      const date = new Date(dateString);
      date.setHours(0, 0, 0, 0);
      return date < today;
    },
    [today],
  );

  const onDayPress = () => {
    // Pan gesture에서 처리하므로 비활성화
    return;
  };

  // 날짜 컴포넌트의 레이아웃 정보 저장 (절대 좌표로 저장)
  const onDayLayout = useCallback(
    (
      day: any,
      layout: { x: number; y: number; width: number; height: number },
    ) => {
      // 절대 좌표로 저장 (findDateAtPosition에서 변환)
      dateLayouts.current.set(day.dateString, layout);
      console.log(
        `Date ${day.dateString} layout:`,
        'x:',
        layout.x,
        'y:',
        layout.y,
        'offset:',
        gestureOffset.current.x,
        gestureOffset.current.y,
      );
    },
    [],
  );

  // 터치 좌표에서 해당하는 날짜 찾기
  const findDateAtPosition = useCallback(
    (x: number, y: number): string | null => {
      // 상대 좌표를 절대 좌표로 변환
      const absoluteX = x + gestureOffset.current.x;
      const absoluteY = y + gestureOffset.current.y;

      console.log(
        `Finding date at relative (${x}, ${y}) -> absolute (${absoluteX}, ${absoluteY}), layouts count:`,
        dateLayouts.current.size,
        'offset:',
        gestureOffset.current,
      );

      for (const [dateString, layout] of dateLayouts.current.entries()) {
        if (
          absoluteX >= layout.x &&
          absoluteX <= layout.x + layout.width &&
          absoluteY >= layout.y &&
          absoluteY <= layout.y + layout.height
        ) {
          console.log(`Found: ${dateString}`);
          return dateString;
        }
      }
      console.log('No date found at position');
      return null;
    },
    [],
  );

  // 두 날짜 사이의 모든 날짜를 가져오는 함수
  const getDatesInRange = useCallback(
    (start: string, end: string): string[] => {
      const dates: string[] = [];
      const startDate = new Date(start);
      const endDate = new Date(end);

      // 시작과 끝을 올바른 순서로 정렬
      const [firstDate, lastDate] =
        startDate <= endDate ? [startDate, endDate] : [endDate, startDate];

      const currentDate = new Date(firstDate);
      while (currentDate <= lastDate) {
        const dateStr = getDateString(currentDate);
        if (!isDateBeforeToday(dateStr)) {
          dates.push(dateStr);
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return dates;
    },
    [isDateBeforeToday],
  );

  // 날짜 범위 선택 처리
  const selectDateRange = useCallback(
    (endDateString: string) => {
      if (!dragStartDate.current || isDateBeforeToday(endDateString)) {
        return;
      }

      const datesInRange = getDatesInRange(
        dragStartDate.current,
        endDateString,
      );

      setSelectedDates(_prev => {
        // 초기 상태에서 시작 (드래그 시작 전 상태)
        const newDates = { ...initialSelectedDates.current };
        console.log('Base state:', Object.keys(newDates));
        console.log('Range to apply:', datesInRange);

        datesInRange.forEach(date => {
          if (dragMode.current === 'select') {
            // 선택 모드: 날짜 추가
            newDates[date] = SELECTED_DATE_STYLE;
          } else {
            // 선택 해제 모드: 날짜 제거
            delete newDates[date];
          }
        });

        console.log('Final state:', Object.keys(newDates));
        return newDates;
      });
    },
    [isDateBeforeToday, getDatesInRange],
  );

  // onDayLongPress는 Pan gesture로 대체되어 제거됨

  // 커스텀 Day 렌더링
  const renderDayComponent = useCallback(
    (props: any) => <CustomDay {...props} onLayout={onDayLayout} />,
    [onDayLayout],
  );

  // Tap Gesture: 클릭 선택
  const tapGesture = useMemo(() => {
    return Gesture.Tap().onEnd(event => {
      console.log('Tap detected at:', event.x, event.y);
      const dateString = findDateAtPosition(event.x, event.y);
      console.log('Tapped date:', dateString);

      if (dateString && !isDateBeforeToday(dateString)) {
        setSelectedFilter('');
        setSelectedDates(prev => {
          const newDates = { ...prev };
          if (newDates[dateString]) {
            delete newDates[dateString];
          } else {
            newDates[dateString] = SELECTED_DATE_STYLE;
          }
          return newDates;
        });
      }
    });
  }, [findDateAtPosition, isDateBeforeToday]);

  // Pan Gesture: 드래그 범위 선택
  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .minDistance(10) // 10픽셀 이상 움직여야 Pan으로 인식
      .onStart(event => {
        console.log('Pan started at:', event.x, event.y);
        const dateString = findDateAtPosition(event.x, event.y);
        console.log('Pan start date:', dateString);

        if (dateString && !isDateBeforeToday(dateString)) {
          setSelectedFilter('');

          // 드래그 전 원본 상태를 저장하고 드래그 모드 결정
          setSelectedDates(prev => {
            console.log('Initial state before drag:', Object.keys(prev));

            // 드래그 전 원본 상태를 저장
            initialSelectedDates.current = { ...prev };

            const isAlreadySelected = !!prev[dateString];
            dragMode.current = isAlreadySelected ? 'deselect' : 'select';

            console.log(
              'Saved initial state:',
              Object.keys(initialSelectedDates.current),
              'Mode:',
              dragMode.current,
            );

            // 드래그 시작
            isDragging.current = true;
            dragStartDate.current = dateString;

            // 상태는 변경하지 않음 (selectDateRange가 처리)
            return prev;
          });

          // 첫 범위 선택 실행 (시작 날짜만 포함)
          setTimeout(() => {
            if (isDragging.current && dragStartDate.current) {
              selectDateRange(dateString);
            }
          }, 0);
        }
      })
      .onUpdate(event => {
        if (isDragging.current && dragStartDate.current) {
          const dateString = findDateAtPosition(event.x, event.y);
          if (dateString) {
            selectDateRange(dateString);
          }
        }
      })
      .onEnd(() => {
        console.log('Pan ended');
        if (isDragging.current) {
          isDragging.current = false;
          dragStartDate.current = null;
          draggedDates.current.clear();
          dragMode.current = 'select';
        }
      })
      .onFinalize(() => {
        if (isDragging.current) {
          isDragging.current = false;
          dragStartDate.current = null;
          draggedDates.current.clear();
          dragMode.current = 'select';
        }
      });
  }, [findDateAtPosition, selectDateRange, isDateBeforeToday]);

  // Tap과 Pan을 배타적으로 인식 (Pan이 먼저 시도, 실패하면 Tap)
  const composedGesture = Gesture.Exclusive(panGesture, tapGesture);

  const applyPresetFilter = (filter: string) => {
    // 이미 선택된 필터를 다시 누르면 해제
    if (selectedFilter === filter) {
      setSelectedFilter('');
      setSelectedDates({});
      return;
    }

    setSelectedFilter(filter);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const newSelectedDates: { [key: string]: any } = {};

    switch (filter) {
      case '내일부터 7일':
        // 내일부터 7일간
        for (let i = 0; i < 7; i++) {
          const date = new Date(tomorrow);
          date.setDate(tomorrow.getDate() + i);
          const dateStr = getDateString(date);
          if (!isDateBeforeToday(dateStr)) {
            newSelectedDates[dateStr] = SELECTED_DATE_STYLE;
          }
        }
        break;

      case '내일부터 14일':
        // 내일부터 14일간
        for (let i = 0; i < 14; i++) {
          const date = new Date(tomorrow);
          date.setDate(tomorrow.getDate() + i);
          const dateStr = getDateString(date);
          if (!isDateBeforeToday(dateStr)) {
            newSelectedDates[dateStr] = SELECTED_DATE_STYLE;
          }
        }
        break;

      case '이번달 주말':
        // 이번 달의 모든 토요일(6), 일요일(0)
        const year = now.getFullYear();
        const month = now.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        for (
          let d = new Date(firstDay);
          d <= lastDay;
          d.setDate(d.getDate() + 1)
        ) {
          const dayOfWeek = d.getDay();
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            // 일요일(0) 또는 토요일(6)
            const dateStr = getDateString(new Date(d));
            if (!isDateBeforeToday(dateStr)) {
              newSelectedDates[dateStr] = SELECTED_DATE_STYLE;
            }
          }
        }
        break;

      case '다음주 일요일까지':
        // 오늘부터 다음주 일요일까지
        const currentDay = now.getDay();
        const daysUntilNextSunday = currentDay === 0 ? 7 : 7 - currentDay + 7;

        for (let i = 0; i <= daysUntilNextSunday; i++) {
          const date = new Date(now);
          date.setDate(now.getDate() + i);
          const dateStr = getDateString(date);
          if (!isDateBeforeToday(dateStr)) {
            newSelectedDates[dateStr] = SELECTED_DATE_STYLE;
          }
        }
        break;
    }

    setSelectedDates(newSelectedDates);
  };

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft color={COLORS.text.primary} size={36} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>원하는 약속 날짜를</Text>
            <Text style={styles.title}>선택해주세요</Text>
          </View>

          {/* Calendar */}
          <GestureDetector gesture={composedGesture}>
            <View
              ref={gestureContainerRef}
              style={styles.calendar}
              onLayout={measureGestureContainer}
            >
              <Calendar
                current={currentDateString}
                minDate={currentDateString}
                markedDates={selectedDates}
                onDayPress={onDayPress}
                dayComponent={renderDayComponent}
                monthFormat={'yyyy년 M월'}
                hideExtraDays={true}
                disableMonthChange={false}
                firstDay={0}
                hideDayNames={false}
                showWeekNumbers={false}
                enableSwipeMonths={false}
                renderArrow={direction => {
                  return direction === 'left' ? (
                    <ChevronLeft color={COLORS.text.primary} size={24} />
                  ) : (
                    <ChevronRight color={COLORS.text.primary} size={24} />
                  );
                }}
                theme={{
                  backgroundColor: 'transparent',
                  calendarBackground: 'transparent',
                  textSectionTitleColor: COLORS.text.tertiary,
                  selectedDayBackgroundColor: COLORS.main.light,
                  selectedDayTextColor: COLORS.main.normal,
                  todayTextColor: COLORS.text.primary,
                  dayTextColor: COLORS.text.primary,
                  textDisabledColor: COLORS.gray['400'],
                  arrowColor: COLORS.text.primary,
                  monthTextColor: COLORS.text.primary,
                  textDayFontFamily: FONTS.pretendard.regular,
                  textMonthFontFamily: FONTS.pretendard.medium,
                  textDayHeaderFontFamily: FONTS.pretendard.medium,
                  textDayFontSize: 21,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: FONT_SIZES.title5,
                  textDayStyle: {
                    marginTop: 0,
                    marginBottom: 0,
                  },
                }}
                style={styles.calendarComponent}
              />
            </View>
          </GestureDetector>

          {/* Preset Filters */}
          <View style={styles.filters}>
            {PRESET_FILTERS.map(filter => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  selectedFilter === filter && styles.filterChipActive,
                ]}
                onPress={() => applyPresetFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === filter && styles.filterTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="다음"
            onPress={handleNext}
            disabled={Object.keys(selectedDates).length === 0}
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
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
  titleContainer: {
    marginLeft: 10,
    marginBottom: 40,
  },
  title: {
    fontSize: FONT_SIZES.heading,
    fontFamily: FONTS.pretendard.extraBold,
    color: COLORS.text.primary,
  },

  dayContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  dayTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDay: {
    backgroundColor: COLORS.main.light,
    borderRadius: 20,
  },
  disabledDay: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 21,
    fontFamily: FONTS.pretendard.regular,
    color: COLORS.text.primary,
  },
  selectedDayText: {
    color: COLORS.main.normal,
    fontFamily: FONTS.pretendard.bold,
  },
  disabledDayText: {
    color: COLORS.gray['700'],
  },
  todayText: {
    color: COLORS.text.primary,
    fontFamily: FONTS.pretendard.bold,
  },
  calendar: {
    marginBottom: 40,
  },
  calendarComponent: {
    borderWidth: 0,
    borderRadius: 0,
    paddingTop: 0,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 40,
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
    backgroundColor: COLORS.black['500'],
  },
  filterText: {
    fontSize: FONT_SIZES.title5,
    fontFamily: FONTS.pretendard.medium,
    color: COLORS.text.primary,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 34,
  },
});
