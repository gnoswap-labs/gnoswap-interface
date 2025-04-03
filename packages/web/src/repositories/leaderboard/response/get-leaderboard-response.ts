import { LeaderboardUser } from "./common/types";

export interface GetLeaderboardResponse {
  lastUpdatedAt: string;
  pageInfo: {
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
  users: LeaderboardUser[];
}

export const nullLeaderboardInfo: GetLeaderboardResponse = {
  lastUpdatedAt: "",
  pageInfo: {
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  },
  users: [],
};
