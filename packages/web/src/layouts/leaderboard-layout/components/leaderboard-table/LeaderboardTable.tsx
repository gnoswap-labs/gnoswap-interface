import React from "react";
import {
  LEADERBOARD_TD_WIDTH,
  MOBILE_LEADERBOARD_TD_WIDTH,
  TABLET_LEADERBOARD_TD_WIDTH,
} from "@constants/skeleton.constant";
import { useWindowSize } from "@hooks/common/use-window-size";
import { LeaderboardUser } from "@repositories/leaderboard/response/common/types";
import LeaderboardTableRow from "../leaderboard-table-row/LeaderboardTableRow";
import { useConnection } from "@hooks/common/use-connection";

export default function LeaderboardTable({
  myAddress,
  currentUserData,
  leaderboardEntries,
  rankOffset = 0,
}: {
  myAddress: string | undefined;
  currentUserData?: LeaderboardUser;
  leaderboardEntries: LeaderboardUser[];
  rankOffset?: number;
}) {
  const { connected } = useConnection();
  const { isTablet, isMobile } = useWindowSize();

  const widths = React.useMemo(() => {
    return (
      (isMobile && MOBILE_LEADERBOARD_TD_WIDTH) || (isTablet && TABLET_LEADERBOARD_TD_WIDTH) || LEADERBOARD_TD_WIDTH
    );
  }, [isTablet, isMobile]);

  return (
    <>
      {connected && currentUserData && (
        <LeaderboardTableRow
          myAddress={myAddress}
          data={currentUserData}
          tdWidths={widths}
          isMobile={isMobile}
          isMe={true}
        />
      )}
      {leaderboardEntries.map(leader => (
        <LeaderboardTableRow
          myAddress={myAddress}
          key={`${leader.rank}:${leader.accountAddress}`}
          data={leader}
          tdWidths={widths}
          isMobile={isMobile}
          rankOffset={rankOffset}
        />
      ))}
    </>
  );
}
