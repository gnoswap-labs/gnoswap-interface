import EarnAddConfirm from "@components/earn-add/earn-add-confirm/EarnAddConfirm";
import { SwapFeeTierInfoMap, SwapFeeTierMaxPriceRangeMap, SwapFeeTierType } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";
import { CommonState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { TokenAmountInputModel } from "./use-token-amount-input";
import { priceToNearTick } from "@utils/swap-utils";
import { SelectPool } from "@hooks/pool/use-select-pool";
import { numberToFormat } from "@utils/string-utils";
import { MAX_TICK, MIN_TICK } from "@constants/swap.constant";
import { useTokenData } from "./use-token-data";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import BigNumber from "bignumber.js";
import { useRouter } from "next/router";
import { makeBroadcastAddLiquidityMessage, useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { CreatePoolResponse } from "@repositories/pool/response/create-pool-response";
import { AddLiquidityResponse } from "@repositories/pool/response/add-liquidity-response";

export interface EarnAddLiquidityConfirmModalProps {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  tokenAAmountInput: TokenAmountInputModel;
  tokenBAmountInput: TokenAmountInputModel;
  selectPool: SelectPool;
  slippage: string;
  swapFeeTier: SwapFeeTierType | null;
  createPool: (
    params: {
      tokenAAmount: string;
      tokenBAmount: string;
      swapFeeTier: SwapFeeTierType;
      startPrice: string;
      minTick: number;
      maxTick: number;
      slippage: string;
    }
  ) => Promise<CreatePoolResponse | null>;
  addLiquidity: (
    params: {
      tokenAAmount: string;
      tokenBAmount: string;
      swapFeeTier: SwapFeeTierType;
      minTick: number;
      maxTick: number;
      slippage: string;
    }
  ) => Promise<AddLiquidityResponse | null>;
}
export interface SelectTokenModalModel {
  openModal: () => void;
}

export const useEarnAddLiquidityConfirmModal = ({
  tokenA,
  tokenB,
  tokenAAmountInput,
  tokenBAmountInput,
  selectPool,
  slippage,
  swapFeeTier,
  createPool,
  addLiquidity,
}: EarnAddLiquidityConfirmModalProps): SelectTokenModalModel => {
  const { broadcastLoading, broadcastRejected, broadcastSuccess, broadcastPending, broadcastError } = useBroadcastHandler();
  const { gnotToken } = useTokenData();
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);
  const router = useRouter();
  const tokenAAmount = useMemo(() => {
    const depositRatio = selectPool.depositRatio;
    const compareTokenPath = selectPool.compareToken?.path;
    if (depositRatio === null || compareTokenPath === undefined) {
      return "0";
    }
    const ordered = compareTokenPath === tokenAAmountInput.token?.path;
    if (ordered && depositRatio === 0) {
      return "0";
    }
    if (!ordered && depositRatio === 100) {
      return "0";
    }
    return tokenAAmountInput.amount;
  }, [selectPool.depositRatio, selectPool.compareToken?.path, tokenAAmountInput.token?.path, tokenAAmountInput.amount]);

  const tokenBAmount = useMemo(() => {
    const depositRatio = selectPool.depositRatio;
    const compareTokenPath = selectPool.compareToken?.path;
    if (depositRatio === null || compareTokenPath === undefined) {
      return "0";
    }
    const ordered = compareTokenPath === tokenBAmountInput.token?.path;
    if (ordered && depositRatio === 0) {
      return "0";
    }
    if (!ordered && depositRatio === 100) {
      return "0";
    }
    return tokenBAmountInput.amount;
  }, [selectPool.depositRatio, selectPool.compareToken?.path, tokenBAmountInput.token?.path, tokenBAmountInput.amount]);

  const amountInfo = useMemo(() => {
    if (!tokenA || !tokenB || !swapFeeTier) {
      return null;
    }
    const tokenAUsdValue = tokenAAmount === "0" ? "$0" : tokenAAmountInput.usdValue;
    const tokenBUsdValue = tokenBAmount === "0" ? "$0" : tokenBAmountInput.usdValue;
    return {
      tokenA: {
        info: tokenA,
        amount: tokenAAmount,
        usdPrice: tokenAUsdValue,
      },
      tokenB: {
        info: tokenB,
        amount: tokenBAmount,
        usdPrice: tokenBUsdValue,
      },
      feeRate: SwapFeeTierInfoMap[swapFeeTier].rateStr
    };
  }, [tokenA, tokenB, swapFeeTier, tokenAAmount, tokenAAmountInput.usdValue, tokenBAmount, tokenBAmountInput.usdValue]);

  const priceLabel = useMemo(() => {
    if (!selectPool.compareToken || !tokenA || !tokenB) {
      return "-";
    }
    const tokenASymbol = selectPool.compareToken?.symbol === tokenA?.symbol ? tokenA?.symbol : tokenB?.symbol;
    const tokenBSymbol = selectPool.compareToken?.symbol === tokenA?.symbol ? tokenB?.symbol : tokenA?.symbol;
    return `${tokenASymbol} per ${tokenBSymbol}`;
  }, [selectPool.compareToken, tokenA, tokenB]);


  const priceRangeInfo = useMemo(() => {
    if (!selectPool) {
      return null;
    }
    const currentPrice = `${selectPool.currentPrice}`;
    if (selectPool.selectedFullRange) {
      return {
        currentPrice,
        inRange: true,
        minPrice: "0.0000",
        maxPrice: "∞",
        priceLabel,
        feeBoost: "x1",
        estimatedAPR: "N/A",
      };
    }

    const { minPrice, maxPrice } = SwapFeeTierMaxPriceRangeMap[selectPool.feeTier || "NONE"];
    let minPriceStr = "0.0000";
    let maxPriceStr = "0.0000";
    if (selectPool.minPrice && selectPool.minPrice > minPrice) {
      minPriceStr = numberToFormat(selectPool.minPrice, 4);
    }
    if (selectPool.maxPrice) {
      if (selectPool.maxPrice / maxPrice > 0.9) {
        maxPriceStr = "∞";
      } else {
        maxPriceStr = numberToFormat(selectPool.maxPrice, 4);
      }
    }
    const feeBoost = selectPool.feeBoost === null ? "-" : `x${selectPool.feeBoost}`;

    let inRange = true;
    if (!selectPool.maxPrice || BigNumber(selectPool.maxPrice).isLessThan(currentPrice)) {
      inRange = false;
    }
    if (!selectPool.minPrice || BigNumber(selectPool.minPrice).isGreaterThan(currentPrice)) {
      inRange = false;
    }
    return {
      currentPrice,
      inRange,
      minPrice: minPriceStr,
      maxPrice: maxPriceStr,
      priceLabel,
      feeBoost,
      estimatedAPR: "N/A",
    };
  }, [priceLabel, selectPool]);

  const feeInfo = useMemo((): { token: TokenModel, fee: string } => {
    return {
      token: gnotToken,
      fee: `${makeDisplayTokenAmount(gnotToken, 1)}` || ""
    };
  }, [gnotToken]);

  const close = useCallback(() => {
    setOpenedModal(false);
    setModalContent(null);
  }, [setModalContent, setOpenedModal]);

  const moveToBack = useCallback(() => {
    close();
    const pathName = router.pathname;
    if (pathName === "/earn/add") {
      router.push("/earn?back=q");
    } else {
      router.push(router.asPath.replace("/add", ""));
    }
  }, [close, router]);

  const confirm = useCallback(() => {
    if (!tokenA || !tokenB || !swapFeeTier) {
      return;
    }

    const minTickMod = Math.abs(MIN_TICK) % selectPool.tickSpacing;
    const maxTickMod = Math.abs(MAX_TICK) % selectPool.tickSpacing;
    let minTick = MIN_TICK + minTickMod;
    let maxTick = MAX_TICK - maxTickMod;

    if (selectPool.minPrice && selectPool.maxPrice) {
      if (!selectPool.selectedFullRange) {
        minTick = priceToNearTick(selectPool.minPrice, selectPool.tickSpacing);
        maxTick = priceToNearTick(selectPool.maxPrice, selectPool.tickSpacing);
      }
    }

    broadcastLoading(makeBroadcastAddLiquidityMessage("pending", {
      tokenASymbol: tokenA.symbol,
      tokenBSymbol: tokenB.symbol,
      tokenAAmount: tokenAAmount,
      tokenBAmount: tokenBAmount
    }));
    const transaction = selectPool.isCreate ? createPool({
      tokenAAmount,
      tokenBAmount,
      minTick,
      maxTick,
      slippage,
      startPrice: `${selectPool.startPrice || 1}`,
      swapFeeTier,
    }) : addLiquidity({
      tokenAAmount,
      tokenBAmount,
      minTick,
      maxTick,
      slippage,
      swapFeeTier,
    });
    transaction.then(result => {
      if (result) {
        if (result.code === 0) {
          broadcastPending();
          setTimeout(() => {
            broadcastSuccess(makeBroadcastAddLiquidityMessage("success", {
              tokenASymbol: result.tokenA.symbol,
              tokenBSymbol: result.tokenB.symbol,
              tokenAAmount: tokenAAmount,
              tokenBAmount: tokenBAmount,
            }), moveToBack);
          }, 1000);
          return true;
        } else if (result.code === 4000) {
          broadcastRejected(makeBroadcastAddLiquidityMessage("error", {
            tokenASymbol: tokenA.symbol,
            tokenBSymbol: tokenB.symbol,
            tokenAAmount: tokenAAmount,
            tokenBAmount: tokenBAmount
          }));
          return true;
        }
      }
      return false;
    }).catch(() => false)
      .then(broadcasted => {
        if (broadcasted) {
          return;
        }
        broadcastError(makeBroadcastAddLiquidityMessage("error", {
          tokenASymbol: tokenA.symbol,
          tokenBSymbol: tokenB.symbol,
          tokenAAmount: tokenAAmount,
          tokenBAmount: tokenBAmount
        }));
      });
  }, [tokenA, tokenB, swapFeeTier, selectPool.tickSpacing, selectPool.minPrice, selectPool.maxPrice, selectPool.isCreate, selectPool.selectedFullRange, selectPool.startPrice, addLiquidity, tokenAAmount, tokenBAmount, slippage, createPool]);

  const openModal = useCallback(() => {
    if (!amountInfo || !priceRangeInfo) {
      return;
    }
    setOpenedModal(true);
    setModalContent(
      <EarnAddConfirm
        isPoolCreation={selectPool.isCreate}
        amountInfo={amountInfo}
        priceRangeInfo={priceRangeInfo}
        feeInfo={feeInfo}
        confirm={confirm}
        close={close}
      />
    );
  }, [amountInfo, close, confirm, feeInfo, priceRangeInfo, setModalContent, setOpenedModal, selectPool.isCreate]);

  return {
    openModal
  };
};