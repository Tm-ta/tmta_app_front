export type ConfirmCaseKey = 'logout' | 'withdraw' | 'leaveGroup';

export type ConfirmCase = {
  title: string;
  body: string;
  leftText: string;
  rightText: string;
};

export const CONFIRM_CASES: Record<ConfirmCaseKey, ConfirmCase> = {
  logout: {
    title: '로그아웃 할까요?',
    body: 'sub(추후 수정)',
    leftText: '예',
    rightText: '아니오',
  },
  withdraw: {
    title: '정말 탈퇴하시겠어요?',
    body: '탈퇴하면 모든 정보들이 없어져요!',
    leftText: '취소',
    rightText: '탈퇴하기',
  },
  leaveGroup: {
    title: '정말 모임을 나가시겠어요?',
    body: '추후 수정',
    leftText: '예',
    rightText: '아니오',
  },
};