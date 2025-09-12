export interface FaucetGRC20SuccessResponse {
  jsonrpc: "2.0";
  id: number;
  result: string;
}

export interface FaucetGRC20ErrorResponse {
  jsonrpc: "2.0";
  id: number;
  error: {
    message: string;
    code: number;
  };
}

export type FaucetGRC20JsonRpcResponse = FaucetGRC20SuccessResponse | FaucetGRC20ErrorResponse;

export type FaucetGRC20Response = FaucetGRC20JsonRpcResponse | string;
