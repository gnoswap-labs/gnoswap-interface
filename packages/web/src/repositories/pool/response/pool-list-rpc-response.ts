import { PoolRPCResponse } from "./pool-info-response";

export interface PoolListRPCResponse {
  stat: {
    height: number;
    timestamp: number;
  };
  response: {
    data: PoolRPCResponse[];
  };
}
