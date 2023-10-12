import { CreatePoolRequest } from "./request/create-pool-request";
import { PoolDetailResponse, PoolListResponse } from "./response";

export interface PoolRepository {
  getPools: () => Promise<PoolListResponse>;

  getPoolDetailByPoolId: (poolId: string) => Promise<PoolDetailResponse>;

  createPool: (request: CreatePoolRequest) => Promise<string | null>;
}
