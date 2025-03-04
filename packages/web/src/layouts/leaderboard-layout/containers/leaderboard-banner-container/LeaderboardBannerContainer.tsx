import React from "react";
import { Trans } from "react-i18next";

import * as S from "./LeaderboardBannerContainer.styles";

const LeaderboardBannerContainer = () => {
  return (
    <S.BannerWrapper>
      <S.BannerTitle>
        <Trans>
          Boost Your Rank - <strong>Refer & Earn!</strong>
        </Trans>
      </S.BannerTitle>
      <S.BannerDescription>
        <Trans>
          When you use a referral code, both you and your friend will receive a <strong>10% bonus.</strong>
        </Trans>
      </S.BannerDescription>
    </S.BannerWrapper>
  );
};

export default LeaderboardBannerContainer;
