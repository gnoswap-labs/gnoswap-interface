import { PoolDetailResponse, PoolListResponse, PoolRepository } from ".";

import PoolListData from "./mock/pools.json";
import PoolDetailData from "./mock/pool-detail.json";

export const MOCK_BINS = PoolListData.pools[0].bins;

export class PoolRepositoryMock implements PoolRepository {
  getPools = async (): Promise<PoolListResponse> => {
    return PoolListData as PoolListResponse;
  };

  getPoolDetailByPoolId = async (): Promise<PoolDetailResponse> => {
    return PoolDetailData as PoolDetailResponse;
  };

  createPool = async (): Promise<string> => {
    return "hash";
  };
}
