import {
	PoolDetailListResponse,
	PoolInfoResposne,
	RewardPoolListResponse,
	PoolSummaryAprResposne,
	PoolSummaryLiquidityResposne,
	PoolSummaryVolumeResposne,
} from "./response";

export interface PoolRepository {
	getRewardPools: () => Promise<RewardPoolListResponse>;

	getPools: (option?: {}) => Promise<PoolDetailListResponse>;

	getPoolsByAddress: (address: string) => Promise<PoolDetailListResponse>;

	getPoolById: (poolId: string) => Promise<PoolInfoResposne>;

	getPoolSummaryLiquidityById: (
		poolId: string,
	) => Promise<PoolSummaryLiquidityResposne>;

	getPoolSummaryVolumeById: (
		poolId: string,
	) => Promise<PoolSummaryVolumeResposne>;

	getPoolSummaryAprById: (poolId: string) => Promise<PoolSummaryAprResposne>;
}
