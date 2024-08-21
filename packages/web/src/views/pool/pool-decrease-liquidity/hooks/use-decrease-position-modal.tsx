import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";

import { ERROR_VALUE } from "@common/errors/adena";
import { GNOT_TOKEN, WUGNOT_TOKEN } from "@common/values/token-constant";
import {
  RANGE_STATUS_OPTION,
  SwapFeeTierInfoMap,
  SwapFeeTierType
} from "@constants/option.constant";
import { useAddress } from "@hooks/address/use-address";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { useClearModal } from "@hooks/common/use-clear-modal";
import useRouter from "@hooks/common/use-custom-router";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useMessage } from "@hooks/common/use-message";
import { TokenModel } from "@models/token/token-model";
import { DexEvent } from "@repositories/common";
import { DecreaseLiquiditySuccessResponse } from "@repositories/position/response";
import { CommonState } from "@states/index";
import { makeDisplayTokenAmount } from "@utils/token-utils";

import DecreasePositionModalContainer from "../containers/decrease-position-modal-container/DecreasePositionModalContainer";
import { IPooledTokenInfo } from "./use-decrease-handle";

export interface Props {
  openModal: () => void;
}

export interface DecreasePositionModal {
  positionId: string;
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  slippage: number;
  swapFeeTier: SwapFeeTierType | null;
  minPriceStr: string;
  maxPriceStr: string;
  rangeStatus: RANGE_STATUS_OPTION;
  percent: number;
  pooledTokenInfos: IPooledTokenInfo | null;
  isGetWGNOT: boolean;
}

export const useDecreasePositionModal = ({
  positionId,
  tokenA,
  slippage,
  tokenB,
  swapFeeTier,
  minPriceStr,
  maxPriceStr,
  rangeStatus,
  percent,
  pooledTokenInfos,
  isGetWGNOT,
}: DecreasePositionModal): Props => {
  const router = useRouter();
  const { address } = useAddress();
  const { positionRepository } = useGnoswapContext();
  const clearModal = useClearModal();

  const onSuccessClose = useCallback(() => {
    clearModal();
    router.back();
  }, [clearModal, router]);

  const {
    broadcastRejected,
    broadcastSuccess,
    broadcastLoading,
    broadcastError,
    broadcastPending,
  } = useBroadcastHandler();

  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const { getMessage } = useMessage();

  const gnotToken = useMemo(
    () => [tokenA, tokenB].find(item => item?.path === GNOT_TOKEN.path),
    [tokenA, tokenB],
  );

  const gnotAmount = useMemo(() => {
    if (tokenA?.path === gnotToken?.path) {
      return (
        Number(pooledTokenInfos?.poolAmountA || 0) +
        Number(pooledTokenInfos?.unClaimTokenAAmount || 0)
      );
    }
    if (tokenB?.path === gnotToken?.path) {
      return (
        Number(pooledTokenInfos?.poolAmountB || 0) +
        Number(pooledTokenInfos?.unClaimTokenBAmount || 0)
      );
    }
    return 0;
  }, [
    gnotToken?.path,
    pooledTokenInfos?.poolAmountA,
    pooledTokenInfos?.poolAmountB,
    pooledTokenInfos?.unClaimTokenAAmount,
    pooledTokenInfos?.unClaimTokenBAmount,
    tokenA?.path,
    tokenB?.path,
  ]);

  const willWrap = useMemo(() => {
    return isGetWGNOT && !!gnotToken && !!gnotAmount;
  }, [gnotAmount, gnotToken, isGetWGNOT]);

  const tokenTransform = useCallback(
    (token: TokenModel) => {
      if (token.path === GNOT_TOKEN.path) {
        if (willWrap) {
          return WUGNOT_TOKEN;
        }
      }

      return token;
    },
    [willWrap],
  );

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
      getMessage(DexEvent.REMOVE, "pending", {
        tokenASymbol: tokenTransform(tokenA).symbol,
        tokenBSymbol: tokenTransform(tokenB).symbol,
        tokenAAmount: Number(pooledTokenInfos?.poolAmountA).toLocaleString(
          "en-US",
          {
            maximumFractionDigits: tokenTransform(tokenA).decimals,
          },
        ),
        tokenBAmount: Number(pooledTokenInfos?.poolAmountB).toLocaleString(
          "en-US",
          {
            maximumFractionDigits: tokenTransform(tokenB).decimals,
          },
        ),
      }),
    );

    const poolAmountA = BigNumber(
      pooledTokenInfos?.poolAmountA ?? 0,
    ).toNumber();
    const poolAmountB = BigNumber(
      pooledTokenInfos?.poolAmountB ?? 0,
    ).toNumber();

    const result = await positionRepository
      .decreaseLiquidity({
        lpTokenId: positionId,
        decreaseRatio: percent,
        tokenA,
        tokenB,
        tokenAAmount: poolAmountA,
        tokenBAmount: poolAmountB,
        slippage,
        caller: address,
        isGetWGNOT: willWrap,
      })
      .catch(() => null);

    const defaultMessageData = {
      tokenASymbol: tokenTransform(tokenA).symbol,
      tokenBSymbol: tokenTransform(tokenB).symbol,
      tokenAAmount: Number(poolAmountA).toLocaleString("en-US", {
        maximumFractionDigits: tokenA.decimals,
      }),
      tokenBAmount: Number(poolAmountB).toLocaleString("en-US", {
        maximumFractionDigits: tokenB.decimals,
      }),
    };

    if (result) {
      if (result.code === 0 && result?.data) {
        const resultData = result?.data as DecreaseLiquiditySuccessResponse;
        broadcastPending({ txHash: resultData.hash });
        setTimeout(() => {
          // Make display token amount
          const tokenAAmount = (
            makeDisplayTokenAmount(tokenA, resultData.removedTokenAAmount) || 0
          ).toLocaleString("en-US", { maximumFractionDigits: tokenA.decimals });
          const tokenBAmount = (
            makeDisplayTokenAmount(tokenB, resultData.removedTokenBAmount) || 0
          ).toLocaleString("en-US", { maximumFractionDigits: tokenB.decimals });

          broadcastSuccess(
            getMessage(
              DexEvent.REMOVE,
              "success",
              {
                tokenASymbol: tokenTransform(tokenA).symbol,
                tokenBSymbol: tokenTransform(tokenB).symbol,
                tokenAAmount,
                tokenBAmount,
              },
              resultData.hash,
            ),
            onSuccessClose,
          );
        }, 1000);
      } else if (
        result.code === ERROR_VALUE.TRANSACTION_REJECTED.status // 4000
      ) {
        broadcastRejected(
          getMessage(DexEvent.REMOVE, "error", defaultMessageData),
        );
      } else {
        broadcastError(
          getMessage(
            DexEvent.REMOVE,
            "error",
            defaultMessageData,
            result?.data?.hash,
          ),
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
    willWrap,
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
