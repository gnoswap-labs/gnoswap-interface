import { Container, SubheaderTitle } from "./LeaderboardSubheader.styles";
import CopyReferralLink from "../copy-referral-link/CopyReferralLink";
import LeaderboardLearnMore from "../leaderboard-learn-more/LeaderboardLearnMore";
import LeaderboardSubesction from "../leaderboard-subsection/LeaderboardSubesction";
import { useConnection } from "../../../hooks/connection/use-connection";

export default function LeaderboardSubHeader() {
  const { conneted } = useConnection();

  return (
    <Container>
      <SubheaderTitle>
        <LeaderboardSubesction />
        &nbsp;
        <LeaderboardLearnMore />
      </SubheaderTitle>

      <div>
        <CopyReferralLink conneted={conneted} />
      </div>
    </Container>
  );
}
