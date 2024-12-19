import { MOBILE_LEADERBOARD_TD_WIDTH } from "@constants/skeleton.constant";
import { LeaderModel } from "@models/leaderboard/leader-model";
import MobileLeaderboardTableRow from "../../mobile-leaderboard-table-row/MobileLeaderboardTableRow";

export default function MobileLeaderboardTable({
  myLeader,
  leaders,
  isMobile,
}: {
  myLeader?: LeaderModel;
  leaders: LeaderModel[];
  isMobile: boolean;
}) {
  return (
    <>
      {myLeader && (
        <MobileLeaderboardTableRow
          item={myLeader}
          tdWidths={MOBILE_LEADERBOARD_TD_WIDTH}
          isMobile={isMobile}
          isMe={true}
        />
      )}
      {leaders.map(leader => (
        <MobileLeaderboardTableRow
          key={`${leader.rank}:${leader.address}`}
          item={leader}
          tdWidths={MOBILE_LEADERBOARD_TD_WIDTH}
          isMobile={isMobile}
        />
      ))}
    </>
  );
}
