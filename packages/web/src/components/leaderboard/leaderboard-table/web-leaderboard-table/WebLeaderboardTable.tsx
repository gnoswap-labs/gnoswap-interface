import { LEADERBOARD_TD_WIDTH } from "@constants/skeleton.constant";
import { LeaderModel } from "@models/leaderboard/leader-model";
import LeaderboardTableRow from "../../leaderboard-table-row/LeaderboardTableRow";

export default function WebLeaderboardTable({
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
          tdWidths={LEADERBOARD_TD_WIDTH}
          isMobile={isMobile}
          me={true}
        />
      )}
      {leaders.map(leader => (
        <LeaderboardTableRow
          key={leader.address}
          item={leader}
          tdWidths={LEADERBOARD_TD_WIDTH}
          isMobile={isMobile}
        />
      ))}
    </>
  );
}
