import { amountFormatToBignum } from "@common/utils/denom-util";
import {
  TokenInfoResponse,
  TokenSearchItemResponse,
  TokenSearchListResponse,
} from "@repositories/token";
import BigNumber from "bignumber.js";
import { TokenDefaultModel } from "@models/token/token-default-model";
import {
  TokenSearchItemType,
  TokenSearchListModel,
} from "@models/token/token-search-list-model";

export class TokenSearchListMapper {
  public static fromResponse(
    response: TokenSearchListResponse,
  ): TokenSearchListModel {
    return {
      items: response.items.map(TokenSearchListMapper.mappedSearchList),
    };
  }

  private static mappedSearchList(
    item: TokenSearchItemResponse,
  ): TokenSearchItemType {
    return {
      searchType: item.search_type,
      changeRate: BigNumber(item.change_rate),
      token: TokenSearchListMapper.mappedTokenModel(item.token),
    };
  }

  private static mappedTokenModel(t: TokenInfoResponse): TokenDefaultModel {
    return {
      tokenId: t.token_id,
      tokenLogo: "",
      name: t.name,
      symbol: t.symbol,
      amount: amountFormatToBignum(t.amount),
    };
  }
}
