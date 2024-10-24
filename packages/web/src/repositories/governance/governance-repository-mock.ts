import { WalletResponse } from "@common/clients/wallet-client/protocols";

import { GovernanceRepository } from "./governance-repository";
import GetDelegateesResponseMock from "./mock/get-delegatees-response.json";
import GetExecutableFunctionsResponseMock from "./mock/get-executable-functions-response.json";
import GetGovernanceSummaryResponseMock from "./mock/get-governance-summary-response.json";
import GetMyDelegationResposneMock from "./mock/get-my-delegation-response.json";
import GetProposalsResponseMock from "./mock/get-proposals-response.json";
import {
  DelegateeInfo,
  ExecutableFunctionInfo,
  GovernanceSummaryInfo,
  MyDelegationInfo,
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
  ProposalItemResponse,
} from "./response";

export class GovernanceRepositoryMock implements GovernanceRepository {
  public getGovernanceSummary = async (): Promise<GovernanceSummaryInfo> => {
    const res: GetGovernanceSummaryResponse = GetGovernanceSummaryResponseMock;

    const result = res;

    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
  };

  public getMyDeligation = async (
    request: GetMyDelegationRequest,
  ): Promise<MyDelegationInfo> => {
    console.log(request);
    const res: GetMyDelegationResponse = GetMyDelegationResposneMock;
    const result = res;

    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
  };

  public getProposals = async (
    request: GetProposalsReqeust,
  ): Promise<ProposalsInfo> => {
    console.log(request);
    const mock: ProposalItemResponse[] = GetProposalsResponseMock.filter(
      item => {
        if (request.isActive)
          return ["ACTIVE", "UPCOMING"].includes(item.status);
        return true;
      },
    );

    if (!request.address) {
      mock.forEach(item => {
        item.myVote = undefined;
      });
    }

    const startIndex = (request.page - 1) * request.itemsPerPage;
    const res: GetProposalsResponse = {
      proposals: [...mock]
        .reverse()
        .slice(startIndex, startIndex + request.itemsPerPage),
      pageInfo: {
        totalItems: mock.length,
        totalPages: Math.floor(
          (mock.length + request.itemsPerPage) / request.itemsPerPage,
        ),
        currentPage: request.page,
      },
    };
    const result = res;

    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
  };

  public getExecutableFunctions = async (): Promise<
    ExecutableFunctionInfo[]
  > => {
    return GetExecutableFunctionsResponseMock;
  };

  public getDelegatees = async (): Promise<DelegateeInfo[]> => {
    const res: GetDelegateesResponse = {
      delegatees: GetDelegateesResponseMock,
    };

    const result = res.delegatees;

    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
  };

  public sendProposeText = async (
    request: SendProposeTextReqeust,
  ): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error(`Mock sendProposeText : ${request}`);
  };

  public sendProposeCommunityPoolSpend = async (
    request: SendProposeCommunityPoolSpendReqeust,
  ): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error(`Mock sendProposeCommunityPoolSpend : ${request}`);
  };

  public sendProposeParameterChange = async (
    request: SendProposeParameterChangeRequest,
  ): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error(`Mock sendProposeParameterChange : ${request}`);
  };

  public sendVote = async (
    request: SendVoteReqeust,
  ): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error(`Mock sendVote : ${request}`);
  };

  public sendCancel = async (
    request: SendCancelReqeust,
  ): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error(`Mock sendCancel : ${request}`);
  };

  public sendExecute = async (
    request: SendExecuteReqeust,
  ): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error(`Mock sendExecute : ${request}`);
  };

  public sendDelegate = async (
    request: SendDelegateReqeust,
  ): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error(`Mock sendDelegate : ${request}`);
  };

  public sendUndelegate = async (
    request: SendUndelegateReqeust,
  ): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error(`Mock sendUndelegate : ${request}`);
  };

  public sendRedelegate = async (
    request: SendRedelegateReqeust,
  ): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error(`Mock sendRedelegate : ${request}`);
  };

  public sendCollectUndelegated = async (): Promise<
    WalletResponse<{ hash: string }>
  > => {
    throw new Error("Mock sendCollectUndelegated");
  };

  public sendCollectReward = async (): Promise<
    WalletResponse<{ hash: string }>
  > => {
    throw new Error("Mock sendCollectUndelegated");
  };
}
