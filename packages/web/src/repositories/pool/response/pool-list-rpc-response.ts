import { PoolRPCResponse } from "./pool-rpc-response";

export interface PoolListRPCResponse {
  stat: {
    height: number;
    timestamp: number;
  };
  response: {
    data: PoolRPCResponse[];
  };
}
