import ExchangeRateGraph from "@components/pool/exchange-rate-graph/ExchangeRateGraph";
import { useLoading } from "@hooks/common/use-loading";
import { PoolModel } from "@models/pool/pool-model";
import { useGetPoolDetailByPath } from "@query/pools";
import { EarnState } from "@states/index";
import { useAtom } from "jotai";

export const initialPool: PoolModel = {
  name: "",
  path: "",
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
  totalVolume: 0,
  id: "",
  apr: 0,
  fee: "",
  feeUsd24h: 0,
  feeChange: 0,
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
};

const ExchangeRateGraphContainer: React.FC = () => {
  const [currentPoolPath] = useAtom(EarnState.currentPoolPath);

  const poolPath = currentPoolPath;
  const { data: poolData = initialPool, isLoading } = useGetPoolDetailByPath(poolPath as string, { enabled: !!poolPath });
  const { isLoadingCommon } = useLoading();

  return (<ExchangeRateGraph
    poolData={poolData}
    feeTier={""}
    isLoading={isLoading || isLoadingCommon}
  />);
};

export default ExchangeRateGraphContainer;