import React, { useMemo } from "react";

import { SwapFeeTierInfoMap } from "@constants/option.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useWindowSize } from "@hooks/common/use-window-size";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useGetBinsByPath, useGetPoolDetailByPath } from "@query/pools";
import { PoolConverter } from "@services/converters/pool";
import { makeSwapFeeTier } from "@utils/swap-utils";

import { ZOOL_VALUES } from "@constants/graph.constant";
import { TOKEN_PRICE_GRADE_TYPE } from "@models/token/token-price-grade";
import { QUERY_KEY } from "@query/query-keys";
import { checkGnotPath } from "@utils/common";
import PoolPairInformation from "../../components/pool-pair-information/PoolPairInformation";

interface PoolPairInformationContainerProps {
  address?: string | undefined;
}

const PoolPairInformationContainer: React.FC<PoolPairInformationContainerProps> = ({ address }) => {
  const [zoomLevel, setZoomLevel] = React.useState<number>(0);
  const [shiftIndex, setShiftIndex] = React.useState<number>(0);
  const binCount = React.useMemo(() => ZOOL_VALUES[zoomLevel], [zoomLevel]);

  const DISPLAY_BIN_COUNT = 40;

  const router = useCustomRouter();
  const { getGnotPath } = useGnotToGnot();
  const poolPath = router.getPoolPath();
  const { isMobile } = useWindowSize();
  const { data, isLoading: loading } = useGetPoolDetailByPath(poolPath as string, {
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

  // Gate the bins query on `data?.currentTick` being defined. Bins are server-centered
  // on the current tick, so firing before pool detail arrives would (1) issue an
  // initial request without a tick, then (2) immediately invalidate and refetch
  // once the tick comes in — producing two slightly different payloads on first
  // mount and a visible re-layout of the graph just after entry.
  const currentTick = data?.currentTick;
  const { data: binsResult, isLoading: isLoadingBins } = useGetBinsByPath(
    poolPath as string,
    binCount,
    currentTick,
    {
      enabled: !!poolPath && currentTick !== undefined,
      queryKey: [QUERY_KEY.poolPairBins, poolPath, zoomLevel, currentTick ?? null],
    },
  );
  const bins = binsResult?.bins ?? [];
  const pairedTick = binsResult?.pairedTick ?? null;
  const { tokenPrices } = useTokenData();

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
      currentTick: pairedTick ?? convertedPool.currentTick,
      tokenA: {
        ...tokenA,
        path: getGnotPath(tokenA).path,
        name: getGnotPath(tokenA).name,
        symbol: getGnotPath(tokenA).symbol,
        logoURI: getGnotPath(tokenA).logoURI,
      },
      tokenB: {
        ...tokenB,
        path: getGnotPath(tokenB).path,
        name: getGnotPath(tokenB).name,
        symbol: getGnotPath(tokenB).symbol,
        logoURI: getGnotPath(tokenB).logoURI,
      },
      tokenAPriceGrade,
      tokenBPriceGrade,
    };
  }, [convertedPool, tokenPrices, getGnotPath, pairedTick]);

  const feeStr = useMemo(() => {
    if (!pool?.fee) {
      return null;
    }
    return SwapFeeTierInfoMap[makeSwapFeeTier(pool.fee)].rateStr;
  }, [pool?.fee]);

  const availInfo = React.useMemo(() => {
    const halfDisplayBinCount = DISPLAY_BIN_COUNT / 2;

    const maxLeftShift = Math.floor(bins.length / 2) - halfDisplayBinCount;
    const maxRightShift = Math.floor(bins.length / 2) - halfDisplayBinCount;

    return {
      availZoomIn: zoomLevel < ZOOL_VALUES.length - 1,
      availZoomOut: zoomLevel > 0,
      availMoveLeft: shiftIndex > -maxLeftShift,
      availMoveRight: shiftIndex < maxRightShift,
    };
  }, [zoomLevel, shiftIndex, bins.length]);

  const handleZoomIn = React.useCallback(() => {
    if (availInfo.availZoomIn && zoomLevel + 1 < ZOOL_VALUES.length) {
      setZoomLevel(zoomLevel + 1);
    }
    setShiftIndex(0);
  }, [zoomLevel, availInfo.availZoomIn]);

  const handleZoomOut = React.useCallback(() => {
    if (availInfo.availZoomOut && zoomLevel > 0) {
      setZoomLevel(zoomLevel - 1);
    }
    setShiftIndex(0);
  }, [zoomLevel, availInfo.availZoomOut]);

  const handleMoveLeft = React.useCallback(() => {
    if (availInfo.availMoveLeft) {
      setShiftIndex(value => value - 1);
    }
  }, [availInfo.availMoveLeft]);

  const handleMoveRight = React.useCallback(() => {
    if (availInfo.availMoveRight) {
      setShiftIndex(value => value + 1);
    }
  }, [availInfo.availMoveRight]);

  return (
    <PoolPairInformation
      pool={pool}
      menu={{
        title: "business:pageHeader.earn",
        path: "/earn",
      }}
      isMobile={isMobile}
      onClickPath={onClickPath}
      shiftIndex={shiftIndex}
      displayBinCount={DISPLAY_BIN_COUNT}
      zoomLevel={zoomLevel}
      onZoomIn={handleZoomIn}
      onZoomOut={handleZoomOut}
      onMoveLeft={handleMoveLeft}
      onMoveRight={handleMoveRight}
      availInfo={availInfo}
      feeStr={feeStr}
      loading={loading || loadingPosition}
      loadingBins={loading || loadingPosition || isLoadingBins}
      poolBins={bins}
    />
  );
};

export default PoolPairInformationContainer;
