import React from "react";
import IconAdd from "../icons/IconAdd";
import { LiquidityEnterAmountsWrapper } from "./LiquidityEnterAmounts.styles";
import TokenAmountInput from "../token-amount-input/TokenAmountInput";
import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import { TokenInfo } from "@models/token/token-info";

interface LiquidityEnterAmountsProps {
  token0Input: TokenAmountInputModel;
  token1Input: TokenAmountInputModel;
  changeToken0: (token: TokenInfo) => void;
  changeToken1: (token: TokenInfo) => void;
}

const LiquidityEnterAmounts: React.FC<LiquidityEnterAmountsProps> = ({
  token0Input,
  token1Input,
  changeToken0,
  changeToken1,
}) => {

  return (
    <LiquidityEnterAmountsWrapper>
      <TokenAmountInput changeToken={changeToken0} {...token0Input} />
      <TokenAmountInput changeToken={changeToken1} {...token1Input} />
      <div className="arrow">
        <div className="shape">
          <IconAdd className="add-icon" />
        </div>
      </div>
    </LiquidityEnterAmountsWrapper>
  );
};

export default LiquidityEnterAmounts;
