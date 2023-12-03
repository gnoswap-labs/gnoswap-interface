import React from "react";
import IconAdd from "../icons/IconAdd";
import { LiquidityEnterAmountsWrapper } from "./LiquidityEnterAmounts.styles";
import TokenAmountInput from "../token-amount-input/TokenAmountInput";
import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import { TokenModel } from "@models/token/token-model";

interface LiquidityEnterAmountsProps {
  tokenAInput: TokenAmountInputModel;
  tokenBInput: TokenAmountInputModel;
  changeTokenA: (token: TokenModel) => void;
  changeTokenB: (token: TokenModel) => void;
  connected: boolean;
  changeTokenAAmount: (amount: string) => void;
  changeTokenBAmount: (amount: string) => void;
}

const LiquidityEnterAmounts: React.FC<LiquidityEnterAmountsProps> = ({
  tokenAInput,
  tokenBInput,
  changeTokenA,
  changeTokenB,
  connected,
  changeTokenAAmount,
  changeTokenBAmount,
}) => {
  return (
    <LiquidityEnterAmountsWrapper>
      <TokenAmountInput {...tokenAInput} connected={connected} changeToken={changeTokenA} changeAmount={changeTokenAAmount} />
      <TokenAmountInput {...tokenBInput} connected={connected} changeToken={changeTokenB} changeAmount={changeTokenBAmount} />
      <div className="arrow">
        <div className="shape">
          <IconAdd className="add-icon" />
        </div>
      </div>
    </LiquidityEnterAmountsWrapper>
  );
};

export default LiquidityEnterAmounts;
