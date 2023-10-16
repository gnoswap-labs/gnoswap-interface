import React from "react";
import { EarnAddConfirmFeeInfoSection, EarnAddConfirmFeeInfoWrapper } from "./EarnAddConfirmFeeInfo.styles";
import { TokenInfo } from "@models/token/token-info";

export interface EarnAddConfirmFeeInfoProps {
  token: TokenInfo;
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
          <img src={token.logoURI} alt="token logo" />
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