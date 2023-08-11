import React from "react";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import IconAdenaLogo from "@components/common/icons/defaultIcon/IconAdenaLogo";
import { WalletConnectorButtonWrapper } from "./WalletConnectorButton.styles";
import WalletConnectorMenu from "@components/common/wallet-connector-menu/WalletConnectorMenu";
import { formatAddress } from "@utils/string-utils";
import { useAtom } from "jotai";
import { CommonState } from "@states/index";

const FAKE_USERINFO = {
  status: "IN_ACTIVE",
  address: "g14qvahvnnllzwl9ehn3mkph248uapsehwgfe4pt",
  amount: {
    value: "",
    denom: "",
  },
};

interface WalletConnectProps {
  isConnected: boolean;
}

const WalletConnectorButton: React.FC<WalletConnectProps> = ({
  isConnected,
}) => {
  const [toggle, setToggle] = useAtom(CommonState.headerToggle);

  const onMenuToggle = () => {
    setToggle(prev => ({
      ...prev,
      walletConnect: !prev.walletConnect,
    }));
  };

  return (
    <WalletConnectorButtonWrapper>
      {isConnected ? (
        <Button
          leftIcon={<IconAdenaLogo />}
          text={formatAddress(FAKE_USERINFO.address)}
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
          isConnected={isConnected}
          onMenuToggle={onMenuToggle}
        />
      )}
    </WalletConnectorButtonWrapper>
  );
};

export default WalletConnectorButton;
