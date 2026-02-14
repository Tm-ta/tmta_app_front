export type Group = {
  id: string;
  name: string;
  type: '약속' | '모임';
  category: string;
  memberCount: number;
  profileImage: string | null;
  isRecruitingSchedule: boolean;
  recentMembers: string[];
};

export type Schedule = {
  id: string;
  groupId: string;
  title: string;
  date: string;
  dateRange: string;
  location: string;
  organizerName: string;
  memberCount: number;
  isRecruiting: boolean;
  hasVote: boolean;
  votedMemberCount: number;
  description: string;
};

export type Member = {
  id: string;
  nickname: string;
  profileImage: string | null;
  joinDate: string;
};

export type VotedMember = {
  id: string;
  name: string;
  profileImage: string | null;
};

export type RootStackParamList = {
  //Auth
  Login : undefined;
  EmailLogin: undefined;
  Signup : undefined;

  // Group
  GroupList: undefined;
  GroupCreate: undefined;
  GroupProfile: { teamId: string };
  GroupDetail: { groupId: string };
  GroupJoin: undefined;
  GroupSetting: { groupId: string };
  
  // Schedule
  ScheduleDetail: { scheduleId: string };
  ScheduleDate: { groupId: string };
  ScheduleTime: { groupId: string; selectedDates: string[] };
  ScheduleSettings: { groupId: string; selectedDates: string[]; timeRange: { start: string; end: string } };
  ScheduleCreated: { scheduleId: string; groupId: string; selectedDates: string[]; timeRange: any; };
  
  // Vote
  Vote: { scheduleId: string };
};

