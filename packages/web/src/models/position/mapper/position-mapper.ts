import { PoolModel } from "@models/pool/pool-model";
import { TokenPairAmountInfo } from "@models/token/token-pair-amount-info";
import {
  PositionListResponse,
  PositionResponse,
} from "@repositories/position/response";
import { RewardResponse } from "@repositories/position/response/reward-response";
import { PoolPositionModel } from "../pool-position-model";
import { PositionModel } from "../position-model";
import { RewardModel } from "../reward-model";
import { toUnitFormat } from "@utils/number-utils";
import { INCENTIVE_TYPE, RewardType } from "@constants/option.constant";

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
        amount: Number(position.tokenABalance),
        currency: tokenA.symbol,
      },
      tokenBAmount: {
        amount: Number(position.tokenBBalance),
        currency: tokenB.symbol,
      },
    };
  }

  public static from(position: PositionResponse): PositionModel {
    const id = position.lpTokenId;

    return {
      id,
      lpTokenId: position.lpTokenId,
      poolPath: position.poolPath,
      staked: position.staked,
      operator: position.operator,
      tickLower: Number(position.tickLower),
      tickUpper: Number(position.tickUpper),
      liquidity: BigInt(position.liquidity),
      tokenABalance: Number(position.tokenABalance),
      tokenBBalance: Number(position.tokenBBalance),
      positionUsdValue: position.usdValue,
      unclaimedFeeAAmount: Number(position.unclaimedFeeAAmount),
      unclaimedFeeBAmount: Number(position.unclaimedFeeBAmount),
      apr: `${position.apr}` ?? "",
      stakedAt: position.stakedAt || "",
      stakedUsdValue: position.stakedUsd || "0",
      reward: position.reward?.map(PositionMapper.rewardFromResponse) || [],
      closed: position.closed,
      totalDailyRewardsUsd: toUnitFormat(
        position.totalDailyRewardsUsd,
        true,
        true,
      ),
      bins40: [],
      totalClaimedUsd: position.totalClaimedUsd || "0",
      usdValue: Number(position.usdValue),
      incentiveType: position.incentiveType as INCENTIVE_TYPE,
    };
  }

  public static fromList(positions: PositionListResponse): PositionModel[] {
    return positions.map(PositionMapper.from);
  }

  public static rewardFromResponse(reward: RewardResponse): RewardModel {
    return {
      rewardToken: reward.rewardToken,
      accuReward1D: reward.accuReward1D !== "" ? reward.accuReward1D : null,
      apr: reward.apr !== "" ? Number(reward.apr) : null,
      totalAmount: Number(reward.totalAmount),
      claimableAmount: Number(reward.claimableAmount),
      claimableUsd: reward.claimableUsd || "0",
      rewardType: reward.rewardType.toUpperCase() as RewardType,
    };
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
