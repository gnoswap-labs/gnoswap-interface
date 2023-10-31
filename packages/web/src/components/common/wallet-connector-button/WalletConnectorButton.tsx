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

const CHAIN_ID = process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID || "";

interface WalletConnectProps {
  account: AccountModel | null;
  connected: boolean;
  connectAdenaClient: () => void;
  themeKey: "dark" | "light";
  disconnectWallet: () => void;
  switchNetwork: () => void;
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
}) => {
  const [toggle, setToggle] = useAtom(CommonState.headerToggle);

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

  return (
    <WalletConnectorButtonWrapper>
      {connected ? (
        <Button
          leftIcon={
            account && account.chainId !== CHAIN_ID ? (
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
          }}
          onClick={onMenuToggle}
        />
      ) : (
        <Button
          text="Connect Wallet"
          rightIcon={<IconStrokeArrowDown className="arrow-icon" />}
          style={{
            hierarchy: ButtonHierarchy.Primary,
            fontType: "p1",
            width: 155,
            height: 36,
            padding: "10px 16px 10px 20px",
            justify: "space-between",
          }}
          onClick={onMenuToggle}
        />
      )}
      {toggle.walletConnect && (
        <WalletConnectorMenu
          account={account}
          connected={connected}
          connectAdenaClient={connectAdenaClient}
          disconnectWallet={disconnectWallet}
          onMenuToggle={onMenuToggle}
          themeKey={themeKey}
          switchNetwork={switchNetwork}
        />
      )}
      <ToolTipGlobalStyle />
    </WalletConnectorButtonWrapper>
  );
};

export default WalletConnectorButton;
