import { LEADERBOARD_TD_WIDTH } from "@constants/skeleton.constant";
import { Leader } from "@repositories/leaderboard/response/common/types";
import LeaderboardTableRow from "../../leaderboard-table-row/LeaderboardTableRow";

export default function WebLeaderboardTable({
  me,
  leaders,
  isMobile,
}: {
  me?: Leader;
  leaders: Leader[];
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
