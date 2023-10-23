import React, { useMemo } from "react";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import IconAdenaLogo from "@components/common/icons/defaultIcon/IconAdenaLogo";
import { WalletConnectorButtonWrapper } from "./WalletConnectorButton.styles";
import WalletConnectorMenu from "@components/common/wallet-connector-menu/WalletConnectorMenu";
import { formatAddress } from "@utils/string-utils";
import { useAtom } from "jotai";
import { CommonState } from "@states/index";
import { AccountModel } from "@models/account/account-model";
import IconFailed from "../icons/IconFailed";

interface WalletConnectProps {
  account: AccountModel | null;
  connected: boolean;
  connectAdenaClient: () => void;
  themeKey: "dark" | "light";
}

const WalletConnectorButton: React.FC<WalletConnectProps> = ({
  account,
  connected,
  connectAdenaClient,
  themeKey,
}) => {
  const [toggle, setToggle] = useAtom(CommonState.headerToggle);

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

  return (
    <WalletConnectorButtonWrapper>
      {connected ? (
        <Button
          leftIcon={
            account && account.chainId !== "dev.gnoswap" ? (
              <IconFailed className="fail-icon" />
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
            width: 151,
            height: 36,
            padding: "10px 16px",
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
          onMenuToggle={onMenuToggle}
          themeKey={themeKey}
        />
      )}
    </WalletConnectorButtonWrapper>
  );
};

export default WalletConnectorButton;
