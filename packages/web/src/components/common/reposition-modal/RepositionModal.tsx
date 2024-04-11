import IncreaseMaxMin from "@components/increase/increase-max-min/IncreaseMaxMin";
import BalanceChange from "@components/reposition/balance-change/BalanceChange";
import RepositionInfo from "@components/reposition/reposition-info/RepositionInfo";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { IPriceRange } from "@hooks/increase/use-increase-handle";
import { TokenModel } from "@models/token/token-model";
import React, { useCallback } from "react";
import Button, { ButtonHierarchy } from "../button/Button";
import IconClose from "../icons/IconCancel";
import { RepositionModalWrapper } from "./RepositionModal.styles";

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
  priceRangeSummary: IPriceRange;
  aprFee: number;
}

const RepositionModal: React.FC<Props> = ({
  close,
  amountInfo,
  minPriceStr,
  maxPriceStr,
  rangeStatus,
  priceRangeSummary,
  aprFee,
}) => {
  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  return (
    <RepositionModalWrapper>
      <div className="modal-body">
        <div className="header">
          <h6>Confirm Reposition</h6>
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
          <RepositionInfo
            tokenA={amountInfo?.tokenA?.info}
            tokenB={amountInfo?.tokenB?.info}
            aprFee={aprFee}
            priceRangeSummary={priceRangeSummary}
          />
          <BalanceChange
            tokenA={amountInfo?.tokenA?.info}
            tokenB={amountInfo?.tokenB?.info}
          />
          <div>
            <Button
              onClick={close}
              text="Confirm Reposition"
              style={{
                hierarchy: ButtonHierarchy.Primary,
                fullWidth: true,
              }}
              className="button-confirm"
            />
          </div>
        </div>
      </div>
    </RepositionModalWrapper>
  );
};

export default RepositionModal;
