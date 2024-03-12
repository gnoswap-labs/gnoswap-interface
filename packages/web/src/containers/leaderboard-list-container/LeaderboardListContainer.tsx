import React, { useCallback, useState } from "react";
import { ValuesType } from "utility-types";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useLoading } from "@hooks/common/use-loading";
import { useTokenData } from "@hooks/token/use-token-data";
import LeaderboardList from "@components/leaderboard/leaderboard-list/LeaderboardList";

export interface Leader {
  rank: number;
  user: string;
  volume: string;
  position: string;
  staking: string;
  points: string;
}

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

// TokenListContainer
const LeaderboardListContainer: React.FC = () => {
  const [page, setPage] = useState(0);
  const { breakpoint } = useWindowSize();
  const { isLoadingCommon } = useLoading();

  const { isFetched, error } = useTokenData();
  const leaders = [
    {
      rank: 1,
      user: "g1ym5k...pndsu1",
      volume: "$100,241,421",
      position: "$241,421",
      staking: "$241,421",
      points: "4,802,250",
    },
    {
      rank: 2,
      user: "g1ym5k...pndsu1",
      volume: "$100,241,421",
      position: "$241,421",
      staking: "$241,421",
      points: "4,802,250",
    },
    {
      rank: 3,
      user: "g1ym5k...pndsu1",
      volume: "$100,241,421",
      position: "$241,421",
      staking: "$241,421",
      points: "4,802,250",
    },
    {
      rank: 4,
      user: "g1ym5k...pndsu1",
      volume: "$100,241,421",
      position: "$241,421",
      staking: "$241,421",
      points: "4,802,250",
    },
    {
      rank: 5,
      user: "g1ym5k...pndsu1",
      volume: "$100,241,421",
      position: "$241,421",
      staking: "$241,421",
      points: "4,802,250",
    },
    {
      rank: 6,
      user: "g1ym5k...pndsu1",
      volume: "$100,241,421",
      position: "$241,421",
      staking: "$241,421",
      points: "4,802,250",
    },
  ];

  const movePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return (
    <LeaderboardList
      leaders={leaders}
      isFetched={isFetched && !isLoadingCommon}
      error={error}
      currentPage={page}
      //   totalPage={Math.ceil((leaders || []).length / 15)}
      totalPage={100}
      movePage={movePage}
      breakpoint={breakpoint}
    />
  );
};

export default LeaderboardListContainer;
