import { WalletResponse } from "./wallet-response";

export interface WalletNetworkMethod {
  addNetwork: (
    network: AddNetworkRequestParam,
  ) => Promise<WalletResponse<AddNetworkResponse>>;

  switchNetwork: (
    chainId: string,
  ) => Promise<WalletResponse<SwitchNetworkResponse>>;
}

export interface AddNetworkRequestParam {
  chainId: string;
  rpcUrl: string;
  chainName: string;
}

export interface AddNetworkResponse {
  chainId: string;
  rpcUrl: string;
  chainName: string;
}

export interface SwitchNetworkResponse {
  chainId: string;
}
