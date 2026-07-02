import { PoolModel } from "@models/pool/pool-model";
import { TokenPairAmountInfo } from "@models/token/token-pair-amount-info";
import { PositionResponse } from "@repositories/position/response";
import { RewardResponse } from "@repositories/position/response/reward-response";
import { PoolPositionModel } from "../pool-position-model";
import { PositionModel } from "../position-model";
import { RewardModel } from "../reward-model";
import { toUnitFormat } from "@utils/number-utils";
import { formatDisplayTokenSymbol } from "@utils/token-utils";
import { SwapFeeTierInfoMap } from "@constants/option.constant";

export class PositionMapper {
  public static toTokenPairAmount(position: PoolPositionModel): TokenPairAmountInfo {
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
    return {
      id: Number(position.lpTokenId),
      lpTokenId: position.lpTokenId,
      poolPath: position.poolPath,
      staked: position.staked,
      owner: position.owner,
      tickLower: Number(position.tickLower),
      tickUpper: Number(position.tickUpper),
      liquidity: BigInt(position.liquidity),
      tokenABalance: position.tokenABalance,
      tokenBBalance: position.tokenBBalance,
      positionUsdValue: position.usdValue,
      unclaimedFeeAAmount: position.unclaimedFeeAAmount,
      unclaimedFeeBAmount: position.unclaimedFeeBAmount,
      apr: position.apr?.toString() ?? "",
      stakedAt: position.stakedAt || "",
      stakedUsdValue: position.stakedUsd || "",
      rewards: position.rewards?.map(PositionMapper.rewardFromResponse) || [],
      claimedRewards: position.claimedRewards || [],
      closed: position.closed,
      totalDailyRewardsUsd: toUnitFormat(position.totalDailyRewardsUsd ?? "", true, true),
      totalClaimedUsd: position.totalClaimedUsd,
      usdValue: Number(position.usdValue),
      tokenUri: position.tokenUri,
    };
  }

  public static fromList(positions: PositionResponse[]): PositionModel[] {
    return positions.map(PositionMapper.from);
  }

  public static rewardFromResponse(reward: RewardResponse): RewardModel {
    return {
      rewardToken: {
        ...reward.rewardToken,
        displaySymbol: formatDisplayTokenSymbol(reward.rewardToken.symbol),
      },
      accuReward1D: reward.accuReward1D,
      apr: reward.apr !== "" ? Number(reward.apr) : null,
      totalAmount: reward.totalAmount,
      claimableAmount: reward.claimableAmount,
      claimableUsd: reward.claimableUsd,
      // rewardType: reward.rewardType.toUpperCase() as RewardType,
    };
  }

  public static makePoolPosition(positionModel: PositionModel, poolModel: PoolModel): PoolPositionModel {
    const feeTierInfo = Object.values(SwapFeeTierInfoMap).find(info => `${info.fee}` === poolModel.fee.toString());
    return {
      ...positionModel,
      feeTier: feeTierInfo?.type || "NONE",
      pool: poolModel,
    };
  }
}
