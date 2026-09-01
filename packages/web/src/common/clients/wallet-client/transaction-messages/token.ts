import { TransactionBankMessage } from "./common";
import { makeGRC20TransferRunMessage, TransactionRunMessage } from "./run";

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
): TransactionRunMessage {
  return makeGRC20TransferRunMessage({
    tokenPath,
    toAddress,
    amount,
    caller: fromAddress,
  });
}
