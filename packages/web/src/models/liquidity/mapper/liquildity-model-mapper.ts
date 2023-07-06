import {
  LiquidityProvideOptions,
  StakedOptions,
} from "@common/values/data-constant";
import { TokenPairModelMapper } from "@models/token/mapper/token-pair-model-mapper";
import {
  LiquidityDetailInfoResponse,
  LiquidityDetailListResponse,
} from "@repositories/liquidity";
import { LiquidityDetailModel } from "@models/liquidity/liquidity-detail-model";

export class LiquidityModelMapper {
  public static fromDetailListResponse(details: LiquidityDetailListResponse) {
    const { total, hits, liquidities } = details;
    return {
      total,
      hits,
      liquidities: liquidities.map(LiquidityModelMapper.fromDetailResponse),
    };
  }

  public static fromDetailResponse(
    detail: LiquidityDetailInfoResponse,
  ): LiquidityDetailModel {
    const {
      pool_id,
      liquidity_id,
      liquidity_type,
      stake_type,
      in_range,
      max_rate,
      min_rate,
      fee_rate,
      liquidity,
      reward,
      apr,
    } = detail;
    return {
      poolId: pool_id,
      liquidityId: liquidity_id,
      liquidityType: liquidity_type as LiquidityProvideOptions,
      stakeType: stake_type as StakedOptions,
      maxRate: max_rate,
      minRate: min_rate,
      feeRate: fee_rate,
      inRange: in_range,
      liquidity: TokenPairModelMapper.fromResposne(liquidity),
      reward: {
        staking: TokenPairModelMapper.fromResposne(reward.staking),
        swap: TokenPairModelMapper.fromResposne(reward.swap),
      },
      apr: TokenPairModelMapper.fromResposne(apr),
    };
  }
}
