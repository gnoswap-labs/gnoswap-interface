import { returnNullWithLog } from "@/common/utils/error-util";
import { IncentivizedOptions } from "@/common/values/data-constant";
import { PoolChartModelMapper } from "@/models/pool/mapper/pool-chart-model-mapper";
import { PoolModelMapper } from "@/models/pool/mapper/pool-model-mapper";
import { PoolDetailModel } from "@/models/pool/pool-detail-model";
import { PoolModel } from "@/models/pool/pool-model";
import { TokenPairModel } from "@/models/token/token-pair-model";
import { PoolRepository } from "@/repositories/pool";

interface PoolSearchOption {
	keyword?: string;
	poolType?: IncentivizedOptions | "NONE";
	sortType?: "NONE" | "LIQUIDITY" | "VOLUME" | "FEE" | "ARP";
	order?: "NONE" | "ASC" | "DESC";
}

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

	public getPools = async (options?: PoolSearchOption) => {
		return this.getPoolDetailsBy({ ...options }).catch(returnNullWithLog);
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

	public getPoolChartByPoolId = (poolId: string) => {
		return this.poolRepository
			.getPoolChartTicks(poolId)
			.then(PoolChartModelMapper.mappedChartTicks)
			.catch(error => {
				console.log(error);
				return null;
			});
	};

	public getPoolChartByTokenPair = (tokenPair: TokenPairModel) => {
		const { token0, token1 } = tokenPair;
		return this.poolRepository
			.getPoolChartTicksByTokenPair(token0.tokenId, token1.tokenId)
			.then(PoolChartModelMapper.mappedChartTicks)
			.catch(error => {
				console.log(error);
				return null;
			});
	};

	private getPoolDetailsBy = async (options: PoolSearchOption) => {
		const {
			keyword = "",
			poolType = "NONE",
			sortType = "NONE",
			order = "NONE",
		} = options;
		const { pools } = await this.poolRepository.getPools();
		const resultPools = pools
			.map(PoolModelMapper.fromDetailResponse)
			.filter(pool => PoolService.equalsIncentivizedType(pool, poolType))
			.filter(pool => PoolService.includeKeyword(pool, keyword))
			.sort((pool0, pool1) =>
				PoolService.sortPoolDetails(pool0, pool1, sortType, order),
			);
		return {
			total: resultPools.length,
			hits: resultPools.length,
			pools: resultPools,
		};
	};

	private static sortPoolDetails = (
		pool0: PoolDetailModel,
		pool1: PoolDetailModel,
		sortType: "NONE" | "LIQUIDITY" | "VOLUME" | "FEE" | "ARP",
		order: "NONE" | "ASC" | "DESC",
	) => {
		if (sortType === "NONE" || order === "NONE") {
			return 0;
		}

		let orderRate = 1;
		if (order === "DESC") {
			orderRate = -1;
		}

		if (sortType === "LIQUIDITY") {
			const token0Amount = pool0.liquidity.token0.amount?.value ?? 0;
			const token1Amount = pool0.liquidity.token1.amount?.value ?? 0;
			return (token0Amount > token1Amount ? 1 : -1) * orderRate;
		}
		if (sortType === "VOLUME") {
			return (pool0.volumn24h > pool1.volumn24h ? 1 : -1) * orderRate;
		}
		if (sortType === "FEE") {
			return (pool0.feeRate > pool1.feeRate ? 1 : -1) * orderRate;
		}
		if (sortType === "ARP") {
			return (pool0.apr > pool1.apr ? 1 : -1) * orderRate;
		}
		return 0;
	};

	private static includeKeyword = (pool: PoolModel, keyword: string) => {
		if (keyword === "") {
			return true;
		}
		const searchKeyword = keyword.toLowerCase();
		const { token0, token1 } = pool.liquidity;

		return (
			token0.name.toLowerCase().includes(searchKeyword) ||
			token1.name.toLowerCase().includes(searchKeyword) ||
			token0.symbol.toLowerCase().includes(searchKeyword) ||
			token1.symbol.toLowerCase().includes(searchKeyword)
		);
	};

	private static equalsIncentivizedType = (
		pool: PoolModel,
		incentivizedType: IncentivizedOptions | "NONE",
	) => {
		if (incentivizedType === "NONE") {
			return true;
		}
		return pool.incentivizedType === incentivizedType;
	};
}
