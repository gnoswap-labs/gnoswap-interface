import { IncentivizedOptions } from "@/common/values/data-constant";
import { PoolModelMapper } from "@/models/pool/mapper/pool-model-mapper";
import { PoolModel } from "@/models/pool/pool-model";
import { PoolRepository } from "@/repositories/pool";

export class PoolService {
	private poolRepository: PoolRepository;

	constructor(poolRepository: PoolRepository) {
		this.poolRepository = poolRepository;
	}

	public getPools = async () => {
		try {
			const poolListData = await this.poolRepository.getPools();
			const pools = PoolModelMapper.fromListResponse(poolListData);
			return pools;
		} catch (e) {
			console.log(e);
			return [];
		}
	};

	public getPoolsByIncentivizedType = async (
		incentivizedType: IncentivizedOptions,
	) => {
		const pools = await this.getPools();
		const filteredPools = pools.filter(pool =>
			PoolService.equalsIncentivizedType(pool, incentivizedType),
		);
		return filteredPools;
	};

	private static equalsIncentivizedType = (
		pool: PoolModel,
		incentivizedType: IncentivizedOptions,
	) => {
		return pool.incentivizedType === incentivizedType;
	};
}
