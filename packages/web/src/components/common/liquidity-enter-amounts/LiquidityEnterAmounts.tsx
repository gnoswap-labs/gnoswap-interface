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
}

const LiquidityEnterAmounts: React.FC<LiquidityEnterAmountsProps> = ({
  tokenAInput,
  tokenBInput,
  changeTokenA,
  changeTokenB,
  connected,
}) => {

  return (
    <LiquidityEnterAmountsWrapper>
      <TokenAmountInput changeToken={changeTokenA} {...tokenAInput} connected={connected} />
      <TokenAmountInput changeToken={changeTokenB} {...tokenBInput} connected={connected} />
      <div className="arrow">
        <div className="shape">
          <IconAdd className="add-icon" />
        </div>
      </div>
    </LiquidityEnterAmountsWrapper>
  );
};

export default LiquidityEnterAmounts;
