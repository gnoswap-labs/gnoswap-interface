import CopyReferralLink from "../copy-referral-link/CopyReferralLink";
import { Container, Text04, TitleWrapper } from "./LeaderboardSubheader.styles";
import LearnMore from "../learn-more/LearnMore";
import { FontSize } from "../common/common.styles";

const LeaderboardSubheader = ({
  connected,
  address,
}: {
  connected: boolean;
  address?: string;
}) => {
  return (
    <Container>
      <TitleWrapper>
        <FontSize>
          <Text04>
            Climb up the leaderboard by collecting points for swapping,
            providing liquidity, staking, or inviting friends. Every activity on
            GnoSwap counts!&nbsp;
          </Text04>
          <LearnMore />
        </FontSize>
      </TitleWrapper>

      <CopyReferralLink connected={connected} address={address} />
    </Container>
  );
};

export default LeaderboardSubheader;
