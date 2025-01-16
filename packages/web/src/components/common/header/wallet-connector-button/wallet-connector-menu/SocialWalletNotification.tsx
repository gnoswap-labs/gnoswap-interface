import React from "react";
import Link from "next/link";

import { SOCIAL_WALLET_EXTERNAL_URL } from "@constants/external-url.contant";

import { SocialWalletNotificationWrapper } from "./SocialWalletNotification.styles";
import IconInfo from "@components/common/icons/IconInfo";
import IconOpenLink from "@components/common/icons/IconOpenLink";

const ORANGE_COLOR = "#F97316";

const SocialWalletNotification = () => {
  return (
    <SocialWalletNotificationWrapper>
      <div className="social-wallet-noti-header">
        <IconInfo fill={ORANGE_COLOR} size={16} />
        <div className="title">You’re Using a Social Wallet</div>
      </div>

      <div className="content">
        To use the full wallet features, install
        <br />
        Adena
        <Link href={SOCIAL_WALLET_EXTERNAL_URL.ADENA_INSTALL_URL} target="_blank">
          <IconOpenLink fill={ORANGE_COLOR} className="margin-left" />
        </Link>
        & login with the same social.
      </div>

      <div className="guide">
        How does Social Wallets work?{" "}
        <Link href={SOCIAL_WALLET_EXTERNAL_URL.SOCIAL_WALLET_FAQ_URL} target="_blank">
          <IconOpenLink fill={ORANGE_COLOR} />
        </Link>
      </div>
    </SocialWalletNotificationWrapper>
  );
};

export default SocialWalletNotification;
