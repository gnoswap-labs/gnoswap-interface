import BigNumber from "bignumber.js";
import { useAtom, useAtomValue } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { makeBankSendGNOTMessage } from "@common/clients/wallet-client/transaction-messages";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconCopy from "@components/common/icons/IconCopy";
import IconExit from "@components/common/icons/IconExit";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import { LANGUAGES } from "@constants/common.constant";
import ThemeModeContainer from "@containers/theme-mode-container/ThemeModeContainer";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { AccountModel } from "@models/account/account-model";
import { ITokenResponse } from "@repositories/token";
import { CommonState, WalletState } from "@states/index";
import { roundDownDecimalNumber } from "@utils/regex";
import { formatAddress } from "@utils/string-utils";
import IconPolygon from "@components/common/icons/IconPolygon";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";

import {
  AmountInfoBox,
  CopyTooltip,
  IconButton,
  MenuHeader,
  Overlay,
  ThemeSelector,
  WalletConnectorMenuWrapper,
} from "./WalletConnectorMenu.styles";
import SocialWalletNotification from "./SocialWalletNotification";
import { WalletTypeState } from "src/types/wallet.types";
import RenderWalletIcon from "../RenderWalletIcon";
import { DEFAULT_GAS_FEE, DEFAULT_GAS_WANTED } from "@common/values";

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
        <IconCopy className="action-icon" />
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
        <IconOpenLink className="action-icon" />
      </IconButton>
      <IconButton onClick={onClickDisconnect}>
        <IconExit className="action-icon" />
      </IconButton>
    </>
  );
};

interface WalletConnectorMenuProps {
  account: AccountModel | null;
  connected: boolean;
  connectAdenaClient: () => void;
  disconnectWallet: () => void;
  onMenuToggle: () => void;
  themeKey: "dark" | "light";
  switchNetwork: () => void;
  isSwitchNetwork: boolean;
  onClickChangeLanguage: () => void;
  gnotBalance?: number | null;
  isLoadingGnotBalance?: boolean;
  gnotToken?: ITokenResponse;
  walletType: WalletTypeState;
}

const WalletConnectorMenu: React.FC<WalletConnectorMenuProps> = ({
  account,
  connected,
  connectAdenaClient,
  disconnectWallet,
  onMenuToggle,
  themeKey,
  switchNetwork,
  isSwitchNetwork,
  onClickChangeLanguage,
  gnotBalance,
  gnotToken,
  walletType,
}) => {
  const [walletClient] = useAtom(WalletState.client);

  const { i18n, t } = useTranslation();
  const { getAccountUrl } = useGnoscanUrl();
  const network = useAtomValue(CommonState.network);

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
        .shiftedBy((gnotToken?.decimals ?? 0) * -1)
        .toString()
        .match(roundDownDecimalNumber(6))
        ?.toString() ?? 0;

    const price = BigNumber(formattedPrice).toFormat();

    return `${price} GNOT` || "0 GNOT";
  }, [account?.balances, gnotBalance, gnotToken?.decimals]);

  const onClickDisconnect = useCallback(() => {
    disconnectWallet();
  }, [disconnectWallet]);

  const connect = useCallback(() => {
    onMenuToggle();
    connectAdenaClient();
  }, [connectAdenaClient]);

  // SendTransaction Example
  const swapTransaction = () => {
    const messages = makeBankSendGNOTMessage({
      from: "g1z5cvp07l80pvsu8rvyyncjrrktpzm8rek4nnnp",
      to: "g1z5cvp07l80pvsu8rvyyncjrrktpzm8rek4nnnp",
      sendAmount: "1000000",
    });
    walletClient
      ?.sendTransaction({ messages: [messages], gasFee: DEFAULT_GAS_FEE, gasWanted: DEFAULT_GAS_WANTED })
      .then(result => {
        console.log(result, "result");
      });
  };

  return (
    <>
      <WalletConnectorMenuWrapper ref={menuRef} width={window?.innerWidth}>
        {connected ? (
          <div className="button-container">
            <MenuHeader>
              <RenderWalletIcon isSwitchNetwork={isSwitchNetwork} walletType={walletType} />
              <span className="user-address">{formatAddress(account?.address || "")}</span>
              <IconButtonMaker
                copyClick={copyClick}
                openLinkClick={openLinkClick}
                themeKey={themeKey}
                copied={copied}
                onClickDisconnect={onClickDisconnect}
              />
            </MenuHeader>
            {walletType.type === "SOCIAL_WALLET" && <SocialWalletNotification />}
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
        ) : (
          <div className="button-container">
            <Button
              text={t("common:btn.walletLogin")}
              onClick={connect}
              style={{
                hierarchy: ButtonHierarchy.Primary,
                fontType: "body9",
                fullWidth: true,
                height: 41,
                justify: "center",
              }}
            />
          </div>
        )}
        <button onClick={swapTransaction}>TXTXTXTXTXT</button>
        <div className="theme-container">
          <ThemeSelector className="mt-16">
            <span>{t("HeaderFooter:language")}</span>
            <div className="language" onClick={onClickChangeLanguage}>
              {LANGUAGES.find(item => item.code === i18n.language)?.name} <IconStrokeArrowRight />
            </div>
          </ThemeSelector>
        </div>
        <div className="theme-container">
          <ThemeSelector>
            <span title={network.chainId}>{t("HeaderFooter:theme")}</span>
            <ThemeModeContainer />
          </ThemeSelector>
        </div>
      </WalletConnectorMenuWrapper>
      <Overlay onClick={onMenuToggle} />
    </>
  );
};

export default WalletConnectorMenu;
