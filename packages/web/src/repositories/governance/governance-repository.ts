import { WalletResponse } from "@common/clients/wallet-client/protocols";
import {
  DelegateeInfo,
  ExecutableFunctionInfo,
  GovernanceSummaryInfo,
  GovernanceSummaryInfo2,
  MyDelegationInfo,
  MyDelegationInfo2,
  ProposalsInfo,
  MyDelegatesInfo,
  MyUnDelegatesInfo,
  Proposals2Info,
  ProposalDetailsInfo,
  ProposalParameterInfo,
  VerifiedDelegatesInfo,
} from "./model";
import {
  GetMyDelegationRequest,
  GetProposalsReqeust,
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
  /**
   * @deprecated
   */
  getGovernanceSummary: () => Promise<GovernanceSummaryInfo>;

  getGovernanceSummary2: () => Promise<GovernanceSummaryInfo2>;

  /**
   * @deprecated
   */
  getMyDeligation: (request: GetMyDelegationRequest) => Promise<MyDelegationInfo>;

  getMyDelegation2: (request: GetMyDelegationRequest) => Promise<MyDelegationInfo2>;

  /**
   * @new feature
   */
  getMyDelegates: (request: GetMyDelegatesRequest) => Promise<MyDelegatesInfo>;

  /**
   * @new feature
   */
  getMyUnDelegates: (request: GetMyUnDelegatesRequest) => Promise<MyUnDelegatesInfo>;

  /**
   * @deprecated
   */
  getProposals: (request: GetProposalsReqeust) => Promise<ProposalsInfo>;

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

  getExecutableFunctions: () => Promise<ExecutableFunctionInfo[]>;

  getDelegatees: () => Promise<DelegateeInfo[]>;

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
