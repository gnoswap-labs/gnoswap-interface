import { TokenPairModel } from "@/models/token/token-pair-model";
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

	getPoolChartTicksByTokenPair: (
		token0Id: string,
		token1Id: string,
	) => Promise<PoolChartResopnse>;

	getPoolSummaryLiquidityById: (
		poolId: string,
	) => Promise<PoolSummaryLiquidityResponse>;

	getPoolSummaryVolumeById: (
		poolId: string,
	) => Promise<PoolSummaryVolumeResponse>;

	getPoolSummaryAprById: (poolId: string) => Promise<PoolSummaryAprResponse>;
}
