
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
  nullDelegateeInfo,
  nullGovernanceSummaryInfo,
  nullMyDelegationInfo,
  nullProposalsInfo,
  ProposalsInfo,
} from "./model";
import {
  GetMyDelegationRequest,
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
import {
  GetDelegateesResponse,
  GetGovernanceSummaryResponse,
  GetMyDelegationResponse,
  GetProposalsResponse,
} from "./response";

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
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const response = await this.networkClient.get<{
      data: GetGovernanceSummaryResponse;
    }>({
      url: "governance/summary",
    });

    if (!response?.data?.data) {
      return nullGovernanceSummaryInfo;
    }

    const data: GovernanceSummaryInfo = response.data.data;

    return data;
  };

  public getMyDeligation = async (
    request: GetMyDelegationRequest,
  ): Promise<MyDelegationInfo> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const response = await this.networkClient.get<{
      data: GetMyDelegationResponse;
    }>({
      url: `governance/delegations?address=${request.address}`,
    });

    if (!response?.data?.data) {
      return nullMyDelegationInfo;
    }

    const data: MyDelegationInfo = response.data.data;

    return data;
  };

  public getProposals = async (
    request: GetProposalsReqeust,
  ): Promise<ProposalsInfo> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const queries = [
      request.isActive !== undefined ? `isActive=${request.isActive}` : "",
      request.address !== undefined ? `address=${request.address}` : "",
      request.page !== undefined ? `page=${request.page}` : "",
      request.itemsPerPage !== undefined ? `itemsPerPage=${request.itemsPerPage}` : "",
    ];
    
    const response = await this.networkClient.get<{data: GetProposalsResponse}>({
      url: `governance/proposals?${queries.filter(item => !! item).join("&")}`
    });

    if (!response?.data?.data) {
      return nullProposalsInfo;
    }

    const data: ProposalsInfo = response.data.data;

    return data;
  };

  public getDelegatees = async (): Promise<DelegateeInfo[]> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const response = await this.networkClient.get<{
      data: GetDelegateesResponse;
    }>({
      url: "governance/delegatees",
    });

    if (!response?.data?.data) {
      return [nullDelegateeInfo];
    }

    const data: DelegateeInfo[] = response.data.data.delegatees;

    return data;
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
