import { amountEmptyBigNumInit } from "@/common/values/global-initial-value";
import { AmountType } from "@/common/types/data-prop-types";
import { notNullStringType } from "@/common/utils/data-check-util";
import { textToBalances } from "@/common/utils/denom-util";
import { ActiveStatusOptions } from "@/common/values/data-constant";
import { AccountInfoResponse } from "@/repositories/account";
import { AccountInfoModel } from "../account-info-model";
import { InjectResponse } from "@/common/clients/wallet-client/protocols";
import { Account } from "@gnoswap-labs/gno-client/src/api/response";

export class AccountInfoMapper {
  public static fromResponse(
    response: InjectResponse<AccountInfoResponse>,
  ): AccountInfoModel {
    const { coins, address, status } = response.data;
    const balance: AmountType = notNullStringType(coins)
      ? textToBalances(coins)[0]
      : amountEmptyBigNumInit;
    return {
      address: address,
      amount: balance,
      status: status as ActiveStatusOptions,
    };
  }

  public static fromGnoResponse(response: Account): AccountInfoModel {
    const { coins, address, status } = response;
    const balance: AmountType = notNullStringType(coins)
      ? textToBalances(coins)[0]
      : amountEmptyBigNumInit;
    return {
      address: address,
      amount: balance,
      status: status as ActiveStatusOptions,
    };
  }
}
