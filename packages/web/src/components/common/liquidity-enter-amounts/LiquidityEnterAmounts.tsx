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
}

const LiquidityEnterAmounts: React.FC<LiquidityEnterAmountsProps> = ({
  tokenAInput,
  tokenBInput,
  changeTokenA,
  changeTokenB,
}) => {

  return (
    <LiquidityEnterAmountsWrapper>
      <TokenAmountInput changeToken={changeTokenA} {...tokenAInput} />
      <TokenAmountInput changeToken={changeTokenB} {...tokenBInput} />
      <div className="arrow">
        <div className="shape">
          <IconAdd className="add-icon" />
        </div>
      </div>
    </LiquidityEnterAmountsWrapper>
  );
};

export default LiquidityEnterAmounts;
