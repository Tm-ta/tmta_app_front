/* 네이밍 규칙
    실패/에러: *_FAILED, *_LOAD_FAILED
    필수 입력: *_REQUIRED
    검증 실패: INVALID_*, *_MUST_BE_*, *_EXCEEDED_*
    상태 제한: *_NOT_AVAILABLE, *_CLOSED, *_NOT_EDITABLE
    모임/약속/일정/투표 등 도메인 prefix 
*/

const RETRY = '다시 시도해주세요';
const RETRY_WITH_NETWORK = '네트워크를 확인한 뒤 \n 다시 시도해주세요';

export const POPUP_MESSAGE = {
  // 기본 
  RETRY: RETRY,
  CHECK_NETWORK_AND_RETRY: RETRY_WITH_NETWORK,

  // 내 정보 관련 
  LOGOUT_FAILED: `로그아웃을 실패했어요\n ${RETRY}`,
  TERMS_LOAD_FAILED: `약관 / 개인정보를 불러올 수 없어요 \n ${RETRY}`,
  SUPPORT_CENTER_LOAD_FAILED: `고객 센터를 불러올 수 없어요 \n ${RETRY}`,
  WITHDRAWAL_FAILED: `탈퇴를 실패했어요 \n ${RETRY}`,

  // 모임 생성 / 참여 
  GROUP_NAME_TOO_LONG: '모임 이름은 20자 이내로 \n 작성해주세요',
  GROUP_FULL: '모임 인원이 가득 찼어요',
  INVITE_CODE_EXPIRED: '초대가 만료된 코드예요',
  INVALID_FORMAT: '형식이 올바르지 않아요',
  IMAGE_PICK_FAILED: `이미지를 불러올 수 없어요 \n ${RETRY}`,
  GROUP_CREATE_FAILED: `모임 생성에 실패했어요 \n ${RETRY}`,
  GROUP_JOIN_FAILED: `모임 참여에 실패했어요 \n ${RETRY}`,

  // 모임 상세 
  GROUP_LIST_LOAD_FAILED: `목록을 불러오지 못했어요 \n ${RETRY}`,
  CANNOT_LEAVE_BEFORE_TRANSFER_OWNER: '모임장을 다른 멤버에게 위임한 뒤 \n 나갈 수 있어요',
  GROUP_LEAVE_FAILED: `모임 나가기에 실패했어요 \n ${RETRY}`,
  MEMBER_KICK_FAILED: `멤버 추방에 실패했어요 \n ${RETRY}`,

  // 약속 생성 
  APPOINTMENT_NAME_REQUIRED: '약속이름을 입력해주세요',
  INVALID_DEADLINE_TIME: '등록 마감 시간을 \n 다시 확인해주세요',
  DATE_REQUIRED: '날짜를 선택해주세요',
  DATE_RANGE_EXCEEDED_50_DAYS: '최대 50일까지 선택할 수 있어요',
  DATE_SELECTION_FAILED: `날짜 선택에 문제가 생겼어요 \n ${RETRY}`,
  START_TIME_MUST_BE_BEFORE_END_TIME: '시작 시간은 종료 시간보다 \n 먼저여야 해요',
  MIN_DURATION_30_MINUTES: '최소 30분 이상이어야 해요',

  // 일정 등록 
  AT_LEAST_ONE_TIME_REQUIRED: '가능한 시간을 한 개 이상\n 선택해주세요',
  SAVE_FAILED: `저장에 실패했어요 \n ${RETRY}`,
  SCHEDULE_REGISTRATION_CLOSED: '일정 등록이 마감되었어요',

  // 일정 수정 
  NO_CHANGES: '변경된 내용이 없어요',
  CONFIRMED_APPOINTMENT_NOT_EDITABLE: '확정된 약속은 수정할 수 없어요',

  // 투표 
  VOTING_NOT_AVAILABLE: '지금은 투표할 수 없는 상태예요',
  VOTE_CANDIDATE_REQUIRED: '투표할 후보를 선택해주세요',
  VOTE_FAILED: `투표에 실패했어요 \n ${RETRY}`,
} as const;

export type PopupMessageKey = keyof typeof POPUP_MESSAGE;