import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import * as S from "./WalletReferralInfo.styles";
import { EXT_URL } from "@constants/external-url.contant";
import IconOpenLink from "@components/common/icons/IconOpenLink";

const WalletReferralGuide = () => {
  const { t } = useTranslation();

  return (
    <Link href={EXT_URL.DOCS.USER_GUIDE.REFERRAL_REWARD} target="_blank" rel="noreferrer">
      <S.ReferralGuideWrapper>
        <div className="text">{t("Learn how referrals work")}</div>
        <IconOpenLink />
      </S.ReferralGuideWrapper>
    </Link>
  );
};

export default WalletReferralGuide;
