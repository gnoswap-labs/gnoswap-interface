import React from "react";
import { TokenAmountWrapper } from "./TokenAmount.styles";
import SelectPairButton from "../select-pair-button/SelectPairButton";
import { TokenModel } from "@models/token/token-model";

export interface TokenAmountProps {
  token: TokenModel;
  usdPrice: string;
  amount: string;
}

const TokenAmount: React.FC<TokenAmountProps> = ({
  token,
  usdPrice,
  amount,
}) => {
  return (
    <TokenAmountWrapper>
      <div className="amount">
        <span className="amount-text">{amount}</span>
        <div className="token">
          <SelectPairButton token={token} disabled={true} isHiddenArrow />
        </div>
      </div>
      <div className="info">
        <span className="price-text">{usdPrice}</span>
      </div>
    </TokenAmountWrapper>
  );
};

export default TokenAmount;
