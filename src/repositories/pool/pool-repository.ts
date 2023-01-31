import {
	PoolDetailListResponse,
	PoolInfoResposne,
	PoolListResponse,
	PoolSummaryAprResposne,
	PoolSummaryLiquidityResposne,
	PoolSummaryVolumeResposne,
} from "./response";

export interface PoolRepository {
	getRewardPools: () => Promise<PoolListResponse>;

	getPools: (option?: {}) => Promise<PoolDetailListResponse>;

	getPoolsByAddress: (address: string) => Promise<PoolDetailListResponse>;

	getPoolById: (poolId: string) => Promise<PoolInfoResposne>;

	getPoolSummaryLiquidityById: () => Promise<PoolSummaryLiquidityResposne>;

	getPoolSummaryVolumeById: () => Promise<PoolSummaryVolumeResposne>;

	getPoolSummaryAprById: () => Promise<PoolSummaryAprResposne>;
}
