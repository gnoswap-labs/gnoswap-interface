import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PoolDetailRPCModel } from "@models/pool/pool-detail-rpc-model";
import {
  IncentivizePoolModel,
  IPoolDetailResponse,
  PoolModel,
} from "@models/pool/pool-model";
import { AddLiquidityRequest } from "./request/add-liquidity-request";
import { CreatePoolRequest } from "./request/create-pool-request";
import { CreateExternalIncentiveRequest } from "./request/create-external-incentive-request";
import { RemoveExternalIncentiveRequest } from "./request/remove-external-incentive-request";
import { AddLiquidityFailedResponse, AddLiquiditySuccessResponse } from "./response/add-liquidity-response";
import { CreatePoolFailedResponse, CreatePoolSuccessResponse } from "./response/create-pool-response";
import {
  SendTransactionResponse,
  WalletResponse,
} from "@common/clients/wallet-client/protocols";
import { PoolBinModel } from "@models/pool/pool-bin-model";

export interface PoolRepository {
  getPools: () => Promise<PoolModel[]>;

  getCreationFee: () => Promise<number>;

  getWithdrawalFee: () => Promise<number>;

  getUnstakingFee: () => Promise<number>;

  getPoolDetailRPCByPoolPath: (
    poolPath: string,
  ) => Promise<PoolDetailRPCModel | null>;

  getPoolDetailByPoolPath: (poolPath: string) => Promise<PoolDetailModel>;

  getBinsOfPoolByPath: (
    poolPath: string,
    count?: number,
  ) => Promise<PoolBinModel[]>;

  createPool: (
    request: CreatePoolRequest,
  ) => Promise<
    WalletResponse<CreatePoolSuccessResponse | CreatePoolFailedResponse>
  >;

  addLiquidity: (
    request: AddLiquidityRequest,
  ) => Promise<
    WalletResponse<AddLiquiditySuccessResponse | AddLiquidityFailedResponse>
  >;

  getPoolDetailByPath: (poolPath: string) => Promise<IPoolDetailResponse>;

  getIncentivizePools: () => Promise<IncentivizePoolModel[]>;

  createExternalIncentive: (
    request: CreateExternalIncentiveRequest,
  ) => Promise<WalletResponse<SendTransactionResponse<string[] | null>> | null>;

  removeExternalIncentive: (
    request: RemoveExternalIncentiveRequest,
  ) => Promise<string | null>;
}
