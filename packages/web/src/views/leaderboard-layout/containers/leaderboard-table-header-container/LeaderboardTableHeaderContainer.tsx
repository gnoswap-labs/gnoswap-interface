import { useWindowSize } from "@hooks/common/use-window-size";
import {
  LEADERBOARD_TD_WIDTH,
  MOBILE_LEADERBOARD_TD_WIDTH,
  TABLET_LEADERBOARD_TD_WIDTH,
} from "@constants/skeleton.constant";

import LeaderboardTableHeader from "../../components/leaderboard-table-header/LeaderboardTableHeader";
import {
  TABLE_HEAD,
  TABLE_HEAD_MOBILE,
} from "../../leaderboard-list/LeaderboardList";

export default function LeaderboardTableHeaderContainer() {
  const { isMobile, isTablet } = useWindowSize();

  const heads = (isMobile && TABLE_HEAD_MOBILE) || TABLE_HEAD;

  const widths =
    (isMobile && MOBILE_LEADERBOARD_TD_WIDTH) ||
    (isTablet && TABLET_LEADERBOARD_TD_WIDTH) ||
    LEADERBOARD_TD_WIDTH;

  return (
    <LeaderboardTableHeader heads={Object.values(heads)} headWidths={widths} />
  );
}
