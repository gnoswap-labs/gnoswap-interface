import { NetworkClient } from "@common/clients/network-client";
import { WalletClient } from "@common/clients/wallet-client";
import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { CommonError } from "@common/errors";
import { PACKAGE_GOVERNANCE_STAKER_PATH } from "@constants/environment.constant";

import { GovernanceRepository } from "./governance-repository";
import {
  DelegateeInfo,
  ExecutableFunctionInfo,
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
  SendProposeParameterChangeRequest,
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

import { DEFAULT_GAS_FEE } from "@common/values";
import {
  makeCancelMessages,
  makeCollectRewardMessages,
  makeCollectUnDelegatedGNSMessages,
  makeDelegateMessagesWithApproves,
  makeExecuteMessages,
  makeProposalTextMessages,
  makeProposeCommunityPoolSpendMessages,
  makeProposeParameterChangeMessages,
  makeReDelegateMessagesWithApproves,
  makeUnDelegateMessages,
  makeVoteMessages,
} from "./governance.message";
import GetExecutableFunctionsResponseMock from "./mock/get-executable-functions-response.json";

export class GovernanceRepositoryImpl implements GovernanceRepository {
  private networkClient: NetworkClient | null;
  private walletClient: WalletClient | null;

  constructor(networkClient: NetworkClient | null, walletClient: WalletClient | null) {
    this.networkClient = networkClient;
    this.walletClient = walletClient;
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

  public getMyDeligation = async (request: GetMyDelegationRequest): Promise<MyDelegationInfo> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const response = await this.networkClient
      .get<{
        data: GetMyDelegationResponse;
      }>({
        url: `governance/delegations?address=${request.address}`,
      })
      .catch(e => {
        console.error(e);
        return null;
      });

    if (!response?.data?.data) {
      return nullMyDelegationInfo;
    }

    const data: MyDelegationInfo = response.data.data;

    return data;
  };

  public getProposals = async (request: GetProposalsReqeust): Promise<ProposalsInfo> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const queries = [
      request.isActive !== undefined ? `isActive=${request.isActive}` : "",
      request.address !== undefined ? `address=${request.address}` : "",
      request.page !== undefined ? `page=${request.page}` : "",
      request.itemsPerPage !== undefined ? `itemsPerPage=${request.itemsPerPage}` : "",
    ];

    const response = await this.networkClient.get<{
      data: GetProposalsResponse;
    }>({
      url: `governance/proposals?${queries.filter(item => !!item).join("&")}`,
    });

    if (!response?.data?.data) {
      return nullProposalsInfo;
    }

    const data: ProposalsInfo = response.data.data;

    return data;
  };

  public getExecutableFunctions = async (): Promise<ExecutableFunctionInfo[]> => {
    return GetExecutableFunctionsResponseMock;
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

  public sendProposeText = async (request: SendProposeTextReqeust): Promise<WalletResponse<{ hash: string }>> => {
    const caller = await this.getAddress();
    const messages = makeProposalTextMessages({ ...request, caller });

    return this.walletClient!.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      memo: "",
    });
  };

  public sendProposeCommunityPoolSpend = async (
    request: SendProposeCommunityPoolSpendReqeust,
  ): Promise<WalletResponse<{ hash: string }>> => {
    const caller = await this.getAddress();
    const messages = makeProposeCommunityPoolSpendMessages({ ...request, caller });

    return this.walletClient!.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      memo: "",
    });
  };

  public sendProposeParameterChange = async (
    request: SendProposeParameterChangeRequest,
  ): Promise<WalletResponse<{ hash: string }>> => {
    const caller = await this.getAddress();
    const messages = makeProposeParameterChangeMessages({ ...request, caller });

    return this.walletClient!.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      memo: "",
    });
  };

  public sendVote = async (request: SendVoteReqeust): Promise<WalletResponse<{ hash: string }>> => {
    const caller = await this.getAddress();
    const messages = makeVoteMessages({ ...request, caller });

    return this.walletClient!.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      memo: "",
    });
  };

  public sendCancel = async (request: SendCancelReqeust): Promise<WalletResponse<{ hash: string }>> => {
    const caller = await this.getAddress();
    const messages = makeCancelMessages({ ...request, caller });

    return this.walletClient!.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      memo: "",
    });
  };

  public sendExecute = async (request: SendExecuteReqeust): Promise<WalletResponse<{ hash: string }>> => {
    const caller = await this.getAddress();
    const messages = makeExecuteMessages({ ...request, caller });

    return this.walletClient!.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      memo: "",
    });
  };

  public sendDelegate = async (request: SendDelegateReqeust): Promise<WalletResponse<{ hash: string }>> => {
    const caller = await this.getAddress();
    const messages = makeDelegateMessagesWithApproves({ ...request, caller });

    return this.walletClient!.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      memo: "",
    });
  };

  public sendUndelegate = async (request: SendUndelegateReqeust): Promise<WalletResponse<{ hash: string }>> => {
    const caller = await this.getAddress();
    const messages = makeUnDelegateMessages({ ...request, caller });

    return this.walletClient!.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      memo: "",
    });
  };

  public sendRedelegate = async (request: SendRedelegateReqeust): Promise<WalletResponse<{ hash: string }>> => {
    const caller = await this.getAddress();
    const messages = makeReDelegateMessagesWithApproves({ ...request, caller });

    return this.walletClient!.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      memo: "",
    });
  };

  public sendCollectUndelegated = async (): Promise<WalletResponse<{ hash: string }>> => {
    const caller = await this.getAddress();
    const messages = makeCollectUnDelegatedGNSMessages({ caller });

    return this.walletClient!.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      memo: "",
    });
  };

  public sendCollectReward = async (): Promise<WalletResponse<{ hash: string }>> => {
    const caller = await this.getAddress();
    const messages = makeCollectRewardMessages({ caller });

    return this.walletClient!.sendTransaction({
      messages,
      gasFee: DEFAULT_GAS_FEE,
      memo: "",
    });
  };

  private async getAddress(): Promise<string> {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    const address = await this.walletClient.getAddress();
    if (!address || !PACKAGE_GOVERNANCE_STAKER_PATH) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    return address;
  }
}
