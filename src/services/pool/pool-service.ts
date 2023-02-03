import { IncentivizedOptions } from "@/common/values/data-constant";
import { PoolModelMapper } from "@/models/pool/mapper/pool-model-mapper";
import { PoolDetailModel } from "@/models/pool/pool-detail-model";
import { PoolModel } from "@/models/pool/pool-model";
import { PoolRepository } from "@/repositories/pool";

export class PoolService {
	private poolRepository: PoolRepository;

	constructor(poolRepository: PoolRepository) {
		this.poolRepository = poolRepository;
	}

	public getPoolById = async (poolId: string) => {
		return this.poolRepository
			.getPoolById(poolId)
			.then(PoolModelMapper.fromResponse)
			.catch(error => {
				console.log(error);
				return null;
			});
	};

	public getPools = async () => {
		return this.poolRepository
			.getPools()
			.then(PoolModelMapper.fromListResponse)
			.catch<Array<PoolDetailModel>>(error => {
				console.log(error);
				return [];
			});
	};

	public getPoolsByAddress = async (address: string) => {
		return this.poolRepository
			.getPoolsByAddress(address)
			.then(PoolModelMapper.fromListResponse)
			.catch<Array<PoolDetailModel>>(error => {
				console.log(error);
				return [];
			});
	};

	public getPoolsByIncentivizedType = async (
		incentivizedType: IncentivizedOptions,
	) => {
		return this.getPools().then(pools =>
			pools.filter(pool =>
				PoolService.equalsIncentivizedType(pool, incentivizedType),
			),
		);
	};

	public getRewardPools = async () => {
		return this.getPools().then(pools =>
			pools.filter(PoolService.existsReward),
		);
	};

	public getPoolSummary = async (poolId: string) => {
		return Promise.all([
			this.poolRepository.getPoolSummaryLiquidityById(poolId),
			this.poolRepository.getPoolSummaryVolumeById(poolId),
			this.poolRepository.getPoolSummaryAprById(poolId),
		])
			.then(values => {
				return {
					liquidity: values[0],
					volume: values[1],
					apr: values[2],
				};
			})
			.catch(error => {
				console.log(error);
				return null;
			});
	};

	public getChartTicksByPoolId = (poolId: string) => {
		return this.poolRepository
			.getPoolChartTicks(poolId)
			.then(response => response.ticks)
			.catch(error => {
				console.log(error);
				return null;
			});
	};

	private static existsReward = (pool: PoolModel) => {
		const reward = pool.rewards;
		return reward.some(reward => reward.amount.value.isGreaterThan(0));
	};

	private static equalsIncentivizedType = (
		pool: PoolModel,
		incentivizedType: IncentivizedOptions,
	) => {
		return pool.incentivizedType === incentivizedType;
	};
}
