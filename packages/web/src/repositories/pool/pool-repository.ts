import { PoolInfoModel } from "@models/pool/pool-info-model";
import { CreatePoolRequest } from "./request/create-pool-request";
import { PoolDetailResponse, PoolListResponse } from "./response";

export interface PoolRepository {
  getPools: () => Promise<PoolListResponse>;

  getPoolInfoByPoolPath: (poolPath: string) => Promise<PoolInfoModel>;

  getPoolDetailByPoolId: (poolId: string) => Promise<PoolDetailResponse>;

  createPool: (request: CreatePoolRequest) => Promise<string | null>;
}
