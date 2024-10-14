import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import { TokenModel } from "@models/token/token-model";

import PoolAddConfirmAmountInfo from "../pool-add-confirm-amount-info/PoolAddConfirmAmountInfo";
import PoolAddConfirmFeeInfo from "../pool-add-confirm-fee-info/PoolAddConfirmFeeInfo";
import PoolAddConfirmPriceRangeInfo from "../pool-add-confirm-price-range-info/PoolAddConfirmPriceRangeInfo";

import { OneClickStakingModalWrapper } from "./OneClickStakingModal.styles";

interface Props {
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

const OneClickStakingModal: React.FC<Props> = ({
  isPoolCreation,
  amountInfo,
  priceRangeInfo,
  feeInfo,
  confirm,
  close,
}) => {
  const { t } = useTranslation();

  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  const onClickConfirm = useCallback(() => {
    if (!feeInfo.errorMsg) {
      confirm();
    }
  }, [confirm, feeInfo.errorMsg]);

  return (
    <OneClickStakingModalWrapper>
      <div className="modal-body">
        <div className="header">
          <h6>
            {t("AddPosition:confirmAddModal.title_oneClick", {
              context: "oneClick",
            })}
          </h6>
          <div className="close-wrap" onClick={onClickClose}>
            <IconClose className="close-icon" />
          </div>
        </div>
        <div className="content">
          <div>
            <PoolAddConfirmAmountInfo {...amountInfo} />
          </div>
          <PoolAddConfirmPriceRangeInfo
            {...priceRangeInfo}
            isShowStaking
            {...amountInfo}
          />

          {isPoolCreation && <PoolAddConfirmFeeInfo {...feeInfo} />}

          <div>
            <Button
              text={t("AddPosition:confirmAddModal.title_oneClick", {
                context: "oneClick",
              })}
              disabled={!!feeInfo.errorMsg}
              style={{
                hierarchy: ButtonHierarchy.Primary,
                fullWidth: true,
              }}
              className="button-confirm"
              onClick={onClickConfirm}
            />
          </div>
        </div>
      </div>
    </OneClickStakingModalWrapper>
  );
};

export default OneClickStakingModal;
