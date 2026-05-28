import { PoolPricesResponse, PoolRepository } from ".";

import { SendTransactionResponse, WalletResponse } from "@common/clients/wallet-client/protocols";
import { DEFAULT_INCENTIVE_CREATION_DEPOSIT_GNS_AMOUNT } from "@common/values";
import { PoolRPCMapper } from "@models/pool/mapper/pool-rpc-mapper";
import { PoolBinModel } from "@models/pool/pool-bin-model";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PoolLiquidityTickModel } from "@models/pool/pool-liquidity-model";
import { IncentivizePoolModel, IPoolDetailResponse, PoolModel } from "@models/pool/pool-model";
import { PoolRPCModel } from "@models/pool/pool-rpc-model";
import { PoolStakingModel } from "@models/pool/pool-staking";
import PoolDetailDataByPath from "./mock/pool-detai-by-path.json";
import PoolDetailData from "./mock/pool-detail.json";
import rpcPools from "./mock/rpc-pools.json";
import { CHART_DAY_SCOPE_TYPE } from "@constants/option.constant";

export class PoolRepositoryMock implements PoolRepository {
  getWithdrawalFee = async (): Promise<number> => {
    return 0;
  };

  getUnstakingFee = async (): Promise<number> => {
    return 0;
  };

  getIncentivizePools = async (): Promise<IncentivizePoolModel[]> => {
    return [];
  };

  getPools = async (): Promise<PoolModel[]> => {
    return [];
  };

  getRPCPools = async (): Promise<PoolRPCModel[]> => {
    return rpcPools.map(pool => PoolRPCMapper.from(pool as never));
  };

  getPoolStakingList = async (): Promise<PoolStakingModel[]> => {
    return [];
  };

  getPoolStakingListByAddress = async (): Promise<PoolStakingModel[]> => {
    return [];
  };

  getLatestBlockHeight = async (): Promise<string> => {
    return "";
  };

  getCreationFee = async (): Promise<number> => {
    return 0;
  };

  getIncentiveCreationDeposit = async (): Promise<string> => {
    return DEFAULT_INCENTIVE_CREATION_DEPOSIT_GNS_AMOUNT;
  };

  getPoolDetailByPoolPath = async (): Promise<PoolDetailModel> => {
    return PoolDetailData.pool as never;
  };

  getBinsOfPoolByPath = async (): Promise<PoolBinModel[]> => {
    return [];
  };

  getLiquidityTicksOfPoolByPath = async (): Promise<PoolLiquidityTickModel[]> => {
    return [];
  };

  createPool = async () => {
    throw new Error("Not implements");
  };

  addLiquidity = async () => {
    throw new Error("Not implements");
  };

  getPoolDetailByPath = async (poolPath: string): Promise<IPoolDetailResponse> => {
    console.log(poolPath);
    return PoolDetailDataByPath as IPoolDetailResponse;
  };

  getPoolPriceByPoolPath = async (poolPath: string, period?: CHART_DAY_SCOPE_TYPE): Promise<PoolPricesResponse> => {
    console.log(poolPath, period);
    return { prices: [] };
  };

  createExternalIncentive = async (): Promise<WalletResponse<SendTransactionResponse<string[] | null>> | null> => {
    return null;
  };

  removeExternalIncentive = async (): Promise<string> => {
    return "hash";
  };

  collectExternalIncentivePenalty = async (): Promise<string> => {
    return "hash";
  };

  getPoolSqrtPriceX96 = async (poolPath: string): Promise<bigint> => {
    console.log("Mock getPoolSqrtPriceX96:", poolPath);
    return 79228162514264337593543950336n;
  };

  getPoolLiquidity = async (poolPath: string): Promise<string> => {
    console.log("Mock getPoolLiquidity:", poolPath);
    return "1000000";
  };

  getPoolTicks = async (
    poolPath: string,
    tickLower: number = -887272,
    tickUpper: number = 887272,
  ): Promise<number[]> => {
    console.log("Mock getPoolTicks:", poolPath, tickLower, tickUpper);
    return [-1000, -500, 0, 500, 1000];
  };

  getPoolTickSpacing = async (poolPath: string): Promise<number> => {
    console.log("Mock getPoolTickSpacing:", poolPath);
    return 10;
  };
}
