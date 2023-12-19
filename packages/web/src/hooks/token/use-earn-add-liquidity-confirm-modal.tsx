import EarnAddConfirm from "@components/earn-add/earn-add-confirm/EarnAddConfirm";
import {
  SwapFeeTierInfoMap,
  SwapFeeTierMaxPriceRangeMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import useNavigate from "@hooks/common/use-navigate";
import { TokenModel } from "@models/token/token-model";
import { CommonState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TokenAmountInputModel } from "./use-token-amount-input";
import { priceToNearTick } from "@utils/swap-utils";
import { SelectPool } from "@hooks/pool/use-select-pool";
import { numberToFormat } from "@utils/string-utils";
import { MAX_TICK, MIN_TICK } from "@constants/swap.constant";
import { useNotice } from "@hooks/common/use-notice";
import { useTokenData } from "./use-token-data";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import BigNumber from "bignumber.js";
import { makeRandomId, parseJson } from "@utils/common";
import { TNoticeType } from "src/context/NoticeContext";
import { PositionResponse } from "@containers/submit-position-modal-container/SubmitPositionModalContainer";
import PositionStatus from "@containers/submit-position-modal-container/PositionModalStatus";

export interface EarnAddLiquidityConfirmModalProps {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  tokenAAmountInput: TokenAmountInputModel;
  tokenBAmountInput: TokenAmountInputModel;
  selectPool: SelectPool;
  slippage: string;
  swapFeeTier: SwapFeeTierType | null;
  createPool: (params: {
    tokenAAmount: string;
    tokenBAmount: string;
    swapFeeTier: SwapFeeTierType;
    startPrice: string;
    minTick: number;
    maxTick: number;
    slippage: string;
  }) => Promise<string | null>;
  addLiquidity: (params: {
    tokenAAmount: string;
    tokenBAmount: string;
    swapFeeTier: SwapFeeTierType;
    minTick: number;
    maxTick: number;
    slippage: string;
  }) => Promise<string | null>;
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
  const { gnotToken } = useTokenData();
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [positionResult, setPositionResult] = useState<PositionResponse>(null);
  const navigator = useNavigate();

  const { setNotice } = useNotice();

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
  }, [
    selectPool.depositRatio,
    selectPool.compareToken?.path,
    tokenAAmountInput.token?.path,
    tokenAAmountInput.amount,
  ]);

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
  }, [
    selectPool.depositRatio,
    selectPool.compareToken?.path,
    tokenBAmountInput.token?.path,
    tokenBAmountInput.amount,
  ]);

  const amountInfo = useMemo(() => {
    if (!tokenA || !tokenB || !swapFeeTier) {
      return null;
    }
    const tokenAUsdValue =
      tokenAAmount === "0" ? "$0" : tokenAAmountInput.usdValue;
    const tokenBUsdValue =
      tokenBAmount === "0" ? "$0" : tokenBAmountInput.usdValue;
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
      feeRate: SwapFeeTierInfoMap[swapFeeTier].rateStr,
    };
  }, [
    tokenA,
    tokenB,
    swapFeeTier,
    tokenAAmount,
    tokenAAmountInput.usdValue,
    tokenBAmount,
    tokenBAmountInput.usdValue,
  ]);

  const priceLabel = useMemo(() => {
    if (!selectPool.compareToken || !tokenA || !tokenB) {
      return "-";
    }
    const tokenASymbol =
      selectPool.compareToken?.symbol === tokenA?.symbol
        ? tokenA?.symbol
        : tokenB?.symbol;
    const tokenBSymbol =
      selectPool.compareToken?.symbol === tokenA?.symbol
        ? tokenB?.symbol
        : tokenA?.symbol;
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

    const { minPrice, maxPrice } =
      SwapFeeTierMaxPriceRangeMap[selectPool.feeTier || "NONE"];
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
    const feeBoost =
      selectPool.feeBoost === null ? "-" : `x${selectPool.feeBoost}`;

    let inRange = true;
    if (
      !selectPool.maxPrice ||
      BigNumber(selectPool.maxPrice).isLessThan(currentPrice)
    ) {
      inRange = false;
    }
    if (
      !selectPool.minPrice ||
      BigNumber(selectPool.minPrice).isGreaterThan(currentPrice)
    ) {
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

  const feeInfo = useMemo((): { token: TokenModel; fee: string } => {
    return {
      token: gnotToken,
      fee: `${makeDisplayTokenAmount(gnotToken, 1)}` || "",
    };
  }, [gnotToken]);

  const close = useCallback(() => {
    setIsConfirm(false);
    setOpenedModal(false);
    setModalContent(null);
    setPositionResult(null);
  }, [setModalContent, setOpenedModal]);

  const moveEarn = useCallback(() => {
    close();
    if (positionResult?.success) {
      navigator.push("/earn");
    }
  }, [close, navigator, positionResult?.success]);

  const confirm = useCallback(async () => {
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

    setIsConfirm(true);
    setPositionResult(null);
    try {
      let result;
      if (selectPool.isCreate) {
        result = await createPool({
          tokenAAmount,
          tokenBAmount,
          minTick,
          maxTick,
          slippage,
          startPrice: `${selectPool.startPrice || 1}`,
          swapFeeTier,
        });
      }
      result = await addLiquidity({
        tokenAAmount,
        tokenBAmount,
        minTick,
        maxTick,
        slippage,
        swapFeeTier,
      });

      setNotice(null, {
        timeout: 50000,
        type: "pending",
        closeable: true,
        id: makeRandomId(),
      });

      setPositionResult({
        success: true,
        hash: result ?? "",
      });

      setTimeout(() => {
        setNotice(null, {
          timeout: 50000,
          type: "success" as TNoticeType,
          closeable: true,
          id: makeRandomId(),
        });
      }, 1000);
    } catch (error) {
      if (error instanceof Error) {
        const { code } = parseJson(error?.message);
        setPositionResult({
          success: code === 0 ? true : false,
          code,
        });

        if (code !== 4000) {
          setNotice(null, {
            timeout: 50000,
            type: "pending",
            closeable: true,
            id: makeRandomId(),
          });

          setTimeout(() => {
            setNotice(null, {
              timeout: 50000,
              type:
                code === 0
                  ? ("success" as TNoticeType)
                  : ("error" as TNoticeType),
              closeable: true,
              id: makeRandomId(),
            });
          }, 1000);
        }
      }
    }
  }, [
    tokenA,
    tokenB,
    swapFeeTier,
    selectPool.tickSpacing,
    selectPool.minPrice,
    selectPool.maxPrice,
    selectPool.selectedFullRange,
    selectPool.isCreate,
    selectPool.startPrice,
    setNotice,
    addLiquidity,
    tokenAAmount,
    tokenBAmount,
    slippage,
    createPool,
  ]);
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
        close={moveEarn}
      />,
    );
  }, [
    amountInfo,
    priceRangeInfo,
    setOpenedModal,
    setModalContent,
    selectPool.isCreate,
    feeInfo,
    confirm,
    moveEarn,
  ]);

  useEffect(() => {
    if (isConfirm) {
      setModalContent(
        <PositionStatus close={moveEarn} positionResult={positionResult} />,
      );
    }
  }, [isConfirm, moveEarn, positionResult, setModalContent]);

  return {
    openModal,
  };
};
