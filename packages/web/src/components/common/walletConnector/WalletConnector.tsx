import React from "react";
import Button from "../button/Button";
import IconStrokeArrowDown from "../icons/IconStrokeArrowDown";
import { ButtonHierarchy } from "../button/Button.styles";
import { formatAddress } from "@/common/utils/string-util";
import IconAdenaLogo from "../icons/defaultIcon/IconAdenaLogo";
import { WalletConnectorWrapper } from "./WalletConnector.styles";

const FAKE_USERINFO = {
  status: "IN_ACTIVE",
  address: "g14qvahvnnllzwl9ehn3mkph248uapsehwgfe4pt",
  amount: {
    value: "",
    denom: "",
  },
};

const WalletConnector = ({ isConnected }: { isConnected: boolean }) => {
  return (
    <WalletConnectorWrapper>
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
          onClick={() => {}}
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
          onClick={() => {}}
        />
      )}
    </WalletConnectorWrapper>
  );
};

export default WalletConnector;
