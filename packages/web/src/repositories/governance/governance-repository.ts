import { WalletResponse } from "@common/clients/wallet-client/protocols";
import {
  DelegateeInfo,
  GovernanceSummaryInfo,
  MyDelegationInfo,
  ProposalsInfo,
} from "./model";
import {
  GetProposalsReqeust,
  SendProposeCommunityPoolSpendReqeust,
  SendProposeParameterChangeReqeust,
  SendProposeTextReqeust,
  SendVoteReqeust,
  GetMyDeligationRequest,
  SendCancelReqeust,
  SendExecuteReqeust,
} from "./request";

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

  sendVote: (
    request: SendVoteReqeust,
  ) => Promise<WalletResponse<{ hash: string }>>;

  sendCancel: (
    request: SendCancelReqeust,
  ) => Promise<WalletResponse<{ hash: string }>>;

  sendExecute: (
    request: SendExecuteReqeust,
  ) => Promise<WalletResponse<{ hash: string }>>;
}
