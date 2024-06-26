import IconAdd from "@components/common/icons/IconAdd";
import TokenAmount from "@components/common/token-amount/TokenAmount";
import { TokenModel } from "@models/token/token-model";
import React from "react";
import { IncreaseAmountInfoWrapper } from "./DecreaseAmountInfo.styles";

export interface IncreaseAmountInfoProps {
  tokenA: {
    info: TokenModel;
    amount: string;
    usdPrice: string;
  };
  tokenB: {
    info: TokenModel;
    amount: string;
    usdPrice: string;
  };
  feeRate: string;
}

const IncreaseAmountInfo: React.FC<IncreaseAmountInfoProps> = ({
  tokenA,
  tokenB,
}) => {
  return (
    <IncreaseAmountInfoWrapper>
      <div className="pair-amount">
        <TokenAmount
          token={tokenA.info}
          amount={tokenA.amount}
          usdPrice={tokenA.usdPrice}
        />
        <TokenAmount
          token={tokenB.info}
          amount={tokenB.amount}
          usdPrice={tokenB.usdPrice}
        />
        <div className="icon-wrapper">
          <IconAdd className="icon-add" />
        </div>
      </div>
    </IncreaseAmountInfoWrapper>
  );
};

export default IncreaseAmountInfo;
