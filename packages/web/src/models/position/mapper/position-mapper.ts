import { IncentivizedOptions } from "@common/values";
import { PoolModel } from "@models/pool/pool-model";
import { TokenPairAmountInfo } from "@models/token/token-pair-amount-info";
import {
  PositionListResponse,
  PositionResponse,
} from "@repositories/position/response";
import { PoolPositionModel } from "../pool-position-model";
import { PositionModel } from "../position-model";

export class PositionMapper {
  public static toTokenPairAmount(
    position: PoolPositionModel,
  ): TokenPairAmountInfo {
    const tokenA = position.pool.tokenA;
    const tokenB = position.pool.tokenB;

    return {
      tokenA,
      tokenB,
      tokenAAmount: {
        amount: Number(position.token0Balance),
        currency: tokenA.symbol,
      },
      tokenBAmount: {
        amount: Number(position.token1Balance),
        currency: tokenB.symbol,
      },
    };
  }

  public static from(position: PositionResponse): PositionModel {
    const id = position.lpTokenId;
    const incentivizedType: IncentivizedOptions = position.incentivized
      ? "INCENTIVIZED"
      : "NON_INCENTIVIZED";

    return {
      id,
      lpTokenId: position.lpTokenId,
      incentivizedType,
      poolPath: position.poolPath,
      staked: position.staked,
      operator: position.operator,
      tickLower: Number(position.tickLower),
      tickUpper: Number(position.tickUpper),
      liquidity: BigInt(position.liquidity),
      token0Balance: BigInt(position.token0Balance),
      token1Balance: BigInt(position.token1Balance),
      positionUsdValue: position.positionUsdValue,
      unclaimedFee0Amount: BigInt(position.unclaimedFee0Amount),
      unclaimedFee1Amount: BigInt(position.unclaimedFee1Amount),
      unclaimedFee0Usd: position.unclaimedFee0Usd,
      unclaimedFee1Usd: position.unclaimedFee1Usd,
      tokensOwed0Amount: BigInt(position.tokensOwed0Amount),
      tokensOwed1Amount: BigInt(position.tokensOwed1Amount),
      tokensOwed0Usd: position.tokensOwed0Usd,
      tokensOwed1Usd: position.tokensOwed1Usd,
      apr: "0",
      rewards: [],
    };
  }

  public static fromList(positions: PositionListResponse): PositionModel[] {
    return positions.map(PositionMapper.from);
  }

  public static makePoolPosition(
    positionModel: PositionModel,
    poolModel: PoolModel,
  ): PoolPositionModel {
    return {
      ...positionModel,
      pool: poolModel,
    };
  }
}
