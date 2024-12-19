import { useAddress } from "@hooks/common/use-address";

import LeaderboardSubheader from "../../components/leaderboard-subheader/LeaderboardSubheader";

export default function LeaderboardSubheaderContainer() {
  const { connected, address } = useAddress();

  return <LeaderboardSubheader connected={connected} address={address} />;
}
