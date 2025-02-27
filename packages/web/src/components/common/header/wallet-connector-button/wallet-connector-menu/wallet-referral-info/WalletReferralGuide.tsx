import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import * as S from "./WalletReferralInfo.styles";
import { EXT_URL } from "@constants/external-url.contant";
import IconOpenLink from "@components/common/icons/IconOpenLink";

const WalletReferralGuide = () => {
  const { t } = useTranslation();

  return (
    <S.ReferralGuideWrapper>
      <div className="text">{t("Learn how referrals work")}</div>
      <Link href={EXT_URL.DOCS.USER_GUIDE.REFERRAL_REWARD} target="_blank" rel="noreferrer">
        <IconOpenLink />
      </Link>
    </S.ReferralGuideWrapper>
  );
};

export default WalletReferralGuide;
