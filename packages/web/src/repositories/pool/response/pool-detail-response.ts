import { PoolDetailModel } from "@models/pool/pool-detail-model";

export interface PoolDetailResponse {
  message: string;
  pool: PoolDetailModel;
}
