import { PACKAGE_NFT_PATH } from "@constants/environment.constant";
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

export interface TokenApproveMessageInfo {
  tokenPath: string;
  targetAddress: string;
  amount: string | bigint | number;
  caller: string;
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

export function makeTokenApproveMessage(
  tokenPath: string,
  targetAddress: string,
  amount: string | bigint | number,
  caller: string,
): TransactionMessage {
  return makeTransactionMessage({
    caller,
    send: "",
    packagePath: tokenPath,
    func: "Approve",
    args: [targetAddress, amount.toString()],
  });
}

export function makeNFTApproveMessage(
  targetAddress: string,
  lpTokenId: string | bigint | number,
  caller: string,
): TransactionMessage {
  return makeTransactionMessage({
    caller,
    send: "",
    packagePath: PACKAGE_NFT_PATH,
    func: "Approve",
    args: [targetAddress, lpTokenId.toString()],
  });
}

export function makeTransactionMessagesWithApproves(
  transactionMessages: TransactionMessage[],
  approveInfos: TokenApproveMessageInfo[],
): TransactionMessage[] {
  const approveMessages = approveInfos.map(approveInfo =>
    makeTokenApproveMessage(approveInfo.tokenPath, approveInfo.targetAddress, approveInfo.amount, approveInfo.caller),
  );

  const approveResetMessages = approveInfos.map(approveInfo =>
    makeTokenApproveMessage(approveInfo.tokenPath, approveInfo.targetAddress, 0, approveInfo.caller),
  );

  return [...approveMessages, ...transactionMessages, ...approveResetMessages];
}

export function makeGNOTSendAmount(amount: string | number | null): string {
  if (!amount || BigNumber(amount).isZero()) {
    return "";
  }
  return BigNumber(amount).toString() + "ugnot";
}
