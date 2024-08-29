import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";

import { ERROR_VALUE } from "@common/errors/adena";
import {
  RANGE_STATUS_OPTION,
  SwapFeeTierInfoMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import { useAddress } from "@hooks/address/use-address";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import useRouter from "@hooks/common/use-custom-router";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useMessage } from "@hooks/common/use-message";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenModel } from "@models/token/token-model";
import { DexEvent } from "@repositories/common";
import { CommonState } from "@states/index";
import { makeDisplayTokenAmount } from "@utils/token-utils";

import IncreasePositionModalContainer from "../containers/increase-position-modal-container/IncreasePositionModalContainer";
import { useTransactionEventStore } from "@hooks/common/use-transaction-event-store";
import { useGetPoolList, useRefetchGetPoolDetailByPath } from "@query/pools";

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
  refetchPositions: () => Promise<void>;
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
  refetchPositions,
}: IncreasePositionModal): Props => {
  const {
    broadcastRejected,
    broadcastSuccess,
    broadcastLoading,
    broadcastError,
  } = useBroadcastHandler();
  const { enqueueEvent } = useTransactionEventStore();

  const router = useRouter();
  const { positionRepository } = useGnoswapContext();
  const { address } = useAddress();
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  // Refetch functions
  const { refetch: refetchPools } = useGetPoolList();
  const { refetch: refetchPoolDetails } = useRefetchGetPoolDetailByPath(
    selectedPosition?.poolPath,
  );

  const onCloseConfirmTransactionModal = useCallback(() => {
    router.back();
  }, [router]);

  const { openModal: openTransactionConfirmModal } = useTransactionConfirmModal(
    {
      closeCallback: onCloseConfirmTransactionModal,
    },
  );

  const { getMessage } = useMessage();

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

  const confirm = async () => {
    if (!address || !selectedPosition) {
      return false;
    }

    const tokenA = selectedPosition.pool.tokenA;
    const tokenB = selectedPosition.pool.tokenB;

    broadcastLoading(
      getMessage(DexEvent.ADD, "pending", {
        tokenASymbol: tokenA.symbol,
        tokenBSymbol: tokenB.symbol,
        tokenAAmount: Number(tokenAAmountInput.amount).toLocaleString("en-US", {
          maximumFractionDigits: tokenA.decimals,
        }),
        tokenBAmount: Number(tokenBAmountInput.amount).toLocaleString("en-US", {
          maximumFractionDigits: tokenB.decimals,
        }),
      }),
    );

    const result = await positionRepository
      .increaseLiquidity({
        lpTokenId: selectedPosition.id.toString(),
        tokenA: tokenA,
        tokenB: tokenB,
        tokenAAmount: Number(tokenAAmountInput.amount),
        tokenBAmount: Number(tokenBAmountInput.amount),
        slippage: slippage,
        caller: address,
      })
      .catch(() => null);

    if (result) {
      if (
        result.code === 0 ||
        result.code === ERROR_VALUE.TRANSACTION_FAILED.status
      ) {
        enqueueEvent({
          txHash: result.data?.hash,
          action: DexEvent.ADD,
          visibleEmitResult: true,
          formatData: response => {
            const tokenAAmount = response
              ? response[2]
              : tokenAAmountInput.amount;
            const tokenBAmount = response
              ? response[3]
              : tokenBAmountInput.amount;
            return {
              tokenASymbol: tokenA.symbol,
              tokenBSymbol: tokenB.symbol,
              tokenAAmount: Number(tokenAAmount).toLocaleString("en-US", {
                maximumFractionDigits: tokenA.decimals,
              }),
              tokenBAmount: Number(tokenBAmount).toLocaleString("en-US", {
                maximumFractionDigits: tokenB.decimals,
              }),
            };
          },
          onEmit: async () => {
            refetchPools();
            refetchPositions();
            refetchPoolDetails();
          },
        });
      }

      if (result.code === 0) {
        openTransactionConfirmModal();
        // Make display token amount
        const tokenAAmount = (
          makeDisplayTokenAmount(tokenA, tokenAAmountInput.amount) || 0
        ).toLocaleString("en-US", { maximumFractionDigits: tokenA.decimals });
        const tokenBAmount = (
          makeDisplayTokenAmount(tokenB, tokenBAmountInput.amount) || 0
        ).toLocaleString("en-US", { maximumFractionDigits: tokenB.decimals });

        broadcastSuccess(
          getMessage(
            DexEvent.ADD,
            "success",
            {
              tokenASymbol: tokenA.symbol,
              tokenBSymbol: tokenB.symbol,
              tokenAAmount,
              tokenBAmount,
            },
            result.data?.hash,
          ),
        );
      } else if (
        result.code === ERROR_VALUE.TRANSACTION_REJECTED.status // 4000
      ) {
        broadcastRejected(
          getMessage(DexEvent.ADD, "error", {
            tokenASymbol: tokenA.symbol,
            tokenBSymbol: tokenB.symbol,
            tokenAAmount: Number(tokenAAmountInput.amount).toLocaleString(
              "en-US",
              { maximumFractionDigits: tokenA.decimals },
            ),
            tokenBAmount: Number(tokenBAmountInput.amount).toLocaleString(
              "en-US",
              { maximumFractionDigits: tokenB.decimals },
            ),
          }),
        );
      } else {
        broadcastError(
          getMessage(
            DexEvent.ADD,
            "error",
            {
              tokenASymbol: tokenA.symbol,
              tokenBSymbol: tokenB.symbol,
              tokenAAmount: Number(tokenAAmountInput.amount).toLocaleString(
                "en-US",
                { maximumFractionDigits: tokenA.decimals },
              ),
              tokenBAmount: Number(tokenBAmountInput.amount).toLocaleString(
                "en-US",
                { maximumFractionDigits: tokenB.decimals },
              ),
            },
            result?.data?.hash,
          ),
        );
      }
    }
    return true;
  };

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
  }, [amountInfo, isDepositTokenA, isDepositTokenB, confirm]);

  return {
    openModal,
  };
};
