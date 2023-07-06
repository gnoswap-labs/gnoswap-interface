import { useCallback, useState } from "react";
import { PoolChartModel } from "@models/pool/pool-chart-model";
import { TokenPairModel } from "@models/token/token-pair-model";
import { useRepository } from "@hooks/repository/use-repository";
import { TokenPairModelMapper } from "@models/token/mapper/token-pair-model-mapper";

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
  const { poolRepository, liquidityRepository } = useRepository();

  const [chartData, setChartData] = useState<PoolChartModel>();
  const [inRange, setInRange] = useState<boolean>(false);

  const currentTick = chartData?.current;

  const addLiquidity = useCallback(async () => {
    if (!liquidity.token0 || !liquidity.token1) {
      return null;
    }

    const response = await liquidityRepository.addLiquidityBy({
      liquidity: TokenPairModelMapper.toRequest(liquidity),
      options
    }).then(tx => tx.tx_hash)
      .catch(() => null);
    return response;
  }, [liquidity, options, liquidityRepository]);

  const updateInRange = useCallback(() => {
    if (!currentTick) {
      return false;
    }
    const { minRate, maxRate } = options;
    const inRange = currentTick <= minRate && currentTick >= maxRate;
    setInRange(inRange);
  }, [currentTick, options]);

  const updateChartData = useCallback(() => {
    poolRepository
      .getPoolChartTicksByTokenPair(liquidity.token0.tokenId, liquidity.token1.tokenId)
      .then(response => response && setChartData(response));
  }, [liquidity, poolRepository]);

  return {
    inRange,
    currentTick,
    addLiquidity,
    updateInRange,
    updateChartData,
  };
};
