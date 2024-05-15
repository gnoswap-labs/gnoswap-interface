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
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

export interface Props {
  openModal: () => void;
}

export interface IncreasePositionModal {
  selectedPosition: PoolPositionModel | null;
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  tokenAAmountInput: TokenAmountInputModel;
  tokenBAmountInput: TokenAmountInputModel;
  swapFeeTier: SwapFeeTierType | null;
  minPriceStr: string;
  maxPriceStr: string;
  rangeStatus: RANGE_STATUS_OPTION;
}

export const useIncreasePositionModal = ({
  selectedPosition,
  tokenA,
  tokenB,
  tokenAAmountInput,
  tokenBAmountInput,
  swapFeeTier,
  minPriceStr,
  maxPriceStr,
  rangeStatus,
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
        caller: address,
      })
      .catch(() => null);

    if (result) {
      const resultData = result?.data;
      if (result.code === 0 && resultData) {
        broadcastPending();
        setTimeout(() => {
          // Make display token amount
          const tokenAAmount = (
            makeDisplayTokenAmount(
              selectedPosition.pool.tokenA,
              resultData.tokenAAmount,
            ) || 0
          ).toLocaleString("en-US", {
            maximumFractionDigits: 6,
          });
          const tokenBAmount = (
            makeDisplayTokenAmount(
              selectedPosition.pool.tokenB,
              resultData.tokenBAmount,
            ) || 0
          ).toLocaleString("en-US", {
            maximumFractionDigits: 6,
          });

          broadcastSuccess(
            makeBroadcastAddLiquidityMessage("success", {
              tokenASymbol: selectedPosition.pool.tokenA.symbol,
              tokenBSymbol: selectedPosition.pool.tokenB.symbol,
              tokenAAmount,
              tokenBAmount,
            }),
          );
        }, 1000);
        router.back();
      } else if (
        result.code === 4000 &&
        result.type !== ERROR_VALUE.TRANSACTION_REJECTED.type
      ) {
        broadcastError(
          makeBroadcastAddLiquidityMessage("error", {
            tokenASymbol: selectedPosition.pool.tokenA.symbol,
            tokenBSymbol: selectedPosition.pool.tokenB.symbol,
            tokenAAmount: Number(tokenAAmountInput.amount).toLocaleString(
              "en-US",
              {
                maximumFractionDigits: 6,
              },
            ),
            tokenBAmount: Number(tokenBAmountInput.amount).toLocaleString(
              "en-US",
              {
                maximumFractionDigits: 6,
              },
            ),
          }),
        );
      } else {
        broadcastRejected(
          makeBroadcastAddLiquidityMessage("error", {
            tokenASymbol: selectedPosition.pool.tokenA.symbol,
            tokenBSymbol: selectedPosition.pool.tokenB.symbol,
            tokenAAmount: Number(tokenAAmountInput.amount).toLocaleString(
              "en-US",
              {
                maximumFractionDigits: 6,
              },
            ),
            tokenBAmount: Number(tokenBAmountInput.amount).toLocaleString(
              "en-US",
              {
                maximumFractionDigits: 6,
              },
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
        confirm={confirm}
      />,
    );
  }, [setModalContent, setOpenedModal, confirm, amountInfo]);

  return {
    openModal,
  };
};
