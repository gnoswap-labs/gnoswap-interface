import { TransactionHashModelMapper } from "@/models/common/mapper/transaction-hash-model-mapper";
import { StakingPeriodInfoModelMapper } from "@/models/staking/mapper/staking-period-info-model-mapper";
import { StakingRepository } from "@/repositories/staking";

export class StakingService {
  private stakingRepository: StakingRepository;

  constructor(stakingRepository: StakingRepository) {
    this.stakingRepository = stakingRepository;
  }

  public getPeriodInfos = (poolId: string) => {
    return this.stakingRepository
      .getStakingPeriods(poolId)
      .then(StakingPeriodInfoModelMapper.fromListResponse);
  };

  public stake = (liquidityIds: Array<string>, period: number) => {
    const request = {
      period: `${period}`,
      liquidityIds,
    };

    return this.stakingRepository
      .stakeBy(request)
      .then(TransactionHashModelMapper.fromResponse);
  };

  public unstake = (liquidityIds: Array<string>) => {
    const request = {
      liquidityIds,
    };

    return this.stakingRepository
      .unstakeBy(request)
      .then(TransactionHashModelMapper.fromResponse);
  };
}
