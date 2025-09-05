// Todo: Delete
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NetworkClient } from "@common/clients/network-client";
import { WalletClient } from "@common/clients/wallet-client";
import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { CommonError } from "@common/errors";
import { PACKAGE_GOVERNANCE_STAKER_PATH } from "@constants/environment.constant";

import { GovernanceRepository } from "./governance-repository";
import {
  DelegateeInfo,
  ExecutableFunctionInfo,
  GovernanceSummaryInfo,
  GovernanceSummaryInfo2,
  MyDelegatesInfo,
  MyDelegationInfo,
  MyDelegationInfo2,
  nullDelegateeInfo,
  nullGovernanceSummaryInfo,
  nullGovernanceSummaryInfo2,
  nullMyDelegationInfo,
  nullMyDelegationInfo2,
  nullMyDelegatesInfo,
  nullMyUnDelegatesInfo,
  nullProposalsInfo,
  ProposalsInfo,
  MyUnDelegatesInfo,
  nullProposals2Info,
  Proposals2Info,
  ProposalDetailsInfo,
  nullProposalDetailsInfo,
  ProposalParameterInfo,
  nullProposalParameterInfo,
} from "./model";
import {
  GetMyDelegatesRequest,
  GetMyDelegationRequest,
  GetMyUnDelegatesRequest,
  GetProposalDetailsRequest,
  GetProposalsReqeust,
  GetProposalsReqeust2,
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
import {
  GetDelegateesResponse,
  // GetGovernanceSummary2Response,
  GetGovernanceSummaryResponse,
  GetMyDelegation2Response,
  GetMyDelegationResponse,
  GetProposalsResponse,
} from "./response";
import { generateSendTransactionParams, withTransactionGuard } from "@utils/transaction-utils";

import { getGRC20Allowance } from "@common/clients/gno-provider";
import { DEFAULT_GAS_FEE } from "@common/values";
import { GnoProvider } from "@gnolang/gno-js-client";
import {
  makeCancelMessages,
  makeCollectRewardMessages,
  makeCollectUnDelegatedGNSMessages,
  makeDelegateMessagesWithApproves,
  makeExecuteMessages,
  makeProposalTextMessages,
  makeProposeCommunityPoolSpendMessages,
  makeProposeParameterChangeMessages,
  makeReDelegateMessagesWithApproves,
  makeUnDelegateMessages,
  makeVoteMessages,
} from "./governance.message";
import GetExecutableFunctionsResponseMock from "./mock/get-executable-functions-response.json";
import { delay } from "@utils/common";

import MockGovernanceSummary2Response from "./mock/get-governance-summary2-response.json";
import MockGovernanceMyDelegation2Response from "./mock/get-my-delegation2-response.json";
import MockGovernanceMyDelegatesResponse from "./mock/get-my-delegates-response.json";
import MockGovernanceMyUnDelegatesResponse from "./mock/get-my-undelegates-response.json";
import MockGovernanceProposalsResponse from "./mock/get-proposals2-response.json";
import MockGovernanceProposalDetails from "./mock/get-proposal-details-response.json";
import MockGovernanceProposalParameters from "./mock/get-proposal-parameters-response.json";

export class GovernanceRepositoryImpl implements GovernanceRepository {
  private networkClient: NetworkClient | null;
  private walletClient: WalletClient | null;
  private gnoProvider: GnoProvider | null;

  constructor(networkClient: NetworkClient | null, walletClient: WalletClient | null, gnoProvider: GnoProvider | null) {
    this.networkClient = networkClient;
    this.walletClient = walletClient;
    this.gnoProvider = gnoProvider;
  }

  /**
   * @deprecated
   */
  public getGovernanceSummary = async (): Promise<GovernanceSummaryInfo> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const response = await this.networkClient.get<{
      data: GetGovernanceSummaryResponse;
    }>({
      url: "governance/summary",
    });

    if (!response?.data?.data) {
      return nullGovernanceSummaryInfo;
    }

    const data: GovernanceSummaryInfo = response.data.data;

    return data;
  };

  public getGovernanceSummary2 = async (): Promise<GovernanceSummaryInfo2> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const response = await delay(1000).then(() => {
      return {
        data: {
          data: MockGovernanceSummary2Response,
        },
      };
    });
    // const response = await this.networkClient.get<{
    //   data: GetGovernanceSummary2Response;
    // }>({
    //   url: "governance/summary",
    // });

    if (!response?.data?.data) {
      return nullGovernanceSummaryInfo2;
    }

    const data: GovernanceSummaryInfo2 = response.data.data;

    return data;
  };

  /**
   * @deprecated
   */
  public getMyDeligation = async (request: GetMyDelegationRequest): Promise<MyDelegationInfo> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const response = await this.networkClient
      .get<{
        data: GetMyDelegationResponse;
      }>({
        url: `governance/delegations?address=${request.address}`,
      })
      .catch(e => {
        console.error(e);
        return null;
      });

    if (!response?.data?.data) {
      return nullMyDelegationInfo;
    }

    const data: MyDelegationInfo = response.data.data;

    return data;
  };

  public getMyDelegation2 = async (request: GetMyDelegationRequest): Promise<MyDelegationInfo2> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const response = await delay(1000).then(() => {
      return {
        data: {
          data: MockGovernanceMyDelegation2Response,
        },
      };
    });
    // const response = await this.networkClient
    //   .get<{
    //     data: GetMyDelegation2Response;
    //   }>({
    //     url: `governance/delegations?address=${request.address}`,
    //   })
    //   .catch(e => {
    //     console.error(e);
    //     return null;
    //   });

    if (!response?.data?.data) {
      return nullMyDelegationInfo2;
    }

    const data: MyDelegationInfo2 = response.data.data;

    return data;
  };

  /**
   * @new feature
   */
  public getMyDelegates = async (request: GetMyDelegatesRequest): Promise<MyDelegatesInfo> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const response = await delay(1000).then(() => {
      return {
        data: {
          data: MockGovernanceMyDelegatesResponse,
        },
      };
    });
    // const response = await this.networkClient
    //   .get<{
    //     data: GetMyDelegatesInfoResponse;
    //   }>({
    //     url: `governance/delegations/${request.address}/delegates`,
    //   })
    //   .catch(e => {
    //     console.error(e);
    //     return null;
    //   });

    if (!response?.data?.data) {
      return nullMyDelegatesInfo;
    }

    const data: MyDelegatesInfo = response.data.data;

    return data;
  };

  /**
   * @new feature
   */
  public getMyUnDelegates = async (request: GetMyUnDelegatesRequest): Promise<MyUnDelegatesInfo> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const response = await delay(1000).then(() => {
      return {
        data: {
          data: MockGovernanceMyUnDelegatesResponse,
        },
      };
    });
    // const response = await this.networkClient
    //   .get<{
    //     data: GetMyUnDelegatesInfoResponse;
    //   }>({
    //     url: `governance/delegations/${request.address}/undelegates`,
    //   })
    //   .catch(e => {
    //     console.error(e);
    //     return null;
    //   });
    if (!response?.data?.data) {
      return nullMyUnDelegatesInfo;
    }

    const data: MyUnDelegatesInfo = response.data.data;

    return data;
  };

  /**
   * @deprecated
   */
  public getProposals = async (request: GetProposalsReqeust): Promise<ProposalsInfo> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const queries = [
      request.isActive !== undefined ? `isActive=${request.isActive}` : "",
      request.address !== undefined ? `address=${request.address}` : "",
      request.page !== undefined ? `page=${request.page}` : "",
      request.itemsPerPage !== undefined ? `itemsPerPage=${request.itemsPerPage}` : "",
    ];

    const response = await this.networkClient.get<{
      data: GetProposalsResponse;
    }>({
      url: `governance/proposals?${queries.filter(item => !!item).join("&")}`,
    });

    if (!response?.data?.data) {
      return nullProposalsInfo;
    }

    const data: ProposalsInfo = response.data.data;

    return data;
  };

  public getProposals2 = async (request: GetProposalsReqeust2): Promise<Proposals2Info> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const response = await delay(1000).then(() => {
      return {
        data: {
          data: MockGovernanceProposalsResponse as Proposals2Info,
        },
      };
    });

    // const queries = [
    //   request.isActive !== undefined ? `isActive=${request.isActive}` : "",
    //   request.address !== undefined ? `address=${request.address}` : "",
    //   request.page !== undefined ? `page=${request.page}` : "",
    //   request.size !== undefined ? `itemsPerPage=${request.size}` : "",
    // ];

    // const response = await this.networkClient.get<{
    //   data: Proposals2Info;
    // }>({
    //   url: `governance/proposals?${queries.filter(item => !!item).join("&")}`,
    // });

    if (!response?.data?.data) {
      return nullProposals2Info;
    }

    const data: Proposals2Info = response.data.data;

    return data;
  };

  public getProposalDetails = async (request: GetProposalDetailsRequest): Promise<ProposalDetailsInfo> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const response = await delay(1500).then(() => {
      return {
        data: {
          data: MockGovernanceProposalDetails as ProposalDetailsInfo,
        },
      };
    });
    // const response = await this.networkClient
    //   .get<{
    //     data: ProposalDetailsInfo;
    //   }>({
    //     url: `governance/proposals/${request.proposalId}`,
    //   })
    //   .catch(e => {
    //     console.error(e);
    //     return null;
    //   });

    if (!response?.data?.data) {
      return nullProposalDetailsInfo;
    }

    const data: ProposalDetailsInfo = response.data.data;

    return data;
  };

  public getProposalParameters = async (): Promise<ProposalParameterInfo> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const response = await delay(1000).then(() => {
      return {
        data: {
          data: MockGovernanceProposalParameters,
        },
      };
    });
    // const response = await this.networkClient
    //   .get<{
    //     data: ProposalParameterInfo;
    //   }>({
    //     url: `governance/proposals-parameters`,
    //   })
    //   .catch(e => {
    //     console.error(e);
    //     return null;
    //   });
    if (!response?.data?.data) {
      return nullProposalParameterInfo;
    }

    const data: ProposalParameterInfo = response.data.data;

    return data;
  };

  public getExecutableFunctions = async (): Promise<ExecutableFunctionInfo[]> => {
    return GetExecutableFunctionsResponseMock;
  };

  public getDelegatees = async (): Promise<DelegateeInfo[]> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const response = await this.networkClient.get<{
      data: GetDelegateesResponse;
    }>({
      url: "governance/delegatees",
    });

    if (!response?.data?.data) {
      return [nullDelegateeInfo];
    }

    const data: DelegateeInfo[] = response.data.data.delegatees;

    return data;
  };

  public sendProposeText = async (request: SendProposeTextReqeust): Promise<WalletResponse<{ hash: string }>> => {
    const caller = await this.getAddress();
    const messages = makeProposalTextMessages({ ...request, caller });

    const sendTransactionParams = generateSendTransactionParams({ messages, gasFee: DEFAULT_GAS_FEE, memo: "" });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  };

  public sendProposeCommunityPoolSpend = async (
    request: SendProposeCommunityPoolSpendReqeust,
  ): Promise<WalletResponse<{ hash: string }>> => {
    const caller = await this.getAddress();
    const messages = makeProposeCommunityPoolSpendMessages({ ...request, caller });

    const sendTransactionParams = generateSendTransactionParams({ messages, gasFee: DEFAULT_GAS_FEE, memo: "" });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  };

  public sendProposeParameterChange = async (
    request: SendProposeParameterChangeRequest,
  ): Promise<WalletResponse<{ hash: string }>> => {
    const caller = await this.getAddress();
    const messages = makeProposeParameterChangeMessages({ ...request, caller });

    const sendTransactionParams = generateSendTransactionParams({ messages, gasFee: DEFAULT_GAS_FEE, memo: "" });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  };

  public sendVote = async (request: SendVoteReqeust): Promise<WalletResponse<{ hash: string }>> => {
    const caller = await this.getAddress();
    const messages = makeVoteMessages({ ...request, caller });

    const sendTransactionParams = generateSendTransactionParams({ messages, gasFee: DEFAULT_GAS_FEE, memo: "" });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  };

  public sendCancel = async (request: SendCancelReqeust): Promise<WalletResponse<{ hash: string }>> => {
    const caller = await this.getAddress();
    const messages = makeCancelMessages({ ...request, caller });

    const sendTransactionParams = generateSendTransactionParams({ messages, gasFee: DEFAULT_GAS_FEE, memo: "" });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  };

  public sendExecute = async (request: SendExecuteReqeust): Promise<WalletResponse<{ hash: string }>> => {
    const caller = await this.getAddress();
    const messages = makeExecuteMessages({ ...request, caller });

    const sendTransactionParams = generateSendTransactionParams({ messages, gasFee: DEFAULT_GAS_FEE, memo: "" });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  };

  public sendDelegate = async (request: SendDelegateReqeust): Promise<WalletResponse<{ hash: string }>> => {
    if (!this.gnoProvider) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const caller = await this.getAddress();
    const messages = await makeDelegateMessagesWithApproves({ ...request, caller }, (packagePath, owner, spender) =>
      getGRC20Allowance(this.gnoProvider!, packagePath, owner, spender),
    );

    const sendTransactionParams = generateSendTransactionParams({ messages, gasFee: DEFAULT_GAS_FEE, memo: "" });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  };

  public sendUndelegate = async (request: SendUndelegateReqeust): Promise<WalletResponse<{ hash: string }>> => {
    const caller = await this.getAddress();
    const messages = makeUnDelegateMessages({ ...request, caller });

    const sendTransactionParams = generateSendTransactionParams({ messages, gasFee: DEFAULT_GAS_FEE, memo: "" });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  };

  public sendRedelegate = async (request: SendRedelegateReqeust): Promise<WalletResponse<{ hash: string }>> => {
    if (!this.gnoProvider) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const caller = await this.getAddress();
    const messages = await makeReDelegateMessagesWithApproves({ ...request, caller }, (packagePath, owner, spender) =>
      getGRC20Allowance(this.gnoProvider!, packagePath, owner, spender),
    );

    const sendTransactionParams = generateSendTransactionParams({ messages, gasFee: DEFAULT_GAS_FEE, memo: "" });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  };

  public sendCollectUndelegated = async (): Promise<WalletResponse<{ hash: string }>> => {
    const caller = await this.getAddress();
    const messages = makeCollectUnDelegatedGNSMessages({ caller });

    const sendTransactionParams = generateSendTransactionParams({ messages, gasFee: DEFAULT_GAS_FEE, memo: "" });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  };

  public sendCollectReward = async (): Promise<WalletResponse<{ hash: string }>> => {
    const caller = await this.getAddress();
    const messages = makeCollectRewardMessages({ caller });

    const sendTransactionParams = generateSendTransactionParams({ messages, gasFee: DEFAULT_GAS_FEE, memo: "" });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  };

  private async getAddress(): Promise<string> {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    const address = await this.walletClient.getAddress();
    if (!address || !PACKAGE_GOVERNANCE_STAKER_PATH) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    return address;
  }
}
