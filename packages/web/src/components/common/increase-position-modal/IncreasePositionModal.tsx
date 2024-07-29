import React, { useCallback } from "react";
import IconClose from "../icons/IconCancel";
import Button, { ButtonHierarchy } from "../button/Button";
import { TokenModel } from "@models/token/token-model";
import { IncreasePositionModalWrapper } from "./IncreasePositionModal.styles";
import IncreaseAmountInfo from "@components/increase/increase-amount-info/IncreaseAmountInfo";
import IncreaseMaxMin from "@components/increase/increase-max-min/IncreaseMaxMin";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { useTranslation } from "react-i18next";

interface Props {
  confirm: () => void;
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
  isDepositTokenA: boolean;
  isDepositTokenB: boolean;
}

const IncreasePositionModal: React.FC<Props> = ({
  confirm,
  close,
  amountInfo,
  minPriceStr,
  maxPriceStr,
  rangeStatus,
  isDepositTokenA,
  isDepositTokenB,
}) => {
  const { t } = useTranslation();

  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  return (
    <IncreasePositionModalWrapper>
      <div className="modal-body">
        <div className="header">
          <h6>{t("IncreaseLiquidity:confirmIncreaseModal.title")}</h6>
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
            title={t(
              "IncreaseLiquidity:confirmIncreaseModal.section.posiDetail.label",
            )}
          />
          <div>
            <p className="label-increase">
              {t("IncreaseLiquidity:confirmIncreaseModal.increaseAmt")}
            </p>
            <IncreaseAmountInfo
              {...amountInfo}
              isDepositTokenA={isDepositTokenA}
              isDepositTokenB={isDepositTokenB}
            />
          </div>
          <div>
            <Button
              onClick={confirm}
              text={t("IncreaseLiquidity:confirmIncreaseModal.btn")}
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
