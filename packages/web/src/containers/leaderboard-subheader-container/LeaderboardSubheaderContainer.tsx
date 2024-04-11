import LeaderboardSubheader from "@components/leaderboard/leaderboard-subheader/LeaderboardSubheader";
import { useAddress } from "@hooks/address/use-address";

export default function LeaderboardSubheaderContainer() {
  const { connected, address } = useAddress();

  return <LeaderboardSubheader connected={connected} address={address} />;
}
