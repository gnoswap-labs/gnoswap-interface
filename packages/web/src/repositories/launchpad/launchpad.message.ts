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
  CollectRewardByDepositId = "CollectRewardByDepositId",

  /**
   * @new
   */
  CollectDepositGns = "CollectDepositGns",

  /**
   * @deprecated
   */
  CollectRewardByProjectId = "CollectRewardByProjectId",
  /**
   * @deprecated
   */
  CollectDepositGnsByProjectId = "CollectDepositGnsByProjectId",
  /**
   * @deprecated
   */
  CollectDepositGnsBydepositID = "CollectDepositGnsBydepositID",
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
  projectID,
  caller,
}: {
  projectID: string;
  caller: string;
}): TransactionMessage[] {
  const collectRewardByProjectIdMessage = makeTransactionMessage({
    packagePath: PACKAGE_LAUNCHPAD_PATH,
    send: "",
    func: TransactionMessageFunctionType.CollectRewardByProjectId,
    args: [projectID],
    caller,
  });

  return [collectRewardByProjectIdMessage];
}

export function makeCollectRewardBydepositIDMessage({
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

export function makeCollectRewardWithDepositByProjectIdMessage({
  projectID,
  caller,
}: {
  projectID: string;
  caller: string;
}): TransactionMessage[] {
  const collectRewardByProjectIdMessage = makeTransactionMessage({
    packagePath: PACKAGE_LAUNCHPAD_PATH,
    send: "",
    func: TransactionMessageFunctionType.CollectRewardByProjectId,
    args: [projectID],
    caller,
  });
  const collectDepositGnsByProjectIdMessage = makeTransactionMessage({
    packagePath: PACKAGE_LAUNCHPAD_PATH,
    send: "",
    func: TransactionMessageFunctionType.CollectDepositGnsByProjectId,
    args: [projectID],
    caller,
  });

  return [collectRewardByProjectIdMessage, collectDepositGnsByProjectIdMessage];
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
