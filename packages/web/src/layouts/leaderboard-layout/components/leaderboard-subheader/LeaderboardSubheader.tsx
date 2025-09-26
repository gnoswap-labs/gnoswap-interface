import React from "react";
import { useTranslation } from "react-i18next";

import { VIDEO_GUIDE_TYPES } from "@constants/video-guide.constant";

import CopyReferralLink from "../copy-referral-link/CopyReferralLink";
import { Container, TitleWrapper } from "./LeaderboardSubheader.styles";
import { FontSize16, P } from "../common/common.styles";
import VideoGuideTrigger from "@components/common/video-guide-trigger/VideoGuideTrigger";

const LeaderboardSubheader = ({
  connected,
  address,
  isMobile,
  onOpenVideoGuide,
}: {
  connected: boolean;
  isMobile: boolean;
  address?: string;
  onOpenVideoGuide: (type: "LEADERBOARD") => void;
}) => {
  const { t } = useTranslation();

  const handleOpenVideoGuide = React.useCallback(() => {
    onOpenVideoGuide(VIDEO_GUIDE_TYPES.LEADERBOARD);
  }, [onOpenVideoGuide]);

  return (
    <Container>
      <TitleWrapper>
        <FontSize16>
          <P as="span" color="text04">
            {t("Leaderboard:subHeader.description")}&nbsp;
          </P>
          <VideoGuideTrigger text={`${t("common:guide.learnMore")} ▶`} onClick={handleOpenVideoGuide} />
        </FontSize16>
      </TitleWrapper>

      <CopyReferralLink connected={connected} isMobile={isMobile} address={address} />
    </Container>
  );
};

export default LeaderboardSubheader;
