import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../constants';
import { Button } from '../../components';

type TimeSlot = {
  day: string;
  date: string;
  times: boolean[];
};

// 시간 문자열을 30분 단위 인덱스로 변환 (예: "9:00" → 18)
const parseTimeToIndex = (timeStr: string): number => {
  const [hours] = timeStr.split(':').map(Number);
  return hours * 2;
};

// 시간 범위에 따른 타임 레이블 생성
const generateTimeLabels = (startIndex: number, endIndex: number): string[] => {
  const labels: string[] = [];
  for (let i = startIndex; i <= endIndex; i++) {
    const hours = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? '00' : '30';
    labels.push(`${hours.toString().padStart(2, '0')}:${minutes}`);
  }
  return labels;
};

// 요일 배열
const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

// 기본 TimeSlot 데이터 (selectedDates가 없을 때 사용)
const getDefaultTimeSlots = (timeSlotCount: number): TimeSlot[] => {
  const today = new Date();
  const slots: TimeSlot[] = [];

  // 오늘부터 6일간의 데이터 생성
  for (let i = 0; i < 6; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayOfWeek = DAY_NAMES[date.getDay()];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedDate = `${month}.${day}`;

    slots.push({
      day: dayOfWeek,
      date: formattedDate,
      times: Array(timeSlotCount).fill(false),
    });
  }

  return slots;
};

// selectedDates를 기반으로 TimeSlot 배열 생성
const createTimeSlotsFromDates = (
  dates: string[],
  timeSlotCount: number,
): TimeSlot[] => {
  if (!dates || dates.length === 0) {
    return getDefaultTimeSlots(timeSlotCount);
  }

  return dates.map(dateString => {
    const date = new Date(dateString);
    const dayOfWeek = DAY_NAMES[date.getDay()];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedDate = `${month}.${day}`;

    return {
      day: dayOfWeek,
      date: formattedDate,
      times: Array(timeSlotCount).fill(false),
    };
  });
};

