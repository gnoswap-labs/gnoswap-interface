import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";

import { PriceRangeMeta, RANGE_STATUS_OPTION, SwapFeeTierType } from "@constants/option.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import { useSelectPool } from "@hooks/pool/data/use-select-pool";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { useTokenAmountInput } from "@hooks/token/data/use-token-amount-input";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { TokenModel } from "@models/token/token-model";
import { IncreaseState } from "@states/index";
import { checkGnotPath } from "@utils/common";
import { formatOtherPrice } from "@utils/new-number-utils";
import { makeDisplayPrice } from "@utils/pool-utils";
import { getDepositAmountsByLiquidity, isEndTickBy, tickToPrice, tickToPriceStr } from "@utils/swap-utils";
import { makeDisplayTokenAmount } from "@utils/token-utils";

export interface IPriceRange {
  tokenARatioStr: string;
  tokenBRatioStr: string;
  feeBoost: string;
}

export interface IPooledTokenInfo {
  poolAmountA: string;
  poolAmountUSDA: string;
  poolAmountB: string;
  poolAmountUSDB: string;
  unClaimTokenAAmount: string;
  unClaimTokenBAmount: string;
  unClaimTokenAAmountUSD: string;
  unClaimTokenBAmountUSD: string;
  tokenABalance: string;
  tokenBBalance: string;
  tokenARemainingAmount: string;
  tokenBRemainingAmount: string;
  liquidity: string;
}

export type DeCREASE_BUTTON_TYPE = "ENTER_AMOUNT" | "INCREASE_LIQUIDITY";

