import { TABLET_LEADERBOARD_TD_WIDTH } from "@constants/skeleton.constant";
import { LeaderModel } from "@models/leaderboard/leader-model";
import LeaderboardTableRow from "../../leaderboard-table-row/LeaderboardTableRow";

export default function TabletLeaderboardTable({
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
        <LeaderboardTableRow
          item={myLeader}
          tdWidths={TABLET_LEADERBOARD_TD_WIDTH}
          isMobile={isMobile}
          isMe={true}
        />
      )}
      {leaders.map(leader => (
        <LeaderboardTableRow
          key={`${leader.rank}:${leader.address}`}
          item={leader}
          tdWidths={TABLET_LEADERBOARD_TD_WIDTH}
          isMobile={isMobile}
        />
      ))}
    </>
  );
}
