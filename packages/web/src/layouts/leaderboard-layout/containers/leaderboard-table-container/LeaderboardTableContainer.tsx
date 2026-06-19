import React from "react";
import { useTheme } from "@emotion/react";

import Pagination from "@components/common/pagination/Pagination";
import { useWindowSize } from "@hooks/common/use-window-size";

import { Box } from "../../components/common/common.styles";
import LeaderboardTableWrapper from "../../components/leaderboard-table-wrapper/LeaderboardTableWrapper";
import LeaderboardTable from "@layouts/leaderboard-layout/components/leaderboard-table/LeaderboardTable";

import { useAddress } from "@hooks/common/use-address";
import { useGetLeaderboard, useGetLeaderboardByAddress } from "@query/leaderboard";

interface LeaderboardTableContainerProps {
  readonly keyword: string;
  readonly page: number;
  readonly movePage: (page: number) => void;
}

const LEADERBOARD_PAGE_SIZE = 100;

export default function LeaderboardTableContainer({ keyword, page, movePage }: LeaderboardTableContainerProps) {
  const theme = useTheme();
  const { isMobile } = useWindowSize();
  const { address: myAddress } = useAddress();

  const { data: leaderboardInfos } = useGetLeaderboard({ limit: LEADERBOARD_PAGE_SIZE, page });
  const { data: leaderboardMyInfo } = useGetLeaderboardByAddress(myAddress || "");
  const rankOffset = Math.max(page - 1, 0) * LEADERBOARD_PAGE_SIZE;

  const filteredData = React.useMemo(() => {
    if (!leaderboardInfos?.users) return [];
    if (!keyword) return leaderboardInfos.users;

    return leaderboardInfos.users.filter(user => user.accountAddress.toLowerCase().includes(keyword.toLowerCase()));
  }, [leaderboardInfos, keyword]);

  const totalPages = React.useMemo(() => {
    if (!leaderboardInfos?.pageInfo.totalPages) return 0;
    return leaderboardInfos.pageInfo.totalPages;
  }, [leaderboardInfos?.pageInfo.totalPages]);

  return (
    <>
      <LeaderboardTableWrapper>
        {filteredData.length === 0 ? (
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
          <LeaderboardTable
            myAddress={myAddress}
            currentUserData={leaderboardMyInfo}
            leaderboardEntries={filteredData}
            rankOffset={rankOffset}
          />
        )}
      </LeaderboardTableWrapper>

      {totalPages > 1 && (
        <Box style={{ marginTop: "4px" }}>
          <Pagination
            currentPage={page}
            totalPage={totalPages}
            onPageChange={movePage}
            siblingCount={isMobile ? 1 : 2}
          />
        </Box>
      )}
    </>
  );
}
