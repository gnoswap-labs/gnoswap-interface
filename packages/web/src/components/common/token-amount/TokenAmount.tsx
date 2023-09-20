import React from "react";
import { TokenAmountWrapper } from "./TokenAmount.styles";
import SelectPairButton from "../select-pair-button/SelectPairButton";
import { TokenDefaultModel } from "@models/token/token-default-model";

export interface TokenAmountProps {
  token: TokenDefaultModel;
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
          <SelectPairButton
            token={token}
            disabled={true}
          />
        </div>
      </div>
      <div className="info">
        <span className="price-text">{usdPrice}</span>
      </div>
    </TokenAmountWrapper>
  );
};

export default TokenAmount;