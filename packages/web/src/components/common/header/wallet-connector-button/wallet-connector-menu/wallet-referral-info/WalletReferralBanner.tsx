import React from "react";
import { Trans } from "react-i18next";

import * as S from "./WalletReferralInfo.styles";
import IconFlare from "@components/common/icons/IconFlare";

export const ReferralBannerContent = () => {
  return (
    <S.ReferralBannerContentWrapper>
      <IconFlare />
      <div className="text">
        <Trans>
          Refer friends for bonus points.
          <br />
          <span className="highlight">Earn 10%, Give 10%</span>
        </Trans>
      </div>
    </S.ReferralBannerContentWrapper>
  );
};

const WalletReferralBanner = () => {
  return (
    <S.ReferralInfoBanner>
      <ReferralBannerContent />
    </S.ReferralInfoBanner>
  );
};

export default WalletReferralBanner;
