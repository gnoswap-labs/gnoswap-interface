import React from "react";
import { EarnAddConfirmWrapper } from "./EarnAddConfirm.styles";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import { TokenDefaultModel } from "@models/token/token-default-model";
import EarnAddConfirmAmountInfo from "../earn-add-confirm-amount-info/EarnAddConfirmAmountInfo";
import EarnAddConfirmPriceRangeInfo from "../earn-add-confirm-price-range-info/EarnAddConfirmPriceRangeInfo";
import EarnAddConfirmFeeInfo from "../earn-add-confirm-fee-info/EarnAddConfirmFeeInfo";

export interface EarnAddConfirmProps {
  amountInfo: {
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
  };
  priceRangeInfo: {
    currentPrice: string;
    minPrice: string;
    minPriceLable: string;
    maxPrice: string;
    maxPriceLable: string;
    feeBoost: string;
    estimatedAPR: string;
  };
  feeInfo: {
    token: TokenDefaultModel;
    fee: string;
  };
  confirm: () => void;
  close: () => void;
}

const EarnAddConfirm: React.FC<EarnAddConfirmProps> = ({
  amountInfo,
  priceRangeInfo,
  feeInfo,
  confirm,
  close,
}) => {
  return (
    <EarnAddConfirmWrapper>
      <div className="confirm-header">
        <h6 className="title">Confirm Liquidity Addition</h6>
        <button className="close-button" onClick={close}>
          <IconClose />
        </button>
      </div>

      <EarnAddConfirmAmountInfo {...amountInfo} />

      <EarnAddConfirmPriceRangeInfo {...priceRangeInfo} />

      <EarnAddConfirmFeeInfo {...feeInfo} />

      <Button
        text="Confirm Liquidity Addition"
        onClick={confirm}
        style={{
          hierarchy: ButtonHierarchy.Primary,
          fullWidth: true,
          height: 57,
          fontType: "body7",
        }}
      />
    </EarnAddConfirmWrapper>
  );
};

export default EarnAddConfirm;