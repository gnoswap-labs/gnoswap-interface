import {
  RecentlyAddedPairInfo,
  SummaryRecentlyAddedListResponse,
} from "@repositories/token/response/summary-recent-added-list-response";
import { amountEmptyBigNumInit } from "@common/values/global-initial-value";
import {
  RecentlyAddedPoolModel,
  SummaryRecentlyPairType,
} from "@models/statistical-data";

export class RecentlyAddedMapper {
  public static fromResponse(
    response: SummaryRecentlyAddedListResponse,
  ): RecentlyAddedPoolModel {
    const { hits, total, pairs } = response;
    return {
      hits,
      total,
      pairs: pairs.map(RecentlyAddedMapper.mappedTokenKeyValue),
    };
  }

  private static mappedTokenKeyValue(
    t: RecentlyAddedPairInfo,
  ): SummaryRecentlyPairType {
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
