import React, { useMemo } from "react";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import IconAdenaLogo from "@components/common/icons/defaultIcon/IconAdenaLogo";
import {
  FailNetworkTooltipContentWrap,
  WalletConnectorButtonWrapper,
} from "./WalletConnectorButton.styles";
import WalletConnectorMenu from "@components/common/wallet-connector-menu/WalletConnectorMenu";
import { formatAddress } from "@utils/string-utils";
import { useAtom } from "jotai";
import { CommonState } from "@states/index";
import { AccountModel } from "@models/account/account-model";
import IconFailed from "../icons/IconFailed";
import Tooltip from "../tooltip/Tooltip";
import { Global, css } from "@emotion/react";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import SelectLanguage from "../select-language/SelectLanguage";
import { ITokenResponse } from "@repositories/token";

interface WalletConnectProps {
  account: AccountModel | null;
  connected: boolean;
  connectAdenaClient: () => void;
  themeKey: "dark" | "light";
  disconnectWallet: () => void;
  switchNetwork: () => void;
  isSwitchNetwork: boolean;
  loadingConnect: string;
  gnotBalance?: number;
  isLoadingGnotBalance?: boolean
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
    setToggle((prev) => ({
      ...prev,
      walletConnect: !prev.walletConnect,
    }));
  };

  const isLoading = useMemo(() => {
    return loadingConnect === "loading";
  }, [loadingConnect]);

  const onClickChangeLanguage = () => {
    setToggle((prev) => ({
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
            height: 36
          }}
          onClick={onMenuToggle}
        />
      ) : (
        <Button
          text={isLoading ? "" : "Wallet Login"}
          rightIcon={isLoading ? <LoadingSpinner className="loading-button" /> : <IconStrokeArrowDown className="arrow-icon" />}
          style={{
            hierarchy: ButtonHierarchy.Primary,
            fontType: "p1",
            width: 136,
            height: 36,
            padding: isLoading ? "8.5px 16px 7.5px 20px" : "10px 16px 10px 20px",
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
      {toggle.showLanguage && <SelectLanguage onClickChangeLanguage={onClickChangeLanguage} />}
      <ToolTipGlobalStyle />
    </WalletConnectorButtonWrapper>
  );
};

export default WalletConnectorButton;
