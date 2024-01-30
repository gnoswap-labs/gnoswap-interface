export interface TokenResponse {
  type: "native" | "grc20";
  chainId: string;
  name: string;
  decimals: 6;
  symbol: string;
  path: string;
  wrappedPath?: string;
}
