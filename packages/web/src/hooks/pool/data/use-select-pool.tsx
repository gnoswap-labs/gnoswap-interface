import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { GNOT_TOKEN } from "@common/values/token-constant";
import { ZOOL_VALUES } from "@constants/graph.constant";
import { SwapFeeTierInfoMap, SwapFeeTierMaxPriceRangeMap, SwapFeeTierType } from "@constants/option.constant";
import { MAX_PRICE, MAX_TICK, MIN_PRICE, MIN_TICK } from "@constants/swap.constant";
import { useLoading } from "@hooks/common/use-loading";
import { PoolBinModel } from "@models/pool/pool-bin-model";
import { isNativeToken, TokenModel } from "@models/token/token-model";
import {
  useGetBinsByPath,
  useGetPoolFromDb,
  useGetPoolLiquidity,
  useGetPoolSqrtPriceX96,
  useGetPoolTicks,
  useGetPoolTickSpacing,
  useInitializeBins,
} from "@query/pools";
import { EarnState } from "@states/index";
import { checkGnotPath, encryptId } from "@utils/common";
import { sortTokenPaths } from "@utils/sort-utils";
import {
  feeBoostRateByPrices,
  getDepositAmountsByAmountA,
  isEndTickBy,
  priceToNearTick,
  priceToSqrtX96,
  tickToPrice,
} from "@utils/swap-utils";
import { makeDisplayTokenAmount } from "@utils/token-utils";

type RenderState = "NONE" | "CREATE" | "LOADING" | "DONE";

interface Props {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  feeTier: SwapFeeTierType | null;
  isCreate?: boolean;
  startPrice?: number | null;
  defaultPriceRange?: [number | null, number | null];
  options?: {
    tickLower: number;
    tickUpper: number;
  } | null;
}

export interface SelectPool {
  bins: PoolBinModel[] | undefined;
  poolPath: string | null;
  isCreate: boolean;
  renderState: (isIgnoreDefaultLoading?: boolean) => RenderState;
  startPrice: number | null;
  feeTier: SwapFeeTierType | null;
  tickSpacing: number;
  minPosition: number | null;
  setMinPosition: (position: number | null) => void;
  maxPosition: number | null;
  setMaxPosition: (position: number | null) => void;
  compareToken: TokenModel | null;
  setCompareToken: (token: TokenModel | null) => void;
  currentPrice: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  depositRatio: number | null;
  feeBoost: string | null;
  estimatedAPR: number | null;
  increaseMinTick: () => void;
  decreaseMinTick: () => void;
  increaseMaxTick: () => void;
  decreaseMaxTick: () => void;
  selectedFullRange: boolean;
  setFullRange: (fullRange: boolean) => void;
  selectFullRange: () => void;
  resetRange: () => void;
  focusPosition: number;
  setFocusPosition: (position: number) => void;
  zoomLevel: number;
  zoomIn: () => void;
  zoomOut: () => void;
  liquidityOfTickPoints: [number, number][];
  setInteractionType: (type: "NONE" | "INTERACTION" | "TICK_UPDATE" | "FINISH") => void;
  isChangeMinMax: boolean;
  setIsChangeMinMax: (value: boolean) => void;
  isLoading: boolean;
}

