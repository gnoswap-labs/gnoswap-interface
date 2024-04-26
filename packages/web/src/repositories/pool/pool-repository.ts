import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PoolDetailRPCModel } from "@models/pool/pool-detail-rpc-model";
import { IPoolDetailResponse, PoolModel } from "@models/pool/pool-model";
import { PoolRPCModel } from "@models/pool/pool-rpc-model";
import { AddLiquidityRequest } from "./request/add-liquidity-request";
import { CreatePoolRequest } from "./request/create-pool-request";
import { CreateExternalIncentiveRequest } from "./request/create-external-incentive-request";
import { RemoveExternalIncentiveRequest } from "./request/remove-external-incentive-request";
import { AddLiquidityResponse } from "./response/add-liquidity-response";
import { CreatePoolResponse } from "./response/create-pool-response";
import { SendTransactionResponse, WalletResponse } from "@common/clients/wallet-client/protocols";
import { PoolBinModel } from "@models/pool/pool-bin-model";

export interface PoolRepository {
  getPools: () => Promise<PoolModel[]>;

  getRPCPools: () => Promise<PoolRPCModel[]>;

  getPoolDetailRPCByPoolPath: (poolPath: string) => Promise<PoolDetailRPCModel>;

  getPoolDetailByPoolPath: (poolPath: string) => Promise<PoolDetailModel>;

  getBinsOfPoolByPath: (poolPath: string) => Promise<PoolBinModel[]>;

  createPool: (request: CreatePoolRequest) => Promise<CreatePoolResponse>;

  addLiquidity: (request: AddLiquidityRequest) => Promise<AddLiquidityResponse>;

  getPoolDetailByPath: (poolPath: string) => Promise<IPoolDetailResponse>;

  createExternalIncentive: (
    request: CreateExternalIncentiveRequest,
  ) => Promise<WalletResponse<SendTransactionResponse<string[] | null>> | null>;

  removeExternalIncentive: (
    request: RemoveExternalIncentiveRequest,
  ) => Promise<string | null>;
}
