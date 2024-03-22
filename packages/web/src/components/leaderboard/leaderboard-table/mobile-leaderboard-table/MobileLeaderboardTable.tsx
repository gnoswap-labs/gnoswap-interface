import { MOBILE_LEADERBOARD_TD_WIDTH } from "@constants/skeleton.constant";
import { LeaderModel } from "@models/leaderboard/leader-model";
import MobileLeaderboardTableRow from "../../mobile-leaderboard-table-row/MobileLeaderboardTableRow";

export default function MobileLeaderboardTable({
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
        <MobileLeaderboardTableRow
          item={me}
          tdWidths={MOBILE_LEADERBOARD_TD_WIDTH}
          isMobile={isMobile}
          me={true}
        />
      )}
      {leaders.map(leader => (
        <MobileLeaderboardTableRow
          key={leader.address}
          item={leader}
          tdWidths={MOBILE_LEADERBOARD_TD_WIDTH}
          isMobile={isMobile}
        />
      ))}
    </>
  );
}
