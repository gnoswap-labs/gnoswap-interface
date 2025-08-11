import React from "react";
import { Trans } from "react-i18next";

import * as S from "./WalletReferralInfo.styles";
import IconFlare from "@components/common/icons/IconFlare";

export const ReferralBannerContent = () => {
  return (
    <S.ReferralBannerContentWrapper>
      <IconFlare />
      <div className="text">
        <Trans
          i18nKey={"HeaderFooter:referralSection.banner.content"}
          components={{ span: <span className="highlight"></span>, br: <br /> }}
        ></Trans>
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
