import {
  SwapFeeTierInfoMap,
  SwapFeeTierMaxPriceRangeMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import { isNativeToken, TokenModel } from "@models/token/token-model";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import {
  feeBoostRateByPrices,
  getDepositAmountsByAmountA,
  isEndTickBy,
  priceToNearTick,
  tickToPrice,
} from "@utils/swap-utils";
import { PoolDetailRPCModel } from "@models/pool/pool-detail-rpc-model";
import {
  MAX_PRICE,
  MAX_TICK,
  MIN_PRICE,
  MIN_TICK,
} from "@constants/swap.constant";
import { EarnState } from "@states/index";
import { useAtom } from "jotai";
import { useLoading } from "@hooks/common/use-loading";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { checkGnotPath, encryptId } from "@utils/common";
import { QUERY_KEY, useGetBinsByPath, useInitializeBins } from "@query/pools";
import BigNumber from "bignumber.js";
import { PoolBinModel } from "@models/pool/pool-bin-model";
import { ZOOL_VALUES } from "@constants/graph.constant";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { PoolModel } from "@models/pool/pool-model";
import { useRouter } from "next/router";

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
  setInteractionType: (
    type: "NONE" | "INTERACTION" | "TICK_UPDATE" | "FINISH",
  ) => void;
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
  const priceRangeRef = useRef<[number | null, number | null]>([
    ...defaultPriceRange,
  ]);

  // Global state
  const [currentPoolPath, setCurrentPoolPath] = useAtom(
    EarnState.currentPoolPath,
  );
  const [, setPoolInfoQuery] = useAtom(EarnState.poolInfoQuery);

  const [fullRange, setFullRange] = useState(false);
  const [focusPosition, setFocusPosition] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(0);
  const { poolRepository } = useGnoswapContext();
  const [minPosition, setMinPosition] = useState<number | null>(null);
  const [maxPosition, setMaxPosition] = useState<number | null>(null);
  const [compareToken, setCompareToken] = useState<TokenModel | null>(tokenA);
  const [latestPoolPath, setLatestPoolPath] = useState<string | null>(null);
  const [interactionType, setInteractionType] = useState<
    "NONE" | "INTERACTION" | "TICK_UPDATE" | "FINISH"
  >("NONE");
  const [isChangeMinMax, setIsChangeMinMax] = useState<boolean>(false);
  const { isLoading } = useLoading();
  const [, setGlobalCompareToken] = useAtom(EarnState.currentCompareToken);

  const tokenAPath = useMemo(
    () => tokenA?.wrappedPath || tokenA?.path,
    [tokenA?.path, tokenA?.wrappedPath],
  );
  const tokenBPath = useMemo(
    () => tokenB?.wrappedPath || tokenB?.path,
    [tokenB?.path, tokenB?.wrappedPath],
  );

  const tokenPair = useMemo(() => {
    if (!tokenA || !tokenB) {
      return null;
    }

    return [checkGnotPath(tokenA.path), checkGnotPath(tokenB.path)].sort();
  }, [tokenA, tokenB]);

  const isReverse = useMemo(() => {
    return (
      tokenPair?.findIndex(path => {
        if (compareToken) {
          return isNativeToken(compareToken) || compareToken.path === "gnot"
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

  const queryClient = useQueryClient();

  const { data: bins } = useGetBinsByPath(
    calculatedPoolPath || "",
    ZOOL_VALUES[zoomLevel],
    {
      enabled: !!calculatedPoolPath && !isCreate,
      queryKey: [
        "useSelectPool/getBins",
        calculatedPoolPath,
        zoomLevel,
        isCreate,
      ],
    },
  );

  const { data: initializeBins } = useInitializeBins(
    feeTier,
    startPrice,
    ZOOL_VALUES[zoomLevel],
    false,
    {
      enabled: !!feeTier && !!startPrice && !!isCreate,
      queryKey: [
        QUERY_KEY.initializeBins,
        feeTier,
        startPrice,
        zoomLevel,
        false,
      ],
    },
  );

  const { data: poolInfo, isLoading: isLoadingPoolInfo } = useQuery<
    {
      chainData: PoolDetailRPCModel | null;
      dbData: PoolModel | null;
    },
    Error
  >({
    queryKey: [
      "poolInfo",
      tokenAPath,
      tokenBPath,
      feeTier,
      isCreate,
      startPrice,
    ],
    queryFn: async () => {
      if (!tokenA || !tokenB || !feeTier) {
        return await Promise.resolve<{
          chainData: PoolDetailRPCModel | null;
          dbData: PoolModel | null;
        }>({ chainData: null, dbData: null } as {
          chainData: PoolDetailRPCModel | null;
          dbData: PoolModel | null;
        });
      }

      const defaultPoolInfo: PoolDetailRPCModel = {
        poolPath: "",
        tokenAPath: "",
        tokenBPath: "",
        fee: 0,
        tokenABalance: 0n,
        tokenBBalance: 0n,
        tickSpacing: SwapFeeTierInfoMap[feeTier].tickSpacing,
        maxLiquidityPerTick: 0,
        price: 0,
        sqrtPriceX96: 0n,
        tick: 0,
        feeProtocol: 0,
        tokenAProtocolFee: 0,
        tokenBProtocolFee: 0,
        liquidity: 0n,
        ticks: [],
        tickDetails: {},
        tickBitmaps: [],
        positions: [],
      };

      if (isCreate) {
        if (!startPrice) {
          return await Promise.resolve<{
            chainData: PoolDetailRPCModel | null;
            dbData: PoolModel | null;
          }>({ chainData: null, dbData: null } as {
            chainData: PoolDetailRPCModel | null;
            dbData: PoolModel | null;
          });
        }
        const poolInfo: PoolDetailRPCModel = {
          ...defaultPoolInfo,
          price: startPrice,
        };

        return Promise.resolve<{
          chainData: PoolDetailRPCModel | null;
          dbData: PoolModel | null;
        }>({ chainData: poolInfo, dbData: null } as {
          chainData: PoolDetailRPCModel | null;
          dbData: PoolModel | null;
        });
      }

      const poolPath = `${tokenPair?.join(":")}:${
        SwapFeeTierInfoMap[feeTier].fee
      }`;

      let poolRes: PoolDetailRPCModel | null = null;

      try {
        poolRes = await poolRepository.getPoolDetailRPCByPoolPath(poolPath);
      } catch (error) {
        console.log("queryFn: ~ error:", error);
      }

      const convertPath = encryptId(poolPath);

      if (isCreate) {
        await queryClient.prefetchQuery({
          queryKey: [QUERY_KEY.poolDetail, convertPath],
          queryFn: () => poolRepository.getPoolDetailByPoolPath(poolPath),
        });
      }

      let poolResFromDb: PoolModel | null = null;

      try {
        poolResFromDb = await poolRepository.getPoolDetailByPoolPath(
          convertPath,
        );
      } catch (error) {
        console.log(" error:", error);
      }

      if (!poolRes && !poolResFromDb) {
        return Promise.resolve({ chainData: null, dbData: null });
      }

      const price = (() => {
        if (poolResFromDb?.price === undefined || poolResFromDb?.price === null)
          return 0;

        const price =
          poolResFromDb.price || tickToPrice(poolResFromDb.currentTick);

        if (!isReverse) return price;

        return 1 / price;
      })();

      const ticks = (() => {
        if (poolRes) {
          return Object.keys(poolRes.ticks).map(tick => Number(tick) * -1);
        }

        return [];
      })();

      const positions = (() => {
        if (poolRes) {
          if (isReverse) {
            return poolRes.positions.map(position => ({
              ...position,
              tickLower: position.tickUpper * -1,
              tickUpper: position.tickLower * -1,
            }));
          }

          return poolRes.positions;
        }
        return [];
      })();

      const changedPoolInfo = {
        ...defaultPoolInfo,
        ...poolRes,
        ticks,
        positions,
        price,
      };

      return Promise.resolve<{
        chainData: PoolDetailRPCModel | null;
        dbData: PoolModel | null;
      }>({
        chainData: changedPoolInfo,
        dbData: poolResFromDb,
      });
    },
    staleTime: 5_000,
    refetchInterval: () => {
      if (["/earn/pool/add", "/earn/add"].includes(router.pathname)) {
        return 10_000;
      }

      return false;
    },
  });

  useEffect(() => {
    setPoolInfoQuery({
      isLoading: isLoadingPoolInfo,
    });
  }, [isLoadingPoolInfo, setPoolInfoQuery]);

  useEffect(() => {
    priceRangeRef.current = [...defaultPriceRange];
  }, [defaultPriceRange]);

  const poolPath = useMemo(() => {
    return latestPoolPath;
  }, [latestPoolPath]);

  const swapFeeTierMaxPriceRangeMap = useMemo(() => {
    return SwapFeeTierMaxPriceRangeMap[feeTier || "NONE"];
  }, [feeTier]);

  const renderState = useCallback(
    (isIgnoreDefaultLoading = false) => {
      if (!tokenA || !tokenB || !feeTier) {
        return "NONE";
      }
      if (isCreate && startPrice === null) {
        return "CREATE";
      }
      if (isLoadingPoolInfo || (isIgnoreDefaultLoading ? isLoading : null)) {
        return "LOADING";
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
    ],
  );

  const liquidityOfTickPoints: [number, number][] = useMemo(() => {
    if (!poolInfo?.chainData || poolInfo?.chainData.ticks.length === 0) {
      return [] as [number, number][];
    }
    const result: [number, number][] = poolInfo.chainData.ticks
      .sort((t1, t2) => t1 - t2)
      .map(tick => {
        const height = poolInfo.chainData?.positions
          .filter(p => p.tickLower <= tick && p.tickUpper > tick)
          .reduce((acc, cur) => acc + cur.liquidityOfTick, 0);
        const tickPrice = tickToPrice(tick);
        return [tickPrice ?? 0, height ?? 0];
      });
    return [[0, 0], ...result];
  }, [poolInfo]);

  const price = useMemo(() => {
    if (!poolInfo?.chainData) {
      return 0;
    }
    return poolInfo.chainData?.price;
  }, [poolInfo]);

  const minPrice = useMemo(() => {
    if (fullRange) {
      return swapFeeTierMaxPriceRangeMap.minPrice;
    }
    return minPosition;
  }, [fullRange, minPosition, swapFeeTierMaxPriceRangeMap.minPrice]);

  const maxPrice = useMemo(() => {
    if (fullRange) {
      return swapFeeTierMaxPriceRangeMap.maxPrice;
    }
    return maxPosition;
  }, [fullRange, maxPosition, swapFeeTierMaxPriceRangeMap.maxPrice]);

  const depositRatio = useMemo(() => {
    if (
      !tokenA ||
      !tokenB ||
      minPrice === null ||
      maxPrice === null ||
      !compareToken
    ) {
      return null;
    }

    const ordered =
      checkGnotPath(compareToken.path) === checkGnotPath(tokenA.path);
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

    const currentMinPrice = fullRange
      ? swapFeeTierMaxPriceRangeMap.minPrice
      : minPrice;
    const currentMaxPrice = fullRange
      ? swapFeeTierMaxPriceRangeMap.maxPrice
      : maxPrice;

    const adjustAmountA = 1_000_000_000n;

    const decimals = tokenB.decimals - tokenA.decimals;
    const { amountA, amountB } = getDepositAmountsByAmountA(
      BigNumber(currentPrice).shiftedBy(decimals).toNumber(),
      BigNumber(currentMinPrice).shiftedBy(decimals).toNumber(),
      BigNumber(currentMaxPrice).shiftedBy(decimals).toNumber(),
      adjustAmountA,
    );

    const tokenAAmount = makeDisplayTokenAmount(tokenA, amountA) || 0;
    const tokenBAmount = makeDisplayTokenAmount(tokenB, amountB) || 0;

    const sumOfAmounts = tokenAAmount + tokenBAmount;
    return BigNumber(tokenAAmount.toString())
      .dividedBy(sumOfAmounts.toString())
      .multipliedBy(100)
      .toNumber();
  }, [
    tokenA,
    tokenB,
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
  }, [maxPrice, minPrice, feeTier]);

  const estimatedAPR = useMemo(() => {
    return Number(poolInfo?.dbData?.feeApr || 0) * Number(feeBoost ?? 0);
  }, [feeBoost, poolInfo?.dbData?.feeApr]);

  const tickSpacing = useMemo(
    () => poolInfo?.chainData?.tickSpacing || 1,
    [poolInfo?.chainData?.tickSpacing],
  );

  function excuteInteraction(callback: () => void) {
    if (interactionType === "INTERACTION") {
      return;
    }
    setInteractionType("INTERACTION");
    new Promise(resolve => resolve(callback())).then(() =>
      setInteractionType("FINISH"),
    );
  }

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
      if (!poolInfo || !minPosition) {
        return;
      }
      const tickSpacing = poolInfo.chainData?.tickSpacing ?? 0;
      const nearTick = priceToNearTick(minPosition, tickSpacing ?? 0);
      if (nearTick < MAX_TICK - tickSpacing) {
        changeMinPosition(tickToPrice(nearTick + tickSpacing));
      }
    });
  }, [poolInfo, minPosition, interactionType]);

  const decreaseMinTick = useCallback(() => {
    excuteInteraction(() => {
      if (!poolInfo || !minPosition) {
        return;
      }
      if (minPosition === 0) {
        return;
      }
      setInteractionType("INTERACTION");
      const tickSpacing = poolInfo?.chainData?.tickSpacing ?? 0;
      const nearTick = priceToNearTick(minPosition, tickSpacing);
      if (nearTick > MIN_TICK + tickSpacing) {
        changeMinPosition(tickToPrice(nearTick - tickSpacing));
      }
    });
  }, [minPosition, poolInfo, interactionType]);

  const increaseMaxTick = useCallback(() => {
    excuteInteraction(() => {
      if (!poolInfo || !maxPosition) {
        return;
      }
      const tickSpacing = poolInfo.chainData?.tickSpacing ?? 0;
      const nearTick = priceToNearTick(maxPosition, tickSpacing);
      if (nearTick < MAX_TICK - tickSpacing) {
        changeMaxPosition(tickToPrice(nearTick + tickSpacing));
      }
    });
  }, [interactionType, poolInfo, maxPosition]);

  const decreaseMaxTick = useCallback(() => {
    excuteInteraction(() => {
      if (!poolInfo?.chainData?.tickSpacing || !maxPosition) {
        return;
      }
      const tickSpacing = poolInfo.chainData.tickSpacing;
      const nearTick = priceToNearTick(maxPosition, tickSpacing);
      if (nearTick > MIN_TICK + tickSpacing) {
        changeMaxPosition(tickToPrice(nearTick - tickSpacing));
      }
    });
  }, [maxPosition, poolInfo, interactionType]);

  const resetRange = useCallback(() => {
    const [defaultMinPosition, defaultMaxPosition] = priceRangeRef.current;

    excuteInteraction(() => {
      setZoomLevel(0);
      setFullRange(false);
      changeMinPosition(defaultMinPosition);
      changeMaxPosition(defaultMaxPosition);
    });
  }, [interactionType]);

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
    if (interactionType === "TICK_UPDATE") {
      if (minPosition === null || maxPosition === null) {
        return;
      }
      const minNearTick = priceToNearTick(minPosition, tickSpacing);
      const maxNearTick = priceToNearTick(maxPosition, tickSpacing);
      setMaxPosition(tickToPrice(minNearTick));
      setMaxPosition(tickToPrice(maxNearTick));
      setInteractionType("FINISH");
    }
  }, [interactionType]);

  useEffect(() => {
    if (isCreate && startPrice === null) {
      setLatestPoolPath(null);
    }
    if (poolInfo?.chainData) {
      setLatestPoolPath(poolInfo.chainData?.poolPath ?? "");
    }
  }, [isCreate, poolInfo, startPrice]);

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
  }, [latestPoolPath]);

  return {
    startPrice,
    bins: isCreate ? initializeBins : bins,
    poolPath,
    renderState,
    feeTier,
    tickSpacing,
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
    poolInfo,
  };
};
