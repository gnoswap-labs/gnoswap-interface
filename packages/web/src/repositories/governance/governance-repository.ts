import { GovernanceSummaryInfo } from "./model";
import { GetProposalsReqeust } from "./request";
import { GetMyDeligationRequest } from "./request/get-my-deligation-request";
import { GetMyDeligationResponse, GetProposalsResponse } from "./response";

export interface GovernanceRepository {
  getGovernanceSummary: () => Promise<GovernanceSummaryInfo>;

  getMyDeligation: (
    request: GetMyDeligationRequest,
  ) => Promise<GetMyDeligationResponse>;

  getProposals: (request: GetProposalsReqeust) => Promise<GetProposalsResponse>;
}
