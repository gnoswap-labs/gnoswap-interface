import { TokenInfoResponse } from "@repositories/token";
import { TokenPairModel } from "@models/token/token-pair-model";
import { TokenModelMapper } from "./token-model-mapper";

interface TokenPairResponse {
  token0: TokenInfoResponse;
  token1: TokenInfoResponse;
}

export class TokenPairModelMapper {
  public static fromResposne(response: TokenPairResponse): TokenPairModel {
    const { token0, token1 } = response;

    return {
      token0: TokenModelMapper.fromResponse(token0),
      token1: TokenModelMapper.fromResponse(token1),
    };
  }

  public static toRequest(model: TokenPairModel) {
    const { token0, token1 } = model;

    return {
      token0: TokenModelMapper.toRequest(token0),
      token1: TokenModelMapper.toRequest(token1),
    };
  }
}
