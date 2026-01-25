# Gathering - 모임 관리 앱

React Native로 개발된 모임 관리 앱입니다.

## 주요 기능

### 그룹 관리
- **그룹 목록**: 약속과 모임을 구분하여 표시
- **그룹 생성**: 모임 이름 입력 → 프로필 설정
- **그룹 상세**: 멤버, 일정, 투표 탭으로 구성

### 일정 관리
- **일정 상세**: 일정 정보 확인 및 투표 참여
- **일정 추가**: 3단계 플로우
  1. 날짜 선택 (캘린더)
  2. 시간 선택
  3. 세부 설정 (제목, 투표 여부, 장소, 참여인원)

### 투표
- **When2Meet 스타일**: 참여 가능한 시간 선택
- **전체선택/취소**: 빠른 입력 지원

## 프로젝트 구조

```
src/
├── components/         # 공통 컴포넌트 (Button, Input, Header)
├── constants/          # 상수 (colors, fonts, mockData)
├── navigation/         # 네비게이션 설정
├── screens/            # 화면 구성
│   ├── group/         # 그룹 관련 화면
│   ├── schedule/      # 일정 관련 화면
│   └── vote/          # 투표 화면
└── types/             # TypeScript 타입 정의
```

## 시작하기

### 설치

```bash
npm install
```

### iOS 실행

```bash
# iOS pod 설치
cd ios && pod install && cd ..

# 실행
npm run ios
```

### Android 실행

```bash
npm run android
```

## 기술 스택

- **React Native**: 0.83.1
- **React Navigation**: 네비게이션 관리
- **TypeScript**: 타입 안정성
- **React Native Safe Area Context**: 안전 영역 처리

## 디자인 시스템

### 색상
- **메인 컬러**: #FBB337 (오렌지)
- **서브 컬러**: #FFF7EB (연한 오렌지)
- **그레이 스케일**: #E7E6E8, #E2E1E4, #DBDADD, #9B9B9D

### 폰트
- **Pretendard**: 제목, 헤더

## 주요 화면

1. **GroupListScreen**: 그룹 목록 (약속/모임 탭)
2. **GroupCreateScreen**: 모임 생성 - 이름 입력
3. **GroupProfileScreen**: 모임 생성 - 프로필 설정
4. **GroupDetailScreen**: 그룹 상세 (멤버/일정/투표 탭)
5. **ScheduleDetailScreen**: 일정 상세
6. **ScheduleDateScreen**: 일정 추가 - 날짜 선택
7. **ScheduleTimeScreen**: 일정 추가 - 시간 선택
8. **ScheduleSettingsScreen**: 일정 추가 - 세부 설정
9. **VoteScreen**: 투표 참여

## 개발 가이드

### 새 화면 추가

1. `src/screens/[domain]/` 에 화면 컴포넌트 생성
2. `src/types/index.ts` 에 네비게이션 파라미터 타입 추가
3. `src/navigation/RootNavigator.tsx` 에 스크린 등록

### 새 컴포넌트 추가

1. `src/components/` 또는 `src/screens/[domain]/components/` 에 생성
2. `index.ts` 파일에 export 추가

## Mock 데이터

현재는 `src/constants/mockData.ts`에 정의된 Mock 데이터를 사용합니다.
실제 API 연동 시 `src/services/` 디렉토리를 추가하여 구현하세요.

## 라이선스

MIT
