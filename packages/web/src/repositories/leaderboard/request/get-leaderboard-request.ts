export interface GetLeaderboardRequest {
  keyword?: string;
  limit?: number;
  page?: number;
  // Round to read; omitted reads the most recent started round.
  roundId?: number;
}
