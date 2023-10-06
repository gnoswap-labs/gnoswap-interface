import React from "react";
import { EarnAddConfirmAmountInfoWrapper, EarnAddConfirmFeeInfoSection } from "./EarnAddConfirmAmountInfo.styles";
import TokenAmount from "@components/common/token-amount/TokenAmount";
import IconAdd from "@components/common/icons/IconAdd";
import { TokenModel } from "@models/token/token-model";

export interface EarnAddConfirmAmountInfoProps {
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

const EarnAddConfirmAmountInfo: React.FC<EarnAddConfirmAmountInfoProps> = ({
  tokenA,
  tokenAAmount,
  tokenAUSDPrice,
  tokenB,
  tokenBAmount,
  tokenBUSDPrice,
  feeRate,
}) => {
  return (
    <EarnAddConfirmAmountInfoWrapper>
      <div className="pair-amount">
        <TokenAmount
          token={tokenA}
          amount={tokenAAmount}
          usdPrice={tokenAUSDPrice}
        />
        <TokenAmount
          token={tokenB}
          amount={tokenBAmount}
          usdPrice={tokenBUSDPrice}
        />
        <div className="icon-wrapper">
          <IconAdd className="icon-add" />
        </div>
      </div>

      <EarnAddConfirmFeeInfoSection>
        <span className="key">Fee</span>
        <span className="value">{feeRate}</span>
      </EarnAddConfirmFeeInfoSection>
    </EarnAddConfirmAmountInfoWrapper>
  );
};

export default EarnAddConfirmAmountInfo;