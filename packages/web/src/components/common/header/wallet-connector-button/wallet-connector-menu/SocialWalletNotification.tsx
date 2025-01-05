import IconInfo from "@components/common/icons/IconInfo";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import Link from "next/link";
import React from "react";
import { SocialWalletNotificationWrapper } from "./SocialWalletNotification.styles";

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
        <Link href="/" target="_blank">
          <IconOpenLink fill={ORANGE_COLOR} />
        </Link>
        & login with the same social.
      </div>

      <div className="guide">
        How does Social Wallets work?{" "}
        <Link href="/" target="_blank">
          <IconOpenLink fill={ORANGE_COLOR} />
        </Link>
      </div>
    </SocialWalletNotificationWrapper>
  );
};

export default SocialWalletNotification;
