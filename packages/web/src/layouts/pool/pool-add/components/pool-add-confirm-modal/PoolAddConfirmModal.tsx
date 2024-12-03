import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import { TokenModel } from "@models/token/token-model";

import PoolAddConfirmAmountInfo from "../pool-add-confirm-amount-info/PoolAddConfirmAmountInfo";
import PoolAddConfirmFeeInfo from "../pool-add-confirm-fee-info/PoolAddConfirmFeeInfo";
import PoolAddConfirmPriceRangeInfo from "../pool-add-confirm-price-range-info/PoolAddConfirmPriceRangeInfo";

import { EarnAddConfirmWrapper } from "./PoolAddConfirmModal.styles";

export interface PoolAddConfirmModalProps {
  isPoolCreation?: boolean;
  amountInfo: {
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
  };
  priceRangeInfo: {
    currentPrice: string;
    inRange: boolean;
    minPrice: string;
    maxPrice: string;
    priceLabelMin: string;
    priceLabelMax: string;
    feeBoost: string;
    estimatedAPR: string;
  };
  feeInfo: {
    token?: TokenModel;
    fee: string;
    errorMsg?: string;
  };
  confirm: () => void;
  close: () => void;
}

const PoolAddConfirmModal: React.FC<PoolAddConfirmModalProps> = ({
  isPoolCreation,
  amountInfo,
  priceRangeInfo,
  feeInfo,
  confirm,
  close,
}) => {
  const { t } = useTranslation();

  const onClickConfirm = useCallback(() => {
    if (isPoolCreation && feeInfo.errorMsg) {
      return;
    }

    confirm();
  }, [confirm, feeInfo.errorMsg, isPoolCreation]);

  return (
    <EarnAddConfirmWrapper>
      <div className="confirm-header">
        <h6 className="title">{t("AddPosition:confirmAddModal.title")}</h6>
        <button className="close-button" onClick={close}>
          <IconClose />
        </button>
      </div>

      <PoolAddConfirmAmountInfo {...amountInfo} />

      <PoolAddConfirmPriceRangeInfo {...priceRangeInfo} {...amountInfo} />

      {isPoolCreation && <PoolAddConfirmFeeInfo {...feeInfo} />}

      <Button
        text={t("AddPosition:confirmAddModal.title")}
        onClick={onClickConfirm}
        disabled={isPoolCreation && !!feeInfo.errorMsg}
        style={{
          hierarchy: ButtonHierarchy.Primary,
          fullWidth: true,
        }}
        className="button-confirm"
      />
    </EarnAddConfirmWrapper>
  );
};

export default PoolAddConfirmModal;
