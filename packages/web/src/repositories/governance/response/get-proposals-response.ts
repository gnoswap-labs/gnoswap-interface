import { ProposalItemInfo, ProposalsPageInfo } from "../model/proposals-info";

export interface GetProposalsResponse {
  proposals: ProposalItemInfo[];
  pageInfo: ProposalsPageInfo;
}
