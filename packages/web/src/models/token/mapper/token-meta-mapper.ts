import BigNumber from "bignumber.js";
import { TokenMeta, TokenMetaListResponse } from "@repositories/token";
import { TokenMetaModel, TokenMetaType } from "@models/token/token-meta-medel";

export class TokenMetaMapper {
  public static fromResponse(response: TokenMetaListResponse): TokenMetaModel {
    return {
      tokens: response.tokens.map(TokenMetaMapper.mappedTokens),
    };
  }

  public static mappedTokens(t: TokenMeta): TokenMetaType {
    const { token_id, name, symbol, denom, minimal_denom, decimals } = t;
    return {
      tokenId: token_id,
      name,
      symbol,
      denom,
      minimalDenom: minimal_denom,
      decimals: BigNumber(decimals),
    };
  }
}
