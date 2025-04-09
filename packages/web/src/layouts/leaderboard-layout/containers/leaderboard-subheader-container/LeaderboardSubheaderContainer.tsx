import { useAddress } from "@hooks/common/use-address";
import { useWindowSize } from "@hooks/common/use-window-size";

import LeaderboardSubheader from "../../components/leaderboard-subheader/LeaderboardSubheader";

export default function LeaderboardSubheaderContainer() {
  const { connected, address } = useAddress();
  const { isMobile } = useWindowSize();

  return <LeaderboardSubheader connected={connected} isMobile={isMobile} address={address} />;
}
