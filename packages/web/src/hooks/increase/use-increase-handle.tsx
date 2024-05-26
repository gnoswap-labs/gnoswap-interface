import {
  RANGE_STATUS_OPTION,
  SwapFeeTierInfoMap,
} from "@constants/option.constant";
import { MAX_PRICE, MIN_PRICE } from "@constants/swap.constant";
import { AddLiquidityPriceRage } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import { usePositionData } from "@hooks/common/use-position-data";
import { useSlippage } from "@hooks/common/use-slippage";
import { useSelectPool } from "@hooks/pool/use-select-pool";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useTokenAmountInput } from "@hooks/token/use-token-amount-input";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel } from "@models/token/token-model";
import { IncreaseState } from "@states/index";
import {
  getDepositAmountsByAmountA,
  getDepositAmountsByAmountB,
  isEndTickBy,
  makeSwapFeeTier,
  priceToTick,
  tickToPrice,
  tickToPriceStr,
} from "@utils/swap-utils";
import { makeDisplayTokenAmount, makeRawTokenAmount } from "@utils/token-utils";
import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useMemo, useCallback, useState, useEffect } from "react";

export interface IPriceRange {
  tokenARatioStr: string;
  tokenBRatioStr: string;
  feeBoost: string;
}

export type INCREASE_BUTTON_TYPE = "ENTER_AMOUNT" | "INCREASE_LIQUIDITY" | "INSUFFICIENT_BALANCE";

