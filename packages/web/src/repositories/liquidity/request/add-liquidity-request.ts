export interface AddLiquidityRequest {
  liquidity: Liquidity;
  options: LiquidityOption;
}

interface Liquidity {
  token0: LiquidityToken;
  token1: LiquidityToken;
}

interface LiquidityToken {
  tokenId: string;
  amount: {
    value: string;
    denom: string;
  };
}

interface LiquidityOption {
  rangeType: "ACTIVE" | "PASSIVE" | "CUSTOM";
  feeRate: number;
  minRate: number;
  maxRate: number;
}
