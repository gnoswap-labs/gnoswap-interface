import { PoolRPCModel } from "@models/pool/pool-rpc-model";
import { CreatePoolRequest } from "./request/create-pool-request";
import { PoolDetailResponse, PoolListResponse } from "./response";

export interface PoolRepository {
  getPools: () => Promise<PoolListResponse>;

  getRPCPools: () => Promise<PoolRPCModel[]>;

  getPoolInfoByPoolPath: (poolPath: string) => Promise<PoolRPCModel>;

  getPoolDetailByPoolId: (poolId: string) => Promise<PoolDetailResponse>;

  createPool: (request: CreatePoolRequest) => Promise<string | null>;
}
