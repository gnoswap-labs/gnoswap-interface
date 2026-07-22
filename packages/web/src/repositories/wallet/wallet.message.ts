import { TransactionMessage } from "@common/clients/wallet-client/protocols";
import { makeTransactionMessage } from "@common/clients/wallet-client/transaction-messages";
import { makeTransferNativeTokenMessage } from "@common/clients/wallet-client/transaction-messages/token";
import { GNOT_UNIT_DENOM } from "@common/values/token-constant";
import { PACKAGE_COMMON_PATH } from "@constants/environment.constant";
import { TokenModel } from "@models/token/token-model";

export function makeTransferGNOTTokenMessages({
  tokenAmount,
  fromAddress,
  toAddress,
}: {
  tokenAmount: string;
  fromAddress: string;
  toAddress: string;
}): TransactionMessage[] {
  const bankSendMessage = makeTransferNativeTokenMessage(tokenAmount, GNOT_UNIT_DENOM, fromAddress, toAddress);

  return [bankSendMessage];
}

export function makeTransferGRC20TokenMessages({
  token,
  tokenAmount,
  fromAddress,
  toAddress,
}: {
  token: TokenModel;
  tokenAmount: string;
  fromAddress: string;
  toAddress: string;
}): TransactionMessage[] {
  const transferGRC20TokenMessage = makeTransactionMessage({
    packagePath: PACKAGE_COMMON_PATH,
    send: "",
    func: "Transfer",
    args: [token.path, toAddress, tokenAmount],
    caller: fromAddress,
  });

  return [transferGRC20TokenMessage];
}
