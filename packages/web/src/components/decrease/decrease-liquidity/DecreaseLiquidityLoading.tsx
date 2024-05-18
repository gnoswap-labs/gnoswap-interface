import React from "react";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { DecreaseLiquidityWrapper } from "./DecreaseLiquidity.styles";
import DecreaseSelectPositionLoading from "../decrease-select-position/DecreaseSelectPositionLoading";
import DecreaseAmountPositionLoading from "../decrease-select-position/DecreaseAmountLoading";

const DecreaseLiquidityLoading: React.FC = () => {
  return (
    <DecreaseLiquidityWrapper>
      <h3 className="title">Decrease Liquidity</h3>
      <article>
        <DecreaseSelectPositionLoading />
      </article>
      <article>
        <DecreaseAmountPositionLoading />
      </article>
      <Button
        onClick={() => {}}
        text="Enter Amount"
        style={{
          hierarchy: ButtonHierarchy.Gray,
          fullWidth: true,
        }}
        className="button-confirm"
      />
    </DecreaseLiquidityWrapper>
  );
};

export default DecreaseLiquidityLoading;
