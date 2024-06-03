import { amountEmptyNumberInit } from "@common/values/global-initial-value";
import { notNullStringType } from "@common/utils/data-check-util";
import { textToBalances } from "@common/utils/denom-util";
import { AccountInfoResponse } from "@repositories/account";
import { AccountModel } from "@models/account/account-model";
import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { AmountModel } from "@models/common/amount-model";

export class AccountMapper {
  public static fromResponse(
    response: WalletResponse<AccountInfoResponse>,
  ): AccountModel {
    if (response.data === null) {
      return {
        status: "NONE",
        balances: [],
        publicKeyType: "",
        publicKeyValue: "",
        accountNumber: 0,
        sequence: 0,
        chainId: "",
        address: "",
      };
    }

    const {
      coins,
      address,
      status,
      accountNumber,
      chainId,
      publicKey,
      sequence,
    } = response.data;
    const balances: AmountModel[] = notNullStringType(coins)
      ? textToBalances(coins)
      : [amountEmptyNumberInit];

    return {
      status: status === "ACTIVE" ? "ACTIVE" : "IN_ACTIVE",
      balances,
      publicKeyType: publicKey ? publicKey["@type"] : "",
      publicKeyValue: publicKey ? publicKey.value : "",
      accountNumber,
      sequence,
      chainId,
      address,
    };
  }
}
