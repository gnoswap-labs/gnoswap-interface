import CopyReferralLink from "../copy-referral-link/CopyReferralLink";
import { Container, Text04, TitleWrapper } from "./LeaderboardSubheader.styles";
import LearnMore from "../learn-more/LearnMore";

const LeaderboardSubheader = ({ connected }: { connected: boolean }) => {
  return (
    <Container>
      <TitleWrapper>
        <Text04>
          Climb up the leaderboard by collecting points for swapping, providing
          liquidity, staking, or inviting friends. Every activity on GnoSwap
          counts!&nbsp;
        </Text04>
        <LearnMore />
      </TitleWrapper>

      <CopyReferralLink connected={connected} />
    </Container>
  );
};

export default LeaderboardSubheader;