import {
  PopularTokenModel,
  SummaryPopularTokenType,
} from "@models/statistical-data";
import {
  PopularTokenInfo,
  SummaryPopularTokenListResponse,
} from "@repositories/token";

export class PopularTokenMapper {
  public static fromResponse(
    response: SummaryPopularTokenListResponse,
  ): PopularTokenModel {
    const { hits, total, tokens } = response;
    return {
      hits,
      total,
      tokens: tokens.map(PopularTokenMapper.mappedTokenKeyValue),
    };
  }

  private static mappedTokenKeyValue(
    t: PopularTokenInfo,
  ): SummaryPopularTokenType {
    return {
      tokenId: t.token_id,
      name: t.name,
      symbol: t.symbol,
      change24h: t.change_24h,
    };
  }
}
