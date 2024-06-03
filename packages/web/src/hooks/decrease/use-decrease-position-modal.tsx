import { ERROR_VALUE } from "@common/errors/adena";
import {
  RANGE_STATUS_OPTION,
  SwapFeeTierInfoMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import DecreasePositionModalContainer from "@containers/decrease-position-modal-container/DecreasePositionModalContainer";
import { useAddress } from "@hooks/address/use-address";
import {
  makeBroadcastRemoveMessage,
  useBroadcastHandler,
} from "@hooks/common/use-broadcast-handler";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { TokenModel } from "@models/token/token-model";
import { CommonState } from "@states/index";
import { useAtom } from "jotai";
import useRouter from "@hooks/common/use-custom-router";
import { useCallback, useMemo } from "react";
import { IPooledTokenInfo } from "./use-decrease-handle";
import BigNumber from "bignumber.js";

export interface Props {
  openModal: () => void;
}

export interface DecreasePositionModal {
  positionId: string;
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  swapFeeTier: SwapFeeTierType | null;
  minPriceStr: string;
  maxPriceStr: string;
  rangeStatus: RANGE_STATUS_OPTION;
  percent: number;
  pooledTokenInfos: IPooledTokenInfo | null;
}

export const useDecreasePositionModal = ({
  positionId,
  tokenA,
  tokenB,
  swapFeeTier,
  minPriceStr,
  maxPriceStr,
  rangeStatus,
  percent,
  pooledTokenInfos,
}: DecreasePositionModal): Props => {
  const router = useRouter();
  const { address } = useAddress();
  const { positionRepository } = useGnoswapContext();

  const {
    broadcastRejected,
    broadcastSuccess,
    broadcastLoading,
    broadcastError,
    broadcastPending,
  } = useBroadcastHandler();

  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const amountInfo = useMemo(() => {
    if (!tokenA || !tokenB || !swapFeeTier) {
      return null;
    }
    return {
      tokenA,
      tokenB,
      feeRate: SwapFeeTierInfoMap[swapFeeTier].rateStr,
    };
  }, [swapFeeTier, tokenA, tokenB]);

  const confirm = useCallback(async () => {
    if (!address || !tokenA || !tokenB) {
      return false;
    }



    broadcastLoading(
      makeBroadcastRemoveMessage("pending", {
        tokenASymbol: tokenA.symbol,
        tokenBSymbol: tokenB.symbol,
        tokenAAmount: Number(pooledTokenInfos?.poolAmountA).toLocaleString(
          "en-US",
          {
            maximumFractionDigits: 6,
          },
        ),
        tokenBAmount: Number(pooledTokenInfos?.poolAmountB).toLocaleString(
          "en-US",
          {
            maximumFractionDigits: 6,
          },
        ),
      }),
    );

    const poolAmountA = BigNumber(pooledTokenInfos?.poolAmountA ?? 0).toNumber();
    const poolAmountB = BigNumber(pooledTokenInfos?.poolAmountB ?? 0).toNumber();

    const result = await positionRepository
      .decreaseLiquidity({
        lpTokenId: positionId,
        decreaseRatio: percent,
        tokenA,
        tokenB,
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
            (resultData.removedTokenAAmount || 0)
          ).toLocaleString("en-US", {
            maximumFractionDigits: 6,
          });
          const tokenBAmount = (
            resultData.removedTokenBAmount || 0
          ).toLocaleString("en-US", {
            maximumFractionDigits: 6,
          });

          broadcastSuccess(
            makeBroadcastRemoveMessage("success", {
              tokenASymbol: tokenA.symbol,
              tokenBSymbol: tokenB.symbol,
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
          makeBroadcastRemoveMessage("error", {
            tokenASymbol: tokenA.symbol,
            tokenBSymbol: tokenB.symbol,
            tokenAAmount: Number(poolAmountA).toLocaleString(
              "en-US",
              {
                maximumFractionDigits: 6,
              },
            ),
            tokenBAmount: Number(poolAmountB).toLocaleString(
              "en-US",
              {
                maximumFractionDigits: 6,
              },
            ),
          }),
        );
      } else {
        broadcastRejected(
          makeBroadcastRemoveMessage("error", {
            tokenASymbol: tokenA.symbol,
            tokenBSymbol: tokenB.symbol,
            tokenAAmount: Number(poolAmountA).toLocaleString(
              "en-US",
              {
                maximumFractionDigits: 6,
              },
            ),
            tokenBAmount: Number(poolAmountB).toLocaleString(
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
    percent,
    pooledTokenInfos,
    positionId,
    positionRepository,
    router,
    tokenA,
    tokenB,
  ]);

  const openModal = useCallback(() => {
    if (!amountInfo) {
      return;
    }
    setOpenedModal(true);
    setModalContent(
      <DecreasePositionModalContainer
        amountInfo={amountInfo}
        minPriceStr={minPriceStr}
        maxPriceStr={maxPriceStr}
        rangeStatus={rangeStatus}
        percent={percent}
        pooledTokenInfos={pooledTokenInfos}
        confirm={confirm}
      />,
    );
  }, [setModalContent, setOpenedModal, confirm, amountInfo, pooledTokenInfos]);

  return {
    openModal,
  };
};
