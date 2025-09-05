import { ProposalItemInfo, ProposalsPageInfo } from "../model/proposals-info";

export interface GetProposals2Response {
  proposals: ProposalItemInfo[];
  pageInfo: ProposalsPageInfo;
}
