import { useAddress } from "@hooks/common/use-address";
import { useWindowSize } from "@hooks/common/use-window-size";

import LeaderboardSubheader from "../../components/leaderboard-subheader/LeaderboardSubheader";

interface LeaderboardSubheaderContainerProps {
  onOpenVideoGuide: (type: "LEADERBOARD") => void;
}

export default function LeaderboardSubheaderContainer({ onOpenVideoGuide }: LeaderboardSubheaderContainerProps) {
  const { connected, address } = useAddress();
  const { isMobile } = useWindowSize();

  return (
    <LeaderboardSubheader
      connected={connected}
      isMobile={isMobile}
      address={address}
      onOpenVideoGuide={onOpenVideoGuide}
    />
  );
}
