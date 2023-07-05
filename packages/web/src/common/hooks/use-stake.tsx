import { useCallback, useState } from "react";
import { LiquidityDetailModel } from "@/models/liquidity/liquidity-detail-model";
import { StakingPeriodInfo } from "@/repositories/staking";
import { useGnoswapContext } from "./use-gnoswap-context";
import { useAtom } from "jotai";
import { AccountAtom } from "@atoms/index";

export const useStake = (poolId: string) => {
  const { liquidityService, stakingService } = useGnoswapContext();

  const [address] = useAtom(AccountAtom.address);

  const [periodInfos, setPeriodInfos] = useState<Array<StakingPeriodInfo>>([]);
  const [availStakeLiquidities, setAvailStakeLiquidities] = useState<
    Array<LiquidityDetailModel>
  >([]);

  const updatePeriodInfo = useCallback(() => {
    stakingService
      .getPeriodInfos(poolId)
      .then(response => response && setPeriodInfos(response.periods));
  }, [poolId, stakingService]);

  const updateAvailStakeLiquidities = useCallback(() => {
    if (!address) {
      return;
    }
    liquidityService
      .getAvailStakeLiquidities(address, poolId)
      .then(
        response => response && setAvailStakeLiquidities(response.liquidities),
      );
  }, [address, poolId, liquidityService]);

  const getSummaryLiquidityTokens = useCallback(
    (liquidityIds: Array<string>) => {
      if (!address) {
        return;
      }
      const selectedLiquidities = availStakeLiquidities.filter(liquidity =>
        liquidityIds.includes(liquidity.liquidityId),
      );
      return liquidityService.getSummaryPooledByLiquidities(
        selectedLiquidities,
      );
    },
    [address, availStakeLiquidities, liquidityService],
  );

  const stake = useCallback(
    (liquidityIds: Array<string>, period: number) => {
      return stakingService.stake(liquidityIds, period);
    },
    [stakingService],
  );

  return {
    periodInfos,
    availStakeLiquidities,
    updatePeriodInfo,
    updateAvailStakeLiquidities,
    getSummaryLiquidityTokens,
    stake,
  };
};
