import { css, Global } from "@emotion/react";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useMemo } from "react";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconAdenaLogo from "@components/common/icons/defaultIcon/IconAdenaLogo";
import IconFailed from "@components/common/icons/IconFailed";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import Tooltip from "@components/common/tooltip/Tooltip";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { AccountModel } from "@models/account/account-model";
import { ITokenResponse } from "@repositories/token";
import { CommonState } from "@states/index";
import { formatAddress } from "@utils/string-utils";

import SelectLanguage from "./select-language/SelectLanguage";
import WalletConnectorMenu from "./wallet-connector-menu/WalletConnectorMenu";

import {
  FailNetworkTooltipContentWrap,
  WalletConnectorButtonWrapper,
} from "./WalletConnectorButton.styles";

interface WalletConnectProps {
  account: AccountModel | null;
  connected: boolean;
  connectAdenaClient: () => void;
  themeKey: "dark" | "light";
  disconnectWallet: () => void;
  switchNetwork: () => void;
  isSwitchNetwork: boolean;
  loadingConnect: string;
  gnotBalance?: number | null;
  isLoadingGnotBalance?: boolean;
  gnotToken?: ITokenResponse;
}

const ToolTipGlobalStyle = () => {
  return (
    <Global
      styles={() => css`
        .float-class-name {
          @media (min-width: 1180px) {
            top: 10px !important;
            svg {
              top: 15px !important;
            }
          }
        }
      `}
    />
  );
};

const FailNetworkTooltipContent: React.FC = () => {
  return (
    <FailNetworkTooltipContentWrap>
      Unsupported network. <br /> Switch your network to Gnoland.
    </FailNetworkTooltipContentWrap>
  );
};

const WalletConnectorButton: React.FC<WalletConnectProps> = ({
  account,
  connected,
  connectAdenaClient,
  themeKey,
  disconnectWallet,
  switchNetwork,
  isSwitchNetwork,
  loadingConnect,
  gnotBalance,
  isLoadingGnotBalance,
  gnotToken,
}) => {
  const { t } = useTranslation();
  const [toggle, setToggle] = useAtom(CommonState.headerToggle);
  const handleESC = () => {
    setToggle(prev => {
      if (prev.walletConnect) {
        return {
          ...prev,
          walletConnect: false,
        };
      }
      return prev;
    });
  };

  useEscCloseModal(() => handleESC());

  const address = useMemo(() => {
    if (account === null) {
      return "";
    }
    return formatAddress(account.address);
  }, [account]);

  const onMenuToggle = () => {
    setToggle(prev => ({
      ...prev,
      walletConnect: !prev.walletConnect,
    }));
  };

  const isLoading = useMemo(() => {
    return loadingConnect === "loading";
  }, [loadingConnect]);

  const onClickChangeLanguage = () => {
    setToggle(prev => ({
      ...prev,
      showLanguage: !prev.showLanguage,
    }));
  };

  return (
    <WalletConnectorButtonWrapper>
      {connected ? (
        <Button
          leftIcon={
            isSwitchNetwork ? (
              <Tooltip
                floatClassName="float-class-name"
                placement="left"
                FloatingContent={<FailNetworkTooltipContent />}
              >
                <IconFailed className="fail-icon" />
              </Tooltip>
            ) : (
              <IconAdenaLogo />
            )
          }
          text={address}
          rightIcon={<IconStrokeArrowDown className="arrow-icon" />}
          className={
            toggle.walletConnect
              ? "selected connected-button"
              : "connected-button"
          }
          style={{
            fontType: "p1",
            textColor: "text19",
            arrowColor: "text18",
            padding: "10px 16px",
            gap: "8px",
            height: 36,
          }}
          onClick={onMenuToggle}
        />
      ) : (
        <Button
          text={isLoading ? "" : t("HeaderFooter:walletLogin")}
          rightIcon={
            isLoading ? (
              <LoadingSpinner className="loading-button" />
            ) : (
              <IconStrokeArrowDown className="arrow-icon" />
            )
          }
          style={{
            hierarchy: ButtonHierarchy.Primary,
            fontType: "p1",
            minWidth: "136px",
            height: 36,
            padding: isLoading
              ? "8.5px 16px 7.5px 20px"
              : "10px 16px 10px 20px",
            justify: "space-between",
          }}
          onClick={onMenuToggle}
        />
      )}
      {toggle.walletConnect && !toggle.showLanguage && (
        <WalletConnectorMenu
          account={account}
          connected={connected}
          connectAdenaClient={connectAdenaClient}
          disconnectWallet={disconnectWallet}
          onMenuToggle={onMenuToggle}
          themeKey={themeKey}
          switchNetwork={switchNetwork}
          isSwitchNetwork={isSwitchNetwork}
          onClickChangeLanguage={onClickChangeLanguage}
          gnotBalance={gnotBalance}
          isLoadingGnotBalance={isLoadingGnotBalance}
          gnotToken={gnotToken}
        />
      )}
      {toggle.showLanguage && (
        <SelectLanguage onClickChangeLanguage={onClickChangeLanguage} />
      )}
      <ToolTipGlobalStyle />
    </WalletConnectorButtonWrapper>
  );
};

export default WalletConnectorButton;
