import { WalletResponse } from "@common/clients/wallet-client/protocols";
import RepositionModal from "@components/common/reposition-modal/RepositionModal";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { IPriceRange } from "@hooks/reposition/use-reposition-handle";
import { TokenModel } from "@models/token/token-model";
import { RepositionLiquidityResponse } from "@repositories/position/response";
import { SwapRouteResponse } from "@repositories/swap/response/swap-route-response";
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
  currentAmounts: { amountA: number; amountB: number } | null;
  repositionAmounts: { amountA: number | null; amountB: number | null } | null;
  removePosition: () => Promise<WalletResponse | null>;
  swapRemainToken: () => Promise<WalletResponse<SwapRouteResponse> | null>;
  reposition: (
    swapToken: TokenModel,
    swapAmount: string,
  ) => Promise<WalletResponse<RepositionLiquidityResponse | null> | null>;
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
    />
  );
};

export default RepositionModalContainer;
