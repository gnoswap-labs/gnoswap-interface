import { WalletResponse } from "@common/clients/wallet-client/protocols";
import RepositionModal from "@components/common/reposition-modal/RepositionModal";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { IPriceRange } from "@hooks/reposition/use-reposition-handle";
import { TokenModel } from "@models/token/token-model";
import {
  AddLiquidityFailedResponse,
  AddLiquiditySuccessResponse,
} from "@repositories/pool/response/add-liquidity-response";
import {
  SwapRouteFailedResponse,
  SwapRouteSuccessResponse,
} from "@repositories/swap/response/swap-route-response";
import React, { useCallback } from "react";

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
  addPosition: (
    swapToken: TokenModel,
    swapAmount: string,
  ) => Promise<WalletResponse<
    AddLiquiditySuccessResponse | AddLiquidityFailedResponse
  > | null>;
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
  addPosition,
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
      addPosition={addPosition}
    />
  );
};

export default RepositionModalContainer;
