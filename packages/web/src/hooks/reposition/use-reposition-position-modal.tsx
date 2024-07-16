import { WalletResponse } from "@common/clients/wallet-client/protocols";
import {
  RANGE_STATUS_OPTION,
  SwapFeeTierInfoMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import RepositionModalContainer from "@containers/reposition-modal-container/RepoitionModalContainer";
import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import { TokenModel } from "@models/token/token-model";
import {
  SwapRouteFailedResponse,
  SwapRouteSuccessResponse,
} from "@repositories/swap/response/swap-route-response";
import { CommonState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { IPriceRange } from "./use-reposition-handle";
import {
  RepositionLiquidityFailedResponse,
  RepositionLiquiditySuccessResponse,
} from "@repositories/position/response";

export interface Props {
  openModal: () => void;
}

export interface RepositionModalProps {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  tokenAAmountInput: TokenAmountInputModel;
  tokenBAmountInput: TokenAmountInputModel;
  swapFeeTier: SwapFeeTierType | null;
  minPriceStr: string;
  maxPriceStr: string;
  rangeStatus: RANGE_STATUS_OPTION;
  priceRangeSummary: IPriceRange;
  aprFee: number;
  currentAmounts: { amountA: number; amountB: number } | null;
  repositionAmounts: { amountA: number | null; amountB: number | null } | null;
  removePosition: () => Promise<WalletResponse | null>;
  swapRemainToken: () => Promise<WalletResponse<
    SwapRouteSuccessResponse | SwapRouteFailedResponse
  > | null>;
  reposition: (
    swapToken: TokenModel,
    swapAmount: string,
  ) => Promise<WalletResponse<
    RepositionLiquiditySuccessResponse | RepositionLiquidityFailedResponse
  > | null>;
}

export const useRepositionModalContainer = ({
  tokenA,
  tokenB,
  tokenAAmountInput,
  tokenBAmountInput,
  swapFeeTier,
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
}: RepositionModalProps): Props => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const amountInfo = useMemo(() => {
    if (!tokenA || !tokenB || !swapFeeTier) {
      return null;
    }
    return {
      tokenA: {
        info: tokenA,
        amount: tokenAAmountInput.amount,
        usdPrice: tokenAAmountInput.usdValue,
      },
      tokenB: {
        info: tokenB,
        amount: tokenBAmountInput.amount,
        usdPrice: tokenBAmountInput.usdValue,
      },
      feeRate: SwapFeeTierInfoMap[swapFeeTier].rateStr,
    };
  }, [swapFeeTier, tokenA, tokenAAmountInput, tokenBAmountInput, tokenB]);

  const openModal = useCallback(() => {
    if (!amountInfo) {
      return;
    }
    setOpenedModal(true);
    setModalContent(
      <RepositionModalContainer
        amountInfo={amountInfo}
        minPriceStr={minPriceStr}
        maxPriceStr={maxPriceStr}
        rangeStatus={rangeStatus}
        priceRangeSummary={priceRangeSummary}
        aprFee={aprFee}
        currentAmounts={currentAmounts}
        repositionAmounts={repositionAmounts}
        removePosition={removePosition}
        swapRemainToken={swapRemainToken}
        reposition={reposition}
      />,
    );
  }, [
    amountInfo,
    setOpenedModal,
    setModalContent,
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
  ]);

  return {
    openModal,
  };
};
