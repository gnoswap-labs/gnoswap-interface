import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PoolDetailRPCModel } from "@models/pool/pool-detail-rpc-model";
import { IPoolDetailResponse, PoolModel } from "@models/pool/pool-model";
import { PoolRPCModel } from "@models/pool/pool-rpc-model";
import { AddLiquidityRequest } from "./request/add-liquidity-request";
import { CreatePoolRequest } from "./request/create-pool-request";
import { CreateExternalIncentiveRequest } from "./request/create-external-incentive-request";
import { RemoveExternalIncentiveRequest } from "./request/remove-external-incentive-request";

export interface PoolRepository {
  getPools: () => Promise<PoolModel[]>;

  getRPCPools: () => Promise<PoolRPCModel[]>;

  getPoolDetailRPCByPoolPath: (poolPath: string) => Promise<PoolDetailRPCModel>;

  getPoolDetailByPoolPath: (poolPath: string) => Promise<PoolDetailModel>;

  createPool: (request: CreatePoolRequest) => Promise<string | null>;

  addLiquidity: (request: AddLiquidityRequest) => Promise<string | null>;

  getPoolDetailByPath: (poolPath: string) => Promise<IPoolDetailResponse>;

  createExternalIncentive: (
    request: CreateExternalIncentiveRequest,
  ) => Promise<string | null>;

  removeExternalIncentive: (
    request: RemoveExternalIncentiveRequest,
  ) => Promise<string | null>;
}
