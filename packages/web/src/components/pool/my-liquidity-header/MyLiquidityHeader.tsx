// TODO : remove eslint-disable after work
/* eslint-disable */
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import React from "react";
import { HeaderWrapper } from "./MyLiquidityHeader.styles";

interface MyLiquidityHeaderProps {
  info: any;
  connected: boolean;
  isSwitchNetwork: boolean;
}

const MyLiquidityHeader: React.FC<MyLiquidityHeaderProps> = ({ info, connected, isSwitchNetwork }) => {
  return (
    <HeaderWrapper>
      <h2>My Positions</h2>
      <div className="button-wrap">
        <Button
          disabled={!connected || isSwitchNetwork}
          text="Remove Position"
          onClick={() => {}}
          style={{
            hierarchy: ButtonHierarchy.Primary,
            height: 36,
            padding: "10px 16px",
            fontType: "p1",
          }}
        />
        <Button
          text="Create Position"
          onClick={() => {}}
          style={{
            hierarchy: ButtonHierarchy.Primary,
            height: 36,
            padding: "10px 16px",
            fontType: "p1",
          }}
        />
      </div>
    </HeaderWrapper>
  );
};

export default MyLiquidityHeader;
