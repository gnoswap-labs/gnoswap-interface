import {
	PoolListResponse,
	PoolInfoResponse,
	PoolSummaryAprResponse,
	PoolSummaryLiquidityResponse,
	PoolSummaryVolumeResponse,
	PoolChartResopnse,
} from "./response";

export interface PoolRepository {
	getPools: (option?: {}) => Promise<PoolListResponse>;

	getPoolsByAddress: (address: string) => Promise<PoolListResponse>;

	getPoolById: (poolId: string) => Promise<PoolInfoResponse>;

	getPoolChartTicks: (poolId: string) => Promise<PoolChartResopnse>;

	getPoolSummaryLiquidityById: (
		poolId: string,
	) => Promise<PoolSummaryLiquidityResponse>;

	getPoolSummaryVolumeById: (
		poolId: string,
	) => Promise<PoolSummaryVolumeResponse>;

	getPoolSummaryAprById: (poolId: string) => Promise<PoolSummaryAprResponse>;
}
