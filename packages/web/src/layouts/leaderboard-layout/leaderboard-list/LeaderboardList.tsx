import React, { Suspense } from "react";
import { ValuesType } from "utility-types";

import ErrorBoundary from "@components/common/error-boundary/ErrorBoundary";
import useClickOutside from "@hooks/common/use-click-outside";

import LeaderboardListHeaderContainer from "../containers/leaderboard-list-header-container/LeaderboardListHeaderContainer";
import LeaderboardTableContainer from "../containers/leaderboard-table-container/LeaderboardTableContainer";
import LeaderboardTableSkeletonContainer from "../containers/leaderboard-table-skeleton-container/LeaderboardTableSkeletonContainer";

import { Wrapper } from "./LeaderboardList.styles";
import { useWindowSize } from "@hooks/common/use-window-size";

export interface TableHeadItem {
  label: string;
  tooltip?: string;
}

export const TABLE_HEAD = {
  INDEX: { label: "Leaderboard:list.column.rank" },
  USER: { label: "Leaderboard:list.column.user" },
  VOLUME: {
    label: "Leaderboard:list.column.swap",
    tooltip: "Leaderboard:list.column.tooltip.volume",
  },
  POSITION: {
    label: "Leaderboard:list.column.position",
    tooltip: "Leaderboard:list.column.tooltip.position",
  },
  STAKING: {
    label: "Leaderboard:list.column.staking",
    tooltip: "Leaderboard:list.column.tooltip.staking",
  },
  POINTS: { label: "Leaderboard:list.column.points" },
} as const;

export const TABLE_HEAD_MOBILE = {
  INDEX: { label: "Leaderboard:list.column.rank" },
  USER: { label: "Leaderboard:list.column.user" },
  POINTS: { label: "Leaderboard:list.column.points" },
} as const;

export type TABLE_HEAD = ValuesType<typeof TABLE_HEAD>;

export default function LeaderboardList() {
  const { breakpoint } = useWindowSize();

  const [keyword, setKeyword] = React.useState<string>("");
  const [page, setPage] = React.useState(1);
  const movePage = (page: number) => setPage(page);
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
          page={page}
          onChangeKeyword={handleSearch}
          onToggleSearch={onToggleSearch}
          searchRef={searchRef}
          isViewSearchIcon={isViewSearchIcon}
        />

        <Suspense fallback={<LeaderboardTableSkeletonContainer />}>
          <LeaderboardTableContainer keyword={keyword} page={page} movePage={movePage} />
        </Suspense>
      </ErrorBoundary>
    </Wrapper>
  );
}
