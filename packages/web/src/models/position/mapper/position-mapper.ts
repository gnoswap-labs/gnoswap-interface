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
import { INCENTIVE_TYPE } from "@constants/option.constant";

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
      // unclaimedFee0Usd: position.unclaimedFee0Usd,
      // unclaimedFee1Usd: position.unclaimedFee0Usd,
      // tokensOwed0Amount: BigInt(0),
      // tokensOwed1Amount: BigInt(0),
      // tokensOwed0Usd: position.tokensOwed0Usd,
      // tokensOwed1Usd: position.tokensOwed1Usd,
      apr: `${position.apr}` ?? "",
      stakedAt: position.stakedAt || "",
      stakedUsdValue: position.stakedUsdValue || "0",
      reward: position.reward?.map(PositionMapper.rewardFromResponse) || [],
      // dailyRewards:
      //   position.reward?.map(PositionMapper.rewardFromResponse) || [],
      closed: position.closed,
      // bins: position.bins,
      totalDailyRewardsUsd: toUnitFormat(position.totalDailyRewardsUsd, true, true),
      bins40: position.bins40,
      totalClaimedUsd: position.totalClaimedUsd,
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
      accuReward1D:
        reward.accuReward1D !== "" ? reward.accuReward1D : null,
      apr: reward.apr !== "" ? Number(reward.apr) : null,
      totalAmount: Number(reward.totalAmount),
      claimableAmount: Number(reward.claimableAmount),
      claimableUsd: reward.claimableUsd,
      rewardType: reward.rewardType,
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
