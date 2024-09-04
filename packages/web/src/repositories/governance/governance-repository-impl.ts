
import { NetworkClient } from "@common/clients/network-client";
import { WalletClient } from "@common/clients/wallet-client";
import { WalletResponse } from "@common/clients/wallet-client/protocols";
import {
  makeApproveMessage,
  makeTransactionMessage,
} from "@common/clients/wallet-client/transaction-messages";
import { CommonError } from "@common/errors";
import { GNS_TOKEN } from "@common/values/token-constant";
import {
  PACKAGE_GOVERNANCE_PATH,
  PACKAGE_GOVERNANCE_STAKER_ADDRESS,
  PACKAGE_GOVERNANCE_STAKER_PATH,
} from "@constants/environment.constant";

import { GovernanceRepository } from "./governance-repository";
import { GovernanceRepositoryMock } from "./governance-repository-mock";
import {
  DelegateeInfo,
  GovernanceSummaryInfo,
  MyDelegationInfo,
  ProposalsInfo,
} from "./model";
import {
  GetMyDeligationRequest,
  GetProposalsReqeust,
  SendCancelReqeust,
  SendDelegateReqeust,
  SendExecuteReqeust,
  SendProposeCommunityPoolSpendReqeust,
  SendProposeParameterChangeReqeust,
  SendProposeTextReqeust,
  SendRedelegateReqeust,
  SendUndelegateReqeust,
  SendVoteReqeust,
} from "./request";

export class GovernanceRepositoryImpl implements GovernanceRepository {
  private networkClient: NetworkClient | null;
  private walletClient: WalletClient | null;
  private mockRepository: GovernanceRepositoryMock;

  constructor(
    networkClient: NetworkClient | null,
    walletClient: WalletClient | null,
  ) {
    this.networkClient = networkClient;
    this.walletClient = walletClient;
    this.mockRepository = new GovernanceRepositoryMock();
  }

  public getGovernanceSummary = async (): Promise<GovernanceSummaryInfo> => {
    return this.mockRepository.getGovernanceSummary();
  };

  public getMyDeligation = async (
    request: GetMyDeligationRequest,
  ): Promise<MyDelegationInfo> => {
    return this.mockRepository.getMyDeligation(request);
  };

  public getProposals = async (
    request: GetProposalsReqeust,
  ): Promise<ProposalsInfo> => {
    return this.mockRepository.getProposals(request);
  };

  public getDelegatees = async (): Promise<DelegateeInfo[]> => {
    return this.mockRepository.getDelegatees();
  };

  public sendProposeText = async (
    request: SendProposeTextReqeust,
  ): Promise<WalletResponse<{ hash: string }>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const account = await this.walletClient.getAccount();
    if (!account.data || !PACKAGE_GOVERNANCE_PATH) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const { address } = account.data;
    const { title, description } = request;

