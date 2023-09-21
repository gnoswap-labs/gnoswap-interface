import React from "react";
import { EarnAddConfirmAmountInfoWrapper, EarnAddConfirmFeeInfoSection } from "./EarnAddConfirmAmountInfo.styles";
import { TokenDefaultModel } from "@models/token/token-default-model";
import TokenAmount from "@components/common/token-amount/TokenAmount";
import IconAdd from "@components/common/icons/IconAdd";

export interface EarnAddConfirmAmountInfoProps {
  token0: {
    info: TokenDefaultModel;
    amount: string;
    usdPrice: string;
  };
  token1: {
    info: TokenDefaultModel;
    amount: string;
    usdPrice: string;
  };
  feeRate: string;
}

const EarnAddConfirmAmountInfo: React.FC<EarnAddConfirmAmountInfoProps> = ({
  token0,
  token1,
  feeRate,
}) => {
  return (
    <EarnAddConfirmAmountInfoWrapper>
      <div className="pair-amount">
        <TokenAmount
          token={token0.info}
          amount={token0.amount}
          usdPrice={token0.usdPrice}
        />
        <TokenAmount
          token={token1.info}
          amount={token1.amount}
          usdPrice={token1.usdPrice}
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