export function VoteScreen({ navigation, route }: any) {
  const { groupId, selectedDates, timeRange } = route.params || {};

  // timeRange를 기반으로 시간 범위 계산
  const startTimeIndex = timeRange?.start
    ? parseTimeToIndex(timeRange.start)
    : 0;
  const endTimeIndex = timeRange?.end ? parseTimeToIndex(timeRange.end) : 47;
  const timeSlotCount = endTimeIndex - startTimeIndex + 1;

  // TIME_LABELS 생성
  const TIME_LABELS = generateTimeLabels(startTimeIndex, endTimeIndex);

  // selectedDates를 기반으로 TimeSlot 생성
  const initialTimeSlots = createTimeSlotsFromDates(
    selectedDates || [],
    timeSlotCount,
  );
  const [selectedSlots, setSelectedSlots] =
    useState<TimeSlot[]>(initialTimeSlots);

  // 드래그 상태 관리
  const isDragging = useRef(false);
  const dragMode = useRef<'select' | 'deselect' | null>(null);
  const processedCells = useRef<Set<string>>(new Set());
  const startCell = useRef<{ dayIndex: number; timeIndex: number } | null>(
    null,
  );
  const lastCell = useRef<{ dayIndex: number; timeIndex: number } | null>(null);
  const horizontalScrollRef = useRef<ScrollView>(null);
  const verticalScrollRef = useRef<ScrollView>(null);
  const timeCellsHorizontalScrollRef = useRef<ScrollView>(null);
  const timeCellsVerticalScrollRef = useRef<ScrollView>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // 드래그 원본 상태 저장
  const originalSlots = useRef<TimeSlot[]>([]);

  // 롱프레스 관련
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressActivated = useRef(false);
  const pressedCell = useRef<{ dayIndex: number; timeIndex: number } | null>(
    null,
  );

  const LONG_PRESS_DURATION = 200; // 200ms 후 드래그 모드 활성화

  // 각 셀의 레이아웃 정보 저장 (절대 좌표)
  const cellLayouts = useRef<
    Map<
      string,
      {
        dayIndex: number;
        timeIndex: number;
        x: number;
        y: number;
        width: number;
        height: number;
      }
    >
  >(new Map());

  // 스크롤 동기화 플래그 (무한 루프 방지)
  const isSyncingHorizontal = useRef(false);
  const isSyncingVertical = useRef(false);

  const gridContainerRef = useRef<View>(null);
  const gridOffset = useRef({ x: 0, y: 0 });
  const scrollOffset = useRef({ x: 0, y: 0 });

  // 터치 좌표에서 셀 찾기 (그리드 기준 상대 좌표)
  const findCellAtTouch = (pageX: number, pageY: number) => {
    // 그리드 기준 상대 좌표 (스크롤 오프셋 고려)
    const relX = pageX - gridOffset.current.x + scrollOffset.current.x;
    const relY = pageY - gridOffset.current.y + scrollOffset.current.y;

    console.log('findCellAtTouch', {
      pageX,
      pageY,
      gridOffset: gridOffset.current,
      scrollOffset: scrollOffset.current,
      relX,
      relY,
      cellLayoutsSize: cellLayouts.current.size,
    });

    // 저장된 레이아웃에서 터치 위치에 해당하는 셀 찾기
    for (const [key, layout] of cellLayouts.current.entries()) {
      if (
        relX >= layout.x &&
        relX <= layout.x + layout.width &&
        relY >= layout.y &&
        relY <= layout.y + layout.height
      ) {
        console.log('셀 찾음:', { key, layout });
        return { dayIndex: layout.dayIndex, timeIndex: layout.timeIndex };
      }
    }

    console.log(
      '셀을 찾지 못함, 첫 3개 레이아웃:',
      Array.from(cellLayouts.current.entries()).slice(0, 3),
    );
    return null;
  };

  // 셀 클릭/터치 시작 핸들러
  const handleCellPressIn = (dayIndex: number, timeIndex: number) => {
    // 이미 롱프레스 드래그 중이면 move 로직 실행
    if (isLongPressActivated.current && isDragging.current) {
      handleCellPressMove(dayIndex, timeIndex);
      return;
    }

    // 눌린 셀 기록
    pressedCell.current = { dayIndex, timeIndex };
    isLongPressActivated.current = false;

    // 원본 상태 저장
    originalSlots.current = selectedSlots.map(slot => ({
      ...slot,
      times: [...slot.times],
    }));

    // 롱프레스 타이머 시작
    longPressTimer.current = setTimeout(() => {
      isLongPressActivated.current = true;
      isDragging.current = true;
      processedCells.current.clear();
      startCell.current = { dayIndex, timeIndex };
      lastCell.current = { dayIndex, timeIndex };
      setScrollEnabled(false); // 드래그 중 스크롤 비활성화

      // 시작 셀의 현재 상태에 따라 드래그 모드 결정
      const currentValue = selectedSlots[dayIndex].times[timeIndex];
      dragMode.current = currentValue ? 'deselect' : 'select';

      // 시작 셀만 토글
      setSelectedSlots(prev => {
        const newSlots = prev.map(slot => ({
          ...slot,
          times: [...slot.times],
        }));
        newSlots[dayIndex].times[timeIndex] = !currentValue;
        processedCells.current.add(`${dayIndex}-${timeIndex}`);
        return newSlots;
      });
    }, LONG_PRESS_DURATION);
  };

  // 셀 위로 드래그할 때
  const handleCellPressMove = (dayIndex: number, timeIndex: number) => {
    if (!isDragging.current || !startCell.current || !dragMode.current) return;

    // 현재 셀이 이전 셀과 같으면 무시
    const isSameCell =
      lastCell.current &&
      lastCell.current.dayIndex === dayIndex &&
      lastCell.current.timeIndex === timeIndex;

    if (isSameCell) return;

    lastCell.current = { dayIndex, timeIndex };

    // 사각형 영역 계산
    const minDay = Math.min(startCell.current.dayIndex, dayIndex);
    const maxDay = Math.max(startCell.current.dayIndex, dayIndex);
    const minTime = Math.min(startCell.current.timeIndex, timeIndex);
    const maxTime = Math.max(startCell.current.timeIndex, timeIndex);

    processedCells.current.clear();

    // 원본 상태를 복원하고 현재 선택 영역만 업데이트
    setSelectedSlots(() => {
      const newSlots = originalSlots.current.map(slot => ({
        ...slot,
        times: [...slot.times],
      }));

      const forceValue = dragMode.current === 'select';
      for (let d = minDay; d <= maxDay; d++) {
        for (let t = minTime; t <= maxTime; t++) {
          const cellKey = `${d}-${t}`;
          processedCells.current.add(cellKey);
          newSlots[d].times[t] = forceValue;
        }
      }

      return newSlots;
    });
  };

  // 셀 터치 종료
  const handleCellPressOut = () => {
    // 타이머가 남아있으면 취소
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    // 롱프레스가 활성화되지 않았고 눌린 셀이 있으면 = 짧은 탭 (클릭)
    if (!isLongPressActivated.current && pressedCell.current) {
      const { dayIndex, timeIndex } = pressedCell.current;
      // 해당 셀만 토글
      setSelectedSlots(prev => {
        const newSlots = prev.map(slot => ({
          ...slot,
          times: [...slot.times],
        }));
        newSlots[dayIndex].times[timeIndex] = !prev[dayIndex].times[timeIndex];
        return newSlots;
      });
    }

    isDragging.current = false;
    isLongPressActivated.current = false;
    dragMode.current = null;
    startCell.current = null;
    lastCell.current = null;
    pressedCell.current = null;
    processedCells.current.clear();
    setScrollEnabled(true); // 스크롤 다시 활성화
  };

  const handleSelectAll = () => {
    const newSlots = selectedSlots.map(slot => ({
      ...slot,
      times: slot.times.map(() => true),
    }));
    setSelectedSlots(newSlots);
  };

  const handleClearAll = () => {
    const newSlots = selectedSlots.map(slot => ({
      ...slot,
      times: slot.times.map(() => false),
    }));
    setSelectedSlots(newSlots);
  };

  const handleComplete = () => {
    // 투표 완료 후 모임 상세 페이지로 이동
    navigation.navigate('GroupDetail', { groupId });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color={COLORS.text.primary} size={24} />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>약속에 참여할 수 있는</Text>
        <Text style={styles.title}>시간을 선택해주세요</Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleSelectAll}
        >
          <Text style={styles.controlText}>전체선택</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={handleClearAll}>
          <Text style={styles.controlText}>전체취소</Text>
        </TouchableOpacity>
      </View>

      {/* Time Grid */}
      <View style={styles.gridWrapper}>
        {/* 고정 헤더 행 */}
        <View style={styles.headerRow}>
          {/* 시간 레이블 헤더 (빈 공간) */}
          <View style={styles.timeLabelsHeaderSpace} />

          {/* 날짜 헤더들 */}
          <ScrollView
            ref={horizontalScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={scrollEnabled}
            scrollEventThrottle={16}
            onScroll={e => {
              if (isSyncingHorizontal.current) return;

              scrollOffset.current.x = e.nativeEvent.contentOffset.x;
              // 타임 셀 가로 스크롤과 동기화
              isSyncingHorizontal.current = true;
              timeCellsHorizontalScrollRef.current?.scrollTo({
                x: e.nativeEvent.contentOffset.x,
                animated: false,
              });
              // 다음 프레임에서 플래그 해제
              requestAnimationFrame(() => {
                isSyncingHorizontal.current = false;
              });
            }}
          >
            <View style={styles.daysHeaderRow}>
              {selectedSlots.map((slot, dayIndex) => (
                <View key={dayIndex} style={styles.dayHeader}>
                  <Text style={styles.dayText}>{slot.day}</Text>
                  <Text style={styles.dateText}>{slot.date}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 스크롤 컨텐츠 행 */}
        <View style={styles.contentRow}>
          {/* 시간 레이블 (스크롤) */}
          <View style={styles.timeLabelsContainer}>
            <ScrollView
              ref={verticalScrollRef}
              showsVerticalScrollIndicator={false}
              scrollEnabled={scrollEnabled}
              scrollEventThrottle={16}
              onScroll={e => {
                if (isSyncingVertical.current) return;

                scrollOffset.current.y = e.nativeEvent.contentOffset.y;
                // 타임 셀 세로 스크롤과 동기화
                isSyncingVertical.current = true;
                timeCellsVerticalScrollRef.current?.scrollTo({
                  y: e.nativeEvent.contentOffset.y,
                  animated: false,
                });
                // 다음 프레임에서 플래그 해제
                requestAnimationFrame(() => {
                  isSyncingVertical.current = false;
                });
              }}
            >
              {TIME_LABELS.map((time, index) => (
                <View
                  key={index}
                  style={[
                    styles.timeLabel,
                    index % 2 === 0
                      ? styles.timeLabelEven
                      : styles.timeLabelOdd,
                  ]}
                >
                  {/* 1시간 단위로만 시간 표시 (짝수 인덱스만) */}
                  {index % 2 === 0 && (
                    <Text style={styles.timeLabelText}>{time}</Text>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>

          {/* 타임 셀 (가로/세로 스크롤) */}
          <ScrollView
            ref={timeCellsHorizontalScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={scrollEnabled}
            scrollEventThrottle={16}
            onScroll={e => {
              if (isSyncingHorizontal.current) return;

              scrollOffset.current.x = e.nativeEvent.contentOffset.x;
              // 헤더 가로 스크롤과 동기화
              isSyncingHorizontal.current = true;
              horizontalScrollRef.current?.scrollTo({
                x: e.nativeEvent.contentOffset.x,
                animated: false,
              });
              // 다음 프레임에서 플래그 해제
              requestAnimationFrame(() => {
                isSyncingHorizontal.current = false;
              });
            }}
          >
            <ScrollView
              ref={timeCellsVerticalScrollRef}
              showsVerticalScrollIndicator={false}
              scrollEnabled={scrollEnabled}
              scrollEventThrottle={16}
              onScroll={e => {
                if (isSyncingVertical.current) return;

                scrollOffset.current.y = e.nativeEvent.contentOffset.y;
                // 시간 레이블 스크롤과 동기화
                isSyncingVertical.current = true;
                verticalScrollRef.current?.scrollTo({
                  y: e.nativeEvent.contentOffset.y,
                  animated: false,
                });
                // 다음 프레임에서 플래그 해제
                requestAnimationFrame(() => {
                  isSyncingVertical.current = false;
                });
              }}
            >
              <View
                ref={gridContainerRef}
                style={styles.timeCellsGrid}
                onLayout={() => {
                  if (gridContainerRef.current) {
                    gridContainerRef.current.measureInWindow((x, y) => {
                      gridOffset.current = { x, y };
                    });
                  }
                }}
              >
                {Array.from({ length: TIME_LABELS.length }).map(
                  (_, timeIndex) => (
                    <View
                      key={timeIndex}
                      style={[
                        styles.timeCellsRow,
                        timeIndex % 2 === 0
                          ? styles.timeCellsRowEven
                          : styles.timeCellsRowOdd,
                      ]}
                    >
                      {selectedSlots.map((slot, dayIndex) => (
                        <View
                          key={dayIndex}
                          ref={ref => {
                            if (ref && gridContainerRef.current) {
                              // 그리드 컨테이너 기준으로 상대 위치 측정
                              ref.measureLayout(
                                gridContainerRef.current,
                                (x, y, width, height) => {
                                  const key = `${dayIndex}-${timeIndex}`;
                                  cellLayouts.current.set(key, {
                                    dayIndex,
                                    timeIndex,
                                    x,
                                    y,
                                    width,
                                    height,
                                  });
                                },
                                () => {
                                  // 에러 발생 시 무시
                                },
                              );
                            }
                          }}
                          style={[
                            styles.timeCell,
                            slot.times[timeIndex] && styles.timeCellSelected,
                          ]}
                          onStartShouldSetResponder={() => true}
                          onMoveShouldSetResponder={() =>
                            isLongPressActivated.current
                          }
                          onResponderTerminationRequest={() =>
                            !isLongPressActivated.current
                          }
                          onResponderGrant={() =>
                            handleCellPressIn(dayIndex, timeIndex)
                          }
                          onResponderMove={evt => {
                            if (isLongPressActivated.current) {
                              const { pageX, pageY } = evt.nativeEvent;
                              const cell = findCellAtTouch(pageX, pageY);
                              if (cell) {
                                handleCellPressMove(
                                  cell.dayIndex,
                                  cell.timeIndex,
                                );
                              }
                            }
                          }}
                          onResponderRelease={handleCellPressOut}
                          onResponderTerminate={handleCellPressOut}
                        />
                      ))}
                    </View>
                  ),
                )}
              </View>
            </ScrollView>
          </ScrollView>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Button title="완료" onPress={handleComplete} />
      </View>
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
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: FONT_SIZES.heading1,
    fontFamily: FONTS.pretendard.black,
    color: COLORS.text.primary,
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  controlButton: {
    backgroundColor: COLORS.white,
    borderWidth: 0.7,
    borderColor: COLORS.gray['400'],
    borderRadius: 7,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  controlText: {
    fontSize: FONT_SIZES.body4,
    fontFamily: FONTS.pretendard.semiBold,
    color: COLORS.black['500'],
  },
  gridWrapper: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 20,
  },
  headerRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  timeLabelsHeaderSpace: {
    width: 60,
    height: 60,
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  timeLabelsContainer: {
    width: 60,
  },
  timeLabel: {
    width: 60,
    height: 33,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 4,
  },
  timeLabelEven: {
    marginBottom: 2,
  },
  timeLabelOdd: {
    marginBottom: 8,
  },
  timeLabelText: {
    fontSize: FONT_SIZES.title3,
    fontFamily: FONTS.pretendard.medium,
    color: COLORS.text.primary,
  },
  daysHeaderRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
    marginLeft: 3,
    paddingRight: 20, // 오른쪽 마진 추가
  },
  dayHeader: {
    width: 68,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: FONT_SIZES.title2,
    fontFamily: FONTS.pretendard.semiBold,
    color: COLORS.text.primary,
  },
  dateText: {
    fontSize: FONT_SIZES.title2,
    fontFamily: FONTS.pretendard.semiBold,
    color: COLORS.text.primary,
  },
  timeCellsGrid: {
    flexDirection: 'column',
    paddingRight: 20, // 오른쪽 마진 추가
  },
  timeCellsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeCellsRowEven: {
    marginBottom: 2,
  },
  timeCellsRowOdd: {
    marginBottom: 8,
  },
  timeCell: {
    width: 68,
    height: 33,
    backgroundColor: COLORS.gray['300'],
    borderRadius: 3,
  },
  timeCellSelected: {
    backgroundColor: COLORS.main.normal,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
  },
});
