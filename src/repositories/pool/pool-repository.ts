import {
	PoolListResponse,
	PoolInfoResposne,
	PoolSummaryAprResposne,
	PoolSummaryLiquidityResposne,
	PoolSummaryVolumeResposne,
	PoolChartResopnse,
} from "./response";

export interface PoolRepository {
	getPools: (option?: {}) => Promise<PoolListResponse>;

	getPoolsByAddress: (address: string) => Promise<PoolListResponse>;

	getPoolById: (poolId: string) => Promise<PoolInfoResposne>;

	getPoolChartTicks: (poolId: string) => Promise<PoolChartResopnse>;

	getPoolSummaryLiquidityById: (
		poolId: string,
	) => Promise<PoolSummaryLiquidityResposne>;

	getPoolSummaryVolumeById: (
		poolId: string,
	) => Promise<PoolSummaryVolumeResposne>;

	getPoolSummaryAprById: (poolId: string) => Promise<PoolSummaryAprResposne>;
}
