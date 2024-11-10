import { TransactionMessage } from "@common/clients/wallet-client/protocols";
import { makeTransactionMessage } from "@common/clients/wallet-client/transaction-messages";
import { makeTransferNativeTokenMessage } from "@common/clients/wallet-client/transaction-messages/token";
import { GNOT_UNIT_DENOM } from "@common/values/token-constant";
import { TokenModel } from "@models/token/token-model";

export function makeTransferGNOTTokenMessages({
  tokenAmount,
  fromAddress,
  toAddress,
}: {
  tokenAmount: number;
  fromAddress: string;
  toAddress: string;
}): TransactionMessage[] {
  const bankSendMessage = makeTransferNativeTokenMessage(
    tokenAmount.toString(),
    GNOT_UNIT_DENOM,
    fromAddress,
    toAddress,
  );

  return [bankSendMessage];
}

export function makeTransferGRC20TokenMessages({
  token,
  tokenAmount,
  fromAddress,
  toAddress,
}: {
  token: TokenModel;
  tokenAmount: number;
  fromAddress: string;
  toAddress: string;
}): TransactionMessage[] {
  const transferGRC20TokenMessage = makeTransactionMessage({
    packagePath: token.path,
    send: "",
    func: "Transfer",
    args: [toAddress, tokenAmount.toString()],
    caller: fromAddress,
  });

  return [transferGRC20TokenMessage];
}
