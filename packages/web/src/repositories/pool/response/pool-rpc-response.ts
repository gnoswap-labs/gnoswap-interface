export interface PoolRPCResponse {
  pool_path: string;
  token0_path: string;
  token1_path: string;
  fee: number;
  token0_balance: string;
  token1_balance: string;
  tick_spacing: number;
  max_liquidity_per_tick: number;
  sqrt_price_x96: string;
  tick: number;
  fee_protocol: number;
  token0_protocol_fee: number;
  token1_protocol_fee: number;
  liquidity: string;
  ticks: number[];
  tick_bitmaps: { [key in number]: bigint };
  positions: {
    owner: string;
    tick_lower: number;
    tick_upper: number;
    liquidity: string;
    token0_owed: string;
    token1_owed: string;
  }[];
}

export interface PoolListRPCResponse {
  stat: {
    height: number;
    timestamp: number;
  };
  response: {
    data: PoolRPCResponse[];
  };
}
