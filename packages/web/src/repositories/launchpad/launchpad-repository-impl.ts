import { getGRC20Allowance } from "@common/clients/gno-provider";
import { NetworkClient } from "@common/clients/network-client";
import { WalletClient } from "@common/clients/wallet-client";
import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { CommonError } from "@common/errors";
import { DEFAULT_GAS_FEE } from "@common/values";
import { GnoProvider } from "@gnolang/gno-js-client";
import { makeQueryParameter } from "@utils/network.utils";
import { withTransactionGuard, generateSendTransactionParams } from "@utils/transaction-utils";
import { LaunchpadRepository } from "./launchpad-repository";
import {
  makeCollectRewardByDepositIdMessage,
  makeCollectRewardByProjectIdMessage,
  makeCollectRewardWithDepositByDepositIdMessage,
  makeCollectRewardWithDepositByProjectIdMessage,
  makeDepositGNSMessageWithApproves,
} from "./launchpad.message";
import { GetLaunchpadProjectsRequestParameters } from "./request";
import {
  GetLaunchpadParticipationInfosResponse,
  GetLaunchpadProjectDetailsResponse,
  GetLaunchpadProjectsResponse,
  GetLaunchpadSummaryResponse,
} from "./response";
import {
  LaunchpadSummaryInfo,
  nullLaunchpadSummaryInfo,
  LaunchpadProjectsInfo,
  nullLaunchpadProjectsInfo,
  LaunchpadProjectDetailsInfo,
  nullLaunchpadProjectDetailsInfo,
} from "./model";

interface APIResponse<T> {
  data: T;
}

export class LaunchpadRepositoryImpl implements LaunchpadRepository {
  private networkClient: NetworkClient | null;
  private walletClient: WalletClient | null;
  private gnoProvider: GnoProvider | null;

  constructor(networkClient: NetworkClient | null, walletClient: WalletClient | null, gnoProvider: GnoProvider | null) {
    this.networkClient = networkClient;
    this.walletClient = walletClient;
    this.gnoProvider = gnoProvider;
  }

  getLaunchpadSummary = async (): Promise<LaunchpadSummaryInfo> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const response = await this.networkClient
      .get<APIResponse<GetLaunchpadSummaryResponse>>({
        url: "launchpad/summary",
      })
      .catch(e => {
        console.error("Launchpad: Failed to fetch GetLaunchpadSummaryError", e);
        return null;
      });

    if (!response?.data?.data) {
      return nullLaunchpadSummaryInfo;
    }

    const data: LaunchpadSummaryInfo = response.data.data;

    return data;
  };

  getLaunchpadProjects = async (params: GetLaunchpadProjectsRequestParameters): Promise<LaunchpadProjectsInfo> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const requestParams = makeQueryParameter({ ...params });

    const response = await this.networkClient
      .get<APIResponse<GetLaunchpadProjectsResponse>>({
        url: `launchpad/projects${requestParams}`,
      })
      .catch(e => {
        console.error("Launchpad: Failed to fetch GetLaunchpadProjectsError", e);
        return null;
      });

    if (!response?.data?.data) {
      return nullLaunchpadProjectsInfo;
    }

    const data: LaunchpadProjectsInfo = response.data.data;

    return data;
  };

  getLaunchpadProjectDetails = async (projectId: string): Promise<LaunchpadProjectDetailsInfo> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const encodedProjectId = encodeURIComponent(projectId);

    const response = await this.networkClient
      .get<APIResponse<GetLaunchpadProjectDetailsResponse>>({
        url: `launchpad/projects/${encodedProjectId}`,
      })
      .catch(e => {
        console.error("Launchpad: Failed to fetch GetLaunchpadProjectDetailsError", e);
        return null;
      });

    if (!response?.data?.data) {
      return nullLaunchpadProjectDetailsInfo;
    }

    const data: LaunchpadProjectDetailsInfo = response.data.data;

    return data;
  };

  getLaunchpadParticipationInfos(projectId: string, address: string): Promise<GetLaunchpadParticipationInfosResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const encodedProjectId = encodeURIComponent(projectId);

    return this.networkClient
      .get<APIResponse<GetLaunchpadParticipationInfosResponse>>({
        url: `launchpad/projects/${encodedProjectId}/participation/${address}`,
      })
      .then(result => result.data?.data);
  }

  async depositLaunchpadPoolBy(
    poolId: string,
    gnsTokenAmount: bigint,
    caller: string,
    referrerAddress: string,
  ): Promise<WalletResponse<{ hash: string }>> {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    if (this.gnoProvider === null) {
      throw new CommonError("FAILED_INITIALIZE_GNO_PROVIDER");
    }

    const messages = await makeDepositGNSMessageWithApproves(
      { poolId, gnsTokenAmount, caller, referrerAddress },
      (packagePath, owner, spender) => getGRC20Allowance(this.gnoProvider!, packagePath, owner, spender),
    );

    const sendTransactionParams = generateSendTransactionParams({ messages, gasFee: DEFAULT_GAS_FEE, memo: "" });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  }

  async collectRewardByProjectId(
    projectId: string,
    caller: string,
    referrerAddress: string,
  ): Promise<WalletResponse<{ hash: string }>> {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    const messages = makeCollectRewardByProjectIdMessage({ projectId, caller, referrerAddress });

    const sendTransactionParams = generateSendTransactionParams({ messages, gasFee: DEFAULT_GAS_FEE, memo: "" });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  }

  async collectRewardByDepositId(
    depositId: string,
    caller: string,
    referrerAddress: string,
  ): Promise<WalletResponse<{ hash: string }>> {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    const messages = makeCollectRewardByDepositIdMessage({ depositId, caller, referrerAddress });

    const sendTransactionParams = generateSendTransactionParams({ messages, gasFee: DEFAULT_GAS_FEE, memo: "" });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  }

  collectRewardWithDepositByProjectId(
    projectId: string,
    caller: string,
    referrerAddress: string,
  ): Promise<WalletResponse<{ hash: string }>> {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    const messages = makeCollectRewardWithDepositByProjectIdMessage({ projectId, caller, referrerAddress });

    const sendTransactionParams = generateSendTransactionParams({ messages, gasFee: DEFAULT_GAS_FEE, memo: "" });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  }

  collectRewardWithDepositByDepositId(
    depositId: string,
    caller: string,
    referrerAddress: string,
  ): Promise<WalletResponse<{ hash: string }>> {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    const messages = makeCollectRewardWithDepositByDepositIdMessage({ depositId, caller, referrerAddress });

    const sendTransactionParams = generateSendTransactionParams({ messages, gasFee: DEFAULT_GAS_FEE, memo: "" });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  }
}
