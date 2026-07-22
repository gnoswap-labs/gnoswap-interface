import { PACKAGE_COMMON_PATH } from "@constants/environment.constant";
import { TransactionMessage } from "../protocols";
import { TransactionBankMessage, makeTransactionMessage } from "./common";

export function makeTransferNativeTokenMessage(
  amount: string,
  denom: string,
  fromAddress: string,
  toAddress: string,
): TransactionBankMessage {
  return {
    amount: `${amount}${denom}`,
    from_address: fromAddress,
    to_address: toAddress,
  };
}

export function makeTransferGRC20TokenMessage(
  tokenPath: string,
  amount: string,
  fromAddress: string,
  toAddress: string,
): TransactionMessage {
  return makeTransactionMessage({
    packagePath: PACKAGE_COMMON_PATH,
    send: "",
    func: "Transfer",
    args: [tokenPath, toAddress, amount],
    caller: fromAddress,
  });
}
