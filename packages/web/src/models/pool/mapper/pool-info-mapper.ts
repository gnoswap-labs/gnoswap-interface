import { PoolInfoResponse } from "@repositories/pool/response/pool-info-response";
import { rawBySqrtX96 } from "@utils/swap-utils";
import { PoolInfoModel } from "../pool-info-model";

export class PoolInfoMapper {
  public static fromResponse(response: PoolInfoResponse | null): PoolInfoModel {
    if (!response) {
      throw new Error("mapper error");
    }
    const sqrtPriceX96 = response.response.data.sqrt_price_x96;
    const price = rawBySqrtX96(sqrtPriceX96);

    return {
      poolPath: response.response.data.pool_path,
      tokenABalance: response.response.data.token0_balance,
      tokenBBalance: response.response.data.token1_balance,
      tickSpacing: response.response.data.tick_spacing,
      maxLiquidityPerTick: response.response.data.max_liquidity_per_tick,
      price,
      sqrtPriceX96,
      tick: response.response.data.tick,
      feeProtocol: response.response.data.fee_protocol,
      feeGrowthGlobal0X128: response.response.data.fee_growth_global0_x128,
      feeGrowthGlobal1X128: response.response.data.fee_growth_global1_x128,
      tokenAProtocolFee: response.response.data.token0_protocol_fee,
      tokenBProtocolFee: response.response.data.token1_protocol_fee,
      liquidity: response.response.data.liquidity,
      ticks: response.response.data.ticks,
      tickBitmaps: response.response.data.tick_bitmaps,
      positions: [] as any,
    };
  }
}
