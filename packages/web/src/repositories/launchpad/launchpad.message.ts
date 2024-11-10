import { TransactionMessage } from "@common/clients/wallet-client/protocols";
import {
  makeTransactionMessage,
  makeTransactionMessagesWithApproves,
  TokenApproveMessageInfo,
} from "@common/clients/wallet-client/transaction-messages";
import { GNS_TOKEN_PATH, PACKAGE_LAUNCHPAD_ADDRESS, PACKAGE_LAUNCHPAD_PATH } from "@constants/environment.constant";

enum TransactionMessageFunctionType {
  DepositGns = "DepositGns",
  CollectRewardByProjectId = "CollectRewardByProjectId",
  CollectRewardByDepositId = "CollectRewardByDepositId",
  CollectDepositGnsByProjectId = "CollectDepositGnsByProjectId",
  CollectDepositGnsByDepositId = "CollectDepositGnsByDepositId",
}

export function makeDepositGNSMessageWithApproves({
  poolId,
  gnsTokenAmount,
  caller,
}: {
  poolId: string;
  gnsTokenAmount: bigint;
  caller: string;
}): TransactionMessage[] {
  const depositGNSMessage = makeTransactionMessage({
    packagePath: PACKAGE_LAUNCHPAD_PATH,
    send: "",
    func: TransactionMessageFunctionType.DepositGns,
    args: [poolId, gnsTokenAmount.toString()],
    caller,
  });

  const approveMessageInfos: TokenApproveMessageInfo[] = [
    {
      tokenPath: GNS_TOKEN_PATH,
      targetAddress: PACKAGE_LAUNCHPAD_ADDRESS,
      amount: gnsTokenAmount.toString(),
      caller,
    },
  ];

  return makeTransactionMessagesWithApproves([depositGNSMessage], approveMessageInfos);
}

export function makeCollectRewardByProjectIdMessage({
  projectId,
  caller,
}: {
  projectId: string;
  caller: string;
}): TransactionMessage[] {
  const collectRewardByProjectIdMessage = makeTransactionMessage({
    packagePath: PACKAGE_LAUNCHPAD_PATH,
    send: "",
    func: TransactionMessageFunctionType.CollectRewardByProjectId,
    args: [projectId],
    caller,
  });

  return [collectRewardByProjectIdMessage];
}

export function makeCollectRewardByDepositIdMessage({
  depositId,
  caller,
}: {
  depositId: string;
  caller: string;
}): TransactionMessage[] {
  const collectRewardByDepositIdMessage = makeTransactionMessage({
    packagePath: PACKAGE_LAUNCHPAD_PATH,
    send: "",
    func: TransactionMessageFunctionType.CollectRewardByDepositId,
    args: [depositId],
    caller,
  });

  return [collectRewardByDepositIdMessage];
}

export function makeCollectRewardWithDepositByProjectIdMessage({
  projectId,
  caller,
}: {
  projectId: string;
  caller: string;
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
    args: [projectId],
    caller,
  });

  return [collectRewardByProjectIdMessage, collectDepositGnsByProjectIdMessage];
}

export function makeCollectRewardWithDepositByDepositIdMessage({
  depositId,
  caller,
}: {
  depositId: string;
  caller: string;
}): TransactionMessage[] {
  const collectRewardByDepositIdMessage = makeTransactionMessage({
    packagePath: PACKAGE_LAUNCHPAD_PATH,
    send: "",
    func: TransactionMessageFunctionType.CollectRewardByDepositId,
    args: [depositId],
    caller,
  });
  const collectDepositGnsByDepositIdMessage = makeTransactionMessage({
    packagePath: PACKAGE_LAUNCHPAD_PATH,
    send: "",
    func: TransactionMessageFunctionType.CollectDepositGnsByDepositId,
    args: [depositId],
    caller,
  });

  return [collectRewardByDepositIdMessage, collectDepositGnsByDepositIdMessage];
}
