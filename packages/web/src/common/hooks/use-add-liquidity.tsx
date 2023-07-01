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

  const currentTick = chartData?.current;

  const addLiquidity = () => {
    liquidityService.addLiquidity(liquidity, options);
  };

  const updateInRange = useCallback(() => {
    if (!currentTick) {
      return false;
    }
    const { minRate, maxRate } = options;
    const inRange = currentTick <= minRate && currentTick >= maxRate;
    setInRange(inRange);
  }, [currentTick, options]);

  const updateChartData = useCallback(() => {
    poolService
      .getPoolChartByTokenPair(liquidity)
      .then(response => response && setChartData(response));
  }, [liquidity, poolService]);

  return {
    inRange,
    currentTick,
    addLiquidity,
    updateInRange,
    updateChartData
  };
};
