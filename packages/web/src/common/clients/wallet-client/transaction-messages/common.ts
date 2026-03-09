import BigNumber from "bignumber.js";

import { getGRC20Allowance } from "@common/clients/gno-provider";
import { GnoProvider } from "@common/clients/gno-provider/gno-provider";
import { TransactionMessageError } from "@common/errors";
import { DEFAULT_ALLOWANCE_LIMIT } from "@common/values";
import { PACKAGE_NFT_PATH, WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { MAX_INT64_STR } from "@utils/math.utils";

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
  gasFee?: string;
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
  gasFee,
}: {
  caller: string;
  send: string;
  packagePath: string;
  func: string;
  args: string[] | null;
  gasFee?: string;
}): TransactionMessage {
  return {
    caller: caller,
    send: send,
    pkg_path: packagePath,
    func: func,
    args: args ? args.map(arg => `${arg}`) : null,
    gasFee: gasFee,
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

export function makeDepositGNOTMessage(amount: string | number | null, caller: string): TransactionMessage | null {
  const minDepositAmount = 1000;
  if (!amount || BigNumber(amount).isLessThan(minDepositAmount)) {
    return null;
  }

  return makeTransactionMessage({
    caller,
    send: makeGNOTSendAmount(amount),
    packagePath: WRAPPED_GNOT_PATH,
    func: "Deposit",
    args: null,
  });
}

type SumApproveMessageType = { [key in string]: { [key in string]: { amount: string; caller: string } } };

export async function makeTransactionMessagesWithApproves(
  transactionMessages: TransactionMessage[],
  approveInfos: TokenApproveMessageInfo[],
  fetchAllowance: (packagePath: string, owner: string, spender: string) => Promise<number>,
  allowanceLimit: number = DEFAULT_ALLOWANCE_LIMIT,
  withReset: boolean = false,
): Promise<TransactionMessage[]> {
  if (!Array.isArray(transactionMessages)) {
    throw new TransactionMessageError("FAILED_PARSE_APPROVE_MESSAGE", transactionMessages);
  }

  if (!Array.isArray(approveInfos)) {
    throw new TransactionMessageError("FAILED_PARSE_APPROVE_MESSAGE", approveInfos);
  }
  /**
   * Remove duplicates of acknowledgment messages by package and destination address.
   * If the package path and destination address are the same, add the authorization quantity.
   * If it is greater than the maximum of the UINT64 value, adjust it to the maximum of the UINT64 quantity.
   */
  const approveMessageMap = approveInfos.reduce<SumApproveMessageType>((accumulated, current) => {
    if (
      !current ||
      !current.targetAddress ||
      !current.caller ||
      current.amount === null ||
      current.amount === undefined
    ) {
      throw new TransactionMessageError("FAILED_PARSE_APPROVE_MESSAGE", approveInfos);
    }

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
    if (sumAmountBN.isGreaterThan(MAX_INT64_STR)) {
      accumulated[current.tokenPath][current.targetAddress].amount = MAX_INT64_STR;
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

  const allowanceApproveMessageInfos: TokenApproveMessageInfo[] = await Promise.all(
    combinedApproveMessageInfos.map(messageInfo =>
      fetchAllowance(messageInfo.tokenPath, messageInfo.caller, messageInfo.targetAddress)
        .then(allowance => ({
          tokenPath: messageInfo.tokenPath,
          targetAddress: messageInfo.targetAddress,
          amount: messageInfo.amount,
          caller: messageInfo.caller,
          allowance,
        }))
        .catch(e => {
          console.log(e);
          return null;
        }),
    ),
  ).then(allowancesInfos => {
    return allowancesInfos.filter(
      allowancesInfo => allowancesInfo !== null && allowancesInfo.allowance <= allowanceLimit,
    ) as TokenApproveMessageInfo[];
  });

  const approveMessages = allowanceApproveMessageInfos.map(approveInfo =>
    makeTokenApproveMessage(approveInfo.tokenPath, approveInfo.targetAddress, approveInfo.amount, approveInfo.caller),
  );

  if (!withReset) {
    return [...approveMessages, ...transactionMessages];
  }

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

export async function fetchAllowance(rpcProvider: GnoProvider, packagePath: string, owner: string, spender: string) {
  try {
    return await getGRC20Allowance(rpcProvider, packagePath, owner, spender);
  } catch (error) {
    console.error("Failed to fetch allowance", error);
    return 0;
  }
}
