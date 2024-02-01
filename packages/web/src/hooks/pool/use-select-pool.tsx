import { SwapFeeTierInfoMap, SwapFeeTierMaxPriceRangeMap, SwapFeeTierType } from "@constants/option.constant";
import { isNativeToken, TokenModel } from "@models/token/token-model";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { feeBoostRateByPrices, priceToNearTick, tickToPrice } from "@utils/swap-utils";
import { PoolDetailRPCModel } from "@models/pool/pool-detail-rpc-model";
import { MAX_TICK, MIN_TICK } from "@constants/swap.constant";
import { EarnState } from "@states/index";
import { useAtom } from "jotai";
import { useLoading } from "@hooks/common/use-loading";

type RenderState = "NONE" | "CREATE" | "LOADING" | "DONE";

interface Props {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  feeTier: SwapFeeTierType | null;
  isCreate?: boolean;
  startPrice?: number | null,
}

export interface SelectPool {
  poolPath: string | null;
  isCreate: boolean;
  renderState: RenderState;
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
}


export const useSelectPool = ({
  tokenA,
  tokenB,
  feeTier,
  isCreate = false,
  startPrice = null,
}: Props) => {
  const [, setCurrentPoolPath] = useAtom(EarnState.currentPoolPath);
  const [fullRange, setFullRange] = useState(false);
  const [focusPosition, setFocusPosition] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(9);
  const { poolRepository } = useGnoswapContext();
  const [minPosition, setMinPosition] = useState<number | null>(null);
  const [maxPosition, setMaxPosition] = useState<number | null>(null);
  const [compareToken, setCompareToken] = useState<TokenModel | null>(tokenA);
  const [poolInfo, setPoolInfo] = useState<PoolDetailRPCModel | null>(null);
  const [latestPoolPath, setLatestPoolPath] = useState<string | null>(null);
  const [interactionType, setInteractionType] = useState<"NONE" | "INTERACTION" | "TICK_UPDATE" | "FINISH">("NONE");
  const [isChangeMinMax, setIsChangeMinMax] = useState<boolean>(false);
  const { isLoadingCommon } = useLoading();

  const poolPath = useMemo(() => {
    setCurrentPoolPath(latestPoolPath);
    return latestPoolPath;
  }, [latestPoolPath, setCurrentPoolPath]);

  const renderState: RenderState = useMemo(() => {
    if (!tokenA || !tokenB || !feeTier) {
      return "NONE";
    }
    if (isCreate && startPrice === null) {
      return "CREATE";
    }
    if (!poolInfo || isLoadingCommon) {
      return "LOADING";
    }
    return "DONE";
  }, [feeTier, isCreate, poolInfo, startPrice, tokenA, tokenB, isLoadingCommon]);

  const liquidityOfTickPoints: [number, number][] = useMemo(() => {
    if (!poolInfo || poolInfo.ticks.length === 0) {
      return [] as [number, number][];
    }
    const result: [number, number][] = poolInfo.ticks.sort((t1, t2) => t1 - t2)
      .map(tick => {
        const height = poolInfo.positions
          .filter(p => p.tickLower <= tick && p.tickUpper > tick)
          .reduce((acc, cur) => acc + cur.liquidityOfTick, 0);
        const tickPrice = tickToPrice(tick);
        return [tickPrice, height];
      });
    return [[0, 0], ...result];
  }, [poolInfo]);

  const price = useMemo(() => {
    if (!poolInfo) {
      return 0;
    }
    return poolInfo.price;
  }, [poolInfo]);

  const minPrice = useMemo(() => {
    return minPosition;
  }, [minPosition]);

  const maxPrice = useMemo(() => {
    if (fullRange) {
      return tickToPrice(MAX_TICK);
    }
    return maxPosition;
  }, [fullRange, maxPosition]);

  const depositRatio = useMemo(() => {
    if (minPrice === null || maxPrice === null) {
      return null;
    }
    const currentPrice = isCreate ? startPrice : price;
    if (currentPrice === undefined || currentPrice === null) {
      return null;
    }

    if (fullRange) {
      return 50;
    }

    const minPriceGap = currentPrice - minPrice;
    const maxPriceGap = maxPrice - currentPrice;

    if (maxPriceGap < 0) {
      return 0;
    }
    if (minPriceGap < 0) {
      return 100;
    }

    const logMin = minPrice <= 0 ?
      Math.log(currentPrice / Number(0.0000000001)) :
      Math.log(currentPrice / minPrice);
    const logMax = Math.log(maxPrice / currentPrice);
    return logMax * 100 / (logMin + logMax);
  }, [maxPrice, minPrice, price, fullRange, startPrice, isCreate]);

  const feeBoost = useMemo(() => {
    if (minPrice === null || maxPrice === null) {
      return null;
    }
    if (minPrice <= 0) {
      const minPriceLimit = SwapFeeTierMaxPriceRangeMap[feeTier || "NONE"].minPrice;
      return feeBoostRateByPrices(minPriceLimit, maxPrice);
    }
    return feeBoostRateByPrices(minPrice, maxPrice);
  }, [startPrice, maxPrice, minPrice, feeTier]);

  const estimatedAPR = useMemo(() => {
    return null;
  }, []);

  const tickSpacing = useMemo(() => poolInfo?.tickSpacing || 2, [poolInfo?.tickSpacing]);

  function excuteInteraction(callback: () => void) {
    if (interactionType === "INTERACTION") {
      return;
    }
    setInteractionType("INTERACTION");
    new Promise(resolve => resolve(callback()))
      .then(() => setInteractionType("FINISH"));
  }

  const changeMinPosition = useCallback((num: number | null) => {
    if (num === null) {
      setMinPosition(null);
      return;
    }
    if (num === 0) {
      const { minPrice } = SwapFeeTierMaxPriceRangeMap[feeTier || "NONE"];
      setMinPosition(minPrice);
    }
    setMinPosition(num);
  }, []);

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
      const tickSpacing = poolInfo.tickSpacing;
      const nearTick = priceToNearTick(minPosition, tickSpacing);
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
      const tickSpacing = poolInfo.tickSpacing;
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
      const tickSpacing = poolInfo.tickSpacing;
      const nearTick = priceToNearTick(maxPosition, tickSpacing);
      if (nearTick < MAX_TICK - tickSpacing) {
        changeMaxPosition(tickToPrice(nearTick + tickSpacing));
      }
    });
  }, [interactionType, poolInfo, maxPosition]);

  const decreaseMaxTick = useCallback(() => {
    excuteInteraction(() => {
      if (!poolInfo || !maxPosition) {
        return;
      }
      const tickSpacing = poolInfo.tickSpacing;
      const nearTick = priceToNearTick(maxPosition, tickSpacing);
      if (nearTick > MIN_TICK + tickSpacing) {
        changeMaxPosition(tickToPrice(nearTick - tickSpacing));
      }
    });
  }, [maxPosition, poolInfo, interactionType]);

  const resetRange = useCallback(() => {
    excuteInteraction(() => {
      setZoomLevel(9);
      setFullRange(false);
      changeMinPosition(null);
      changeMaxPosition(null);
    });
  }, [interactionType]);

  const zoomIn = useCallback(() => {
    if (zoomLevel > 1) {
      setZoomLevel(zoomLevel - 1);
    }
  }, [zoomLevel]);

  const zoomOut = useCallback(() => {
    if (zoomLevel < 20) {
      setZoomLevel(zoomLevel + 1);
    }
  }, [zoomLevel]);

  const selectFullRange = useCallback(() => {
    const maxPriceRange = SwapFeeTierMaxPriceRangeMap[feeTier || "NONE"];
    setZoomLevel(9);
    setMinPosition(maxPriceRange.minPrice);
    setMaxPosition(maxPriceRange.maxPrice);
    setFullRange(true);
  }, [feeTier]);

  useEffect(() => {
    if (!tokenA || !tokenB || !feeTier) {
      return;
    }
    setPoolInfo(null);

    if (isCreate) {
      if (!startPrice) {
        setPoolInfo(null);
        return;
      }
      const poolInfo: PoolDetailRPCModel = {
        poolPath: "",
        tokenAPath: "",
        tokenBPath: "",
        fee: 0,
        tokenABalance: 0n,
        tokenBBalance: 0n,
        tickSpacing: SwapFeeTierInfoMap[feeTier].tickSpacing,
        maxLiquidityPerTick: 0,
        price: startPrice,
        sqrtPriceX96: 0n,
        tick: 0,
        feeProtocol: 0,
        tokenAProtocolFee: 0,
        tokenBProtocolFee: 0,
        liquidity: 0n,
        ticks: [],
        tickBitmaps: [],
        positions: []
      };
      setPoolInfo(poolInfo);
      return;
    }

    const tokenAPoolPath = tokenA.wrappedPath || tokenA.path;
    const tokenBPoolPath = tokenB.wrappedPath || tokenB.path;
    const tokenPair = [tokenAPoolPath, tokenBPoolPath].sort();
    const poolPath = `${tokenPair.join(":")}:${SwapFeeTierInfoMap[feeTier].fee}`;
    const reverse = tokenPair.findIndex(path => {
      if (compareToken) {
        return isNativeToken(compareToken) ?
          compareToken.wrappedPath === path :
          compareToken.path === path;
      }
      return false;
    }) === 1;
    poolRepository.getPoolDetailRPCByPoolPath(poolPath).then(poolInfo => {
      const changedPoolInfo = reverse === false ? poolInfo : {
        ...poolInfo,
        price: 1 / poolInfo.price,
        ticks: poolInfo.ticks.map(tick => tick * -1),
        positions: poolInfo.positions.map(position => ({
          ...position,
          tickLower: position.tickUpper * -1,
          tickUpper: position.tickLower * -1,
        }))
      };
      setPoolInfo(changedPoolInfo);
    }).catch(() => setPoolInfo(null));
  }, [feeTier, tokenA, tokenB, compareToken, isCreate, startPrice, poolRepository]);

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
    if (poolInfo) {
      setLatestPoolPath(poolInfo.poolPath);
    }
  }, [isCreate, poolInfo, startPrice]);

  return {
    startPrice,
    poolPath,
    renderState,
    feeTier,
    tickSpacing,
    minPosition,
    setMinPosition: changeMinPosition,
    maxPosition,
    setMaxPosition: changeMaxPosition,
    compareToken,
    setCompareToken,
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
  };
};