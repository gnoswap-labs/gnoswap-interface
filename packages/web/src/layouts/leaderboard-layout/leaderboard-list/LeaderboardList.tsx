import React, { Suspense } from "react";
import { ValuesType } from "utility-types";

import ErrorBoundary from "@components/common/error-boundary/ErrorBoundary";
import useClickOutside from "@hooks/common/use-click-outside";

import LeaderboardListHeaderContainer from "../containers/leaderboard-list-header-container/LeaderboardListHeaderContainer";
import LeaderboardTableContainer from "../containers/leaderboard-table-container/LeaderboardTableContainer";
import LeaderboardTableSkeletonContainer from "../containers/leaderboard-table-skeleton-container/LeaderboardTableSkeletonContainer";

import { Wrapper } from "./LeaderboardList.styles";
import { useWindowSize } from "@hooks/common/use-window-size";

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
  const { breakpoint } = useWindowSize();

  const [keyword, setKeyword] = React.useState<string>("");
  const [isViewSearchIcon, setIsViewSearchIcon] = React.useState<boolean>(false);
  const [searchRef, isClickOutside, setIsInside] = useClickOutside();

  const handleSearch = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  const onToggleSearch = React.useCallback(() => {
    setIsViewSearchIcon(prev => !prev);
    setIsInside(true);
  }, [setIsInside]);

  React.useEffect(() => {
    if (!keyword) {
      if (isClickOutside) {
        setIsViewSearchIcon(false);
      }
    }
  }, [isClickOutside, keyword]);

  return (
    <Wrapper>
      <ErrorBoundary>
        <LeaderboardListHeaderContainer
          breakpoint={breakpoint}
          keyword={keyword}
          onChangeKeyword={handleSearch}
          onToggleSearch={onToggleSearch}
          searchRef={searchRef}
          isViewSearchIcon={isViewSearchIcon}
        />

        <Suspense fallback={<LeaderboardTableSkeletonContainer />}>
          <LeaderboardTableContainer breakpoint={breakpoint} keyword={keyword} />
        </Suspense>
      </ErrorBoundary>
    </Wrapper>
  );
}
