export const QUERY_KEY = {
  default: () => ["leaderboard"],
  leader: (address?: string) => ["leaderboard", address],
  leaders: (page: number) => ["leaderboard", page],
  nextUpdateTime: () => ["leaderboard", "nextUpdateTime"],
};