export const useDecreaseHandle = () => {
  const router = useCustomRouter();
  const [selectedPosition, setSelectedPosition] = useAtom(IncreaseState.selectedPosition);
  const poolPath = router.getPoolPath();
  const positionId = router.getPositionId();
  const { getGnotPath } = useGnotToGnot();
  const [priceRange, setPriceRange] = useState<PriceRangeMeta | null>({
    type: "Custom",
  });
  const [percent, setPercent] = useState<number>(50);
  const { tokenPrices } = useTokenData();

  const { positions } = usePositionData({
    poolPath,
  });

  const { refetch: refetchPositions } = usePositionData({
    poolPath: poolPath,
    queryOption: {
      enabled: !!poolPath,
    },
  });

  const loading = useMemo(() => {
    return !selectedPosition;
  }, [selectedPosition]);

  useEffect(() => {
    if (!selectedPosition && positions.length > 0 && positionId) {
      const position = positions.find(position => position.lpTokenId.toString() === positionId);

      if (!position) {
        router.movePageWithPoolPath("POOL", router.getPoolPath() || "");
        return;
      }

      setSelectedPosition(position);
    }
  }, [selectedPosition, positions, positionId, poolPath, selectedPosition]);

  const { connected, account, loadingConnect } = useWallet();
  const minPriceStr = useMemo(() => {
    if (!selectedPosition) return "-";
    const isEndTick = isEndTickBy(selectedPosition?.tickLower, selectedPosition?.pool.fee);
    const minPrice = tickToPriceStr(selectedPosition?.tickLower, { isEnd: isEndTick });
    if (minPrice === "0" || minPrice === "∞") return minPrice;

    return `${makeDisplayPrice(tickToPrice(selectedPosition.tickLower), selectedPosition.pool.tokenA, selectedPosition.pool.tokenB)}`;
  }, [selectedPosition]);

  const maxPriceStr = useMemo(() => {
    if (!selectedPosition) return "-";
    const isEndTick = isEndTickBy(selectedPosition?.tickUpper, selectedPosition?.pool.fee);

    const maxPrice = tickToPriceStr(selectedPosition?.tickUpper, { isEnd: isEndTick });
    if (maxPrice === "0" || maxPrice === "∞") return maxPrice;

    return `${makeDisplayPrice(tickToPrice(selectedPosition.tickUpper), selectedPosition.pool.tokenA, selectedPosition.pool.tokenB)}`;
  }, [selectedPosition]);

  const fee = poolPath?.split(":")[2];
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
    return selectedPosition?.rewards.reduce((acc, item) => acc + Number(item.apr || 0), 0);
  }, [selectedPosition]);

  const selectPool = useSelectPool({
    tokenA,
    tokenB,
    feeTier: `FEE_${fee}` as SwapFeeTierType,
    startPrice: 1,
    isCreate: true,
  });
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
  }, [selectPool.compareToken?.symbol, selectPool.depositRatio, selectPool.feeBoost, selectPool.selectedFullRange]);

  const tokenAAmountInput = useTokenAmountInput(tokenA);
  const tokenBAmountInput = useTokenAmountInput(tokenB);
  const changeTokenAAmount = useCallback(
    (amount: string) => {
      tokenAAmountInput.changeAmount(amount);
    },
    [tokenAAmountInput],
  );

  const changeTokenBAmount = useCallback(
    (amount: string) => {
      tokenBAmountInput.changeAmount(amount);
    },
    [tokenBAmountInput],
  );

  const buttonType: DeCREASE_BUTTON_TYPE = useMemo(() => {
    if (!Number(tokenAAmountInput.amount) || !Number(tokenBAmountInput.amount)) {
      return "ENTER_AMOUNT";
    }
    return "INCREASE_LIQUIDITY";
  }, [tokenAAmountInput, tokenBAmountInput]);

  const changePriceRange = useCallback((priceRange: PriceRangeMeta) => {
    setPriceRange(priceRange);
  }, []);

  const pooledTokenInfos: IPooledTokenInfo | null = useMemo(() => {
    if (!selectedPosition) {
      return null;
    }

    const tokenA = selectedPosition.pool.tokenA;
    const tokenB = selectedPosition.pool.tokenB;
    const pooledTokenAAmount = selectedPosition.tokenABalance;
    const pooledTokenBAmount = selectedPosition.tokenBBalance;
    const unClaimTokenA = selectedPosition.unclaimedFeeAAmount;
    const unClaimTokenB = selectedPosition.unclaimedFeeBAmount;

    const currentPrice = tickToPrice(selectedPosition.pool.currentTick);
    const minTick = tickToPrice(selectedPosition.tickLower);
    const maxTick = tickToPrice(selectedPosition.tickUpper);
    const liquidityAmounts = getDepositAmountsByLiquidity(currentPrice, minTick, maxTick, selectedPosition.liquidity);

    const { amountA: tokenALiquidity, amountB: tokenBLiquidity } = liquidityAmounts;

    const tokenAPrice = tokenPrices[checkGnotPath(tokenA.priceID)]?.usd || 0;
    const tokenBPrice = tokenPrices[checkGnotPath(tokenB.priceID)]?.usd || 0;

    const tokenAAmount = Number(pooledTokenAAmount) || 0;
    const tokenBAmount = Number(pooledTokenBAmount) || 0;
    const unClaimTokenAAmount = makeDisplayTokenAmount(tokenA, unClaimTokenA) || 0;
    const unClaimTokenBAmount = makeDisplayTokenAmount(tokenB, unClaimTokenB) || 0;

    return {
      poolAmountA: BigNumber(makeDisplayTokenAmount(tokenA, tokenALiquidity.toString()) || 0)
        .multipliedBy(percent)
        .dividedBy(100)
        .toString(),
      poolAmountUSDA: tokenAPrice
        ? formatOtherPrice((tokenAAmount * Number(tokenAPrice) * percent) / 100, {
            isKMB: false,
          })
        : "-",
      tokenABalance: tokenAAmount.toString(),
      tokenBBalance: tokenBAmount.toString(),
      tokenARemainingAmount: BigNumber(tokenAAmount)
        .multipliedBy(100 - percent)
        .dividedBy(100)
        .toNumber()
        .toString(),
      tokenBRemainingAmount: BigNumber(tokenBAmount)
        .multipliedBy(100 - percent)
        .dividedBy(100)
        .toNumber()
        .toString(),
      poolAmountB: BigNumber(makeDisplayTokenAmount(tokenB, tokenBLiquidity.toString()) || 0)
        .multipliedBy(percent)
        .dividedBy(100)
        .toString(),
      poolAmountUSDB: tokenBPrice
        ? formatOtherPrice((tokenBAmount * Number(tokenBPrice) * percent) / 100, {
            isKMB: false,
          })
        : "-",
      unClaimTokenAAmount: BigNumber(unClaimTokenAAmount || 0).toString(),
      unClaimTokenBAmount: BigNumber(unClaimTokenBAmount || 0).toString(),
      unClaimTokenAAmountUSD: tokenAPrice
        ? formatOtherPrice(unClaimTokenAAmount * Number(tokenAPrice), {
            isKMB: false,
          })
        : "-",
      unClaimTokenBAmountUSD: tokenBPrice
        ? formatOtherPrice(unClaimTokenBAmount * Number(tokenBPrice), {
            isKMB: false,
          })
        : "-",
      liquidity: selectedPosition.liquidity.toString(),
    };
  }, [selectedPosition, tokenPrices, percent]);

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
    fee: fee,
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
    buttonType,
    selectPool,
    priceRange,
    changePriceRange,
    setPercent,
    percent,
    pooledTokenInfos,
    refetchPositions,
  };
};
