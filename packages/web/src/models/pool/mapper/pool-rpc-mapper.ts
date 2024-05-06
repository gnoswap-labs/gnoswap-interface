import { PoolRPCResponse } from "@repositories/pool/response/pool-rpc-response";
import { rawBySqrtX96 } from "@utils/swap-utils";
import { PoolDetailRPCModel } from "../pool-detail-rpc-model";
import { PoolRPCModel } from "../pool-rpc-model";

export class PoolRPCMapper {
  public static from(data: PoolRPCResponse): PoolRPCModel {
    const responseData = data;
    const sqrtPriceX96 = BigInt(responseData.sqrtPriceX96);
    const price = rawBySqrtX96(sqrtPriceX96);

    return {
      poolPath: responseData.poolPath,
      tokenAPath: responseData.token0Path,
      tokenBPath: responseData.token1Path,
      fee: responseData.fee,
      tokenABalance: BigInt(responseData.tokenABalance),
      tokenBBalance: BigInt(responseData.tokenBBalance),
      tickSpacing: responseData.tickSpacing,
      maxLiquidityPerTick: responseData.maxLiquidityPerTick,
      price,
      sqrtPriceX96,
      tick: responseData.tick,
      feeProtocol: responseData.feeProtocol,
      tokenAProtocolFee: responseData.token0ProtocolFee,
      tokenBProtocolFee: responseData.token1ProtocolFee,
      liquidity: BigInt(responseData.liquidity),
      ticks: Object.keys(responseData.ticks).map(Number),
      tickDetails: responseData.ticks,
      tickBitmaps: Object.entries(responseData.tickBitmaps).reduce<{
        [key in string]: string;
      }>((acc, [key, value]) => {
        acc[key] = value.toString();
        return acc;
      }, {}),
      positions: responseData.positions.map(position => ({
        owner: position.owner,
        tickLower: position.tickLower,
        tickUpper: position.tickUpper,
        liquidity: BigInt(position.liquidity),
        tokenAOwed: BigInt(position.token0Owed),
        tokenBOwed: BigInt(position.token1Owed),
      })),
    };
  }

  public static detailFrom(data: PoolRPCResponse): PoolDetailRPCModel {
    const responseData = data;
    const sqrtPriceX96 = BigInt(responseData.sqrtPriceX96);
    const price = rawBySqrtX96(sqrtPriceX96);
    const tickSpacing = responseData.tickSpacing;

    return {
      poolPath: responseData.poolPath,
      tokenAPath: responseData.token0Path,
      tokenBPath: responseData.token1Path,
      fee: responseData.fee,
      tokenABalance: BigInt(responseData.tokenABalance),
      tokenBBalance: BigInt(responseData.tokenBBalance),
      tickSpacing,
      maxLiquidityPerTick: responseData.maxLiquidityPerTick,
      price,
      sqrtPriceX96,
      tick: responseData.tick,
      feeProtocol: responseData.feeProtocol,
      tokenAProtocolFee: responseData.token0ProtocolFee,
      tokenBProtocolFee: responseData.token1ProtocolFee,
      liquidity: BigInt(responseData.liquidity),
      ticks: Object.keys(responseData.ticks).map(Number),
      tickDetails: responseData.ticks,
      tickBitmaps: Object.entries(responseData.tickBitmaps).reduce<{
        [key in string]: string;
      }>((acc, [key, value]) => {
        acc[key] = value.toString();
        return acc;
      }, {}),
      positions: data.positions.map(position => {
        const tickLower = position.tickLower;
        const tickUpper = position.tickUpper;
        const tickCount = 1 + (tickUpper - tickLower) / tickSpacing;
        const liquidityOfTick = Number(position.liquidity) / tickCount;
        return {
          owner: position.owner,
          tickLower,
          tickUpper,
          liquidityOfTick,
          liquidity: BigInt(position.liquidity),
          tokenAOwed: BigInt(position.token0Owed),
          tokenBOwed: BigInt(position.token1Owed),
        };
      }),
    };
  }

  public static toDetail(data: PoolRPCModel): PoolDetailRPCModel {
    const tickSpacing = data.tickSpacing;

    return {
      ...data,
      positions: data.positions.map(position => {
        const tickLower = position.tickLower;
        const tickUpper = position.tickUpper;
        const tickCount = 1 + (tickUpper - tickLower) / tickSpacing;
        const liquidityOfTick = Number(position.liquidity) / tickCount;
        return {
          ...position,
          liquidityOfTick,
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
