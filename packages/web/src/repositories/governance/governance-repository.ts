import { GovernanceSummaryInfo, MyDelegationInfo } from "./model";
import { GetProposalsReqeust } from "./request";
import { GetMyDeligationRequest } from "./request/get-my-deligation-request";
import { GetProposalsResponse } from "./response";

export interface GovernanceRepository {
  getGovernanceSummary: () => Promise<GovernanceSummaryInfo>;

  getMyDeligation: (
    request: GetMyDeligationRequest,
  ) => Promise<MyDelegationInfo>;

  getProposals: (request: GetProposalsReqeust) => Promise<GetProposalsResponse>;
}
