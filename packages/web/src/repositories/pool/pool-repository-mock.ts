import { PoolRepository } from ".";

import PoolDetailData from "./mock/pool-detail.json";
import { PoolRPCModel } from "@models/pool/pool-rpc-model";
import { PoolError } from "@common/errors/pool";
import rpcPools from "./mock/rpc-pools.json";
import { PoolRPCMapper } from "@models/pool/mapper/pool-rpc-mapper";
import { IPoolDetailResponse, PoolModel } from "@models/pool/pool-model";
import { PoolDetailRPCModel } from "@models/pool/pool-detail-rpc-model";
import PoolDetailDataByPath from "./mock/pool-detai-by-path.json";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { StakePositions } from "@hooks/earn/use-submit-position-modal";
export class PoolRepositoryMock implements PoolRepository {
  getPools = async (): Promise<PoolModel[]> => {
    return [];
  };

  getRPCPools = async (): Promise<PoolRPCModel[]> => {
    return rpcPools.map(pool => PoolRPCMapper.from(pool as any));
  };

  getPoolDetailRPCByPoolPath = async (): Promise<PoolDetailRPCModel> => {
    throw new PoolError("NOT_FOUND_POOL");
  };

  getPoolDetailByPoolPath = async (): Promise<PoolDetailModel> => {
    return PoolDetailData.pool as PoolDetailModel;
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

  createExternalIncentive = async (): Promise<StakePositions> => {
    return {
      code: 0,
      hash: "0x000"
    };
  };

  removeExternalIncentive = async (): Promise<string> => {
    return "hash";
  };
}
