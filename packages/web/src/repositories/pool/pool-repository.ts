import { PoolDetailRPCModel } from "@models/pool/pool-detail-rpc-model";
import { PoolModel } from "@models/pool/pool-model";
import { PoolRPCModel } from "@models/pool/pool-rpc-model";
import { AddLiquidityRequest } from "./request/add-liquidity-request";
import { CreatePoolRequest } from "./request/create-pool-request";
import { PoolDetailResponse } from "./response";

export interface PoolRepository {
  getPools: () => Promise<PoolModel[]>;

  getRPCPools: () => Promise<PoolRPCModel[]>;

  getPoolDetailRPCByPoolPath: (poolPath: string) => Promise<PoolDetailRPCModel>;

  getPoolDetailByPoolId: (poolId: string) => Promise<PoolDetailResponse>;

  createPool: (request: CreatePoolRequest) => Promise<string | null>;

  addLiquidity: (request: AddLiquidityRequest) => Promise<string | null>;
}
