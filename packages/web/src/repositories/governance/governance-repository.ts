import { WalletResponse } from "@common/clients/wallet-client/protocols";
import {
  MyDelegationInfo,
  MyDelegatesInfo,
  MyUnDelegatesInfo,
  ProposalsInfo,
  ProposalDetailsInfo,
  ProposalParameterInfo,
  VerifiedDelegatesInfo,
  CommunityPoolBalancesInfo,
  GovernanceSummaryInfo,
} from "./model";
import {
  GetMyDelegationRequest,
  GetMyDelegatesRequest,
  GetMyUnDelegatesRequest,
  SendCancelReqeust,
  SendDelegateReqeust,
  SendExecuteReqeust,
  SendProposeCommunityPoolSpendReqeust,
  SendProposeParameterChangeRequest,
  SendProposeTextReqeust,
  SendRedelegateReqeust,
  SendUndelegateReqeust,
  SendVoteReqeust,
  GetProposalsReqeust,
  GetProposalDetailsRequest,
} from "./request";

export interface GovernanceRepository {
  getGovernanceSummary: () => Promise<GovernanceSummaryInfo>;

  getMyDelegation: (request: GetMyDelegationRequest) => Promise<MyDelegationInfo>;

  getMyDelegates: (request: GetMyDelegatesRequest) => Promise<MyDelegatesInfo>;

  getMyUnDelegates: (request: GetMyUnDelegatesRequest) => Promise<MyUnDelegatesInfo>;

  getProposals: (request: GetProposalsReqeust) => Promise<ProposalsInfo>;

  getProposalDetails: (request: GetProposalDetailsRequest) => Promise<ProposalDetailsInfo>;

  getProposalParameters: () => Promise<ProposalParameterInfo>;

  getVerifiedDelegates: () => Promise<VerifiedDelegatesInfo>;

  getCommunityPoolBalances: () => Promise<CommunityPoolBalancesInfo>;

  sendProposeText: (request: SendProposeTextReqeust) => Promise<WalletResponse<{ hash: string }>>;

  sendProposeCommunityPoolSpend: (
    request: SendProposeCommunityPoolSpendReqeust,
  ) => Promise<WalletResponse<{ hash: string }>>;

  sendProposeParameterChange: (request: SendProposeParameterChangeRequest) => Promise<WalletResponse<{ hash: string }>>;

  sendVote: (request: SendVoteReqeust) => Promise<WalletResponse<{ hash: string }>>;

  sendCancel: (request: SendCancelReqeust) => Promise<WalletResponse<{ hash: string }>>;

  sendExecute: (request: SendExecuteReqeust) => Promise<WalletResponse<{ hash: string }>>;

  sendDelegate: (request: SendDelegateReqeust) => Promise<WalletResponse<{ hash: string }>>;

  sendUndelegate: (request: SendUndelegateReqeust) => Promise<WalletResponse<{ hash: string }>>;

  sendRedelegate: (request: SendRedelegateReqeust) => Promise<WalletResponse<{ hash: string }>>;

  sendCollectUndelegated: () => Promise<WalletResponse<{ hash: string }>>;

  sendCollectReward: (
    claimGovernanceRewards: boolean,
    claimLaunchpadProtocolFees: boolean,
  ) => Promise<WalletResponse<{ hash: string }>>;
}
