import React from "react";
import { useTranslation } from "react-i18next";

import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import IconAdd from "@components/common/icons/IconAdd";
import TokenAmount from "@components/common/token-amount/TokenAmount";
import { TokenModel } from "@models/token/token-model";

import {
  PoolAddConfirmAmountInfoWrapper,
  PoolAddConfirmFeeInfoSection,
} from "./PoolAddConfirmAmountInfo.styles";

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

const PoolAddConfirmAmountInfo: React.FC<EarnAddConfirmAmountInfoProps> = ({
  tokenA,
  tokenB,
  feeRate,
}) => {
  const { t } = useTranslation();

  return (
    <PoolAddConfirmAmountInfoWrapper>
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

      <PoolAddConfirmFeeInfoSection>
        <span className="key">
          {t("AddPosition:confirmAddModal.info.label.feeTier")}
        </span>
        <Badge
          text={feeRate}
          type={BADGE_TYPE.DARK_DEFAULT}
          className="value"
        />
      </PoolAddConfirmFeeInfoSection>
    </PoolAddConfirmAmountInfoWrapper>
  );
};

export default PoolAddConfirmAmountInfo;
