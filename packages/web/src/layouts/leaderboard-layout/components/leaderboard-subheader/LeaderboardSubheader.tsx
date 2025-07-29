import { useTranslation } from "react-i18next";

import CopyReferralLink from "../copy-referral-link/CopyReferralLink";
import { Container, TitleWrapper } from "./LeaderboardSubheader.styles";
import LearnMore from "../learn-more/LearnMore";
import { FontSize16, P } from "../common/common.styles";

const LeaderboardSubheader = ({
  connected,
  address,
  isMobile,
}: {
  connected: boolean;
  isMobile: boolean;
  address?: string;
}) => {
  const { t } = useTranslation();

  return (
    <Container>
      <TitleWrapper>
        <FontSize16>
          <P as="span" color="text04">
            {t("Leaderboard:subHeader.description")}&nbsp;
          </P>
          <LearnMore />
        </FontSize16>
      </TitleWrapper>

      <CopyReferralLink connected={connected} isMobile={isMobile} address={address} />
    </Container>
  );
};

export default LeaderboardSubheader;
