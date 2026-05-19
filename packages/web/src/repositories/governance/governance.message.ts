import { TransactionMessage } from "@common/clients/wallet-client/protocols";
import {
  makeTransactionMessage,
  makeTransactionMessagesWithApproves,
  TokenApproveMessageInfo,
} from "@common/clients/wallet-client/transaction-messages";
import {
  GNS_TOKEN_PATH,
  PACKAGE_GOVERNANCE_PATH,
  PACKAGE_GOVERNANCE_STAKER_ADDRESS,
  PACKAGE_GOVERNANCE_STAKER_PATH,
} from "@constants/environment.constant";
import { makeProposalVariablesQuery } from "@utils/governance-utils";

enum TransactionMessageFunctionType {
  ProposeText = "ProposeText",
  ProposeCommunityPoolSpend = "ProposeCommunityPoolSpend",
  ProposeParameterChange = "ProposeParameterChange",
  Vote = "Vote",
  Cancel = "Cancel",
  Execute = "Execute",
  Delegate = "Delegate",
  Undelegate = "Undelegate",
  Redelegate = "Redelegate",
  CollectUnDelegatedGNS = "CollectUndelegatedGns",
  CollectReward = "CollectReward",
}

export function makeProposalTextMessages({
  title,
  description,
  caller,
}: {
  title: string;
  description: string;
  caller: string;
}): TransactionMessage[] {
  const message = makeTransactionMessage({
    packagePath: PACKAGE_GOVERNANCE_PATH,
    send: "",
    func: TransactionMessageFunctionType.ProposeText,
    args: [title, description],
    caller,
  });

  return [message];
}

export function makeProposeCommunityPoolSpendMessages({
  title,
  description,
  to,
  tokenPath,
  amount,
  caller,
}: {
  title: string;
  description: string;
  to: string;
  tokenPath: string;
  amount: string;
  caller: string;
}): TransactionMessage[] {
  const message = makeTransactionMessage({
    packagePath: PACKAGE_GOVERNANCE_PATH,
    send: "",
    func: TransactionMessageFunctionType.ProposeCommunityPoolSpend,
    args: [title, description, to, tokenPath, amount],
    caller,
  });

  return [message];
}

export function makeProposeParameterChangeMessages({
  title,
  description,
  variables,
  caller,
}: {
  title: string;
  description: string;
  variables: {
    pkgPath: string;
    func: string;
    param: string;
  }[];
  caller: string;
}): TransactionMessage[] {
  const variableQuery = makeProposalVariablesQuery(variables);
  const message = makeTransactionMessage({
    packagePath: PACKAGE_GOVERNANCE_PATH,
    send: "",
    func: TransactionMessageFunctionType.ProposeParameterChange,
    args: [title, description, variables.length.toString(), variableQuery],
    caller,
  });

  return [message];
}

export function makeVoteMessages({
  proposalId,
  voteYes,
  caller,
}: {
  proposalId: number;
  voteYes: boolean;
  caller: string;
}): TransactionMessage[] {
  const message = makeTransactionMessage({
    packagePath: PACKAGE_GOVERNANCE_PATH,
    send: "",
    func: TransactionMessageFunctionType.Vote,
    args: [proposalId.toString(), `${voteYes}`],
    caller,
  });

  return [message];
}

export function makeCancelMessages({
  proposalId,
  caller,
}: {
  proposalId: number;
  caller: string;
}): TransactionMessage[] {
  const message = makeTransactionMessage({
    packagePath: PACKAGE_GOVERNANCE_PATH,
    send: "",
    func: TransactionMessageFunctionType.Cancel,
    args: [proposalId.toString()],
    caller,
  });

  return [message];
}

export function makeExecuteMessages({
  proposalId,
  caller,
}: {
  proposalId: number;
  caller: string;
}): TransactionMessage[] {
  const message = makeTransactionMessage({
    packagePath: PACKAGE_GOVERNANCE_PATH,
    send: "",
    func: TransactionMessageFunctionType.Execute,
    args: [proposalId.toString()],
    caller,
  });

  return [message];
}

export function makeDelegateMessagesWithApproves(
  {
    to,
    amount,
    caller,
    referrerAddress,
  }: {
    to: string;
    amount: string;
    caller: string;
    referrerAddress: string | null;
  },
  fetchAllowance: (packagePath: string, owner: string, spender: string) => Promise<number>,
): Promise<TransactionMessage[]> {
  const delegateTransactionMessage = makeTransactionMessage({
    packagePath: PACKAGE_GOVERNANCE_STAKER_PATH,
    send: "",
    func: TransactionMessageFunctionType.Delegate,
    args: [to, amount, referrerAddress || ""], // Referral address
    caller,
  });

  const approveMessageInfos: TokenApproveMessageInfo[] = [
    {
      tokenPath: GNS_TOKEN_PATH,
      targetAddress: PACKAGE_GOVERNANCE_STAKER_ADDRESS,
      amount,
      caller,
    },
  ];

  return makeTransactionMessagesWithApproves([delegateTransactionMessage], approveMessageInfos, fetchAllowance);
}

export function makeUnDelegateMessages({
  to,
  amount,
  caller,
}: {
  to: string;
  amount: string;
  caller: string;
}): TransactionMessage[] {
  const delegateTransactionMessage = makeTransactionMessage({
    packagePath: PACKAGE_GOVERNANCE_STAKER_PATH,
    send: "",
    func: TransactionMessageFunctionType.Undelegate,
    args: [to, amount],
    caller,
  });

  return [delegateTransactionMessage];
}

export function makeReDelegateMessagesWithApproves(
  {
    from,
    to,
    amount,
    caller,
  }: {
    from: string;
    to: string;
    amount: string;
    caller: string;
  },
  fetchAllowance: (packagePath: string, owner: string, spender: string) => Promise<number>,
): Promise<TransactionMessage[]> {
  const redelegateTransactionMessage = makeTransactionMessage({
    packagePath: PACKAGE_GOVERNANCE_STAKER_PATH,
    send: "",
    func: TransactionMessageFunctionType.Redelegate,
    args: [from, to, amount],
    caller,
  });

  const approveMessageInfos: TokenApproveMessageInfo[] = [
    {
      tokenPath: GNS_TOKEN_PATH,
      targetAddress: PACKAGE_GOVERNANCE_STAKER_ADDRESS,
      amount,
      caller,
    },
  ];

  return makeTransactionMessagesWithApproves([redelegateTransactionMessage], approveMessageInfos, fetchAllowance);
}

export function makeCollectUnDelegatedGNSMessages({ caller }: { caller: string }): TransactionMessage[] {
  const collectUnDelegateGNSTransactionMessage = makeTransactionMessage({
    packagePath: PACKAGE_GOVERNANCE_STAKER_PATH,
    send: "",
    func: TransactionMessageFunctionType.CollectUnDelegatedGNS,
    args: [],
    caller,
  });

  return [collectUnDelegateGNSTransactionMessage];
}

export function makeCollectRewardMessages({ caller }: { caller: string }): TransactionMessage[] {
  const collectUnDelegateGNSTransactionMessage = makeTransactionMessage({
    packagePath: PACKAGE_GOVERNANCE_STAKER_PATH,
    send: "",
    func: TransactionMessageFunctionType.CollectReward,
    args: [],
    caller,
  });

  return [collectUnDelegateGNSTransactionMessage];
}
