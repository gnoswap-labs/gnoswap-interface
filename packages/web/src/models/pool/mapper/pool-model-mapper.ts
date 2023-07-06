import { IncentivizedOptions } from "@common/values/data-constant";
import { TokenModelMapper } from "@models/token/mapper/token-model-mapper";
import { TokenPairModelMapper } from "@models/token/mapper/token-pair-model-mapper";
import {
  PoolInfoResponse,
  PoolListInfoResponse,
  PoolListResponse,
} from "@repositories/pool";
import BigNumber from "bignumber.js";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PoolModel } from "@models/pool/pool-model";

export class PoolModelMapper {
  public static fromResponse(response: PoolInfoResponse): PoolModel {
    const {
      fee_rate,
      incentivized_type,
      liquidity,
      pool_id,
      rewards,
    } = response;

    return {
      poolId: pool_id,
      liquidity: TokenPairModelMapper.fromResposne(liquidity),
      feeRate: fee_rate,
      incentivizedType: incentivized_type as IncentivizedOptions,
      rewards: rewards.map(TokenModelMapper.fromResponse),
    };
  }

  public static fromListResponse(
    response: PoolListResponse,
  ): Array<PoolDetailModel> {
    const { pools } = response;
    return pools.map(PoolModelMapper.fromDetailResponse);
  }

  public static fromDetailResponse(
    response: PoolListInfoResponse,
  ): PoolDetailModel {
    const {
      fee_rate,
      incentivized_type,
      liquidity,
      pool_id,
      rewards,
      apr,
      fees_24h,
      volume_24h,
    } = response;

    return {
      poolId: pool_id,
      liquidity: TokenPairModelMapper.fromResposne(liquidity),
      feeRate: fee_rate,
      incentivizedType: incentivized_type as IncentivizedOptions,
      rewards: rewards.map(TokenModelMapper.fromResponse),
      apr,
      fees24h: BigNumber(fees_24h),
      volume24h: BigNumber(volume_24h),
    };
  }
}
