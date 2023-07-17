import { TokenPairModelMapper } from "@models/token/mapper/token-pair-model-mapper";
import { LiquidityRewardResponse } from "@repositories/liquidity";
import { LiquidityRewardSummaryModel } from "@models/liquidity/liquidity-reward-summary-model";

export class LiquidityRewardModelMapper {
  public static fromResponse(
    response: LiquidityRewardResponse,
  ): LiquidityRewardSummaryModel {
    const {
      pool_id,
      daily_earning,
      is_claim,
      reward,
      total_balance,
    } = response;
    return {
      poolId: pool_id,
      isClaim: is_claim,
      totalBalance: TokenPairModelMapper.fromResposne(total_balance),
      dailyEarning: TokenPairModelMapper.fromResposne(daily_earning),
      reward: {
        staking: TokenPairModelMapper.fromResposne(reward.staking),
        swap: TokenPairModelMapper.fromResposne(reward.swap),
      },
    };
  }
}