    const messages = [];
    messages.push(
      makeTransactionMessage({
        packagePath: PACKAGE_GOVERNANCE_PATH,
        send: "",
        func: "ProposeText",
        args: [title, description],
        caller: address,
      }),
    );
    const response = await this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });

    return {
      ...response,
      data: {
        hash: response.data?.hash || "",
      },
    };
  };

  public sendProposeCommunityPoolSpend = async (
    request: SendProposeCommunityPoolSpendReqeust,
  ): Promise<WalletResponse<{ hash: string }>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const account = await this.walletClient.getAccount();
    if (!account.data || !PACKAGE_GOVERNANCE_PATH) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const { address } = account.data;
    const { title, description, to, tokenPath, amount } = request;

    const messages = [];
    messages.push(
      makeTransactionMessage({
        packagePath: PACKAGE_GOVERNANCE_PATH,
        send: "",
        func: "ProposeCommunityPoolSpend",
        args: [title, description, to, tokenPath, amount],
        caller: address,
      }),
    );
    const response = await this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });

    return {
      ...response,
      data: {
        hash: response.data?.hash || "",
      },
    };
  };

  public sendProposeParameterChange = async (
    request: SendProposeParameterChangeReqeust,
  ): Promise<WalletResponse<{ hash: string }>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const account = await this.walletClient.getAccount();
    if (!account.data || !PACKAGE_GOVERNANCE_PATH) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const { address } = account.data;
    const { title, description, pkgPath, functionName, param } = request;

    const messages = [];
    messages.push(
      makeTransactionMessage({
        packagePath: PACKAGE_GOVERNANCE_PATH,
        send: "",
        func: "ProposeParameterChange",
        args: [title, description, pkgPath, functionName, param],
        caller: address,
      }),
    );
    const response = await this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });

    return {
      ...response,
      data: {
        hash: response.data?.hash || "",
      },
    };
  };

  public sendVote = async (
    request: SendVoteReqeust,
  ): Promise<WalletResponse<{ hash: string }>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const account = await this.walletClient.getAccount();
    if (!account.data || !PACKAGE_GOVERNANCE_PATH) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const { address } = account.data;
    const { proposalId, voteYes } = request;

    const messages = [];
    messages.push(
      makeTransactionMessage({
        packagePath: PACKAGE_GOVERNANCE_PATH,
        send: "",
        func: "Vote",
        args: [proposalId.toString(), `${voteYes}`],
        caller: address,
      }),
    );
    const response = await this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });

    return {
      ...response,
      data: {
        hash: response.data?.hash || "",
      },
    };
  };

  public sendCancel = async (
    request: SendCancelReqeust,
  ): Promise<WalletResponse<{ hash: string }>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const account = await this.walletClient.getAccount();
    if (!account.data || !PACKAGE_GOVERNANCE_PATH) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const { address } = account.data;
    const { proposalId } = request;

    const messages = [];
    messages.push(
      makeTransactionMessage({
        packagePath: PACKAGE_GOVERNANCE_PATH,
        send: "",
        func: "Cancel",
        args: [proposalId.toString()],
        caller: address,
      }),
    );
    const response = await this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });

    return {
      ...response,
      data: {
        hash: response.data?.hash || "",
      },
    };
  };

  public sendExecute = async (
    request: SendExecuteReqeust,
  ): Promise<WalletResponse<{ hash: string }>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const account = await this.walletClient.getAccount();
    if (!account.data || !PACKAGE_GOVERNANCE_PATH) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const { address } = account.data;
    const { proposalId } = request;

    const messages = [];
    messages.push(
      makeTransactionMessage({
        packagePath: PACKAGE_GOVERNANCE_PATH,
        send: "",
        func: "Execute",
        args: [proposalId.toString()],
        caller: address,
      }),
    );
    const response = await this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });

    return {
      ...response,
      data: {
        hash: response.data?.hash || "",
      },
    };
  };

  public sendDelegate = async (
    request: SendDelegateReqeust,
  ): Promise<WalletResponse<{ hash: string }>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const account = await this.walletClient.getAccount();
    if (
      !account.data ||
      !PACKAGE_GOVERNANCE_STAKER_PATH ||
      !PACKAGE_GOVERNANCE_STAKER_ADDRESS
    ) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const { address } = account.data;
    const { to, amount } = request;

    const messages = [];
    messages.push(
      makeApproveMessage(
        GNS_TOKEN.path,
        [PACKAGE_GOVERNANCE_STAKER_ADDRESS, amount],
        address,
      ),
    );
    messages.push(
      makeTransactionMessage({
        packagePath: PACKAGE_GOVERNANCE_STAKER_PATH,
        send: "",
        func: "Delegate",
        args: [to, amount],
        caller: address,
      }),
    );
    const response = await this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });

    return {
      ...response,
      data: {
        hash: response.data?.hash || "",
      },
    };
  };

  public sendUndelegate = async (
    request: SendUndelegateReqeust,
  ): Promise<WalletResponse<{ hash: string }>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const account = await this.walletClient.getAccount();
    if (!account.data || !PACKAGE_GOVERNANCE_STAKER_PATH) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const { address } = account.data;
    const { to, amount } = request;

    const messages = [];
    messages.push(
      makeTransactionMessage({
        packagePath: PACKAGE_GOVERNANCE_STAKER_PATH,
        send: "",
        func: "Undelegate",
        args: [to, amount],
        caller: address,
      }),
    );
    const response = await this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });

    return {
      ...response,
      data: {
        hash: response.data?.hash || "",
      },
    };
  };

  public sendRedelegate = async (
    request: SendRedelegateReqeust,
  ): Promise<WalletResponse<{ hash: string }>> => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const account = await this.walletClient.getAccount();
    if (!account.data || !PACKAGE_GOVERNANCE_STAKER_PATH) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const { address } = account.data;
    const { from, to, amount } = request;

    const messages = [];
    messages.push(
      makeTransactionMessage({
        packagePath: PACKAGE_GOVERNANCE_STAKER_PATH,
        send: "",
        func: "Redelegate",
        args: [from, to, amount],
        caller: address,
      }),
    );
    const response = await this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });

    return {
      ...response,
      data: {
        hash: response.data?.hash || "",
      },
    };
  };

  public sendCollectUndelegated = async (): Promise<
    WalletResponse<{ hash: string }>
  > => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const account = await this.walletClient.getAccount();
    if (!account.data || !PACKAGE_GOVERNANCE_STAKER_PATH) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const { address } = account.data;

    const messages = [];
    messages.push(
      makeTransactionMessage({
        packagePath: PACKAGE_GOVERNANCE_STAKER_PATH,
        send: "",
        func: "CollectUndelegated",
        args: [],
        caller: address,
      }),
    );
    const response = await this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });

    return {
      ...response,
      data: {
        hash: response.data?.hash || "",
      },
    };
  };

  public sendCollectReward = async (): Promise<
    WalletResponse<{ hash: string }>
  > => {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const account = await this.walletClient.getAccount();
    if (!account.data || !PACKAGE_GOVERNANCE_STAKER_PATH) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const { address } = account.data;

    const messages = [];
    messages.push(
      makeTransactionMessage({
        packagePath: PACKAGE_GOVERNANCE_STAKER_PATH,
        send: "",
        func: "CollectReward",
        args: [],
        caller: address,
      }),
    );
    const response = await this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });

    return {
      ...response,
      data: {
        hash: response.data?.hash || "",
      },
    };
  };
}
