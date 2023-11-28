import { fromSqrtX96, Pool } from "../swap-simulator";

export function makePool(data: any): Pool {
  const responseData = data;
  const sqrtPriceX96 = BigInt(responseData.sqrt_price_x96);
  const price = fromSqrtX96(data.sqrt_price_x96);

  return {
    poolPath: responseData.pool_path,
    tokenAPath: responseData.token0_path,
    tokenBPath: responseData.token1_path,
    fee: responseData.fee,
    tokenABalance: BigInt(responseData.token0_balance),
    tokenBBalance: BigInt(responseData.token1_balance),
    tickSpacing: responseData.tick_spacing,
    maxLiquidityPerTick: responseData.max_liquidity_per_tick,
    price,
    sqrtPriceX96,
    tick: responseData.tick,
    feeProtocol: responseData.fee_protocol,
    tokenAProtocolFee: responseData.token0_protocol_fee,
    tokenBProtocolFee: responseData.token1_protocol_fee,
    liquidity: BigInt(responseData.liquidity),
    ticks: responseData.ticks,
    tickBitmaps: Object.entries(responseData.tick_bitmaps).reduce<
      { [key in string]: bigint }
    >((acc, [key, value]) => {
      acc[key] = BigInt(value as string);
      return acc;
    }, {}),
    positions: responseData.positions.map((position: any) => ({
      liquidity: BigInt(position.liquidity),
      owner: position.owner,
      tickLower: position.tick_lower,
      tickUpper: position.tick_upper,
      tokenAOwed: BigInt(position.token0_owed),
      tokenBOwed: BigInt(position.token1_owed),
    })),
  };
}

export function makePoolsByRPC(pools: any[]): Pool[] {
  return pools.map(makePool);
}
