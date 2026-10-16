export interface GetLeaderboardRequest {
  keyword?: string;
  limit?: number;
  page?: number;
  // Round to read; omitted reads the current active round.
  roundId?: number;
}
