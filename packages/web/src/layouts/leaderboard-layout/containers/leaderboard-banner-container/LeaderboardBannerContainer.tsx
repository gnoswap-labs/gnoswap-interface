import React from "react";
import { Trans } from "react-i18next";

import * as S from "./LeaderboardBannerContainer.styles";

const LeaderboardBannerContainer = () => {
  return (
    <S.BannerWrapper>
      <S.BannerTitle>
        <Trans i18nKey={"Leaderboard:banner.title"} components={{ strong: <strong></strong> }} />
      </S.BannerTitle>
      <S.BannerDescription>
        <Trans i18nKey={"Leaderboard:banner.description"} components={{ strong: <strong></strong> }} />
      </S.BannerDescription>
    </S.BannerWrapper>
  );
};

export default LeaderboardBannerContainer;
