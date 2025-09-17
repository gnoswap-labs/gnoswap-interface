import { css, Global } from "@emotion/react";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useCallback, useMemo } from "react";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconFailed from "@components/common/icons/IconFailed";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import Tooltip from "@components/common/tooltip/Tooltip";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { AccountModel } from "@models/account/account-model";
import { ITokenResponse } from "@repositories/token";
import { CommonState } from "@states/index";

import WalletConnectorMenu from "./wallet-connector-menu/WalletConnectorMenu";

import { DEVICE_TYPE } from "@styles/media";
import { FailNetworkTooltipContentWrap, WalletConnectorButtonWrapper } from "./WalletConnectorButton.styles";
import { WalletTypeState } from "src/types/wallet.types";
import RenderWalletIcon from "./RenderWalletIcon";

interface WalletConnectProps {
  account: AccountModel | null;
  breakpoint: DEVICE_TYPE;
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
  walletType: WalletTypeState;
  displayAddress: string;
  resetWeb3authSession: () => void;
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
      Unsupported network. <br /> Switch your network to Gno.land.
    </FailNetworkTooltipContentWrap>
  );
};

const WalletConnectorButton: React.FC<WalletConnectProps> = ({
  account,
  breakpoint,
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
  walletType,
  displayAddress,
  resetWeb3authSession,
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

  const onMenuToggle = () => {
    setToggle(prev => ({
      ...prev,
      walletConnect: !prev.walletConnect,
    }));
  };

  const handleCloseWalletConnectToggle = () => {
    setToggle(prev => ({
      ...prev,
      walletConnect: false,
    }));
  };

  const isLoading = useMemo(() => {
    return loadingConnect === "loading";
  }, [loadingConnect]);

  const connect = useCallback(() => {
    resetWeb3authSession();
    handleCloseWalletConnectToggle();
    connectAdenaClient();
  }, [connectAdenaClient]);

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
                <IconFailed className="fail-icon tooltip" />
              </Tooltip>
            ) : (
              <RenderWalletIcon isSwitchNetwork={isSwitchNetwork} walletType={walletType} />
            )
          }
          text={displayAddress}
          rightIcon={<IconStrokeArrowDown className="arrow-icon" />}
          className={toggle.walletConnect ? "selected connected-button" : "connected-button"}
          style={{
            fontType: "p1",
            textColor: "text19",
            arrowColor: "text18",
            padding: "10px 16px",
            height: 36,
          }}
          onClick={onMenuToggle}
        />
      ) : (
        <Button
          className="connector-button"
          text={isLoading ? "" : t("common:btn.walletLogin")}
          rightIcon={isLoading ? <LoadingSpinner className="loading-button" /> : null}
          style={{
            hierarchy: ButtonHierarchy.Primary,
            fontType: "p1",
            minWidth: "136px",
            height: 36,
            padding: isLoading ? "8.5px 16px 7.5px 16px" : "10px 16px",
            justify: "space-between",
          }}
          onClick={connect}
        />
      )}
      {connected && toggle.walletConnect && (
        <WalletConnectorMenu
          account={account}
          breakpoint={breakpoint}
          connected={connected}
          disconnectWallet={disconnectWallet}
          onMenuToggle={onMenuToggle}
          themeKey={themeKey}
          switchNetwork={switchNetwork}
          isSwitchNetwork={isSwitchNetwork}
          gnotBalance={gnotBalance}
          isLoadingGnotBalance={isLoadingGnotBalance}
          gnotToken={gnotToken}
          walletType={walletType}
          resetWeb3authSession={resetWeb3authSession}
        />
      )}
      <ToolTipGlobalStyle />
    </WalletConnectorButtonWrapper>
  );
};

export default WalletConnectorButton;
