import React, { useState } from "react";
import { useTheme } from "@emotion/react";

import Pagination from "@components/common/pagination/Pagination";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useGetLeaders, useGetMyLeader } from "@query/leaderboard";

import { Box } from "../../components/common/common.styles";
import LeaderboardTableWrapper from "../../components/leaderboard-table-wrapper/LeaderboardTableWrapper";
import MobileLeaderboardTable from "../../components/leaderboard-table/mobile-leaderboard-table/MobileLeaderboardTable";
import TabletLeaderboardTable from "../../components/leaderboard-table/tablet-leaderboard-table/TabletLeaderboardTable";
import WebLeaderboardTable from "../../components/leaderboard-table/web-leaderboard-table/WebLeaderboardTable";
import { DEVICE_TYPE } from "@styles/media";

interface LeaderboardTableContainerProps {
  breakpoint: DEVICE_TYPE;
  keyword: string;
}

export default function LeaderboardTableContainer({ breakpoint, keyword }: LeaderboardTableContainerProps) {
  const theme = useTheme();

  const [page, setPage] = useState(0);
  const movePage = (page: number) => setPage(page);

  const { isMobile, isTablet, isWeb } = useWindowSize();
  const leadersQuery = useGetLeaders(page, 100);

  const meQuery = useGetMyLeader();

  const filteredLeaders = React.useMemo(() => {
    if (!leadersQuery.data?.leaders) return [];
    if (!keyword) return leadersQuery.data.leaders;

    return leadersQuery.data.leaders.filter(leader => leader.address.toLowerCase().includes(keyword.toLowerCase()));
  }, [leadersQuery.data?.leaders, keyword]);

  const totalPage = React.useMemo(() => {
    if (!filteredLeaders.length) return 0;
    return Math.ceil(filteredLeaders.length / 100);
  }, [filteredLeaders]);

  return (
    <>
      <LeaderboardTableWrapper>
        {filteredLeaders.length === 0 ? (
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "120px",
              color: theme.color.text04,
            }}
          >
            No users found
          </Box>
        ) : (
          <>
            {breakpoint === DEVICE_TYPE.MOBILE && (
              <MobileLeaderboardTable myLeader={meQuery.data?.leader} leaders={filteredLeaders} isMobile={isMobile} />
            )}
            {isTablet && (
              <TabletLeaderboardTable myLeader={meQuery.data?.leader} leaders={filteredLeaders} isMobile={isMobile} />
            )}
            {isWeb && (
              <WebLeaderboardTable myLeader={meQuery.data?.leader} leaders={filteredLeaders} isMobile={isMobile} />
            )}
          </>
        )}
      </LeaderboardTableWrapper>

      {totalPage > 1 && (
        <Box style={{ marginTop: "4px" }}>
          <Pagination
            currentPage={page}
            totalPage={totalPage}
            onPageChange={movePage}
            siblingCount={isMobile ? 1 : 2}
          />
        </Box>
      )}
    </>
  );
}
