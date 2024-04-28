import CopyReferralLink from "../copy-referral-link/CopyReferralLink";
import { Container, TitleWrapper } from "./LeaderboardSubheader.styles";
import LearnMore from "../learn-more/LearnMore";
import { FontSize16, P } from "../common/common.styles";

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
        <FontSize16>
          <P as="span" color="text04">
            Climb up the leaderboard by collecting points for swapping,
            providing liquidity, staking, or inviting friends. Every activity on
            GnoSwap counts!&nbsp;
          </P>
          <LearnMore />
        </FontSize16>
      </TitleWrapper>

      <CopyReferralLink connected={connected} address={address} />
    </Container>
  );
};

export default LeaderboardSubheader;
