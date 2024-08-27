
import { GovernanceRepository } from "./governance-repository";
import GetProposalsResponseMock from "./mock/get-proposals-response.json";
import GetMyDelegationResposneMock from "./mock/get-my-delegation-response.json";
import { GovernanceSummaryInfo, MyDelegationInfo } from "./model";
import { GetMyDeligationRequest, GetProposalsReqeust } from "./request";
import {
  GetGovernanceSummaryResponse,
  GetMyDeligationResponse,
  GetProposalsResponse
} from "./response";

export class GovernanceRepositoryMock implements GovernanceRepository {
  public getGovernanceSummary =
    async (): Promise<GovernanceSummaryInfo> => {
      const res: GetGovernanceSummaryResponse = {
        totalDeligated: 59144225,
        DeligatedRatio: 55.12,
        apy: 12.51,
        communityPool: 2412148.12,
      };

      const result = res;

      return new Promise(resolve => setTimeout(resolve, 500)).then(
        () => result,
      );
    };

  public getMyDeligation = async (
    request: GetMyDeligationRequest,
  ) :Promise<MyDelegationInfo> => {
    console.log(request);
    const res: GetMyDeligationResponse = GetMyDelegationResposneMock;
    const result = res;

    return new Promise(resolve => setTimeout(resolve, 500)).then(
      () => result,
    );
  };

  public getProposals = async (
    request: GetProposalsReqeust,
  ): Promise<GetProposalsResponse> => {
    console.log(request);

    return new Promise(resolve => setTimeout(resolve, 500)).then(() => ({
      proposals: GetProposalsResponseMock,
    }));
  };
}