export const useSelectPool = ({
  tokenA,
  tokenB,
  feeTier,
  isCreate = false,
  startPrice = null,
  defaultPriceRange = [null, null],
  options,
}: Props) => {
  const router = useRouter();
  const priceRangeRef = useRef<[number | null, number | null]>([...defaultPriceRange]);

  // Global state
  const [currentPoolPath, setCurrentPoolPath] = useAtom(EarnState.currentPoolPath);
  const [, setPoolInfoQuery] = useAtom(EarnState.poolInfoQuery);
  const [, setGlobalCompareToken] = useAtom(EarnState.currentCompareToken);

  // Local state
  const [fullRange, setFullRange] = useState(false);
  const [focusPosition, setFocusPosition] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(0);
  const [minPosition, setMinPosition] = useState<number | null>(null);
  const [maxPosition, setMaxPosition] = useState<number | null>(null);
  const [compareToken, setCompareToken] = useState<TokenModel | null>(tokenA);
  const [latestPoolPath, setLatestPoolPath] = useState<string | null>(null);
  const [interactionType, setInteractionType] = useState<"NONE" | "INTERACTION" | "TICK_UPDATE" | "FINISH">("NONE");
  const [isChangeMinMax, setIsChangeMinMax] = useState<boolean>(false);

  const { isLoading } = useLoading();

  const tokenPair = useMemo(() => {
    if (!tokenA || !tokenB) return null;
    return [checkGnotPath(tokenA.path), checkGnotPath(tokenB.path)].sort(sortTokenPaths);
  }, [tokenA, tokenB]);

  const isReverse = useMemo(() => {
    return (
      tokenPair?.findIndex(path => {
        if (compareToken) {
          return isNativeToken(compareToken) || compareToken.path === GNOT_TOKEN.path
            ? compareToken.wrappedPath === path
            : compareToken.path === path;
        }
        return false;
      }) === 1
    );
  }, [compareToken, tokenPair]);

  const calculatedPoolPath = useMemo(() => {
    if (!tokenPair || !feeTier) {
      return null;
    }

    return [...tokenPair, SwapFeeTierInfoMap[feeTier].fee].join(":");
  }, [tokenPair, feeTier]);

  const convertPath = useMemo(() => (calculatedPoolPath ? encryptId(calculatedPoolPath) : null), [calculatedPoolPath]);

  const swapFeeTierMaxPriceRangeMap = useMemo(() => {
    return SwapFeeTierMaxPriceRangeMap[feeTier || "NONE"];
  }, [feeTier]);

  const shouldRefetch = ["/earn/pool/add", "/earn/add"].includes(router.pathname);

  const { data: bins } = useGetBinsByPath(calculatedPoolPath || "", ZOOL_VALUES[zoomLevel], {
    enabled: !!calculatedPoolPath && !isCreate,
    queryKey: ["useSelectPool/getBins", calculatedPoolPath, zoomLevel, isCreate],
  });

  const { data: initializeBins, isLoading: isLoadingInitializeBins } = useInitializeBins(
    feeTier,
    startPrice,
    ZOOL_VALUES[zoomLevel],
    isReverse,
    {
      enabled: !!feeTier && !!startPrice && !!isCreate,
      queryKey: ["useSelectPool/initializeBins", feeTier, startPrice, zoomLevel, isReverse, isCreate],
    },
  );

  const { data: poolFromDb, isLoading: isLoadingPoolFromDb } = useGetPoolFromDb(convertPath, {
    enabled: !!convertPath && !isCreate,
    refetchInterval: shouldRefetch ? 10_000 : false,
  });

  const { data: liquidity, isLoading: isLoadingLiquidity } = useGetPoolLiquidity(calculatedPoolPath, {
    enabled: !!calculatedPoolPath && !isCreate,
    refetchInterval: shouldRefetch ? 10_000 : false,
  });

  const { data: ticks, isLoading: isLoadingTicks } = useGetPoolTicks(calculatedPoolPath, {
    enabled: !!calculatedPoolPath && !isCreate,
    isReverse,
  });

  const { data: tickSpacing, isLoading: isLoadingTickSpacing } = useGetPoolTickSpacing(calculatedPoolPath, {
    enabled: !!calculatedPoolPath,
    fallbackFeeTier: feeTier,
  });

  const { data: sqrtPriceX96, isLoading: isLoadingSqrtPriceX96 } = useGetPoolSqrtPriceX96(calculatedPoolPath, {
    enabled: !!calculatedPoolPath && !isCreate,
    refetchInterval: shouldRefetch ? 10_000 : false,
  });

  const isLoadingPoolInfo =
    isLoadingPoolFromDb || isLoadingLiquidity || isLoadingTicks || isLoadingTickSpacing || isLoadingSqrtPriceX96;

  const price = useMemo(() => {
    if (isCreate) return startPrice || 0;
    if (poolFromDb?.price == null) return 0;
    const basePrice = poolFromDb.price || tickToPrice(poolFromDb.currentTick);
    return isReverse ? 1 / basePrice : basePrice;
  }, [isCreate, startPrice, poolFromDb, isReverse]);

  const liquidityOfTickPoints: [number, number][] = useMemo(() => {
    if (!ticks || ticks.length === 0) return [];

    const result: [number, number][] = ticks
      .sort((t1, t2) => t1 - t2)
      .map(tick => {
        const height = 0;
        const tickPrice = tickToPrice(tick);
        return [tickPrice ?? 0, height ?? 0];
      });

    return [[0, 0], ...result];
  }, [ticks]);

  const poolPath = useMemo(() => {
    return latestPoolPath;
  }, [latestPoolPath]);

  const renderState = useCallback(
    (isIgnoreDefaultLoading = false) => {
      if (!tokenA || !tokenB || !feeTier) return "NONE";

      if (isCreate) {
        if (startPrice === null) {
          return "CREATE";
        }

        if (isLoadingInitializeBins || initializeBins === undefined) {
          return "LOADING";
        }
      } else {
        if (isLoadingPoolInfo || (isIgnoreDefaultLoading ? isLoading : null)) {
          return "LOADING";
        }
      }

      return "DONE";
    },
    [
      feeTier,
      isCreate,
      startPrice,
      tokenA,
      tokenB,
      isLoading,
      isLoadingPoolInfo,
      isLoadingInitializeBins,
      initializeBins,
    ],
  );

  const minPrice = useMemo(() => {
    if (fullRange) {
      return swapFeeTierMaxPriceRangeMap?.minPrice;
    }
    return minPosition;
  }, [fullRange, minPosition, swapFeeTierMaxPriceRangeMap?.minPrice]);

  const maxPrice = useMemo(() => {
    if (fullRange) {
      return swapFeeTierMaxPriceRangeMap?.maxPrice;
    }
    return maxPosition;
  }, [fullRange, maxPosition, swapFeeTierMaxPriceRangeMap?.maxPrice]);

  const depositRatio = useMemo(() => {
    if (!tokenA || !tokenB || minPrice === null || maxPrice === null || !compareToken) {
      return null;
    }

    const ordered = checkGnotPath(compareToken.path) === checkGnotPath(tokenA.path);
    const currentPrice = isCreate ? startPrice : ordered ? price : 1 / price;
    if (!currentPrice) {
      return null;
    }

    if (maxPrice < currentPrice) {
      return 0;
    }

    if (minPrice > currentPrice) {
      return 100;
    }

    const currentMinPrice = fullRange ? swapFeeTierMaxPriceRangeMap.minPrice : minPrice;
    const currentMaxPrice = fullRange ? swapFeeTierMaxPriceRangeMap.maxPrice : maxPrice;

    const adjustAmountA = 1_000_000_000n;

    const decimals = tokenB.decimals - tokenA.decimals;
    const currentSqrtPriceX96 = isCreate ? priceToSqrtX96(currentPrice) : sqrtPriceX96;
    if (!currentSqrtPriceX96) {
      return null;
    }

    const { amountA, amountB } = getDepositAmountsByAmountA(
      BigNumber(currentPrice).shiftedBy(decimals).toNumber(),
      currentSqrtPriceX96,
      BigNumber(currentMinPrice).shiftedBy(decimals).toNumber(),
      BigNumber(currentMaxPrice).shiftedBy(decimals).toNumber(),
      adjustAmountA,
    );

    const tokenAAmount = makeDisplayTokenAmount(tokenA, amountA) || 0;
    const tokenBAmount = makeDisplayTokenAmount(tokenB, amountB) || 0;
    const sumOfAmounts = tokenAAmount + tokenBAmount;
    if (sumOfAmounts === 0) return null;
    return BigNumber(tokenAAmount.toString()).dividedBy(sumOfAmounts.toString()).multipliedBy(100).toNumber();
  }, [
    sqrtPriceX96,
    tokenA,
    tokenB,
    compareToken,
    minPrice,
    maxPrice,
    swapFeeTierMaxPriceRangeMap,
    isCreate,
    startPrice,
    price,
    fullRange,
  ]);

  const feeBoost = useMemo(() => {
    if (minPrice === null || maxPrice === null) {
      return null;
    }
    if (minPrice <= 0) {
      const minPriceLimit = swapFeeTierMaxPriceRangeMap.minPrice;
      return feeBoostRateByPrices(minPriceLimit, maxPrice);
    }
    return feeBoostRateByPrices(minPrice, maxPrice);
  }, [maxPrice, minPrice, swapFeeTierMaxPriceRangeMap]);

  const estimatedAPR = useMemo(() => {
    return Number(poolFromDb?.feeApr || 0) * Number(feeBoost ?? 0);
  }, [feeBoost, poolFromDb?.feeApr]);

  const interactionTypeRef = useRef(interactionType);
  interactionTypeRef.current = interactionType;

  const excuteInteraction = useCallback((callback: () => void) => {
    if (interactionTypeRef.current === "INTERACTION") {
      return;
    }
    setInteractionType("INTERACTION");
    new Promise(resolve => resolve(callback()))
      .catch(() => {})
      .finally(() => setInteractionType("FINISH"));
  }, []);

  const changeMinPosition = useCallback(
    (num: number | null) => {
      if (num === null) {
        setMinPosition(null);
        return;
      }
      if (num === 0) {
        const { minPrice } = swapFeeTierMaxPriceRangeMap;
        setMinPosition(minPrice);
        return;
      }
      setMinPosition(num);
    },
    [swapFeeTierMaxPriceRangeMap],
  );

  const changeMaxPosition = useCallback((num: number | null) => {
    if (num === null) {
      setMaxPosition(null);
      return;
    }
    setMaxPosition(num);
  }, []);

  const increaseMinTick = useCallback(() => {
    excuteInteraction(() => {
      if (!tickSpacing || !minPosition) {
        return;
      }
      const nearTick = priceToNearTick(minPosition, tickSpacing);
      if (nearTick < MAX_TICK - tickSpacing) {
        changeMinPosition(tickToPrice(nearTick + tickSpacing));
      }
    });
  }, [tickSpacing, minPosition, excuteInteraction, changeMinPosition]);

  const decreaseMinTick = useCallback(() => {
    excuteInteraction(() => {
      if (!tickSpacing || !minPosition) {
        return;
      }
      if (minPosition === 0) {
        return;
      }
      const nearTick = priceToNearTick(minPosition, tickSpacing);
      if (nearTick > MIN_TICK + tickSpacing) {
        changeMinPosition(tickToPrice(nearTick - tickSpacing));
      }
    });
  }, [minPosition, tickSpacing, excuteInteraction, changeMinPosition]);

  const increaseMaxTick = useCallback(() => {
    excuteInteraction(() => {
      if (!tickSpacing || !maxPosition) {
        return;
      }
      const nearTick = priceToNearTick(maxPosition, tickSpacing);
      if (nearTick < MAX_TICK - tickSpacing) {
        changeMaxPosition(tickToPrice(nearTick + tickSpacing));
      }
    });
  }, [excuteInteraction, changeMaxPosition, tickSpacing, maxPosition]);

  const decreaseMaxTick = useCallback(() => {
    excuteInteraction(() => {
      if (!tickSpacing || !maxPosition) {
        return;
      }
      const nearTick = priceToNearTick(maxPosition, tickSpacing);
      if (nearTick > MIN_TICK + tickSpacing) {
        changeMaxPosition(tickToPrice(nearTick - tickSpacing));
      }
    });
  }, [maxPosition, tickSpacing, excuteInteraction, changeMaxPosition]);

  const resetRange = useCallback(() => {
    const [defaultMinPosition, defaultMaxPosition] = priceRangeRef.current;

    excuteInteraction(() => {
      setZoomLevel(0);
      setFullRange(false);
      changeMinPosition(defaultMinPosition);
      changeMaxPosition(defaultMaxPosition);
    });
  }, [excuteInteraction, changeMinPosition, changeMaxPosition]);

  const zoomIn = useCallback(() => {
    if (zoomLevel + 1 < ZOOL_VALUES.length) {
      setZoomLevel(zoomLevel + 1);
    }
  }, [zoomLevel]);

  const zoomOut = useCallback(() => {
    if (zoomLevel > 0) {
      setZoomLevel(zoomLevel - 1);
    }
  }, [zoomLevel]);

  const selectFullRange = useCallback(() => {
    const maxPriceRange = swapFeeTierMaxPriceRangeMap;
    setZoomLevel(0);
    setMinPosition(maxPriceRange.minPrice);
    setMaxPosition(maxPriceRange.maxPrice);
    setFullRange(true);
  }, [swapFeeTierMaxPriceRangeMap]);

  useEffect(() => {
    setPoolInfoQuery({
      isLoading: isLoadingPoolInfo,
    });
  }, [isLoadingPoolInfo, setPoolInfoQuery]);

  useEffect(() => {
    priceRangeRef.current = [...defaultPriceRange];
  }, [defaultPriceRange]);

  useEffect(() => {
    if (interactionType === "TICK_UPDATE") {
      if (minPosition === null || maxPosition === null || !tickSpacing) {
        return;
      }
      const minNearTick = priceToNearTick(minPosition, tickSpacing);
      const maxNearTick = priceToNearTick(maxPosition, tickSpacing);
      setMinPosition(tickToPrice(minNearTick));
      setMaxPosition(tickToPrice(maxNearTick));
      setInteractionType("FINISH");
    }
  }, [interactionType, minPosition, maxPosition, tickSpacing]);

  useEffect(() => {
    if (isCreate && startPrice === null) {
      setLatestPoolPath(null);
    } else if (calculatedPoolPath) {
      setLatestPoolPath(calculatedPoolPath);
    }
  }, [isCreate, calculatedPoolPath, startPrice]);

  useEffect(() => {
    if (!options || !feeTier) {
      return;
    }
    const feeStr = `${SwapFeeTierInfoMap[feeTier].fee}`;
    const isEndMinTick = isEndTickBy(options.tickLower, feeStr);
    const isEndMaxTick = isEndTickBy(options.tickUpper, feeStr);
    setMinPosition(isEndMinTick ? MIN_PRICE : tickToPrice(options.tickLower));
    setMaxPosition(isEndMaxTick ? MAX_PRICE : tickToPrice(options.tickUpper));

    if (isEndMinTick && isEndMaxTick) {
      setFullRange(true);
    }
  }, [options, feeTier]);

  useEffect(() => {
    setCurrentPoolPath(latestPoolPath);
  }, [latestPoolPath, setCurrentPoolPath]);

  return {
    startPrice,
    bins: isCreate ? initializeBins : bins,
    poolPath,
    renderState,
    feeTier,
    tickSpacing: tickSpacing ?? 1,
    minPosition,
    setMinPosition: changeMinPosition,
    maxPosition,
    setMaxPosition: changeMaxPosition,
    compareToken,
    setCompareToken: (token: TokenModel | null) => {
      setCompareToken(token);
      setGlobalCompareToken(token);
    },
    currentPrice: price,
    minPrice,
    maxPrice,
    depositRatio,
    feeBoost,
    estimatedAPR,
    increaseMinTick,
    decreaseMinTick,
    increaseMaxTick,
    decreaseMaxTick,
    selectedFullRange: fullRange,
    setFullRange,
    selectFullRange,
    resetRange,
    focusPosition,
    setFocusPosition,
    zoomLevel,
    zoomIn,
    zoomOut,
    liquidityOfTickPoints,
    isCreate,
    setInteractionType,
    isChangeMinMax,
    setIsChangeMinMax,
    isLoading: isLoading || isLoadingPoolInfo,
    currentPoolPath,
    poolFromDb,
    liquidity,
    ticks,
    sqrtPriceX96,
  };
};
