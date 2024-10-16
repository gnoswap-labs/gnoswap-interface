import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { WalletResponse } from "@common/clients/wallet-client/protocols";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";
import {
  RepositionLiquidityFailedResponse,
  RepositionLiquiditySuccessResponse,
} from "@repositories/position/response";
import {
  SwapRouteFailedResponse,
  SwapRouteSuccessResponse,
} from "@repositories/swap/response/swap-route-response";

import IncreaseMaxMin from "../../../common/components/increase-max-min/IncreaseMaxMin";
import { IPriceRange } from "../../hooks/use-reposition-handle";
import BalanceChange from "../balance-change/BalanceChange";
import RepositionBroadcastProgress from "../reposition-broadcast-progress/RepositionBroadcastProgress";
import RepositionInfo from "../reposition-info/RepositionInfo";

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
  currentAmounts: { amountA: string; amountB: string } | null;
  repositionAmounts: { amountA: string | null; amountB: string | null } | null;
  removePosition: () => Promise<WalletResponse | null>;
  swapRemainToken: () => Promise<WalletResponse<
    SwapRouteSuccessResponse | SwapRouteFailedResponse
  > | null>;
  reposition: (
    swapToken: TokenModel | null,
    swapAmount: string | null,
  ) => Promise<WalletResponse<
    RepositionLiquiditySuccessResponse | RepositionLiquidityFailedResponse
  > | null>;
  isSkipSwap: boolean;
  refetchPositions: () => Promise<void>;
}

const RepositionModal: React.FC<Props> = ({
  close,
  amountInfo,
  minPriceStr,
  maxPriceStr,
  rangeStatus,
  priceRangeSummary,
  aprFee,
  currentAmounts,
  repositionAmounts,
  removePosition,
  swapRemainToken,
  reposition,
  refetchPositions,
  isSkipSwap,
}) => {
  const { t } = useTranslation();
  const [confirm, setConfirm] = useState(false);

  const onClickConfirm = useCallback(() => {
    setConfirm(true);
  }, []);

  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  return (
    <RepositionModalWrapper>
      <div className="modal-body">
        <div className="header">
          <h6>{t("Reposition:confModal.title")}</h6>
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
            title={t("Reposition:confModal.section.posiDetail.label")}
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
            currentAmounts={currentAmounts}
            repositionAmounts={repositionAmounts}
            isLoadingPosition={false}
          />

          {confirm ? (
            <React.Fragment>
              <hr />
              <RepositionBroadcastProgress
                removePosition={removePosition}
                swapRemainToken={swapRemainToken}
                reposition={reposition}
                refetchPositions={refetchPositions}
                closeModal={close}
                tokenA={amountInfo.tokenA.info}
                tokenB={amountInfo.tokenB.info}
                swapAtoB={
                  Number(currentAmounts?.amountA) -
                    Number(repositionAmounts?.amountA) >
                  0
                }
                isSkipSwap={isSkipSwap}
              />
            </React.Fragment>
          ) : (
            <div className="confirm-area">
              <Button
                onClick={onClickConfirm}
                text={t("Reposition:confModal.title")}
                style={{
                  hierarchy: ButtonHierarchy.Primary,
                  fullWidth: true,
                }}
                className="button-confirm"
              />
            </div>
          )}
        </div>
      </div>
    </RepositionModalWrapper>
  );
};

export default RepositionModal;
