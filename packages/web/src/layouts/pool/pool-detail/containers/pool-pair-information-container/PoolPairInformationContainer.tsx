import React, { useMemo } from "react";

import { SwapFeeTierInfoMap } from "@constants/option.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { initialDetailPool } from "@models/pool/pool-detail-model";
import { useGetBinsByPath, useGetPoolDetailByPath } from "@query/pools";
import { makeSwapFeeTier } from "@utils/swap-utils";
import { useWindowSize } from "@hooks/common/use-window-size";

import PoolPairInformation from "../../components/pool-pair-information/PoolPairInformation";
import { ZOOL_VALUES } from "@constants/graph.constant";

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
  const { data = initialDetailPool, isLoading: loading } = useGetPoolDetailByPath(poolPath as string, {
    enabled: !!poolPath,
  });
  const { loading: loadingPosition } = usePositionData({
    address,
    poolPath,
    queryOption: {
      enabled: !!poolPath,
    },
  });
  const { data: bins = [], isLoading: isLoadingBins } = useGetBinsByPath(poolPath as string, binCount, {
    keepPreviousData: true,
    staleTime: 60_000,
    enabled: !!poolPath,
    queryKey: ["poolPairInformationContainer/getBins", poolPath, zoomLevel],
  });

  const onClickPath = (path: string) => {
    router.push(path);
  };

  const pool = useMemo(() => {
    return {
      ...data,
      tokenA: {
        ...data.tokenA,
        path: getGnotPath(data.tokenA).path,
        name: getGnotPath(data.tokenA).name,
        symbol: getGnotPath(data.tokenA).symbol,
        logoURI: getGnotPath(data.tokenA).logoURI,
      },
      tokenB: {
        ...data.tokenB,
        path: getGnotPath(data.tokenB).path,
        name: getGnotPath(data.tokenB).name,
        symbol: getGnotPath(data.tokenB).symbol,
        logoURI: getGnotPath(data.tokenB).logoURI,
      },
    };
  }, [data, bins]);

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
