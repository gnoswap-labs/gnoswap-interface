import { Proposal2ItemInfo, Proposals2PageInfo } from "../model/proposals2-info";

export interface GetProposals2Response {
  proposals: Proposal2ItemInfo[];
  pageInfo: Proposals2PageInfo;
}
