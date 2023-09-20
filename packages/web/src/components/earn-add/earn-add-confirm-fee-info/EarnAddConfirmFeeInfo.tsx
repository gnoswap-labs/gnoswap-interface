import React from "react";
import { EarnAddConfirmFeeInfoSection, EarnAddConfirmFeeInfoWrapper } from "./EarnAddConfirmFeeInfo.styles";
import { TokenDefaultModel } from "@models/token/token-default-model";

export interface EarnAddConfirmFeeInfoProps {
  token: TokenDefaultModel;
  fee: string;
}

const EarnAddConfirmFeeInfo: React.FC<EarnAddConfirmFeeInfoProps> = ({
  token,
  fee,
}) => {
  return (
    <EarnAddConfirmFeeInfoWrapper>
      <p>Pool Creation Fee</p>

      <EarnAddConfirmFeeInfoSection>
        <div className="token-info">
          <img src={token.tokenLogo} alt="token logo" />
          <span>{token.symbol}</span>
        </div>
        <div className="fee-info">
          <span>{fee}</span>
        </div>
      </EarnAddConfirmFeeInfoSection>
    </EarnAddConfirmFeeInfoWrapper>
  );
};

export default EarnAddConfirmFeeInfo;