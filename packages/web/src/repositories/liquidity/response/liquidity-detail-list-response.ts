export interface LiquidityDetailListResponse {
  total: number;
  hits: number;
  liquidities: Array<LiquidityInfo>;
}

interface LiquidityInfo {
  pool_id: string;
  liquidity_id: string;
  liquidity_type: "NONE" | "PROVIDED";
  stake_type: "NONE" | "STAKED" | "UNSTAKING";
  in_range: boolean;
  max_rate: number;
  min_rate: number;
  fee_rate: number;
  liquidity: TokenPair;
  reward: {
    swap: TokenPair;
    staking: TokenPair;
  };
  apr: TokenPair;
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
