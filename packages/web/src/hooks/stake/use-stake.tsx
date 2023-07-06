import { useCallback, useState } from "react";
import { LiquidityDetailModel } from "@models/liquidity/liquidity-detail-model";
import { StakingPeriodInfo } from "@repositories/staking";
import { useAtom } from "jotai";
import { AccountState } from "@states/index";
import { useRepository } from "@hooks/repository/use-repository";
import { LiquidityModelMapper } from "@models/liquidity/mapper/liquildity-model-mapper";

export const useStake = (poolId: string) => {
  const { liquidityRepository, stakingRepository } = useRepository();

  const [address] = useAtom(AccountState.address);

  const [periodInfos, setPeriodInfos] = useState<Array<StakingPeriodInfo>>([]);
  const [availStakeLiquidities, setAvailStakeLiquidities] = useState<
    Array<LiquidityDetailModel>
  >([]);

  const updatePeriodInfo = useCallback(() => {
    stakingRepository
      .getStakingPeriods(poolId)
      .then(response => response && setPeriodInfos(response.periods));
  }, [poolId, stakingRepository]);

  const updateAvailStakeLiquidities = useCallback(async () => {
    if (!address) {
      return;
    }
    const liquidities = await liquidityRepository
      .getAvailStakeLiquiditiesBy(address, poolId)
      .then(LiquidityModelMapper.fromDetailListResponse);
    setAvailStakeLiquidities(liquidities.liquidities);
  }, [address, poolId, liquidityRepository]);

  const stake = useCallback(
    (liquidityIds: Array<string>, period: number) => {
      return stakingRepository.stakeBy({ liquidityIds, period: period.toString() });
    },
    [stakingRepository],
  );

  const unstake = useCallback((liquidityIds: Array<string>) => {
    return stakingRepository.unstakeBy({ liquidityIds });
  }, [stakingRepository]);

  return {
    periodInfos,
    availStakeLiquidities,
    updatePeriodInfo,
    updateAvailStakeLiquidities,
    stake,
    unstake
  };
};
