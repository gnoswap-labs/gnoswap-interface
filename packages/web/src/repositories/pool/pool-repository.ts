import { PoolDetailResponse, PoolListResponse } from "./response";

export interface PoolRepository {
  getPools: () => Promise<PoolListResponse>;

  getPoolDetailByPoolId: (poolId: string) => Promise<PoolDetailResponse>;
}
