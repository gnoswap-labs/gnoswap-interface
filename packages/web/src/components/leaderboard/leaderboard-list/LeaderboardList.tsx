import React from "react";
import Pagination from "@components/common/pagination/Pagination";
import { Wrapper } from "./LeaderboardList.styles";
import { DEVICE_TYPE } from "@styles/media";
import { Leader } from "@containers/leaderboard-list-container/LeaderboardListContainer";
import LeaderboardListTable from "../leaderboard-list-table/LeaderboardListTable";
import LeaderboardListHeader from "../leaderboard-list-header/LeaderboardListHeader";

interface LeaderItem {
  leaders: Leader[];
  isFetched: boolean;
  error: Error | null;
  currentPage: number;
  totalPage: number;
  movePage: (page: number) => void;
  breakpoint: DEVICE_TYPE;
}

const LeaderboardList: React.FC<LeaderItem> = ({
  leaders,
  isFetched,
  // TODO: Resolve Unused vars errors and remove ESLint comments
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error,
  currentPage,
  totalPage,
  movePage,
  breakpoint,
}) => {
  return (
    <Wrapper>
      <LeaderboardListHeader />
      <LeaderboardListTable
        leaders={leaders}
        isFetched={isFetched}
        breakpoint={breakpoint}
      />
      {totalPage > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPage={totalPage}
          onPageChange={movePage}
          siblingCount={breakpoint !== DEVICE_TYPE.MOBILE ? 2 : 1}
        />
      )}
    </Wrapper>
  );
};

export default LeaderboardList;
