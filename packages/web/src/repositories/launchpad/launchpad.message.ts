import { TransactionMessage } from "@common/clients/wallet-client/protocols";
import {
  makeTransactionMessage,
  makeTransactionMessagesWithApproves,
  TokenApproveMessageInfo,
} from "@common/clients/wallet-client/transaction-messages";
import { GNS_TOKEN_PATH, PACKAGE_LAUNCHPAD_ADDRESS, PACKAGE_LAUNCHPAD_PATH } from "@constants/environment.constant";

enum TransactionMessageFunctionType {
  DepositGns = "DepositGns",
  CollectRewardByDepositId = "CollectRewardByDepositId",
  CollectDepositGns = "CollectDepositGns",
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
      amount: gnsTokenAmount,
      caller,
    },
  ];

  return makeTransactionMessagesWithApproves([depositGNSMessage], approveMessageInfos, fetchAllowance);
}

export function makeCollectRewardByDepositIdsMessage({
  depositIDs,
  caller,
}: {
  depositIDs: string[];
  caller: string;
}): TransactionMessage[] {
  if (!depositIDs || depositIDs.length === 0) return [];

  return depositIDs.map(depositID =>
    makeTransactionMessage({
      packagePath: PACKAGE_LAUNCHPAD_PATH,
      send: "",
      func: TransactionMessageFunctionType.CollectRewardByDepositId,
      args: [depositID],
      caller,
    }),
  );
}

export function makeCollectRewardBydepositIdMessage({
  depositID,
  caller,
}: {
  depositID: string;
  caller: string;
}): TransactionMessage[] {
  const collectRewardBydepositIDMessage = makeTransactionMessage({
    packagePath: PACKAGE_LAUNCHPAD_PATH,
    send: "",
    func: TransactionMessageFunctionType.CollectRewardByDepositId,
    args: [depositID],
    caller,
  });

  return [collectRewardBydepositIDMessage];
}

export function makeCollectRewardWithDepositByDepositIdsMessage({
  depositIDs,
  caller,
}: {
  depositIDs: string[];
  caller: string;
}): TransactionMessage[] {
  if (!depositIDs || depositIDs.length === 0) return [];

  return depositIDs.flatMap(depositID => [
    makeTransactionMessage({
      packagePath: PACKAGE_LAUNCHPAD_PATH,
      send: "",
      func: TransactionMessageFunctionType.CollectRewardByDepositId,
      args: [depositID],
      caller,
    }),
    makeTransactionMessage({
      packagePath: PACKAGE_LAUNCHPAD_PATH,
      send: "",
      func: TransactionMessageFunctionType.CollectDepositGns,
      args: [depositID],
      caller,
    }),
  ]);
}

export function makeCollectRewardWithDepositBydepositIDMessage({
  depositID,
  caller,
}: {
  depositID: string;
  caller: string;
}): TransactionMessage[] {
  const collectRewardBydepositIDMessage = makeTransactionMessage({
    packagePath: PACKAGE_LAUNCHPAD_PATH,
    send: "",
    func: TransactionMessageFunctionType.CollectRewardByDepositId,
    args: [depositID],
    caller,
  });
  const collectDepositGnsMessage = makeTransactionMessage({
    packagePath: PACKAGE_LAUNCHPAD_PATH,
    send: "",
    func: TransactionMessageFunctionType.CollectDepositGns,
    args: [depositID],
    caller,
  });

  return [collectRewardBydepositIDMessage, collectDepositGnsMessage];
}
