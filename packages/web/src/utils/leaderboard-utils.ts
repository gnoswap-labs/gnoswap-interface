import { LeaderboardUser, LeaderboardVisibilityStatus } from "@repositories/leaderboard/response/common/types";
import { removeTrailingZeros } from "@utils/number-utils";
import { numberToFormat } from "@utils/string-utils";

export const isLeaderboardHidden = (status: LeaderboardVisibilityStatus) => {
  return status === LeaderboardVisibilityStatus.HIDDEN;
};

export const isRoundLeaderboardUser = (user: Pick<LeaderboardUser, "roundId">) => {
  return Number(user.roundId) > 0;
};

export const formatLeaderboardPoint = (point: string | undefined): string => {
  if (!point) return "-";
  const formattedPoint = numberToFormat(point, { decimals: 2, forceDecimals: true, truncateDecimals: true });
  return removeTrailingZeros(formattedPoint);
};
