import React from "react";
import { EarnAddConfirmAmountInfoWrapper, EarnAddConfirmFeeInfoSection } from "./EarnAddConfirmAmountInfo.styles";
import { TokenInfo } from "@models/token/token-info";
import TokenAmount from "@components/common/token-amount/TokenAmount";
import IconAdd from "@components/common/icons/IconAdd";

export interface EarnAddConfirmAmountInfoProps {
  tokenA: {
    info: TokenInfo;
    amount: string;
    usdPrice: string;
  };
  tokenB: {
    info: TokenInfo;
    amount: string;
    usdPrice: string;
  };
  feeRate: string;
}

const EarnAddConfirmAmountInfo: React.FC<EarnAddConfirmAmountInfoProps> = ({
  tokenA,
  tokenB,
  feeRate,
}) => {
  return (
    <EarnAddConfirmAmountInfoWrapper>
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

      <EarnAddConfirmFeeInfoSection>
        <span className="key">Fee</span>
        <span className="value">{feeRate}</span>
      </EarnAddConfirmFeeInfoSection>
    </EarnAddConfirmAmountInfoWrapper>
  );
};

export default EarnAddConfirmAmountInfo;