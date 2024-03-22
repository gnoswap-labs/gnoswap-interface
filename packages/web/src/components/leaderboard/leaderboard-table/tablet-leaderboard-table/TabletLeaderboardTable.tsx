import { TABLET_LEADERBOARD_TD_WIDTH } from "@constants/skeleton.constant";
import { LeaderModel } from "@models/leaderboard/leader-model";
import LeaderboardTableRow from "../../leaderboard-table-row/LeaderboardTableRow";

export default function TabletLeaderboardTable({
  me,
  leaders,
  isMobile,
}: {
  me?: LeaderModel;
  leaders: LeaderModel[];
  isMobile: boolean;
}) {
  return (
    <>
      {me && (
        <LeaderboardTableRow
          item={me}
          tdWidths={TABLET_LEADERBOARD_TD_WIDTH}
          isMobile={isMobile}
          me={true}
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
