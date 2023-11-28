import { PoolDetailResponse, PoolListResponse, PoolRepository } from ".";

import PoolListData from "./mock/pools.json";
import PoolDetailData from "./mock/pool-detail.json";
import { PoolRPCModel } from "@models/pool/pool-rpc-model";
import { PoolError } from "@common/errors/pool";
import rpcPools from "./mock/rpc-pools.json";
import { PoolRPCMapper } from "@models/pool/mapper/pool-rpc-mapper";
export class PoolRepositoryMock implements PoolRepository {
  getPools = async (): Promise<PoolListResponse> => {
    return PoolListData as PoolListResponse;
  };

  getRPCPools = async (): Promise<PoolRPCModel[]> => {
    return rpcPools.map(pool => PoolRPCMapper.from(pool as any));
  };

  getPoolInfoByPoolPath = async (): Promise<PoolRPCModel> => {
    throw new PoolError("NOT_FOUND_POOL");
  };

  getPoolDetailByPoolId = async (): Promise<PoolDetailResponse> => {
    return PoolDetailData as PoolDetailResponse;
  };

  createPool = async (): Promise<string> => {
    return "hash";
  };
}
