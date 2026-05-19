import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { IncentivizePoolModel, PoolModel } from "@models/pool/pool-model";
import { AddLiquidityRequest } from "./request/add-liquidity-request";
import { CreatePoolRequest } from "./request/create-pool-request";
import { CreateExternalIncentiveRequest } from "./request/create-external-incentive-request";
import { CollectExternalIncentivePenaltyRequest } from "./request/collect-external-incentive-penalty-request";
import { RemoveExternalIncentiveRequest } from "./request/remove-external-incentive-request";
import { AddLiquidityFailedResponse, AddLiquiditySuccessResponse } from "./response/add-liquidity-response";
import { CreatePoolFailedResponse, CreatePoolSuccessResponse } from "./response/create-pool-response";
import { SendTransactionResponse, WalletResponse } from "@common/clients/wallet-client/protocols";
import { PoolBinModel } from "@models/pool/pool-bin-model";
import { PoolStakingModel } from "@models/pool/pool-staking";
import { PoolPricesResponse } from "./response";
import { CHART_DAY_SCOPE_TYPE } from "@constants/option.constant";

export interface PoolRepository {
  getPools: () => Promise<PoolModel[]>;

  getCreationFee: () => Promise<number>;

  getIncentiveCreationDeposit: () => Promise<string>;

  getWithdrawalFee: () => Promise<number>;

  getUnstakingFee: () => Promise<number>;

  getLatestBlockHeight: () => Promise<string>;

  getPoolDetailByPoolPath: (poolPath: string) => Promise<PoolDetailModel>;

  getBinsOfPoolByPath: (poolPath: string, count?: number) => Promise<PoolBinModel[]>;

  getPoolPriceByPoolPath: (poolPath: string, period?: CHART_DAY_SCOPE_TYPE) => Promise<PoolPricesResponse>;

  createPool: (
    request: CreatePoolRequest,
  ) => Promise<WalletResponse<CreatePoolSuccessResponse | CreatePoolFailedResponse>>;

  addLiquidity: (
    request: AddLiquidityRequest,
  ) => Promise<WalletResponse<AddLiquiditySuccessResponse | AddLiquidityFailedResponse>>;

  getIncentivizePools: (address?: string) => Promise<IncentivizePoolModel[]>;

  createExternalIncentive: (
    request: CreateExternalIncentiveRequest,
  ) => Promise<WalletResponse<SendTransactionResponse<string[] | null>> | null>;

  removeExternalIncentive: (request: RemoveExternalIncentiveRequest) => Promise<string | null>;

  collectExternalIncentivePenalty: (request: CollectExternalIncentivePenaltyRequest) => Promise<string | null>;

  getPoolStakingList: (poolPath: string) => Promise<PoolStakingModel[]>;

  getPoolStakingListByAddress: (address: string) => Promise<PoolStakingModel[]>;

  getPoolLiquidity: (poolPath: string) => Promise<string>;

  getPoolTicks: (poolPath: string, tickLower?: number, tickUpper?: number) => Promise<number[]>;

  getPoolTickSpacing: (poolPath: string) => Promise<number>;

  getPoolSqrtPriceX96: (poolPath: string) => Promise<bigint>;
}
