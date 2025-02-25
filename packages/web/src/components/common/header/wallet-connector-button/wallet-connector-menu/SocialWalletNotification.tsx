import React from "react";
import Link from "next/link";
import { Trans, useTranslation } from "next-i18next";

import { SOCIAL_WALLET_EXTERNAL_URL } from "@constants/external-url.contant";

import { SocialWalletNotificationWrapper } from "./SocialWalletNotification.styles";
import IconInfo from "@components/common/icons/IconInfo";
import IconOpenLink from "@components/common/icons/IconOpenLink";

const ORANGE_COLOR = "#F97316";

const SocialWalletNotification = () => {
  const { t } = useTranslation();

  return (
    <SocialWalletNotificationWrapper>
      <div className="social-wallet-noti-header">
        <IconInfo fill={ORANGE_COLOR} size={16} />
        <div className="title">{t("common:social.notification.title")}</div>
      </div>

      <div className="content">
        <Trans
          i18nKey={"common:social.notification.content"}
          components={{
            link: (
              <Link href={SOCIAL_WALLET_EXTERNAL_URL.ADENA_INSTALL_URL} target="_blank">
                <IconOpenLink size="11" fill={ORANGE_COLOR} className="margin-left" />{" "}
              </Link>
            ),
          }}
        />
      </div>

      <div className="guide">
        {t("common:social.notification.footer")}{" "}
        <Link href={SOCIAL_WALLET_EXTERNAL_URL.SOCIAL_WALLET_FAQ_URL} target="_blank">
          <IconOpenLink size="11" fill={ORANGE_COLOR} />
        </Link>
      </div>
    </SocialWalletNotificationWrapper>
  );
};

export default SocialWalletNotification;
