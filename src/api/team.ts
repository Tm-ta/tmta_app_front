import { api } from './client';

// 팀 목록 아이템 타입
export type TeamListItem = {
  groupId: string;
  groupName: string;
  state: string;
  memberCount: number;
  memberProfiles: string[];
};

// 팀 상세 타입 (appointments는 일단 사용하지 않으므로 any[])
export type TeamDetail = {
  groupId: string;
  groupName: string;
  memberCount: number;
  appointments: any[];
  // 백엔드에서 내려준다면 사용 (없으면 undefined)
  profileImage?: string | null;
};

type CreateTeamBody = {
  groupName: string;
};

type CreateTeamResponse = {
  groupId: string;
};

type JoinTeamBody = {
  userName: string;
  profileImg?: string;
};

// 1. 팀 전체 목록 조회
export async function getTeams(): Promise<TeamListItem[]> {
  const res = await api.get('/api/v1/teams');
  // Response : { teamList: [...] }
  return res.data.teamList ?? [];
}

// 2. 팀 생성
export async function createTeam(groupName: string): Promise<CreateTeamResponse> {
  const body: CreateTeamBody = {
    groupName,
  };

  const res = await api.post('/api/v1/teams', body);
  return res.data;
}

// 3. 팀 상세 조회
export async function getTeamDetail(teamId: string): Promise<TeamDetail> {
  const res = await api.get(`/api/v1/teams/${teamId}`);
  return res.data;
}

// 4. 팀 가입
export async function joinTeam(teamId: string, payload: JoinTeamBody) {
  const res = await api.post(`/api/v1/teams/${teamId}`, payload);
  return res.data;
}

// 5. 팀 탈퇴
export async function leaveTeam(teamId: string) {
  const res = await api.delete(`/api/v1/teams/${teamId}`);
  return res.data;
}

// 6. 방장 위임
export async function delegateLeader(teamId: string, memberId: string) {
  const res = await api.post(`/api/v1/teams/${teamId}/member/${memberId}`);
  return res.data;
}

// 7. 멤버 강제 추방
export async function kickMember(teamId: string, memberId: string) {
  const res = await api.delete(`/api/v1/teams/${teamId}/member/${memberId}`);
  return res.data;
}
