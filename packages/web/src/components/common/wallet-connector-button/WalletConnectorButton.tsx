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

const WalletConnectorButton = ({ isConnected }: { isConnected: boolean }) => {
  const [toggle, setToggle] = useAtom(CommonState.headerToggle);

  const menuOpenToggleHandler = () =>
    setToggle(prev => ({
      ...prev,
      notification: false,
      walletConnect: !prev.walletConnect,
    }));

  return (
    <WalletConnectorButtonWrapper>
      {isConnected ? (
        <Button
          leftIcon={<IconAdenaLogo />}
          text={formatAddress(FAKE_USERINFO.address)}
          rightIcon={<IconStrokeArrowDown />}
          style={{
            hierarchy: ButtonHierarchy.Dark,
            fontType: "p1",
            width: 165,
            height: 36,
            padding: "10px 16px",
            justify: "space-between",
          }}
          onClick={menuOpenToggleHandler}
        />
      ) : (
        <Button
          text="Connect Wallet"
          rightIcon={<IconStrokeArrowDown />}
          style={{
            hierarchy: ButtonHierarchy.Primary,
            fontType: "p1",
            width: 151,
            height: 36,
            padding: "10px 16px",
            justify: "space-between",
          }}
          onClick={menuOpenToggleHandler}
        />
      )}
      {toggle.walletConnect && (
        <WalletConnectorMenu isConnected={isConnected} />
      )}
    </WalletConnectorButtonWrapper>
  );
};

export default WalletConnectorButton;
