import BigNumber from "bignumber.js";

import { getGRC20Allowance } from "@common/clients/gno-provider";
import { GnoProvider } from "@common/clients/gno-provider/gno-provider";
import { TransactionMessageError } from "@common/errors";
import { DEFAULT_ALLOWANCE_LIMIT } from "@common/values";
import { PACKAGE_NFT_PATH, WRAPPED_GNOT_PACKAGE_PATH } from "@constants/environment.constant";
import { Grc20Routes } from "@models/token/token-model";
import { MAX_INT64_STR } from "@utils/math.utils";

import { resolveGrc20Route } from "./grc20-route";
import { gnoInt64Literal, GRC20ApproveRunMessageInfo, makeGRC20ApproveRunMessage, TransactionRunMessage } from "./run";

export interface TransactionBankMessage {
  from_address: string;
  to_address: string;
  amount: string;
}

export interface TransactionCallMessage {
  caller: string;
  send: string;
  pkg_path: string;
  func: string;
  args: string[] | null;
  gasFee?: string;
}

/**
 * Message shapes a transaction can carry, other than a bank send.
 *
 * GRC20 balance mutations are built as {@link TransactionRunMessage}; every
 * other realm interaction stays a {@link TransactionCallMessage}.
 */
export type TransactionMessage = TransactionCallMessage | TransactionRunMessage;

export type { TransactionRunMessage };

export function isTransactionCallMessage(message: TransactionMessage): message is TransactionCallMessage {
  return "func" in message;
}

export function isTransactionRunMessage(message: TransactionMessage): message is TransactionRunMessage {
  return "package" in message;
}

export interface TokenApproveMessageInfo {
  tokenPath: string;
  targetAddress: string;
  amount: string | bigint | number;
  caller: string;
  pkgPath?: string;
  routes?: Grc20Routes;
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
}): TransactionCallMessage {
  return {
    caller: caller,
    send: send,
    pkg_path: packagePath,
    func: func,
    args: args ? args.map(arg => `${arg}`) : null,
    gasFee: gasFee,
  };
}

export function makeTokenApproveMessage(approveInfo: TokenApproveMessageInfo): TransactionMessage {
  const amountLiteral = gnoInt64Literal(approveInfo.amount);
  const route = resolveGrc20Route(
    { path: approveInfo.tokenPath, pkgPath: approveInfo.pkgPath, routes: approveInfo.routes },
    "approve",
    {
      $owner: approveInfo.caller,
      $spender: approveInfo.targetAddress,
      $amount: amountLiteral,
    },
  );

  if (route) {
    return makeTransactionMessage({
      caller: approveInfo.caller,
      send: "",
      packagePath: route.packagePath,
      func: route.func,
      args: route.args,
    });
  }

  return makeGRC20ApproveRunMessage({
    approves: [
      { tokenPath: approveInfo.tokenPath, spenderAddress: approveInfo.targetAddress, amount: approveInfo.amount },
    ],
    caller: approveInfo.caller,
  });
}

/**
 * Batches a block of approves into as few `MsgRun` messages as possible.
 *
 * Approves are emitted consecutively, so every adjacent run sharing a caller
 * collapses into a single ephemeral package instead of one message each.
 * Tokens with a GRC20 method spec are sent as a direct `MsgCall` instead.
 */
export function makeTokenApproveMessages(approveInfos: TokenApproveMessageInfo[]): TransactionMessage[] {
  const messages: TransactionMessage[] = [];
  let currentRunGroup: { caller: string; approves: GRC20ApproveRunMessageInfo[] } | null = null;

  const flushRunGroup = () => {
    if (currentRunGroup) {
      messages.push(makeGRC20ApproveRunMessage(currentRunGroup));
      currentRunGroup = null;
    }
  };

  for (const approveInfo of approveInfos) {
    const approveMessage = makeTokenApproveMessage(approveInfo);
    if (isTransactionCallMessage(approveMessage)) {
      flushRunGroup();
      messages.push(approveMessage);
      continue;
    }

    const approve: GRC20ApproveRunMessageInfo = {
      tokenPath: approveInfo.tokenPath,
      spenderAddress: approveInfo.targetAddress,
      amount: approveInfo.amount,
    };

    if (currentRunGroup && currentRunGroup.caller === approveInfo.caller) {
      currentRunGroup.approves.push(approve);
    } else {
      flushRunGroup();
      currentRunGroup = { caller: approveInfo.caller, approves: [approve] };
    }
  }

  flushRunGroup();

  return messages;
}

export function makeNFTApproveMessage(
  targetAddress: string,
  lpTokenId: string | bigint | number,
  caller: string,
): TransactionCallMessage {
  return makeTransactionMessage({
    caller,
    send: "",
    packagePath: PACKAGE_NFT_PATH,
    func: "Approve",
    args: [targetAddress, lpTokenId.toString()],
  });
}

export function makeDepositGNOTMessage(amount: string | number | null, caller: string): TransactionCallMessage | null {
  const minDepositAmount = 1000;
  if (!amount || BigNumber(amount).isLessThan(minDepositAmount)) {
    return null;
  }

  return makeTransactionMessage({
    caller,
    send: makeGNOTSendAmount(amount),
    packagePath: WRAPPED_GNOT_PACKAGE_PATH,
    func: "Deposit",
    args: null,
  });
}

type SumApproveMessageType = {
  [tokenPath: string]: {
    [targetAddress: string]: {
      amount: string;
      caller: string;
      pkgPath?: string;
      routes?: Grc20Routes;
    };
  };
};

// Without `fetchAllowance` every approve message is kept, which is what the swap
// simulation wants: it must not query an allowance it never broadcasts.
export async function makeTransactionMessagesWithApproves(
  transactionMessages: TransactionMessage[],
  approveInfos: TokenApproveMessageInfo[],
  fetchAllowance?: (packagePath: string, owner: string, spender: string) => Promise<number>,
  allowanceLimit: number = DEFAULT_ALLOWANCE_LIMIT,
  withReset: boolean = true,
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
        pkgPath: current.pkgPath,
        routes: current.routes,
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
        pkgPath: messageInfo.pkgPath,
        routes: messageInfo.routes,
      })),
  );

  const allowanceApproveMessageInfos: TokenApproveMessageInfo[] = !fetchAllowance
    ? combinedApproveMessageInfos
    : await Promise.all(
        combinedApproveMessageInfos.map(messageInfo =>
          fetchAllowance(messageInfo.tokenPath, messageInfo.caller, messageInfo.targetAddress)
            .then(allowance => ({
              tokenPath: messageInfo.tokenPath,
              targetAddress: messageInfo.targetAddress,
              amount: messageInfo.amount,
              caller: messageInfo.caller,
              pkgPath: messageInfo.pkgPath,
              routes: messageInfo.routes,
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

  const approveMessages = makeTokenApproveMessages(allowanceApproveMessageInfos);

  if (!withReset) {
    return [...approveMessages, ...transactionMessages];
  }

  const approveResetMessages = makeTokenApproveMessages(
    combinedApproveMessageInfos.map(approveInfo => ({ ...approveInfo, amount: 0 })),
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
