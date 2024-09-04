import { WalletResponse } from "@common/clients/wallet-client/protocols";
import {
  DelegateeInfo,
  GovernanceSummaryInfo,
  MyDelegationInfo,
  ProposalsInfo,
} from "./model";
import { GetProposalsReqeust, SendProposeCommunityPoolSpendReqeust, SendProposeParameterChangeReqeust, SendProposeTextReqeust } from "./request";
import { GetMyDeligationRequest } from "./request/get-my-deligation-request";

export interface GovernanceRepository {
  getGovernanceSummary: () => Promise<GovernanceSummaryInfo>;

  getMyDeligation: (
    request: GetMyDeligationRequest,
  ) => Promise<MyDelegationInfo>;

  getProposals: (request: GetProposalsReqeust) => Promise<ProposalsInfo>;

  getDelegatees: () => Promise<DelegateeInfo[]>;

  sendProposeText: (
    request: SendProposeTextReqeust,
  ) => Promise<WalletResponse<{ hash: string }>>;

  sendProposeCommunityPoolSpend: (
    request: SendProposeCommunityPoolSpendReqeust,
  ) => Promise<WalletResponse<{ hash: string }>>;

  sendProposeParameterChange: (
    request: SendProposeParameterChangeReqeust,
  ) => Promise<WalletResponse<{ hash: string }>>;
}
