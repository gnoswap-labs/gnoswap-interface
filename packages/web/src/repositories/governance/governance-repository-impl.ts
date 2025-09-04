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
  MyDelegationInfo,
  MyDelegationInfo2,
  nullDelegateeInfo,
  nullGovernanceSummaryInfo,
  nullGovernanceSummaryInfo2,
  nullMyDelegationInfo,
  nullMyDelegationInfo2,
  nullProposalsInfo,
  ProposalsInfo,
} from "./model";
import {
  GetMyDelegationRequest,
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
