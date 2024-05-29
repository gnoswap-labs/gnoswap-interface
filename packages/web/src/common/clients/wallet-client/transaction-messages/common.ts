import BigNumber from "bignumber.js";

export interface TransactionBankMessage {
  from_address: string;
  to_address: string;
  amount: string;
}

export interface TransactionMessage {
  caller: string;
  send: string;
  pkg_path: string;
  func: string;
  args: string[] | null;
}

export function makeBankSendGNOTMessage({
  from,
  to,
  sendAmount,
}: {
  from: string;
  to: string;
  sendAmount: string;
}): TransactionBankMessage {
  const amount = `${sendAmount}ugnot`;

  return {
    from_address: from,
    to_address: to,
    amount,
  };
}

export function makeTransactionMessage({
  caller,
  send,
  packagePath,
  func,
  args,
}: {
  caller: string;
  send: string;
  packagePath: string;
  func: string;
  args: string[] | null;
}): TransactionMessage {
  return {
    caller: caller,
    send: send,
    pkg_path: packagePath,
    func: func,
    args: args ? args.map(arg => `${arg}`) : null,
  };
}

export function makeApproveMessage(
  packagePath: string,
  args: string[],
  caller: string,
) {
  return makeTransactionMessage({
    caller,
    send: "",
    packagePath,
    func: "Approve",
    args,
  });
}

export function makeGNOTSendAmount(amount: string | number | null): string {
  if (!amount || BigNumber(amount).isZero()) {
    return "";
  }
  return BigNumber(amount).toString() + "ugnot";
}
