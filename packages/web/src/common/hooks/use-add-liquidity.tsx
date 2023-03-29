import { useCallback, useState } from "react";
import { PoolChartModel } from "@/models/pool/pool-chart-model";
import { TokenPairModel } from "@/models/token/token-pair-model";
import { useGnoswapContext } from "./use-gnoswap-context";

interface Props {
  liquidity: TokenPairModel;
  options: {
    rangeType: "ACTIVE" | "PASSIVE" | "CUSTOM";
    feeRate: number;
    minRate: number;
    maxRate: number;
  };
}

export const useAddLiquidity = ({ liquidity, options }: Props) => {
  const { poolService, liquidityService } = useGnoswapContext();

  const [chartData, setChartData] = useState<PoolChartModel>();
  const [inRange, setInRange] = useState<boolean>(false);

  const currnetTick = chartData?.current;

  const addLiquidity = () => {
    liquidityService.addLiquidity(liquidity, options);
  };

  const updateInRange = useCallback(() => {
    if (!currnetTick) {
      return false;
    }
    const { minRate, maxRate } = options;
    const inRange = currnetTick <= minRate && currnetTick >= maxRate;
    setInRange(inRange);
  }, [currnetTick, options]);

  const updateChartData = useCallback(() => {
    poolService
      .getPoolChartByTokenPair(liquidity)
      .then(response => response && setChartData(response));
  }, [liquidity, poolService]);

  return {
    inRange,
    currnetTick,
    addLiquidity,
    updateInRange,
    updateChartData
  };
};
