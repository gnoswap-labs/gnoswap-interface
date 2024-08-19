import { ValuesType } from "utility-types";
import { Wrapper } from "./LeaderboardList.styles";
import LeaderboardListHeaderContainer from "@containers/leaderboard-list-header-container/LeaderboardListHeaderContainer";
import { Suspense } from "react";
import LeaderboardTableContainer from "@containers/leaderboard-table-container/LeaderboardTableContainer";
import LeaderboardTableSkeletonContainer from "@containers/leaderboard-table-skeleton-container/LeaderboardTableSkeletonContainer";
import ErrorBoundary from "@components/common/error-boundary/ErrorBoundary";

export const TABLE_HEAD = {
  INDEX: "Rank",
  USER: "User",
  VOLUME: "Swap Volume",
  POSITION: "Position Value",
  STAKING: "Staking Value",
  POINTS: "Points",
} as const;

export const TABLE_HEAD_MOBILE = {
  INDEX: "Rank",
  USER: "User",
  POINTS: "Points",
} as const;

export type TABLE_HEAD = ValuesType<typeof TABLE_HEAD>;

export default function LeaderboardList() {
  return (
    <Wrapper>
      <ErrorBoundary>
        <LeaderboardListHeaderContainer />

        <Suspense fallback={<LeaderboardTableSkeletonContainer />}>
          <LeaderboardTableContainer />
        </Suspense>
      </ErrorBoundary>
    </Wrapper>
  );
}
