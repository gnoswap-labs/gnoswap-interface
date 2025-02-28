import { TransactionMessage } from "@common/clients/wallet-client/protocols";
import {
  makeTransactionMessage,
  makeTransactionMessagesWithApproves,
  TokenApproveMessageInfo,
} from "@common/clients/wallet-client/transaction-messages";
import { GNS_TOKEN_PATH, PACKAGE_LAUNCHPAD_ADDRESS, PACKAGE_LAUNCHPAD_PATH } from "@constants/environment.constant";
import { MAX_INT64 } from "@utils/math.utils";

enum TransactionMessageFunctionType {
  DepositGns = "DepositGns",
  CollectRewardByProjectId = "CollectRewardByProjectId",
  CollectRewardByDepositId = "CollectRewardByDepositId",
  CollectDepositGnsByProjectId = "CollectDepositGnsByProjectId",
  CollectDepositGnsByDepositId = "CollectDepositGnsByDepositId",
}

export function makeDepositGNSMessageWithApproves(
  {
    poolId,
    gnsTokenAmount,
    caller,
    referrerAddress,
  }: {
    poolId: string;
    gnsTokenAmount: bigint;
    caller: string;
    referrerAddress: string | null;
  },
  fetchAllowance: (packagePath: string, owner: string, spender: string) => Promise<number>,
): Promise<TransactionMessage[]> {
  const depositGNSMessage = makeTransactionMessage({
    packagePath: PACKAGE_LAUNCHPAD_PATH,
    send: "",
    func: TransactionMessageFunctionType.DepositGns,
    args: [poolId, gnsTokenAmount.toString(), referrerAddress || ""], // Referral address
    caller,
  });

  const approveMessageInfos: TokenApproveMessageInfo[] = [
    {
      tokenPath: GNS_TOKEN_PATH,
      targetAddress: PACKAGE_LAUNCHPAD_ADDRESS,
      amount: MAX_INT64,
      caller,
    },
  ];

  return makeTransactionMessagesWithApproves([depositGNSMessage], approveMessageInfos, fetchAllowance);
}

export function makeCollectRewardByProjectIdMessage({
  projectId,
  caller,
  referrerAddress,
}: {
  projectId: string;
  caller: string;
  referrerAddress: string | null;
}): TransactionMessage[] {
  const collectRewardByProjectIdMessage = makeTransactionMessage({
    packagePath: PACKAGE_LAUNCHPAD_PATH,
    send: "",
    func: TransactionMessageFunctionType.CollectRewardByProjectId,
    args: [projectId, referrerAddress || ""], // Referral address
    caller,
  });

  return [collectRewardByProjectIdMessage];
}

export function makeCollectRewardByDepositIdMessage({
  depositId,
  caller,
  referrerAddress,
}: {
  depositId: string;
  caller: string;
  referrerAddress: string | null;
}): TransactionMessage[] {
  const collectRewardByDepositIdMessage = makeTransactionMessage({
    packagePath: PACKAGE_LAUNCHPAD_PATH,
    send: "",
    func: TransactionMessageFunctionType.CollectRewardByDepositId,
    args: [depositId, referrerAddress || ""], // Referral address
    caller,
  });

  return [collectRewardByDepositIdMessage];
}

export function makeCollectRewardWithDepositByProjectIdMessage({
  projectId,
  caller,
  referrerAddress,
}: {
  projectId: string;
  caller: string;
  referrerAddress: string | null;
}): TransactionMessage[] {
  const collectRewardByProjectIdMessage = makeTransactionMessage({
    packagePath: PACKAGE_LAUNCHPAD_PATH,
    send: "",
    func: TransactionMessageFunctionType.CollectRewardByProjectId,
    args: [projectId],
    caller,
  });
  const collectDepositGnsByProjectIdMessage = makeTransactionMessage({
    packagePath: PACKAGE_LAUNCHPAD_PATH,
    send: "",
    func: TransactionMessageFunctionType.CollectDepositGnsByProjectId,
    args: [projectId, referrerAddress || ""], // Referral address
    caller,
  });

  return [collectRewardByProjectIdMessage, collectDepositGnsByProjectIdMessage];
}

export function makeCollectRewardWithDepositByDepositIdMessage({
  depositId,
  caller,
  referrerAddress,
}: {
  depositId: string;
  caller: string;
  referrerAddress: string | null;
}): TransactionMessage[] {
  const collectRewardByDepositIdMessage = makeTransactionMessage({
    packagePath: PACKAGE_LAUNCHPAD_PATH,
    send: "",
    func: TransactionMessageFunctionType.CollectRewardByDepositId,
    args: [depositId, referrerAddress || ""], // Referral address
    caller,
  });
  const collectDepositGnsByDepositIdMessage = makeTransactionMessage({
    packagePath: PACKAGE_LAUNCHPAD_PATH,
    send: "",
    func: TransactionMessageFunctionType.CollectDepositGnsByDepositId,
    args: [depositId, referrerAddress || ""], // Referral address
    caller,
  });

  return [collectRewardByDepositIdMessage, collectDepositGnsByDepositIdMessage];
}
