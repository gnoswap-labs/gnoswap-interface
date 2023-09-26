import { PoolModel } from "@models/pool/pool-model";

export interface PoolListResponse {
  message: string;
  count: number;
  meta: {
    block: number;
    ageRaw: number;
  };
  pools: PoolModel[];
}
