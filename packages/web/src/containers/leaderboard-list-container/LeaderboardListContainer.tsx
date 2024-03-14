import { useState } from "react";
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
  swapPoint: string;
  positionPoint: string;
  stakingPoint: string;
  referralPoint: string;
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

export default function LeaderboardListContainer() {
  const [page, setPage] = useState(0);
  const { breakpoint } = useWindowSize();
  const { isLoadingCommon } = useLoading();

  const { isFetched, error } = useTokenData();
  const leaders = [
    {
      rank: 1,
      user: "g1j0q...8auvm",
      volume: "$100,241,421",
      position: "$241,421",
      staking: "$241,421",
      points: "4,802,250",
      swapPoint: "242,802,250000000000",
      positionPoint: "1,000,000",
      stakingPoint: "700,000",
      referralPoint: "300,000",
    },
    {
      rank: 2,
      user: "g1j0q...8auvm",
      volume: "$100,241,421",
      position: "$241,421",
      staking: "$241,421",
      points: "4,802,250",
      swapPoint: "242,802,250250000000000",
      positionPoint: "1,000,000",
      stakingPoint: "700,000",
      referralPoint: "300,000",
    },
    {
      rank: 3,
      user: "g1j0q...8auvm",
      volume: "$100,241,421",
      position: "$241,421",
      staking: "$241,421",
      points: "4,802,250",
      swapPoint: "242,802,250",
      positionPoint: "1,000,000",
      stakingPoint: "700,000",
      referralPoint: "300,000",
    },
    {
      rank: 4,
      user: "g1j0q...8auvm",
      volume: "$100,241,421",
      position: "$241,421",
      staking: "$241,421",
      points: "4,802,250",
      swapPoint: "242,802,250",
      positionPoint: "1,000,000",
      stakingPoint: "700,000",
      referralPoint: "300,000",
    },
    {
      rank: 5,
      user: "g1j0q...8auvm",
      volume: "$100,241,421",
      position: "$241,421",
      staking: "$241,421",
      points: "4,802,250",
      swapPoint: "242,802,250",
      positionPoint: "1,000,000",
      stakingPoint: "700,000",
      referralPoint: "300,000",
    },
    {
      rank: 6,
      user: "g1j0q...8auvm",
      volume: "$100,241,421",
      position: "$241,421",
      staking: "$241,421",
      points: "4,802,250",
      swapPoint: "242,802,250",
      positionPoint: "1,000,000",
      stakingPoint: "700,000",
      referralPoint: "300,000",
    },
    {
      rank: 7,
      user: "g1j0q...8auvm",
      volume: "$100,241,421",
      position: "$241,421",
      staking: "$241,421",
      points: "4,802,250",
      swapPoint: "242,802,250",
      positionPoint: "1,000,000",
      stakingPoint: "700,000",
      referralPoint: "300,000",
    },
    {
      rank: 8,
      user: "g1j0q...8auvm",
      volume: "$100,241,421",
      position: "$241,421",
      staking: "$241,421",
      points: "4,802,250",
      swapPoint: "242,802,250",
      positionPoint: "1,000,000",
      stakingPoint: "700,000",
      referralPoint: "300,000",
    },
    {
      rank: 9,
      user: "g1j0q...8auvm",
      volume: "$100,241,421",
      position: "$241,421",
      staking: "$241,421",
      points: "4,802,250",
      swapPoint: "242,802,250",
      positionPoint: "1,000,000",
      stakingPoint: "700,000",
      referralPoint: "300,000",
    },
    {
      rank: 10,
      user: "g1j0q...8auvm",
      volume: "$100,241,421",
      position: "$241,421",
      staking: "$241,421",
      points: "4,802,250",
      swapPoint: "242,802,250",
      positionPoint: "1,000,000",
      stakingPoint: "700,000",
      referralPoint: "300,000",
    },
  ];

  const movePage = (page: number) => setPage(page);

  return (
    <LeaderboardList
      me={leaders[0]}
      leaders={leaders}
      isFetched={isFetched && !isLoadingCommon}
      error={error}
      currentPage={page}
      // totalPage={Math.ceil((leaders || []).length / 15)}
      totalPage={100}
      movePage={movePage}
      breakpoint={breakpoint}
    />
  );
}
