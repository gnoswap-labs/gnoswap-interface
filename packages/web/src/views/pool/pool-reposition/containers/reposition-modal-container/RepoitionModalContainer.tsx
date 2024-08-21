import React, { useCallback } from "react";

import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { TokenModel } from "@models/token/token-model";
import {
  RepositionLiquidityFailedResponse,
  RepositionLiquiditySuccessResponse,
} from "@repositories/position/response";
import {
  SwapRouteFailedResponse,
  SwapRouteSuccessResponse,
} from "@repositories/swap/response/swap-route-response";

import RepositionModal from "../../components/reposition-modal/RepositionModal";
import { IPriceRange } from "../../hooks/use-reposition-handle";


interface Props {
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
  aprFee: number;
  priceRangeSummary: IPriceRange;
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
}

const RepositionModalContainer: React.FC<Props> = ({
  amountInfo,
  maxPriceStr,
  minPriceStr,
  rangeStatus,
  aprFee,
  priceRangeSummary,
  currentAmounts,
  repositionAmounts,
  removePosition,
  swapRemainToken,
  reposition,
  isSkipSwap,
}) => {
  const clearModal = useClearModal();

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  return (
    <RepositionModal
      close={close}
      amountInfo={amountInfo}
      maxPriceStr={maxPriceStr}
      minPriceStr={minPriceStr}
      rangeStatus={rangeStatus}
      priceRangeSummary={priceRangeSummary}
      aprFee={aprFee}
      currentAmounts={currentAmounts}
      repositionAmounts={repositionAmounts}
      removePosition={removePosition}
      swapRemainToken={swapRemainToken}
      reposition={reposition}
      isSkipSwap={isSkipSwap}
    />
  );
};

export default RepositionModalContainer;
