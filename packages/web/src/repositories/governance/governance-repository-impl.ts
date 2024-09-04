
import { NetworkClient } from "@common/clients/network-client";
import { WalletClient } from "@common/clients/wallet-client";
import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { makeTransactionMessage } from "@common/clients/wallet-client/transaction-messages";
import { CommonError } from "@common/errors";
import { PACKAGE_GOVERNANCE_PATH } from "@constants/environment.constant";

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
  SendExecuteReqeust,
  SendProposeCommunityPoolSpendReqeust,
  SendProposeParameterChangeReqeust,
  SendProposeTextReqeust,
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
}
