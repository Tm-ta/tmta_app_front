import { api } from './client';

type CreateTeamBody = {
  teamName: string;
  useRealName: boolean;
  onlyLeaderCanPost: boolean;
};

export async function createTeam(teamName: string) {
  const body: CreateTeamBody = {
    teamName,
    useRealName: true,
    onlyLeaderCanPost: true,
  };

  const res = await api.post('/api/v1/teams', body);
  return res.data;
}