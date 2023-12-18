import { TransactionMessage } from "../protocols";
import { TransactionBankMessage, makeTransactionMessage } from "./common";

export function makeDepositMessage(
  packagePath: string,
  amount: string,
  denom: string,
  caller: string,
) {
  const send = `${amount.toString()}${denom}`;
  return makeTransactionMessage({
    packagePath,
    send,
    func: "Deposit",
    args: null,
    caller,
  });
}

export function makeWithdrawMessage(
  packagePath: string,
  amount: string,
  caller: string,
) {
  return makeTransactionMessage({
    packagePath,
    send: "",
    func: "Withdraw",
    args: [amount.toString()],
    caller,
  });
}

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
    packagePath: tokenPath,
    send: "",
    func: "Transfer",
    args: [toAddress, amount],
    caller: fromAddress,
  });
}
