import BigNumber from "bignumber.js";
import React, { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "@emotion/react";
import { Trans, useTranslation } from "next-i18next";

import { GNOT_TOKEN } from "@common/values/token-constant";
import { SOCIAL_WALLET_EXTERNAL_URL } from "@constants/external-url.contant";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconInfo from "@components/common/icons/IconInfo";
import IconHeaderCopy from "@components/common/icons/IconHeaderCopy";
import IconHeaderOpenLink from "@components/common/icons/IconHeaderOpenLink";
import IconHeaderExit from "@components/common/icons/IconHeaderExit";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { AccountModel } from "@models/account/account-model";
import { ITokenResponse } from "@repositories/token";
import { roundDownDecimalNumber } from "@utils/regex";
import IconPolygon from "@components/common/icons/IconPolygon";

import { DEVICE_TYPE } from "@styles/media";
import {
  AmountInfoBox,
  CopyTooltip,
  IconButton,
  MenuHeader,
  Overlay,
  TooltipContent,
  WalletConnectorMenuWrapper,
} from "./WalletConnectorMenu.styles";
import SocialWalletNotification from "./SocialWalletNotification";
import { WalletTypeState } from "src/types/wallet.types";
import RenderWalletIcon from "../RenderWalletIcon";
import Tooltip from "@components/common/tooltip/Tooltip";
import { formatAddress } from "@utils/string-utils";
import WalletReferralInfo from "./wallet-referral-info/WalletReferralInfo";
import WalletReferralBanner from "./wallet-referral-info/WalletReferralBanner";
import WalletReferralGuide from "./wallet-referral-info/WalletReferralGuide";

interface IconButtonClickProps {
  copyClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  openLinkClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  themeKey: "dark" | "light";
  copied: boolean;
  onClickDisconnect: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const IconButtonMaker: React.FC<IconButtonClickProps> = ({
  copyClick,
  openLinkClick,
  themeKey,
  copied,
  onClickDisconnect,
}) => {
  return (
    <>
      <IconButton onClick={copyClick}>
        <IconHeaderCopy className="action-icon" />
        {copied && (
          <CopyTooltip>
            <div className={`box ${themeKey}-shadow`}>
              <span>Copied!</span>
            </div>
            <IconPolygon className="polygon-icon" />
          </CopyTooltip>
        )}
      </IconButton>
      <IconButton onClick={openLinkClick}>
        <IconHeaderOpenLink className="action-icon" />
      </IconButton>
      <IconButton onClick={onClickDisconnect}>
        <IconHeaderExit className="action-icon" />
      </IconButton>
    </>
  );
};

interface WalletConnectorMenuProps {
  account: AccountModel | null;
  breakpoint: DEVICE_TYPE;
  connected: boolean;
  disconnectWallet: () => void;
  onMenuToggle: () => void;
  themeKey: "dark" | "light";
  switchNetwork: () => void;
  isSwitchNetwork: boolean;
  gnotBalance?: number | null;
  isLoadingGnotBalance?: boolean;
  gnotToken?: ITokenResponse;
  walletType: WalletTypeState;
  resetWeb3authSession: () => void;
}

const WalletConnectorMenu: React.FC<WalletConnectorMenuProps> = ({
  account,
  breakpoint,
  connected,
  disconnectWallet,
  onMenuToggle,
  themeKey,
  switchNetwork,
  isSwitchNetwork,
  gnotBalance,
  gnotToken,
  walletType,
  resetWeb3authSession,
}) => {
  const { t } = useTranslation();
  const { getAccountUrl } = useGnoscanUrl();
  const theme = useTheme();

  const [copied, setCopied] = useState(false);
  const copyClick = async () => {
    try {
      await navigator.clipboard.writeText(account?.address || "");
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (e: unknown) {
      throw new Error(`Copy Error! ${e}`);
    }
  };
  const openLinkClick = () => {
    window.open(getAccountUrl(account?.address || ""), "_blank");
  };

  const menuRef = useRef<HTMLDivElement | null>(null);

  const balanceText = useMemo(() => {
    const balance = gnotBalance || account?.balances?.[0].amount || "-";
    const formattedPrice =
      BigNumber(balance ?? 0)
        .shiftedBy((gnotToken?.decimals ?? GNOT_TOKEN.decimals) * -1)
        .toString()
        .match(roundDownDecimalNumber(6))
        ?.toString() ?? 0;

    const price = BigNumber(formattedPrice).toFormat();

    return `${price} GNOT` || "0 GNOT";
  }, [account?.balances, gnotBalance, gnotToken?.decimals]);

  const onClickDisconnect = useCallback(async () => {
    await disconnectWallet();
    resetWeb3authSession();
  }, [disconnectWallet]);

  return (
    <>
      <WalletConnectorMenuWrapper ref={menuRef} width={window?.innerWidth}>
        {connected && (
          <div className="wallet-connector-container">
            <div className="button-container">
              <MenuHeader>
                <RenderWalletIcon isSwitchNetwork={isSwitchNetwork} walletType={walletType} />
                <span className="user-address">
                  {formatAddress(account?.address || "")}
                  {breakpoint === DEVICE_TYPE.MOBILE && walletType.type === "SOCIAL_WALLET" && (
                    <Tooltip
                      floatClassName="test"
                      FloatingContent={<SocialWalletNotificationTooltip />}
                      placement="top"
                    >
                      <IconInfo
                        className="tooltip"
                        fill={theme.themeKey === "dark" ? "#596782" : "#90A2C0"}
                        size={16}
                      />
                    </Tooltip>
                  )}
                </span>
                <IconButtonMaker
                  copyClick={copyClick}
                  openLinkClick={openLinkClick}
                  themeKey={themeKey}
                  copied={copied}
                  onClickDisconnect={onClickDisconnect}
                />
              </MenuHeader>
              {breakpoint !== DEVICE_TYPE.MOBILE && walletType.type === "SOCIAL_WALLET" && <SocialWalletNotification />}
              {isSwitchNetwork ? (
                <Button
                  text={t("HeaderFooter:switchNetwork")}
                  onClick={switchNetwork}
                  style={{
                    hierarchy: ButtonHierarchy.Primary,
                    fontType: "body9",
                    fullWidth: true,
                    height: 41,
                    justify: "center",
                  }}
                  className="switch-network"
                />
              ) : (
                <AmountInfoBox>{balanceText}</AmountInfoBox>
              )}
            </div>

            <WalletReferralInfo account={account} breakpoint={breakpoint} />

            {breakpoint !== DEVICE_TYPE.MOBILE && <WalletReferralBanner />}

            <WalletReferralGuide />
          </div>
        )}
      </WalletConnectorMenuWrapper>
      <Overlay onClick={onMenuToggle} />
    </>
  );
};

export const SocialWalletNotificationTooltip = () => {
  const { t } = useTranslation();
  const ORANGE_COLOR = "#FF9F0A";
  return (
    <TooltipContent>
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
          <IconOpenLink size="12" fill={ORANGE_COLOR} />
        </Link>
      </div>
    </TooltipContent>
  );
};

export default WalletConnectorMenu;
