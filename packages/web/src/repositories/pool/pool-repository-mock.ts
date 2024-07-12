import { PoolRepository } from ".";

import PoolDetailData from "./mock/pool-detail.json";
import { PoolRPCModel } from "@models/pool/pool-rpc-model";
import { PoolError } from "@common/errors/pool";
import rpcPools from "./mock/rpc-pools.json";
import { PoolRPCMapper } from "@models/pool/mapper/pool-rpc-mapper";
import {
  IncentivizePoolModel,
  IPoolDetailResponse,
  PoolModel,
} from "@models/pool/pool-model";
import { PoolDetailRPCModel } from "@models/pool/pool-detail-rpc-model";
import PoolDetailDataByPath from "./mock/pool-detai-by-path.json";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import {
  SendTransactionResponse,
  WalletResponse,
} from "@common/clients/wallet-client/protocols";
import { PoolBinModel } from "@models/pool/pool-bin-model";
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
    return rpcPools.map(pool => PoolRPCMapper.from(pool as any));
  };

  getCreationFee = async (): Promise<number> => {
    return 0;
  };

  getPoolDetailRPCByPoolPath = async (): Promise<PoolDetailRPCModel> => {
    throw new PoolError("NOT_FOUND_POOL");
  };

  getPoolDetailByPoolPath = async (): Promise<PoolDetailModel> => {
    return PoolDetailData.pool as any;
  };

  getBinsOfPoolByPath = async (): Promise<PoolBinModel[]> => {
    return [];
  };

  createPool = async () => {
    throw new Error("Not implements");
  };

  addLiquidity = async () => {
    throw new Error("Not implements");
  };

  getPoolDetailByPath = async (
    poolPath: string,
  ): Promise<IPoolDetailResponse> => {
    console.log(poolPath);

    return PoolDetailDataByPath as IPoolDetailResponse;
  };

  createExternalIncentive = async (): Promise<WalletResponse<
    SendTransactionResponse<string[] | null>
  > | null> => {
    return null;
  };

  removeExternalIncentive = async (): Promise<string> => {
    return "hash";
  };
}
