import { WalletResponse } from "@common/clients/wallet-client/protocols";
import {
  GovernanceSummaryInfo2,
  MyDelegationInfo2,
  MyDelegatesInfo,
  MyUnDelegatesInfo,
  Proposals2Info,
  ProposalDetailsInfo,
  ProposalParameterInfo,
  VerifiedDelegatesInfo,
  CommunityPoolBalancesInfo,
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
  GetProposalsReqeust2,
  GetProposalDetailsRequest,
} from "./request";

export interface GovernanceRepository {
  getGovernanceSummary2: () => Promise<GovernanceSummaryInfo2>;

  getMyDelegation2: (request: GetMyDelegationRequest) => Promise<MyDelegationInfo2>;

  /**
   * @new feature
   */
  getMyDelegates: (request: GetMyDelegatesRequest) => Promise<MyDelegatesInfo>;

  /**
   * @new feature
   */
  getMyUnDelegates: (request: GetMyUnDelegatesRequest) => Promise<MyUnDelegatesInfo>;

  getProposals2: (request: GetProposalsReqeust2) => Promise<Proposals2Info>;

  /**
   * @new feature
   */
  getProposalDetails: (request: GetProposalDetailsRequest) => Promise<ProposalDetailsInfo>;

  /**
   * @new feature
   */
  getProposalParameters: () => Promise<ProposalParameterInfo>;

  /**
   * @new feature
   */
  getVerifiedDelegates: () => Promise<VerifiedDelegatesInfo>;

  /**
   * @new feature
   */
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

  sendCollectReward: () => Promise<WalletResponse<{ hash: string }>>;
}
