import { makeTransactionMessage } from "./common";

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
