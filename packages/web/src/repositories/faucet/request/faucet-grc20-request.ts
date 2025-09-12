// JSON-RPC request type
export interface FaucetGRC20Request {
  id: number;
  jsonrpc: "2.0";
  method: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any[];
}
