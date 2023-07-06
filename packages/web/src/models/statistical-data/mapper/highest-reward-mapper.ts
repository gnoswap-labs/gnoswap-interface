import { amountEmptyBigNumInit } from "@common/values/global-initial-value";
import {
  HighestRewardPoolModel,
  SummaryHighestPairType,
} from "@models/statistical-data";
import {
  HighestRewardPairInfo,
  SummaryHighestRewardListResponse,
} from "@repositories/token";

export class HighestRewardMapper {
  public static fromResponse(
    response: SummaryHighestRewardListResponse,
  ): HighestRewardPoolModel {
    const { hits, total, pairs } = response;
    return {
      hits,
      total,
      pairs: pairs.map(HighestRewardMapper.mappedTokenKeyValue),
    };
  }

  private static mappedTokenKeyValue(
    t: HighestRewardPairInfo,
  ): SummaryHighestPairType {
    return {
      poolId: t.pool_id,
      tokenPair: {
        token0: {
          tokenId: t.token0.token_id,
          tokenLogo: "",
          name: t.token0.name,
          symbol: t.token0.symbol,
          amount: amountEmptyBigNumInit,
        },
        token1: {
          tokenId: t.token1.token_id,
          tokenLogo: "",
          name: t.token1.name,
          symbol: t.token1.symbol,
          amount: amountEmptyBigNumInit,
        },
      },
      feeTier: t.fee_tier,
      apr: t.apr,
    };
  }
}
