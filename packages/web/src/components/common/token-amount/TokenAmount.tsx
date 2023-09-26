import React from "react";
import { TokenAmountWrapper } from "./TokenAmount.styles";
import SelectPairButton from "../select-pair-button/SelectPairButton";
import { TokenInfo } from "@models/token/token-info";

export interface TokenAmountProps {
  token: TokenInfo;
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