import { amountEmptyBigNumInit } from "@common/values/global-initial-value";
import { AmountNumberType, AmountType } from "@common/types/data-prop-types";
import BigNumber from "bignumber.js";
import { TokenDefaultModel } from "@models/token/token-default-model";

interface TokenResponse {
  token_id: string;
  name: string;
  symbol: string;
  amount: AmountNumberType;
}

export class TokenModelMapper {
  public static fromResponse(response: TokenResponse): TokenDefaultModel {
    const { token_id, name, symbol, amount } = response;

    return {
      tokenId: token_id,
      tokenLogo: "",
      name,
      symbol,
      amount: amount
        ? TokenModelMapper.mappedAmount(amount)
        : amountEmptyBigNumInit,
    };
  }

  public static mappedAmount(response: AmountNumberType): AmountType {
    const { denom, value } = response;
    return {
      value: BigNumber(value),
      denom,
    };
  }

  public static toRequest(model: TokenDefaultModel) {
    const { value, denom } = model.amount ?? {};
    return {
      tokenId: model.tokenId,
      amount: {
        denom: denom ?? "",
        value: value?.toString() ?? "",
      },
    };
  }
}
