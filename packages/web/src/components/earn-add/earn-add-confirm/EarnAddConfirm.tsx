import React from "react";
import { EarnAddConfirmWrapper } from "./EarnAddConfirm.styles";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import EarnAddConfirmAmountInfo from "../earn-add-confirm-amount-info/EarnAddConfirmAmountInfo";
import EarnAddConfirmPriceRangeInfo from "../earn-add-confirm-price-range-info/EarnAddConfirmPriceRangeInfo";
import EarnAddConfirmFeeInfo from "../earn-add-confirm-fee-info/EarnAddConfirmFeeInfo";
import { TokenModel } from "@models/token/token-model";

export interface EarnAddConfirmProps {
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
    priceLabel: string;
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

const EarnAddConfirm: React.FC<EarnAddConfirmProps> = ({
  isPoolCreation,
  amountInfo,
  priceRangeInfo,
  feeInfo,
  confirm,
  close,
}) => {
  return (
    <EarnAddConfirmWrapper>
      <div className="confirm-header">
        <h6 className="title">Confirm Add Position</h6>
        <button className="close-button" onClick={close}>
          <IconClose />
        </button>
      </div>

      <EarnAddConfirmAmountInfo {...amountInfo} />

      <EarnAddConfirmPriceRangeInfo {...priceRangeInfo} {...amountInfo}/>

      {isPoolCreation && (
        <EarnAddConfirmFeeInfo {...feeInfo} />
      )}

      <Button
        text="Confirm Add Position"
        onClick={confirm}
        style={{
          hierarchy: ButtonHierarchy.Primary,
          fullWidth: true,
        }}
        className="button-confirm"
      />
    </EarnAddConfirmWrapper>
  );
};

export default EarnAddConfirm;