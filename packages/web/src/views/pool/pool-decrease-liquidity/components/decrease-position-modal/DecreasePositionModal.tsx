import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";

import DecreasePoolInfo from "../decrease-pool-info/DecreasePoolInfo";
import { IPooledTokenInfo } from "../../hooks/use-decrease-handle";
import BalanceChange from "./balance-change/BalanceChange";
import DecreaseMaxMin from "./decrease-max-min/DecreaseMaxMin";

import { DecreasePositionModalWrapper } from "./DecreasePositionModal.styles";

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
  pooledTokenInfos: IPooledTokenInfo | null;
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
  const { t } = useTranslation();

  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  return (
    <DecreasePositionModalWrapper>
      <div className="modal-body">
        <div className="header">
          <h6>{t("DecreaseLiquidity:confModal.title")}</h6>
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
            <p className="label">
              {t("DecreaseLiquidity:confModal.decreasingAmount")}
            </p>
            <DecreasePoolInfo
              {...amountInfo}
              isShowProtocolFee
              pooledTokenInfos={pooledTokenInfos}
            />
          </div>

          <BalanceChange
            {...amountInfo}
            pooledTokenInfos={pooledTokenInfos}
            title={t("DecreaseLiquidity:confModal.balanceChanges")}
          />
          <div>
            <Button
              onClick={confirm}
              text={t("DecreaseLiquidity:confModal.btn")}
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
