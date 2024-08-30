import React from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@models/token/token-info";
import Tooltip from "@components/common/tooltip/Tooltip";
import IconInfo from "@components/common/icons/IconInfo";

import {
  CreationFeeErrorMsgWrapper,
  PoolAddConfirmFeeInfoWrapper,
  PoolAddConfirmFeeInfoSection,
  ToolTipContentWrapper,
} from "./PoolAddConfirmFeeInfo.styles";

export interface EarnAddConfirmFeeInfoProps {
  token?: TokenInfo;
  fee: string;
  errorMsg?: string;
}

const PoolAddConfirmFeeInfo: React.FC<EarnAddConfirmFeeInfoProps> = ({
  token,
  fee,
  errorMsg,
}) => {
  const { t } = useTranslation();

  return (
    <PoolAddConfirmFeeInfoWrapper>
      <div className="title-wrapper">
        <p>{t("AddPosition:confirmAddModal.info.label.creationFee.title")}</p>
        <Tooltip
          placement="top"
          FloatingContent={
            <ToolTipContentWrapper>
              {t("AddPosition:confirmAddModal.info.label.creationFee.tooltip")}
            </ToolTipContentWrapper>
          }
        >
          <IconInfo />
        </Tooltip>
      </div>
      <PoolAddConfirmFeeInfoSection $hasError={!!errorMsg}>
        <div className="token-info">
          <img src={token?.logoURI} alt="token logo" />
          <div>{token?.symbol}</div>
        </div>
        <div className="fee-info">
          <span>{fee}</span>
        </div>
      </PoolAddConfirmFeeInfoSection>
      {errorMsg && (
        <CreationFeeErrorMsgWrapper>{errorMsg}</CreationFeeErrorMsgWrapper>
      )}
    </PoolAddConfirmFeeInfoWrapper>
  );
};

export default PoolAddConfirmFeeInfo;
