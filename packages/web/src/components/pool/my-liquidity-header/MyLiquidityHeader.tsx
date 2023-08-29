// TODO : remove eslint-disable after work
/* eslint-disable */
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import React from "react";
import { HeaderWrapper } from "./MyLiquidityHeader.styles";

interface MyLiquidityHeaderProps {
  info: any;
}

const MyLiquidityHeader: React.FC<MyLiquidityHeaderProps> = ({ info }) => {
  return (
    <HeaderWrapper>
      <h2>My Liquidity</h2>
      <div className="button-wrap">
        <Button
          text="Remove Liquidity"
          onClick={() => {}}
          style={{
            hierarchy: ButtonHierarchy.Primary,
            height: 36,
            padding: "10px 16px",
            fontType: "p1",
          }}
        />
        <Button
          text="Add Liquidity"
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
