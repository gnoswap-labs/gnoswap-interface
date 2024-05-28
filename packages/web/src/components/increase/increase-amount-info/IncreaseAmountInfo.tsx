import IconAdd from "@components/common/icons/IconAdd";
import TokenAmount from "@components/common/token-amount/TokenAmount";
import { TokenModel } from "@models/token/token-model";
import React from "react";
import { IncreaseAmountInfoWrapper } from "./IncreaseAmountInfo.styles";

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
  isDepositTokenA: boolean;
  isDepositTokenB: boolean;
}

const IncreaseAmountInfo: React.FC<IncreaseAmountInfoProps> = ({
  tokenA,
  tokenB,
  isDepositTokenA,
  isDepositTokenB,
}) => {
  return (
    <IncreaseAmountInfoWrapper>
      <div className="pair-amount">
        {isDepositTokenA && (
          <TokenAmount
            token={tokenA.info}
            amount={tokenA.amount}
            usdPrice={tokenA.usdPrice}
          />
        )}
        {isDepositTokenB && (
          <TokenAmount
            token={tokenB.info}
            amount={tokenB.amount}
            usdPrice={tokenB.usdPrice}
          />
        )}
        {(!isDepositTokenA || !isDepositTokenB) && <div className="icon-wrapper">
          <IconAdd className="icon-add" />
        </div>}
      </div>
    </IncreaseAmountInfoWrapper>
  );
};

export default IncreaseAmountInfo;
