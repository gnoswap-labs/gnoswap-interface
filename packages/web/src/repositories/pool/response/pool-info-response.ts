export interface PoolInfoResponse {
  stat: {
    height: number;
    timestamp: number;
  };
  response: {
    data: {
      pool_path: string;
      token0_balance: number;
      token1_balance: number;
      tick_spacing: number;
      max_liquidity_per_tick: number;
      sqrt_price_x96: number;
      tick: number;
      fee_protocol: number;
      fee_growth_global0_x128: number;
      fee_growth_global1_x128: number;
      token0_protocol_fee: number;
      token1_protocol_fee: number;
      liquidity: number;
      ticks: number[];
      tick_bitmaps: number[];
      positions: [
        {
          owner: string;
          tick_lower: number;
          tick_upper: number;
          liquidity: number;
          token0_owed: number;
          token1_owed: number;
        },
      ];
    };
  };
}
