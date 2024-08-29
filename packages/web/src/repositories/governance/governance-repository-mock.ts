
import { GovernanceRepository } from "./governance-repository";
import GetMyDelegationResposneMock from "./mock/get-my-delegation-response.json";
import GetProposalsResponseMock from "./mock/get-proposals-response.json";
import { GovernanceSummaryInfo, MyDelegationInfo, ProposalsInfo } from "./model";
import { GetMyDeligationRequest, GetProposalsReqeust } from "./request";
import {
  GetGovernanceSummaryResponse,
  GetMyDeligationResponse,
  GetProposalsResponse,
  ProposalItemResponse,
} from "./response";

export class GovernanceRepositoryMock implements GovernanceRepository {
  public getGovernanceSummary = async (): Promise<GovernanceSummaryInfo> => {
    const res: GetGovernanceSummaryResponse = {
      totalDeligated: 59144225,
      DeligatedRatio: 55.12,
      apy: 12.51,
      communityPool: 2412148.12,
    };

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
}
