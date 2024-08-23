import { useAtom } from "jotai";
import { useMemo } from "react";

import { initialPool } from "@models/pool/pool-model";
import { isNativeToken } from "@models/token/token-model";
import { useGetPoolDetailByPath } from "@query/pools";
import { EarnState } from "@states/index";

import ExchangeRateGraph from "../../components/exchange-rate-graph/ExchangeRateGraph";
import { usePoolAddSearchParams } from "../../hooks/use-pool-add-serach-param";

export interface LineGraphData {
  value: string;
  time: string;
}

const ExchangeRateGraphContainer: React.FC = () => {
  const [compareToken] = useAtom(EarnState.currentCompareToken);
  const [{ isLoading: isLoadingRPCPoolInfo }] = useAtom(
    EarnState.poolInfoQuery,
  );
  const { poolPath, tokenPair } = usePoolAddSearchParams();

  const {
    data: poolData = initialPool,
    isLoading,
  } = useGetPoolDetailByPath(poolPath as string, {
    enabled: !!poolPath,
  });

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

  if (!poolData.tokenA?.path || !poolData.tokenB?.path) return null;

  return (
    <ExchangeRateGraph
      poolData={poolData}
      isLoading={isLoading || isLoadingRPCPoolInfo}
      isReversed={isReversed}
    />
  );
};

export default ExchangeRateGraphContainer;
