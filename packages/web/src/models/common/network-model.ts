export interface NetworkModel {
  name: string;
  chainId: string;
  rpcUrl: string;
  /** Optional second RPC endpoint used once `rpcUrl` stops answering. */
  fallbackRpcUrl?: string;
  wsUrl: string;
  apiUrl: string;
  routerUrl: string;
  scannerUrl: string;
}
