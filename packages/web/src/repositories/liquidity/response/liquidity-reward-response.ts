export interface LiquidityRewardResponse {
  pool_id: string;
  is_claim: boolean;
  total_balance: TokenPair;
  daily_earning: TokenPair;
  reward: {
    staking: TokenPair;
    swap: TokenPair;
  };
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
