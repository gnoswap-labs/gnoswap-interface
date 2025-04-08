import { LeaderboardVisibilityStatus } from "@repositories/leaderboard/response/common/types";

export const isLeaderboardHidden = (status: LeaderboardVisibilityStatus) => {
  return status === LeaderboardVisibilityStatus.HIDDEN;
};
