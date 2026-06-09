import { WalletResponse } from "@common/clients/wallet-client/protocols";

import { GovernanceRepository } from "./governance-repository";
import {
  CommunityPoolBalancesInfo,
  GovernanceSummaryInfo,
  MyDelegatesInfo,
  MyDelegationInfo,
  MyUnDelegatesInfo,
  ProposalDetailsInfo,
  ProposalParameterInfo,
  ProposalsInfo,
  VerifiedDelegatesInfo,
} from "./model";
import {
  GetMyDelegatesRequest,
  GetMyDelegationRequest,
  GetMyUnDelegatesRequest,
  GetProposalDetailsRequest,
  GetProposalsReqeust,
  SendCancelReqeust,
  SendDelegateReqeust,
  SendExecuteReqeust,
  SendProposeCommunityPoolSpendReqeust,
  SendProposeParameterChangeRequest,
  SendProposeTextReqeust,
  SendRedelegateReqeust,
  SendUndelegateReqeust,
  SendVoteReqeust,
} from "./request";
import MockGovernanceSummaryResponse from "./mock/get-governance-summary-response.json";
import MockGovernanceMyDelegationResponse from "./mock/get-my-delegation-response.json";
import MockGovernanceMyDelegatesResponse from "./mock/get-my-delegates-response.json";
import MockGovernanceMyUnDelegatesResponse from "./mock/get-my-undelegates-response.json";
import MockGovernanceProposalsResponse from "./mock/get-proposals-response.json";
import MockGovernanceProposalDetailsResponse from "./mock/get-proposal-details-response.json";
import MockGovernanceProposalParametersResponse from "./mock/get-proposal-parameters-response.json";
import MockGovernanceVerifiedDelegatesResponse from "./mock/get-verified-delegates-response.json";
import MockGovernanceCommunityPoolBalancesResponse from "./mock/get-community-pool-balances-response.json";

export class GovernanceRepositoryMock implements GovernanceRepository {
  public getGovernanceSummary = async (): Promise<GovernanceSummaryInfo> => {
    const result = MockGovernanceSummaryResponse;
    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
  };

  public getMyDelegation = async (request: GetMyDelegationRequest): Promise<MyDelegationInfo> => {
    console.log(request);
    const result = MockGovernanceMyDelegationResponse;
    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
  };

  public getMyDelegates = async (request: GetMyDelegatesRequest): Promise<MyDelegatesInfo> => {
    console.log(request);
    const result = MockGovernanceMyDelegatesResponse;
    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
  };

  public getMyUnDelegates = async (request: GetMyUnDelegatesRequest): Promise<MyUnDelegatesInfo> => {
    console.log(request);
    const result = MockGovernanceMyUnDelegatesResponse;
    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
  };

  public getProposals = async (request: GetProposalsReqeust): Promise<ProposalsInfo> => {
    console.log("Mock getProposals:", request);
    const result = MockGovernanceProposalsResponse as ProposalsInfo;
    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
  };

  public getProposalDetails = async (request: GetProposalDetailsRequest): Promise<ProposalDetailsInfo> => {
    console.log("Mock getProposalDetails:", request);
    const result = MockGovernanceProposalDetailsResponse as ProposalDetailsInfo;
    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
  };

  public getProposalParameters = async (): Promise<ProposalParameterInfo> => {
    console.log("Mock getProposalParameters:");
    const result = MockGovernanceProposalParametersResponse;
    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
  };

  public getVerifiedDelegates = async (): Promise<VerifiedDelegatesInfo> => {
    console.log("Mock getVerifiedDelegates:");
    const result = MockGovernanceVerifiedDelegatesResponse;
    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
  };

  public getCommunityPoolBalances = async (): Promise<CommunityPoolBalancesInfo> => {
    console.log("Mock getCommunityPoolBalances:");
    const result = MockGovernanceCommunityPoolBalancesResponse;
    return new Promise(resolve => setTimeout(resolve, 500)).then(() => result);
  };

  public sendProposeText = async (request: SendProposeTextReqeust): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error(`Mock sendProposeText : ${request}`);
  };

  public sendProposeCommunityPoolSpend = async (
    request: SendProposeCommunityPoolSpendReqeust,
  ): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error(`Mock sendProposeCommunityPoolSpend : ${request}`);
  };

  public sendProposeParameterChange = async (
    request: SendProposeParameterChangeRequest,
  ): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error(`Mock sendProposeParameterChange : ${request}`);
  };

  public sendVote = async (request: SendVoteReqeust): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error(`Mock sendVote : ${request}`);
  };

  public sendCancel = async (request: SendCancelReqeust): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error(`Mock sendCancel : ${request}`);
  };

  public sendExecute = async (request: SendExecuteReqeust): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error(`Mock sendExecute : ${request}`);
  };

  public sendDelegate = async (request: SendDelegateReqeust): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error(`Mock sendDelegate : ${request}`);
  };

  public sendUndelegate = async (request: SendUndelegateReqeust): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error(`Mock sendUndelegate : ${request}`);
  };

  public sendRedelegate = async (request: SendRedelegateReqeust): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error(`Mock sendRedelegate : ${request}`);
  };

  public sendCollectUndelegated = async (): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error("Mock sendCollectUndelegated");
  };

  public sendCollectReward = async (claimLaunchpadProtocolFees: boolean): Promise<WalletResponse<{ hash: string }>> => {
    throw new Error(`Mock sendCollectReward : ${claimLaunchpadProtocolFees}`);
  };
}
