import { PACKAGE_NFT_PATH } from "@constants/environment.constant";
import { MAX_UINT64 } from "@utils/math.utils";
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

type SumApproveMessageType = { [key in string]: { [key in string]: { amount: string; caller: string } } };

export function makeTransactionMessagesWithApproves(
  transactionMessages: TransactionMessage[],
  approveInfos: TokenApproveMessageInfo[],
): TransactionMessage[] {
  /**
   * Remove duplicates of acknowledgment messages by package and destination address.
   * If the package path and destination address are the same, add the authorization quantity.
   * If it is greater than the maximum of the UINT64 value, adjust it to the maximum of the UINT64 quantity.
   */
  const approveMessageMap = approveInfos.reduce<SumApproveMessageType>((accumulated, current) => {
    if (BigNumber(current.amount.toString()).isZero()) {
      return accumulated;
    }

    if (!accumulated[current.tokenPath]) {
      accumulated[current.tokenPath] = {};
    }

    if (!accumulated[current.tokenPath][current.targetAddress]) {
      accumulated[current.tokenPath][current.targetAddress] = {
        amount: "0",
        caller: current.caller,
      };
    }

    const previousAmount = accumulated[current.tokenPath][current.targetAddress].amount || "0";
    const sumAmountBN = BigNumber(previousAmount).plus(current.amount.toString());
    if (sumAmountBN.isGreaterThan(MAX_UINT64.toString())) {
      accumulated[current.tokenPath][current.targetAddress].amount = MAX_UINT64.toString();
    } else {
      accumulated[current.tokenPath][current.targetAddress].amount = sumAmountBN.toString();
    }

    return accumulated;
  }, {});

  const combinedApproveMessageInfos: TokenApproveMessageInfo[] = Object.entries(approveMessageMap).flatMap(
    ([tokenPath, approveMessageByTargetAddress]) =>
      Object.entries(approveMessageByTargetAddress).map(([targetAddress, messageInfo]) => ({
        tokenPath,
        targetAddress,
        amount: messageInfo.amount,
        caller: messageInfo.caller,
      })),
  );

  console.log("combinedApproveMessageInfos", combinedApproveMessageInfos);

  const approveMessages = combinedApproveMessageInfos.map(approveInfo =>
    makeTokenApproveMessage(approveInfo.tokenPath, approveInfo.targetAddress, approveInfo.amount, approveInfo.caller),
  );

  const approveResetMessages = combinedApproveMessageInfos.map(approveInfo =>
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
