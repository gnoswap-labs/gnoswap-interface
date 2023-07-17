export interface PoolInfoResponse {
  pool_id: string;
  incentivized_type: "INCENTIVZED" | "NON_INCENTIVZED" | "EXTERNAL_INCENTIVZED";
  fee_rate: number;
  liquidity: TokenPair;
  rewards: Array<TokenBalance>;
}

interface TokenPair {
  token0: TokenBalance;
  token1: TokenBalance;
}

interface TokenBalance {
  token_id: string;
  name: string;
  symbol: string;
  amount: {
    value: number;
    denom: string;
  };
}
