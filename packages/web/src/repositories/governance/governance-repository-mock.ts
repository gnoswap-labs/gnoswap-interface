
import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { GovernanceRepository } from "./governance-repository";
import GetDelegateesResponseMock from "./mock/get-delegatees-response.json";
import GetGovernanceSummaryResponseMock from "./mock/get-governance-summary-response.json";
import GetMyDelegationResposneMock from "./mock/get-my-delegation-response.json";
import GetProposalsResponseMock from "./mock/get-proposals-response.json";
import {
  DelegateeInfo,
  GovernanceSummaryInfo,
  MyDelegationInfo,
  ProposalsInfo,
} from "./model";
import { GetMyDeligationRequest, GetProposalsReqeust, SendCancelReqeust, SendExecuteReqeust, SendProposeCommunityPoolSpendReqeust, SendProposeParameterChangeReqeust, SendProposeTextReqeust, SendVoteReqeust } from "./request";
import {
  GetGovernanceSummaryResponse,
  GetMyDeligationResponse,
  GetProposalsResponse,
  ProposalItemResponse,
} from "./response";
import { GetDelegateesResponse } from "./response/get-delegatees-response";

export class GovernanceRepositoryMock implements GovernanceRepository {
  public getGovernanceSummary = async (): Promise<GovernanceSummaryInfo> => {
    const res: GetGovernanceSummaryResponse = GetGovernanceSummaryResponseMock;

    const result = res;

    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
  };

  public getMyDeligation = async (
    request: GetMyDeligationRequest,
  ): Promise<MyDelegationInfo> => {
    console.log(request);
    const res: GetMyDeligationResponse = GetMyDelegationResposneMock;
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
          return ["ACTIVE", "UPCOMMING"].includes(item.status);
        return true;
      },
    );

    if (!request.address) {
      mock.forEach(item => {
        item.myVote = undefined;
      });
    }

    const startIndex = request.offset * request.limit;
    const res: GetProposalsResponse = {
      proposals: [...mock]
        .reverse()
        .slice(startIndex, startIndex + request.limit),
      pageInfo: {
        totalItems: mock.length,
        totalPages: (mock.length + request.limit) % request.limit,
        currentPage: request.offset,
      },
    };
    const result = res;

    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
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
    request: SendProposeParameterChangeReqeust,
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
}
