import React, { useMemo } from "react";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import IconAdenaLogo from "@components/common/icons/defaultIcon/IconAdenaLogo";
import { WalletConnectorButtonWrapper } from "./WalletConnectorButton.styles";
import WalletConnectorMenu from "@components/common/wallet-connector-menu/WalletConnectorMenu";
import { formatAddress } from "@utils/string-utils";
import { useAtom } from "jotai";
import { CommonState } from "@states/index";
import { AccountInfo } from "@common/clients/wallet-client/protocols";

interface WalletConnectProps {
  account: AccountInfo | null;
  connected: boolean;
  connectAdenaClient: () => void;
}

const WalletConnectorButton: React.FC<WalletConnectProps> = ({
  account,
  connected,
  connectAdenaClient,
}) => {
  const [toggle, setToggle] = useAtom(CommonState.headerToggle);

  const address = useMemo(() => account?.address || "", [account?.address]);

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
          leftIcon={<IconAdenaLogo />}
          text={formatAddress(address)}
          rightIcon={<IconStrokeArrowDown className="arrow-icon" />}
          className={toggle.walletConnect ? "selected" : ""}
          style={{
            hierarchy: ButtonHierarchy.Dark,
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
        />
      )}
    </WalletConnectorButtonWrapper>
  );
};

export default WalletConnectorButton;
