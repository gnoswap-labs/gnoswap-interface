import React from "react";
import { Trans, useTranslation } from "react-i18next";

import { EXT_URL } from "@constants/external-url.contant";
import { VIDEO_GUIDE_TYPES } from "@constants/video-guide.constant";

import CopyReferralLink from "../copy-referral-link/CopyReferralLink";
import { Container, DocsLink, TitleWrapper } from "./LeaderboardSubheader.styles";
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
            <Trans i18nKey="Leaderboard:subHeader.description" components={{ br: <br /> }} />
            &nbsp;&nbsp;
          </P>
          <DocsLink href={EXT_URL.DOCS.USER_GUIDE.LEADERBOARD} target="_blank" rel="noreferrer">
            {t("Leaderboard:subHeader.howPointsWork")}
          </DocsLink>
          <VideoGuideTrigger text={`${t("common:guide.learnMore")} ▶`} onClick={handleOpenVideoGuide} />
        </FontSize16>
      </TitleWrapper>

      <CopyReferralLink connected={connected} isMobile={isMobile} address={address} />
    </Container>
  );
};

export default LeaderboardSubheader;
