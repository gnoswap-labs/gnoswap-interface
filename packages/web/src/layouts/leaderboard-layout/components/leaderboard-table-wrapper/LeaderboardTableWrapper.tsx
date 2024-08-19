import React from "react";

import {
  ListBody,
  ScrollWrapper,
  TableWrapper,
} from "./LeaderboardTableWrapper.styles";
import LeaderboardTableHeaderContainer from "../../containers/leaderboard-table-header-container/LeaderboardTableHeaderContainer";

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
