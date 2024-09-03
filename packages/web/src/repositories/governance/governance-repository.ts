import {
  DelegateeInfo,
  GovernanceSummaryInfo,
  MyDelegationInfo,
  ProposalsInfo,
} from "./model";
import { GetProposalsReqeust } from "./request";
import { GetMyDeligationRequest } from "./request/get-my-deligation-request";

export interface GovernanceRepository {
  getGovernanceSummary: () => Promise<GovernanceSummaryInfo>;

  getMyDeligation: (
    request: GetMyDeligationRequest,
  ) => Promise<MyDelegationInfo>;

  getProposals: (request: GetProposalsReqeust) => Promise<ProposalsInfo>;

  getDelegatees: () => Promise<DelegateeInfo[]>
}
