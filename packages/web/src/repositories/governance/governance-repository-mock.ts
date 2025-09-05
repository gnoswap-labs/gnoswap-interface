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
  GovernanceSummaryInfo2,
  MyDelegatesInfo,
  MyDelegationInfo,
  MyDelegationInfo2,
  MyUnDelegatesInfo,
  ProposalDetailsInfo,
  ProposalParameterInfo,
  Proposals2Info,
  ProposalsInfo,
} from "./model";
import {
  GetMyDelegatesRequest,
  GetMyDelegationRequest,
  GetMyUnDelegatesRequest,
  GetProposalDetailsRequest,
  GetProposalsReqeust,
  GetProposalsReqeust2,
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
import MockGovernanceSummary2Response from "./mock/get-governance-summary2-response.json";
import MockGovernanceMyDelegation2Response from "./mock/get-my-delegation2-response.json";
import MockGovernanceMyDelegatesResponse from "./mock/get-my-delegates-response.json";
import MockGovernanceMyUnDelegatesResponse from "./mock/get-my-undelegates-response.json";
import MockGovernanceProposals2Response from "./mock/get-proposals2-response.json";
import MockGovernanceProposalDetailsResponse from "./mock/get-proposal-details-response.json";
import MockGovernanceProposalParametersResponse from "./mock/get-proposal-parameters-response.json";

export class GovernanceRepositoryMock implements GovernanceRepository {
  public getGovernanceSummary = async (): Promise<GovernanceSummaryInfo> => {
    const res: GetGovernanceSummaryResponse = GetGovernanceSummaryResponseMock;

    const result = res;

    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
  };

  public getGovernanceSummary2 = async (): Promise<GovernanceSummaryInfo2> => {
    const result = MockGovernanceSummary2Response;
    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
  };

  public getMyDeligation = async (request: GetMyDelegationRequest): Promise<MyDelegationInfo> => {
    console.log(request);
    const res: GetMyDelegationResponse = GetMyDelegationResposneMock;
    const result = res;

    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
  };

  public getMyDelegation2 = async (request: GetMyDelegationRequest): Promise<MyDelegationInfo2> => {
    console.log(request);
    const result = MockGovernanceMyDelegation2Response;
    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
  };

  public getMyDelegates = async (request: GetMyDelegatesRequest): Promise<MyDelegatesInfo> => {
    console.log(request);
    const result = MockGovernanceMyDelegatesResponse;
    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
  };

  public getMyUnDelegates = async (request: GetMyUnDelegatesRequest): Promise<MyUnDelegatesInfo> => {
    console.log(request);
    const result = MockGovernanceMyUnDelegatesResponse;
    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
  };

  public getProposals = async (request: GetProposalsReqeust): Promise<ProposalsInfo> => {
    console.log(request);
    const mock: ProposalItemResponse[] = GetProposalsResponseMock.filter(item => {
      if (request.isActive) return ["ACTIVE", "UPCOMING"].includes(item.status);
      return true;
    });

    if (!request.address) {
      mock.forEach(item => {
        item.myVote = undefined;
      });
    }

    const startIndex = (request.page - 1) * request.itemsPerPage;
    const res: GetProposalsResponse = {
      proposals: [...mock].reverse().slice(startIndex, startIndex + request.itemsPerPage),
      pageInfo: {
        totalItems: mock.length,
        totalPages: Math.floor((mock.length + request.itemsPerPage) / request.itemsPerPage),
        currentPage: request.page,
      },
    };
    const result = res;

    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
  };

  public getProposals2 = async (request: GetProposalsReqeust2): Promise<Proposals2Info> => {
    console.log("Mock getProposals2:", request);
    const result = MockGovernanceProposals2Response as Proposals2Info;
    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
  };

  public getProposalDetails = async (request: GetProposalDetailsRequest): Promise<ProposalDetailsInfo> => {
    console.log("Mock getProposalDetails:", request);
    const result = MockGovernanceProposalDetailsResponse as ProposalDetailsInfo;
    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
  };

  public getProposalParameters = async (): Promise<ProposalParameterInfo> => {
    console.log("Mock getProposalParameters:");
    const result = MockGovernanceProposalParametersResponse;
    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
  };

  public getExecutableFunctions = async (): Promise<ExecutableFunctionInfo[]> => {
    return GetExecutableFunctionsResponseMock;
  };

  public getDelegatees = async (): Promise<DelegateeInfo[]> => {
    const res: GetDelegateesResponse = {
      delegatees: GetDelegateesResponseMock,
    };

    const result = res.delegatees;

    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
  };

  public sendProposeText = async (request: SendProposeTextReqeust): Promise<WalletResponse<{ hash: string }>> => {
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

  public sendVote = async (request: SendVoteReqeust): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error(`Mock sendVote : ${request}`);
  };

  public sendCancel = async (request: SendCancelReqeust): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error(`Mock sendCancel : ${request}`);
  };

  public sendExecute = async (request: SendExecuteReqeust): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error(`Mock sendExecute : ${request}`);
  };

  public sendDelegate = async (request: SendDelegateReqeust): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error(`Mock sendDelegate : ${request}`);
  };

  public sendUndelegate = async (request: SendUndelegateReqeust): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error(`Mock sendUndelegate : ${request}`);
  };

  public sendRedelegate = async (request: SendRedelegateReqeust): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error(`Mock sendRedelegate : ${request}`);
  };

  public sendCollectUndelegated = async (): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error("Mock sendCollectUndelegated");
  };

  public sendCollectReward = async (): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error("Mock sendCollectUndelegated");
  };
}
