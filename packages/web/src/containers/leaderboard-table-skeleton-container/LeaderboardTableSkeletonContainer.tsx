import TableSkeleton from "@components/common/table-skeleton/TableSkeleton";
import LeaderboardTableWrapper from "@components/leaderboard/leaderboard-table-wrapper/LeaderboardTableWrapper";
import {
  LEADER_INFO,
  MOBILE_LEADER_INFO,
  TABLET_LEADER_INFO,
} from "@constants/skeleton.constant";
import { useWindowSize } from "@hooks/common/use-window-size";

export default function LeaderboardTableSkeletonContainer() {
  const { isMobile, isTablet, isWeb } = useWindowSize();

  return (
    <LeaderboardTableWrapper>
      {isMobile && <TableSkeleton info={MOBILE_LEADER_INFO} />}
      {isTablet && <TableSkeleton info={TABLET_LEADER_INFO} />}
      {isWeb && <TableSkeleton info={LEADER_INFO} />}
    </LeaderboardTableWrapper>
  );
}
