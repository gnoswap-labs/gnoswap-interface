import {
  PoolListResponse,
  PoolInfoResponse,
  PoolSummaryAprResponse,
  PoolSummaryLiquidityResponse,
  PoolSummaryVolumeResponse,
  PoolChartResponse,
} from "./response";

export interface PoolRepository {
  getPools: (option?: {}) => Promise<PoolListResponse>;

  getPoolsByAddress: (address: string) => Promise<PoolListResponse>;

  getPoolById: (poolId: string) => Promise<PoolInfoResponse>;

  getPoolChartTicks: (poolId: string) => Promise<PoolChartResponse>;

  getPoolChartTicksByTokenPair: (
    token0Id: string,
    token1Id: string,
  ) => Promise<PoolChartResponse>;

  getPoolSummaryLiquidityById: (
    poolId: string,
  ) => Promise<PoolSummaryLiquidityResponse>;

  getPoolSummaryVolumeById: (
    poolId: string,
  ) => Promise<PoolSummaryVolumeResponse>;

  getPoolSummaryAprById: (poolId: string) => Promise<PoolSummaryAprResponse>;
}
