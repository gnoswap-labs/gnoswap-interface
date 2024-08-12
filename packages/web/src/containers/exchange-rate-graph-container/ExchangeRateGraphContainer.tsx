import { useAtom } from "jotai";
import { useMemo, useState } from "react";

import ExchangeRateGraph from "@components/pool/exchange-rate-graph/ExchangeRateGraph";
import { CHART_DAY_SCOPE_TYPE } from "@constants/option.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { PoolModel } from "@models/pool/pool-model";
import { isNativeToken } from "@models/token/token-model";
import { useGetPoolDetailByPath } from "@query/pools";
import { EarnState } from "@states/index";
import { checkGnotPath } from "@utils/common";

export const initialPool: PoolModel = {
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
  rewards24hUsd: 0,
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

export interface LineGraphData {
  value: string;
  time: string;
}

const ExchangeRateGraphContainer: React.FC = () => {
  const [compareToken] = useAtom(EarnState.currentCompareToken);
  const [{ isLoading: isLoadingRPCPoolInfo }] = useAtom(
    EarnState.poolInfoQuery,
  );
  const router = useCustomRouter();
  const currentPoolPath = (router.query.poolPath as string) || "";
    const tokenAPath =
      (router.query.tokenA as string) || window.history.state?.tokenA;
    const tokenBPath =
      (router.query.tokenB as string) || window.history.state?.tokenB;
    const feeTier =
      (router.query.fee_tier as string) || window.history.state?.fee_tier;

  const tokenPair = useMemo(() => {
    if (currentPoolPath) return currentPoolPath?.split(":");
    return [checkGnotPath(tokenAPath), checkGnotPath(tokenBPath)].sort();
  }, [currentPoolPath, tokenAPath, tokenBPath]);


  let poolPath = "";
  if (currentPoolPath) {
    poolPath = currentPoolPath;
  } else {
    if (tokenAPath && tokenBPath && feeTier) {
      poolPath = [...tokenPair, feeTier].join(":");
    } else {
      poolPath = "";
    }
  }

  const { getGnotPath } = useGnotToGnot();

  const {
    data: poolData = initialPool,
    isLoading,
  } = useGetPoolDetailByPath(poolPath as string, {
    enabled: !!poolPath,
  });

  const [selectedScope, setSelectedScope] = useState<CHART_DAY_SCOPE_TYPE>(
    CHART_DAY_SCOPE_TYPE["7D"],
  );

  const isReversed = useMemo(() => {
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

  const changedPoolInfo = useMemo(() => {
    return isReversed === false
      ? {
          ...poolData,
          tokenA: {
            ...poolData.tokenA,
            logoURI: getGnotPath(poolData.tokenA).logoURI,
            path: getGnotPath(poolData.tokenA).path,
            name: getGnotPath(poolData.tokenA).name,
            symbol: getGnotPath(poolData.tokenA).symbol,
          },
          tokenB: {
            ...poolData.tokenB,
            logoURI: getGnotPath(poolData.tokenB).logoURI,
            path: getGnotPath(poolData.tokenB).path,
            name: getGnotPath(poolData.tokenB).name,
            symbol: getGnotPath(poolData.tokenB).symbol,
          },
        }
      : {
          ...poolData,
          tokenA: {
            ...poolData.tokenA,
            logoURI: getGnotPath(poolData.tokenA).logoURI,
            path: getGnotPath(poolData.tokenA).path,
            name: getGnotPath(poolData.tokenA).name,
            symbol: getGnotPath(poolData.tokenA).symbol,
          },
          tokenB: {
            ...poolData.tokenB,
            logoURI: getGnotPath(poolData.tokenB).logoURI,
            path: getGnotPath(poolData.tokenB).path,
            name: getGnotPath(poolData.tokenB).name,
            symbol: getGnotPath(poolData.tokenB).symbol,
          },
          price: 1 / poolData.price,
        };
  }, [getGnotPath, poolData, isReversed]);

  if (!poolPath) return null;

  return (
    <ExchangeRateGraph
      poolData={changedPoolInfo}
      isLoading={isLoading || isLoadingRPCPoolInfo}
      isReversed={isReversed}
      selectedScope={selectedScope}
      setSelectedScope={setSelectedScope}
    />
  );
};

export default ExchangeRateGraphContainer;
