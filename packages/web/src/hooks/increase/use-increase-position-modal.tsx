import { ERROR_VALUE } from "@common/errors/adena";
import {
  RANGE_STATUS_OPTION,
  SwapFeeTierInfoMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import IncreasePositionModalContainer from "@containers/increase-position-modal-container/IncreasePositionModalContainer";
import { useAddress } from "@hooks/address/use-address";
import {
  makeBroadcastAddLiquidityMessage,
  useBroadcastHandler,
} from "@hooks/common/use-broadcast-handler";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenModel } from "@models/token/token-model";
import { CommonState } from "@states/index";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { useAtom } from "jotai";
import useRouter from "@hooks/common/use-custom-router";
import { useCallback, useMemo } from "react";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { IncreaseLiquidityFailedResponse, IncreaseLiquiditySuccessResponse } from "@repositories/position/response";

export interface Props {
  openModal: () => void;
}

export interface IncreasePositionModal {
  selectedPosition: PoolPositionModel | null;
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  tokenAAmountInput: TokenAmountInputModel;
  tokenBAmountInput: TokenAmountInputModel;
  slippage: number;
  swapFeeTier: SwapFeeTierType | null;
  minPriceStr: string;
  maxPriceStr: string;
  rangeStatus: RANGE_STATUS_OPTION;
  isDepositTokenA: boolean;
  isDepositTokenB: boolean;
}

export const useIncreasePositionModal = ({
  selectedPosition,
  tokenA,
  tokenB,
  tokenAAmountInput,
  tokenBAmountInput,
  slippage,
  swapFeeTier,
  minPriceStr,
  maxPriceStr,
  rangeStatus,
  isDepositTokenA,
  isDepositTokenB,
}: IncreasePositionModal): Props => {
  const {
    broadcastRejected,
    broadcastSuccess,
    broadcastLoading,
    broadcastError,
    broadcastPending,
  } = useBroadcastHandler();
  const router = useRouter();
  const { positionRepository } = useGnoswapContext();
  const { address } = useAddress();
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const onCloseConfirmTransactionModal = useCallback(() => {
    router.back();
  }, [router]);

  const { openModal: openTransactionConfirmModal } = useTransactionConfirmModal({
    closeCallback: onCloseConfirmTransactionModal,
  });

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

  const confirm = useCallback(async () => {
    if (!address || !selectedPosition) {
      return false;
    }

    broadcastLoading(
      makeBroadcastAddLiquidityMessage("pending", {
        tokenASymbol: selectedPosition.pool.tokenA.symbol,
        tokenBSymbol: selectedPosition.pool.tokenB.symbol,
        tokenAAmount: Number(tokenAAmountInput.amount).toLocaleString("en-US", {
          maximumFractionDigits: 6,
        }),
        tokenBAmount: Number(tokenBAmountInput.amount).toLocaleString("en-US", {
          maximumFractionDigits: 6,
        }),
      }),
    );

    const result = await positionRepository
      .increaseLiquidity({
        lpTokenId: selectedPosition.id,
        tokenA: selectedPosition.pool.tokenA,
        tokenB: selectedPosition.pool.tokenB,
        tokenAAmount: Number(tokenAAmountInput.amount),
        tokenBAmount: Number(tokenBAmountInput.amount),
        slippage: slippage,
        caller: address,
      })
      .catch(() => null);

    if (result) {
      if (result.code === 0 && result?.data) {
        const resultData = result?.data as IncreaseLiquiditySuccessResponse;
        broadcastPending();
        setTimeout(() => {
          // Make display token amount
          const tokenAAmount = (
            makeDisplayTokenAmount(
              selectedPosition.pool.tokenA,
              resultData.tokenAAmount,
            ) || 0
          ).toLocaleString("en-US", { maximumFractionDigits: 6 });
          const tokenBAmount = (
            makeDisplayTokenAmount(
              selectedPosition.pool.tokenB,
              resultData.tokenBAmount,
            ) || 0
          ).toLocaleString("en-US", { maximumFractionDigits: 6 });

          broadcastSuccess(
            makeBroadcastAddLiquidityMessage(
              "success",
              {
                tokenASymbol: selectedPosition.pool.tokenA.symbol,
                tokenBSymbol: selectedPosition.pool.tokenB.symbol,
                tokenAAmount,
                tokenBAmount,
              },
              resultData.hash,
            ),
          );
        }, 1000);

        openTransactionConfirmModal();
      } else if (
        result.code === 4001 &&
        result.type === ERROR_VALUE.TRANSACTION_FAILED.type
      ) {
        const resultData = result?.data as IncreaseLiquidityFailedResponse;
        broadcastError(
          makeBroadcastAddLiquidityMessage(
            "error",
            {
              tokenASymbol: selectedPosition.pool.tokenA.symbol,
              tokenBSymbol: selectedPosition.pool.tokenB.symbol,
              tokenAAmount: Number(tokenAAmountInput.amount).toLocaleString(
                "en-US",
                { maximumFractionDigits: 6 },
              ),
              tokenBAmount: Number(tokenBAmountInput.amount).toLocaleString(
                "en-US",
                { maximumFractionDigits: 6 },
              ),
            },
            resultData.hash,
          ),
        );
      } else {
        broadcastRejected(
          makeBroadcastAddLiquidityMessage("error", {
            tokenASymbol: selectedPosition.pool.tokenA.symbol,
            tokenBSymbol: selectedPosition.pool.tokenB.symbol,
            tokenAAmount: Number(tokenAAmountInput.amount).toLocaleString(
              "en-US",
              { maximumFractionDigits: 6 },
            ),
            tokenBAmount: Number(tokenBAmountInput.amount).toLocaleString(
              "en-US",
              { maximumFractionDigits: 6 },
            ),
          }),
        );
      }
    }
    return true;
  }, [
    address,
    positionRepository,
    router,
    selectedPosition,
    tokenAAmountInput.amount,
    tokenBAmountInput.amount,
    slippage,
  ]);

  const openModal = useCallback(() => {
    if (!amountInfo) {
      return;
    }
    setOpenedModal(true);
    setModalContent(
      <IncreasePositionModalContainer
        amountInfo={amountInfo}
        minPriceStr={minPriceStr}
        maxPriceStr={maxPriceStr}
        rangeStatus={rangeStatus}
        isDepositTokenA={isDepositTokenA}
        isDepositTokenB={isDepositTokenB}
        confirm={confirm}
      />,
    );
  }, [
    setModalContent,
    setOpenedModal,
    confirm,
    amountInfo,
    isDepositTokenA,
    isDepositTokenB,
  ]);

  return {
    openModal,
  };
};
