import LeaderboardTableHeaderContainer from "@containers/leaderboard-table-header-container/LeaderboardTableHeaderContainer";
import {
  ListBody,
  ScrollWrapper,
  TableWrapper,
} from "./LeaderboardTableWrapper.styles";
import React from "react";

export default function LeaderboardTableWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TableWrapper>
      <ScrollWrapper>
        <LeaderboardTableHeaderContainer />
        <ListBody>{children}</ListBody>
      </ScrollWrapper>
    </TableWrapper>
  );
}
