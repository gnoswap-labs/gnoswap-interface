import { TransactionHashModelMapper } from "@/models/common/mapper/transaction-hash-model-mapper";
import { StakingPeriodInfoModelMapper } from "@/models/staking/mapper/staking-period-info-model-mapper";
import { StakingRepository } from "@/repositories/staking";

export class StakingService {
	private stakingRepository: StakingRepository;

	constructor(stakingRepository: StakingRepository) {
		this.stakingRepository = stakingRepository;
	}

	public getPeriodInfos = () => {
		return this.stakingRepository
			.getStakingPeriods()
			.then(StakingPeriodInfoModelMapper.fromListResponse);
	};

	public stake = (period: number, liquidityIds: Array<string>) => {
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
