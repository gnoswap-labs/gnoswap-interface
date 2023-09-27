import { PoolModel } from "@models/pool/pool-model";

export interface PoolListResponse {
  meta: {
    height: number;
    timestamp: string;
  };
  pools: PoolModel[];
}
