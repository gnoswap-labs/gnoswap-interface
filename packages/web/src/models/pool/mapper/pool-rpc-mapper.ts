import { PoolRPCResponse } from "@repositories/pool/response/pool-rpc-response";
import { rawBySqrtX96 } from "@utils/swap-utils";
import { PoolDetailRPCModel } from "../pool-detail-rpc-model";
import { PoolRPCModel } from "../pool-rpc-model";

export class PoolRPCMapper {
  public static from(data: PoolRPCResponse): PoolRPCModel {
    const responseData = data;
    const sqrtPriceX96 = BigInt(responseData.sqrt_price_x96);
    const price = rawBySqrtX96(sqrtPriceX96);

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
        { [key in string]: string }
      >((acc, [key, value]) => {
        acc[key] = value.toString();
        return acc;
      }, {}),
      positions: responseData.positions.map(position => ({
        owner: position.owner,
        tickLower: position.tick_lower,
        tickUpper: position.tick_upper,
        liquidity: BigInt(position.liquidity),
        tokenAOwed: BigInt(position.token0_owed),
        tokenBOwed: BigInt(position.token1_owed),
      })),
    };
  }

  public static detailFrom(data: PoolRPCResponse): PoolDetailRPCModel {
    const responseData = data;
    const sqrtPriceX96 = BigInt(responseData.sqrt_price_x96);
    const price = rawBySqrtX96(sqrtPriceX96);
    const tickSpacing = responseData.tick_spacing;

    return {
      poolPath: responseData.pool_path,
      tokenAPath: responseData.token0_path,
      tokenBPath: responseData.token1_path,
      fee: responseData.fee,
      tokenABalance: BigInt(responseData.token0_balance),
      tokenBBalance: BigInt(responseData.token1_balance),
      tickSpacing,
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
        { [key in string]: string }
      >((acc, [key, value]) => {
        acc[key] = value.toString();
        return acc;
      }, {}),
      positions: data.positions.map(position => {
        const tickLower = position.tick_lower;
        const tickUpper = position.tick_upper;
        const tickCount = 1 + (tickUpper - tickLower) / tickSpacing;
        const liquidityOfTick = Number(position.liquidity) / tickCount;
        return {
          owner: position.owner,
          tickLower,
          tickUpper,
          liquidityOfTick,
          liquidity: BigInt(position.liquidity),
          tokenAOwed: BigInt(position.token0_owed),
          tokenBOwed: BigInt(position.token1_owed),
        };
      }),
    };
  }

  public static fromList(response: PoolRPCResponse[] | null): PoolRPCModel[] {
    if (!response) {
      throw new Error("mapper error");
    }

    return response.map(PoolRPCMapper.from);
  }
}
