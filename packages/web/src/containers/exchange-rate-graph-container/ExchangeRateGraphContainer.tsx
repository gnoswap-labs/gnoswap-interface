import ExchangeRateGraph from "@components/pool/exchange-rate-graph/ExchangeRateGraph";
import { CHART_DAY_SCOPE_TYPE } from "@constants/option.constant";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { PoolModel } from "@models/pool/pool-model";
import { isNativeToken } from "@models/token/token-model";
import { useGetPoolDetailByPath } from "@query/pools";
import { EarnState } from "@states/index";
import { useAtom } from "jotai";
import { useMemo, useState } from "react";

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
  tvl: 0,
  tvlChange: 0,
  volume24h: 0,
  volumeChange: 0,
  id: "",
  apr: 0,
  fee: "",
  feeUsd24h: 0,
  currentTick: 0,
  price: 0,
  tokenABalance: 0,
  tokenBBalance: 0,
  tickSpacing: 0,
  bins: [],
  bins40: [],
  rewardTokens: [],
  totalApr: 0,
  poolPath: "",
  liquidity: "",
  rewards24hUsd: 0,
  volumeChange24h: 0,
  feeApr: "",
  stakingApr: "",
  allTimeVolumeUsd: 0,
  priceRatio: {
    "7d": [],
    "30d": [],
    "all": [],
  }
};

export interface LineGraphData {
  value: string;
  time: string;
}

const ExchangeRateGraphContainer: React.FC = () => {
  const [currentPoolPath] = useAtom(EarnState.currentPoolPath);
  const [compareToken] = useAtom(EarnState.currentCompareToken);
  const [{ isLoading: isLoadingRPCPoolInfo }] = useAtom(EarnState.poolInfoQuery);

  const tokenPair = currentPoolPath?.split(":");
  const { getGnotPath } = useGnotToGnot();

  const poolPath = currentPoolPath;
  const { data: poolData = initialPool, isLoading } = useGetPoolDetailByPath(
    poolPath as string, {
    enabled: !!poolPath,
  }
  );
  const [selectedScope, setSelectedScope] = useState<CHART_DAY_SCOPE_TYPE>(CHART_DAY_SCOPE_TYPE["7D"]);

  const isReversed = useMemo(() => {
    return tokenPair?.findIndex(path => {
      if (compareToken) {
        return isNativeToken(compareToken)
          ? compareToken.wrappedPath === path
          : compareToken.path === path;
      }
      return false;
    }) === 1;
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

  return (<ExchangeRateGraph
    poolData={changedPoolInfo}
    isLoading={isLoading || isLoadingRPCPoolInfo}
    isReversed={isReversed}
    selectedScope={selectedScope}
    setSelectedScope={setSelectedScope}
  />);
};

export default ExchangeRateGraphContainer;