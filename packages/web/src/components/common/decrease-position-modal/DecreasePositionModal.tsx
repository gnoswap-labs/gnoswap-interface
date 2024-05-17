import DecreaseMaxMin from "@components/decrease/decrease-max-min/DecreaseMaxMin";
import DecreasePoolInfo from "@components/decrease/decrease-pool-info/DecreasePoolInfo";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";
import React, { useCallback } from "react";
import Button, { ButtonHierarchy } from "../button/Button";
import IconClose from "../icons/IconCancel";
import { DecreasePositionModalWrapper } from "./DecreasePositionModal.styles";
import BalanceChange from "@components/decrease/balance-change/BalanceChange";

interface Props {
  confirm: () => void;
  close: () => void;
  amountInfo: {
    tokenA: TokenModel;
    tokenB: TokenModel;
    feeRate: string;
  };
  minPriceStr: string;
  maxPriceStr: string;
  rangeStatus: RANGE_STATUS_OPTION;
  percent: number;
  pooledTokenInfos: any;
}

const DecreasePositionModal: React.FC<Props> = ({
  confirm,
  close,
  amountInfo,
  minPriceStr,
  maxPriceStr,
  rangeStatus,
  pooledTokenInfos,
}) => {
  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  return (
    <DecreasePositionModalWrapper>
      <div className="modal-body">
        <div className="header">
          <h6>Confirm Decrease Liquidity</h6>
          <div className="close-wrap" onClick={onClickClose}>
            <IconClose className="close-icon" />
          </div>
        </div>
        <div className="content">
          <DecreaseMaxMin
            minPriceStr={minPriceStr}
            maxPriceStr={maxPriceStr}
            {...amountInfo}
            rangeStatus={rangeStatus}
          />
          <div>
            <p className="label">Decreasing Amount</p>
            <DecreasePoolInfo
              {...amountInfo}
              isShowProtocolFee
              pooledTokenInfos={pooledTokenInfos}
            />
          </div>

          <BalanceChange {...amountInfo} title="Balance Changes" />
          <div>
            <Button
              onClick={confirm}
              text="Confirm Decrease Liquidity"
              style={{
                hierarchy: ButtonHierarchy.Primary,
                fullWidth: true,
              }}
              className="button-confirm"
            />
          </div>
        </div>
      </div>
    </DecreasePositionModalWrapper>
  );
};

export default DecreasePositionModal;