export const useIncreaseHandle = () => {
  const router = useRouter();
  const [selectedPosition, setSelectedPosition] = useAtom(
    IncreaseState.selectedPosition,
  );
  const poolPath = router.query["pool-path"] as string;
  const positionId = router.query["position-id"] as string;
  const { getGnotPath } = useGnotToGnot();
  const { slippage, changeSlippage } = useSlippage();
  const [priceRange, setPriceRange] = useState<AddLiquidityPriceRage | null>({
    type: "Custom",
  });
  const loading = useMemo(() => {
    return !selectedPosition;
  }, [selectedPosition]);

  const { positions } = usePositionData();
  useEffect(() => {
    if (!selectedPosition && positions.length > 0 && positionId) {
      const position = positions.find(
        position => position.lpTokenId.toString() === positionId,
      );

      if (!position) {
        router.push(`/earn/pool/${poolPath}`);
        return;
      }

      setSelectedPosition(position);
    }
  }, [selectedPosition, positions, positionId, poolPath]);

  const { connected, account, loadingConnect } = useWallet();
  const minPriceStr = useMemo(() => {
    if (!selectedPosition) return "-";
    const isEndTick = isEndTickBy(
      selectedPosition?.tickLower,
      selectedPosition?.pool.fee,
    );
    const minPrice = tickToPriceStr(selectedPosition?.tickLower, 40, isEndTick);
    return `${minPrice}`;
  }, [selectedPosition?.tickUpper, selectedPosition?.tickLower]);

  const maxPriceStr = useMemo(() => {
    if (!selectedPosition) return "-";
    const isEndTick = isEndTickBy(
      selectedPosition?.tickUpper,
      selectedPosition?.pool.fee,
    );

    const maxPrice = tickToPriceStr(selectedPosition?.tickUpper, 40, isEndTick);

    return maxPrice;
  }, [selectedPosition?.tickLower, selectedPosition?.tickUpper]);

  const feeTier = useMemo(() => {
    return selectedPosition ? makeSwapFeeTier(selectedPosition.pool.fee) : null;
  }, [selectedPosition]);

  const tokenA: TokenModel | null = useMemo(() => {
    if (!selectedPosition) return null;
    return {
      ...selectedPosition?.pool.tokenA,
      name: getGnotPath(selectedPosition?.pool.tokenA).name,
      symbol: getGnotPath(selectedPosition?.pool.tokenA).symbol,
      logoURI: getGnotPath(selectedPosition?.pool.tokenA).logoURI,
    };
  }, [selectedPosition?.pool]);

  const tokenB: TokenModel | null = useMemo(() => {
    if (!selectedPosition) return null;
    return {
      ...selectedPosition?.pool.tokenB,
      name: getGnotPath(selectedPosition?.pool.tokenB).name,
      symbol: getGnotPath(selectedPosition?.pool.tokenB).symbol,
      logoURI: getGnotPath(selectedPosition?.pool.tokenB).logoURI,
    };
  }, [selectedPosition?.pool]);

  const inRange = useMemo(() => {
    if (!selectedPosition) return false;
    const { tickLower, tickUpper, pool } = selectedPosition;
    const currentTick = pool.currentTick;
    if (currentTick < tickLower || currentTick > tickUpper) {
      return false;
    }
    return true;
  }, [selectedPosition]);

  const rangeStatus = useMemo(() => {
    return selectedPosition?.closed
      ? RANGE_STATUS_OPTION.NONE
      : inRange
        ? RANGE_STATUS_OPTION.IN
        : RANGE_STATUS_OPTION.OUT;
  }, [selectedPosition, inRange]);

  const aprFee = useMemo(() => {
    if (!selectedPosition) return 0;
    return selectedPosition?.reward.reduce(
      (acc, item) => acc + Number(item.apr || 0),
      0,
    );
  }, [selectedPosition]);

  const selectPool = useSelectPool({
    tokenA,
    tokenB,
    feeTier,
    startPrice: selectedPosition
      ? tickToPrice(selectedPosition.pool.currentTick)
      : null,
    isCreate: false,
    options: selectedPosition
      ? {
        tickLower: selectedPosition.tickLower,
        tickUpper: selectedPosition.tickUpper,
      }
      : null,
  });

  const currentTick = useMemo(() => {
    return priceToTick(selectPool.currentPrice);
  }, [selectPool.currentPrice]);

  const isDepositTokenA = useMemo(() => {
    if (!selectedPosition?.tickUpper) {
      return false;
    }

    return selectedPosition.tickUpper > currentTick;
  }, [selectedPosition?.tickUpper, currentTick]);

  const isDepositTokenB = useMemo(() => {
    if (!selectedPosition?.tickLower) {
      return false;
    }

    return selectedPosition.tickLower < currentTick;
  }, [selectedPosition?.tickLower, currentTick]);

  const priceRangeSummary: IPriceRange = useMemo(() => {
    let tokenARatioStr = "-";
    let tokenBRatioStr = "-";
    let feeBoost: string | null = null;
    const deposiRatio = selectPool.depositRatio;
    if (deposiRatio !== null) {
      tokenARatioStr = BigNumber(deposiRatio).toFixed(1);
      tokenBRatioStr = BigNumber(100 - deposiRatio).toFixed(1);
    }
    feeBoost = selectPool.feeBoost === null ? "-" : `x${selectPool.feeBoost}`;

    return {
      tokenARatioStr,
      tokenBRatioStr,
      feeBoost,
    };
  }, [
    selectPool.compareToken?.symbol,
    selectPool.depositRatio,
    selectPool.feeBoost,
    selectPool.selectedFullRange,
  ]);

  const tokenAAmountInput = useTokenAmountInput(tokenA);
  const tokenBAmountInput = useTokenAmountInput(tokenB);

  const minPrice = useMemo(() => {
    if (selectPool.selectedFullRange || !selectPool.minPrice) {
      return MIN_PRICE;
    }

    return selectPool.minPrice;
  }, [selectPool.minPrice, selectPool.selectedFullRange]);

  const maxPrice = useMemo(() => {
    if (selectPool.selectedFullRange || !selectPool.maxPrice) {
      return MAX_PRICE;
    }

    return selectPool.maxPrice;
  }, [selectPool.maxPrice, selectPool.selectedFullRange]);

  const changeTokenAAmount = useCallback(
    (amount: string) => {
      tokenAAmountInput.changeAmount(amount);

      if (
        !selectPool ||
        !tokenA ||
        !tokenB ||
        Number.isNaN(amount) ||
        Number(amount) <= 0
      ) {
        return;
      }
      const amountAAmountRaw = makeRawTokenAmount(tokenA, amount) || "0";
      const { amountB } = getDepositAmountsByAmountA(
        selectPool.currentPrice,
        minPrice,
        maxPrice,
        BigInt(amountAAmountRaw),
      );

      const tokenBAmount = makeDisplayTokenAmount(tokenB, amountB) || "0";
      tokenBAmountInput.changeAmount(tokenBAmount.toString());
    },
    [
      tokenAAmountInput,
      selectPool.currentPrice,
      tokenA,
      tokenB,
      minPrice,
      maxPrice,
    ],
  );

  const changeTokenBAmount = useCallback(
    (amount: string) => {
      tokenBAmountInput.changeAmount(amount);

      if (
        !selectPool ||
        !tokenA ||
        !tokenB ||
        Number.isNaN(amount) ||
        Number(amount) <= 0
      ) {
        return;
      }

      const amountBAmountRaw = makeRawTokenAmount(tokenB, amount) || "0";
      const { amountA } = getDepositAmountsByAmountB(
        selectPool.currentPrice,
        minPrice,
        maxPrice,
        BigInt(amountBAmountRaw),
      );

      const tokenAAmount = makeDisplayTokenAmount(tokenA, amountA) || "0";
      tokenAAmountInput.changeAmount(tokenAAmount.toString());
    },
    [
      tokenBAmountInput,
      selectPool.currentPrice,
      tokenA,
      tokenB,
      minPrice,
      maxPrice,
    ],
  );

  const buttonType: INCREASE_BUTTON_TYPE = useMemo(() => {
    if (
      !Number(tokenAAmountInput.amount) ||
      !Number(tokenBAmountInput.amount)
    ) {
      return "ENTER_AMOUNT";
    }

    if (
      (isDepositTokenA && !!tokenA && Number(tokenAAmountInput.amount) > Number(tokenAAmountInput.balance.replace(/,/g, "")))
      || (isDepositTokenB && !!tokenB && Number(tokenBAmountInput.amount) > Number(tokenBAmountInput.balance.replace(/,/g, "")))
    ) {

      return "INSUFFICIENT_BALANCE";
    }

    return "INCREASE_LIQUIDITY";
  }, [tokenAAmountInput, tokenBAmountInput]);

  const changePriceRange = useCallback((priceRange: AddLiquidityPriceRage) => {
    setPriceRange(priceRange);
  }, []);

  useEffect(() => {
    if (!["done", "error", "failure"].includes(loadingConnect)) {
      return;
    }

    if (!account && poolPath) {
      router.push(`/earn/pool/${poolPath}`);
    }
  }, [account, poolPath, loadingConnect]);

  return {
    loading,
    tokenA,
    tokenB,
    fee: SwapFeeTierInfoMap[feeTier || "NONE"].fee,
    maxPriceStr,
    minPriceStr,
    rangeStatus,
    aprFee,
    priceRangeSummary,
    connected,
    tokenAAmountInput,
    tokenBAmountInput,
    changeTokenAAmount,
    changeTokenBAmount,
    slippage,
    changeSlippage,
    buttonType,
    selectPool,
    priceRange,
    changePriceRange,
    selectedPosition,
    isDepositTokenA,
    isDepositTokenB,
  };
};
