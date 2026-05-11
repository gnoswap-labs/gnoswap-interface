import React, { useEffect, useMemo, useState } from "react";

import { SwapFeeTierInfoMap } from "@constants/option.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { useGetBinsByPath, useGetPoolDetailByPath } from "@query/pools";
import { makeSwapFeeTier } from "@utils/swap-utils";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { PoolConverter } from "@services/converters/pool";

import PoolPairInformation from "../../components/pool-pair-information/PoolPairInformation";
import { ZOOL_VALUES } from "@constants/graph.constant";
import { checkGnotPath } from "@utils/common";
import { TOKEN_PRICE_GRADE_TYPE } from "@models/token/token-price-grade";
import { QUERY_KEY } from "@query/query-keys";

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
    queryOption: {
      enabled: !!poolPath,
    },
  });
  const {
    data: bins = [],
    isLoading: isLoadingBins,
    isFetching: isFetchingBins,
    dataUpdatedAt: binsUpdatedAt,
  } = useGetBinsByPath(poolPath as string, binCount, {
    keepPreviousData: true,
    staleTime: 60_000,
    enabled: !!poolPath,
    queryKey: [QUERY_KEY.poolPairBins, poolPath, zoomLevel],
  });
  const { tokenPrices } = useTokenData();

  // Snapshot of pool.currentTick that is paired with the currently-displayed bins.
  // The bar chart (bins) and the current-price marker (currentTick) must move together —
  // without this, pool detail refetches every 5s update the tick while bins stay stale,
  // causing the dashed current-price line to drift away from the bars after a swap.
  const [pairedTick, setPairedTick] = useState<number | null>(null);
  useEffect(() => {
    if (!isFetchingBins && data) {
      setPairedTick(data.currentTick);
    }
  }, [binsUpdatedAt, isFetchingBins, data]);

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
