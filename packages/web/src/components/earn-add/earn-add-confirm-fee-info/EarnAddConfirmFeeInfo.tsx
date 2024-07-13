import React from "react";
import {
  CreationFeeErrorMsgWrapper,
  EarnAddConfirmFeeInfoSection,
  EarnAddConfirmFeeInfoWrapper,
} from "./EarnAddConfirmFeeInfo.styles";
import { TokenInfo } from "@models/token/token-info";

export interface EarnAddConfirmFeeInfoProps {
  token?: TokenInfo;
  fee: string;
  errorMsg?: string;
}

const EarnAddConfirmFeeInfo: React.FC<EarnAddConfirmFeeInfoProps> = ({
  token,
  fee,
  errorMsg,
}) => {
  return (
    <EarnAddConfirmFeeInfoWrapper>
      <p>Pool Creation Fee</p>
      <EarnAddConfirmFeeInfoSection $hasError={!!errorMsg}>
        <div className="token-info">
          <img src={token?.logoURI} alt="token logo" />
          <div>{token?.symbol}</div>
        </div>
        <div className="fee-info">
          <span>{fee}</span>
        </div>
      </EarnAddConfirmFeeInfoSection>
      {errorMsg && (
        <CreationFeeErrorMsgWrapper>{errorMsg}</CreationFeeErrorMsgWrapper>
      )}
    </EarnAddConfirmFeeInfoWrapper>
  );
};

export default EarnAddConfirmFeeInfo;
