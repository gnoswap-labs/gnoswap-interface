export const QUERY_KEY = {
  leader: (address?: string) => ["leaderboard", address],
  leaders: (page: number) => ["leaderboard", page],
};
