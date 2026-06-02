import React, { useMemo } from "react";

import {
  LIQUIDITY_GRAPH_BIN_COUNT,
  LIQUIDITY_GRAPH_INITIAL_ZOOM_LEVEL,
  LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES,
} from "@constants/graph.constant";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useWindowSize } from "@hooks/common/use-window-size";
import { usePoolLiquiditySegmentsByPath } from "@hooks/pool/data/use-pool-liquidity-segments-by-path";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useGetPoolDetailByPath, useGetPoolSqrtPriceX96 } from "@query/pools";
import { PoolConverter } from "@services/converters/pool";
import { makeSwapFeeTier } from "@utils/swap-utils";

import { TOKEN_PRICE_GRADE_TYPE } from "@models/token/token-price-grade";
import { checkGnotPath } from "@utils/common";
import PoolPairInformation from "../../components/pool-pair-information/PoolPairInformation";

interface PoolPairInformationContainerProps {
  address?: string | undefined;
}

const PoolPairInformationContainer: React.FC<PoolPairInformationContainerProps> = ({ address }) => {
  const [zoomLevel, setZoomLevel] = React.useState<number>(LIQUIDITY_GRAPH_INITIAL_ZOOM_LEVEL);
  const router = useCustomRouter();
  const { getGnotPath } = useGnotToGnot();
  const poolPath = router.getPoolPath();
  const { isMobile } = useWindowSize();
  const { data, isLoading: loading } = useGetPoolDetailByPath(poolPath as string, {
    enabled: !!poolPath,
  });
  const { data: currentSqrtPriceX96, isLoading: isLoadingSqrtPriceX96 } = useGetPoolSqrtPriceX96(poolPath as string, {
    enabled: !!poolPath,
  });
  const { loading: loadingPosition } = usePositionData({
    address,
    poolPath,
    withClosed: false,
    queryOption: {
      enabled: !!poolPath,
    },
  });

  const { tokenPrices } = useTokenData();
  const visibleTickRange = React.useMemo(() => LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES[zoomLevel], [zoomLevel]);

  const onClickPath = (path: string) => {
    router.push(path);
  };

  const convertedPool = useMemo(() => {
    return PoolConverter.convertPoolModel(data);
  }, [data]);

  const pool = useMemo(() => {
    const tokenAPriceGrade =
      tokenPrices[checkGnotPath(convertedPool.tokenA.path || "")]?.priceGradeType || TOKEN_PRICE_GRADE_TYPE.NONE;
    const tokenBPriceGrade =
      tokenPrices[checkGnotPath(convertedPool.tokenB.path || "")]?.priceGradeType || TOKEN_PRICE_GRADE_TYPE.NONE;

    const tokenA = convertedPool.tokenA;
    const tokenB = convertedPool.tokenB;
    return {
      ...convertedPool,
      currentTick: convertedPool.currentTick,
      tokenA: {
        ...tokenA,
        path: getGnotPath(tokenA).path,
        name: getGnotPath(tokenA).name,
        symbol: getGnotPath(tokenA).symbol,
        displaySymbol: getGnotPath(tokenA).displaySymbol,
        logoURI: getGnotPath(tokenA).logoURI,
      },
      tokenB: {
        ...tokenB,
        path: getGnotPath(tokenB).path,
        name: getGnotPath(tokenB).name,
        symbol: getGnotPath(tokenB).symbol,
        displaySymbol: getGnotPath(tokenB).displaySymbol,
        logoURI: getGnotPath(tokenB).logoURI,
      },
      tokenAPriceGrade,
      tokenBPriceGrade,
    };
  }, [convertedPool, tokenPrices, getGnotPath]);

  const { liquiditySegments, isLoading: isLoadingLiquiditySegments } = usePoolLiquiditySegmentsByPath(
    poolPath as string,
    {
      currentTick: pool.currentTick,
      currentSqrtPriceX96: currentSqrtPriceX96 ?? undefined,
      currentPrice: pool.price,
      tokenA: pool.tokenA,
      tokenB: pool.tokenB,
      includeTokenAmounts: true,
      visibleTickRange,
      binCount: LIQUIDITY_GRAPH_BIN_COUNT,
    },
    {
      enabled: !!poolPath,
    },
  );

  const feeStr = useMemo(() => {
    if (!pool?.fee) {
      return null;
    }
    return SwapFeeTierInfoMap[makeSwapFeeTier(pool.fee)].rateStr;
  }, [pool?.fee]);

  const availInfo = React.useMemo(
    () => ({
      availZoomIn: zoomLevel < LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES.length - 1,
      availZoomOut: zoomLevel > 0,
    }),
    [zoomLevel],
  );

  const handleZoomIn = React.useCallback(() => {
    if (availInfo.availZoomIn && zoomLevel + 1 < LIQUIDITY_GRAPH_VISIBLE_TICK_RANGES.length) {
      setZoomLevel(zoomLevel + 1);
    }
  }, [zoomLevel, availInfo.availZoomIn]);

  const handleZoomOut = React.useCallback(() => {
    if (availInfo.availZoomOut && zoomLevel > 0) {
      setZoomLevel(zoomLevel - 1);
    }
  }, [zoomLevel, availInfo.availZoomOut]);

  return (
    <PoolPairInformation
      pool={pool}
      menu={{
        title: "business:pageHeader.earn",
        path: "/earn",
      }}
      isMobile={isMobile}
      onClickPath={onClickPath}
      feeStr={feeStr}
      loading={loading || loadingPosition}
      loadingBins={loading || loadingPosition || isLoadingLiquiditySegments || isLoadingSqrtPriceX96}
      liquiditySegments={liquiditySegments}
      currentSqrtPriceX96={currentSqrtPriceX96}
      availInfo={availInfo}
      onZoomIn={handleZoomIn}
      onZoomOut={handleZoomOut}
    />
  );
};

export default PoolPairInformationContainer;
