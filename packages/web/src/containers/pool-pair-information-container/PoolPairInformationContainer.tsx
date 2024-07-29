import React, { useMemo } from "react";
import useCustomRouter from "@hooks/common/use-custom-router";
import PoolPairInformation from "@components/pool/pool-pair-information/PoolPairInformation";
import { makeSwapFeeTier } from "@utils/swap-utils";
import { SwapFeeTierInfoMap } from "@constants/option.constant";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useGetBinsByPath, useGetPoolDetailByPath } from "@query/pools";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { usePositionData } from "@hooks/common/use-position-data";

export interface pathProps {
  title: string;
  path: string;
}

export const menu = {
  title: "business:pageHeader.earn",
  path: "/earn",
};

export const initialPool: PoolDetailModel = {
  tokenA: {
    chainId: "",
    createdAt: "",
    name: "",
    address: "",
    path: "",
    decimals: 4,
    symbol: "",
    logoURI: "",
    type: "native",
    priceID: "",
  },
  tokenB: {
    chainId: "",
    createdAt: "",
    name: "",
    address: "",
    path: "",
    decimals: 4,
    symbol: "",
    logoURI: "",
    type: "native",
    priceID: "",
  },
  incentiveType: "INCENTIVIZED",
  tvl: "0",
  tvlChange: 0,
  volume24h: 0,
  rewards24hUsd: 0,
  id: "",
  apr: "0",
  fee: "",
  feeUsd24h: 0,
  currentTick: 0,
  price: 0,
  tokenABalance: 0,
  tokenBBalance: 0,
  tickSpacing: 0,
  rewardTokens: [],
  totalApr: 0,
  poolPath: "",
  liquidity: "",
  volumeChange24h: 0,
  feeApr: "",
  stakingApr: "",
  allTimeVolumeUsd: "",
  priceRatio: {
    "7d": [],
    "30d": [],
    all: [],
  },
};

interface PoolPairInformationContainerProps {
  address?: string | undefined;
}

const PoolPairInformationContainer: React.FC<
  PoolPairInformationContainerProps
> = ({ address }) => {
  const router = useCustomRouter();
  const { getGnotPath } = useGnotToGnot();
  const poolPath = router.getPoolPath();
  const { data = initialPool as PoolDetailModel, isLoading: loading } =
    useGetPoolDetailByPath(poolPath as string, { enabled: !!poolPath });
  const { loading: loadingPosition } = usePositionData({
    address,
    poolPath,
    queryOption: {
      enabled: !!poolPath,
    },
  });
  const { data: bins = [], isLoading: isLoadingBins } = useGetBinsByPath(
    poolPath as string,
    40,
    {
      enabled: !!poolPath,
    },
  );

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

  return (
    <PoolPairInformation
      pool={pool}
      menu={menu}
      onClickPath={onClickPath}
      feeStr={feeStr}
      loading={loading || loadingPosition}
      loadingBins={loading || loadingPosition || isLoadingBins}
      poolBins={bins}
    />
  );
};

export default PoolPairInformationContainer;
