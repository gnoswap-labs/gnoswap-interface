import React, { useCallback } from "react";
import IconClose from "../icons/IconCancel";
import Button, { ButtonHierarchy } from "../button/Button";
import { TokenModel } from "@models/token/token-model";
import { IncreasePositionModalWrapper } from "./IncreasePositionModal.styles";
import IncreaseAmountInfo from "@components/increase/increase-amount-info/IncreaseAmountInfo";
import IncreaseMaxMin from "@components/increase/increase-max-min/IncreaseMaxMin";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";

interface Props {
  close: () => void;
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
  minPriceStr: string;
  maxPriceStr: string;
  rangeStatus: RANGE_STATUS_OPTION;
}

const IncreasePositionModal: React.FC<Props> = ({
  close,
  amountInfo,
  minPriceStr,
  maxPriceStr,
  rangeStatus,
}) => {
  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  return (
    <IncreasePositionModalWrapper>
      <div className="modal-body">
        <div className="header">
          <h6>Confirm Increase Liquidity</h6>
          <div className="close-wrap" onClick={onClickClose}>
            <IconClose className="close-icon" />
          </div>
        </div>
        <div className="content">
          <IncreaseMaxMin
            minPriceStr={minPriceStr}
            maxPriceStr={maxPriceStr}
            {...amountInfo}
            rangeStatus={rangeStatus}
          />
          <div>
            <p className="label-increase">Increasing Amount</p>
            <IncreaseAmountInfo {...amountInfo} />
          </div>
          <div>
            <Button
              onClick={close}
              text="Confirm Increase Liquidity"
              style={{
                hierarchy: ButtonHierarchy.Primary,
                fullWidth: true,
              }}
              className="button-confirm"
            />
          </div>
        </div>
      </div>
    </IncreasePositionModalWrapper>
  );
};

export default IncreasePositionModal;
