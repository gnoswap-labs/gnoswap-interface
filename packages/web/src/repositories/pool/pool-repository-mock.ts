import { PoolDetailResponse, PoolListResponse, PoolRepository } from ".";

import PoolListData from "./mock/pools.json";
import PoolDetailData from "./mock/pool-detail.json";
import { PoolInfoModel } from "@models/pool/pool-info-model";
import { PoolError } from "@common/errors/pool";

export class PoolRepositoryMock implements PoolRepository {
  getPools = async (): Promise<PoolListResponse> => {
    return PoolListData as PoolListResponse;
  };

  getPoolInfoByPoolPath = async (): Promise<PoolInfoModel> => {
    throw new PoolError("NOT_FOUND_POOL");
  };

  getPoolDetailByPoolId = async (): Promise<PoolDetailResponse> => {
    return PoolDetailData as PoolDetailResponse;
  };

  createPool = async (): Promise<string> => {
    return "hash";
  };
}
