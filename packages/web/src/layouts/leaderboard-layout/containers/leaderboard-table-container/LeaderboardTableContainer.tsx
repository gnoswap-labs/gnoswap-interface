import { useState } from "react";

import Pagination from "@components/common/pagination/Pagination";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useGetLeaders, useGetMyLeader } from "@query/leaderboard";

import { Box } from "../../components/common/common.styles";
import LeaderboardTableWrapper from "../../components/leaderboard-table-wrapper/LeaderboardTableWrapper";
import MobileLeaderboardTable from "../../components/leaderboard-table/mobile-leaderboard-table/MobileLeaderboardTable";
import TabletLeaderboardTable from "../../components/leaderboard-table/tablet-leaderboard-table/TabletLeaderboardTable";
import WebLeaderboardTable from "../../components/leaderboard-table/web-leaderboard-table/WebLeaderboardTable";

export default function LeaderboardTableContainer() {
  const [page, setPage] = useState(0);
  const movePage = (page: number) => setPage(page);

  const { isMobile, isTablet, isWeb } = useWindowSize();
  const leadersQuery = useGetLeaders(page, 100);
  const meQuery = useGetMyLeader();

  return (
    <>
      <LeaderboardTableWrapper>
        {isMobile && (
          <MobileLeaderboardTable
            myLeader={meQuery.data?.leader}
            leaders={leadersQuery.data!.leaders}
            isMobile={isMobile}
          />
        )}
        {isTablet && (
          <TabletLeaderboardTable
            myLeader={meQuery.data?.leader}
            leaders={leadersQuery.data!.leaders}
            isMobile={isMobile}
          />
        )}
        {isWeb && (
          <WebLeaderboardTable
            myLeader={meQuery.data?.leader}
            leaders={leadersQuery.data!.leaders}
            isMobile={isMobile}
          />
        )}
      </LeaderboardTableWrapper>

      {leadersQuery.data!.totalPage > 1 && (
        <Box style={{ marginTop: "4px" }}>
          <Pagination
            currentPage={leadersQuery.data!.currentPage}
            totalPage={leadersQuery.data!.totalPage}
            onPageChange={movePage}
            siblingCount={isMobile ? 1 : 2}
          />
        </Box>
      )}
    </>
  );
}
