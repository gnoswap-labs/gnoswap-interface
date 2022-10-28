export interface NetworkConfig {
  chainId: string;
  chainName: string;
  addressPrefix: string;
  rpcUrl: string;
  gnoUrl: string;
  explorerUrl: string;
  httpUrl: string;
  token: {
    coinDenom: string;
    coinDecimals: number;
    coinMinimalDenom: string;
  };
  gasPrice: number;
}
