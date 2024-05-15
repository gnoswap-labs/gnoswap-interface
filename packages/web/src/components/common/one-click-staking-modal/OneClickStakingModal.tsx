import { OneClickStakingModalWrapper } from "./OneClickStakingModal.styles";
import React, { useCallback } from "react";
import IconClose from "../icons/IconCancel";
import Button, { ButtonHierarchy } from "../button/Button";
import EarnAddConfirmPriceRangeInfo from "@components/earn-add/earn-add-confirm-price-range-info/EarnAddConfirmPriceRangeInfo";
import { TokenModel } from "@models/token/token-model";
import EarnAddConfirmAmountInfo from "@components/earn-add/earn-add-confirm-amount-info/EarnAddConfirmAmountInfo";
import EarnAddConfirmFeeInfo from "@components/earn-add/earn-add-confirm-fee-info/EarnAddConfirmFeeInfo";

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
    token: TokenModel;
    fee: string;
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
  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  return (
    <OneClickStakingModalWrapper>
      <div className="modal-body">
        <div className="header">
          <h6>Confirm One-Click Staking</h6>
          <div className="close-wrap" onClick={onClickClose}>
            <IconClose className="close-icon" />
          </div>
        </div>
        <div className="content">
          <div>
            <EarnAddConfirmAmountInfo {...amountInfo} />
          </div>
          <EarnAddConfirmPriceRangeInfo
            {...priceRangeInfo}
            isShowStaking
            {...amountInfo}
          />

          {isPoolCreation && <EarnAddConfirmFeeInfo {...feeInfo} />}

          <div>
            <Button
              text="Confirm One-Click Staking"
              style={{
                hierarchy: ButtonHierarchy.Primary,
                fullWidth: true,
              }}
              className="button-confirm"
              onClick={confirm}
            />
          </div>
        </div>
      </div>
    </OneClickStakingModalWrapper>
  );
};

export default OneClickStakingModal;
