import LeaderboardSubheader from "@components/leaderboard/leaderboard-subheader/LeaderboardSubheader";
import { useConnection } from "@hooks/connection/use-connection";

export default function LeaderboardSubheaderContainer() {
  const { conneted } = useConnection();

  return <LeaderboardSubheader conneted={conneted} />;
}
