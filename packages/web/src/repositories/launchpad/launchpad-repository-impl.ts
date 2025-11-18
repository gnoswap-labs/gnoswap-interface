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
  makeCollectRewardWithDepositBydepositIDMessage,
  makeDepositGNSMessageWithApproves,
  makeCollectRewardBydepositIdMessage,
  makeCollectRewardByDepositIdsMessage,
  makeCollectRewardWithDepositByDepositIdsMessage,
} from "./launchpad.message";
import { GetLaunchpadProjectsRequestParameters } from "./request";
import {
  GetLaunchpadParticipationInfosResponse,
  GetLaunchpadProjectDetailsResponse,
  GetLaunchpadProjectsResponse,
  GetLaunchpadSummaryResponse,
} from "./response";
import {
  LaunchpadProjectsInfo,
  nullLaunchpadProjectsInfo,
  LaunchpadProjectDetailsInfo,
  nullLaunchpadProjectDetailsInfo,
  LaunchpadParticipationInfo,
  nullLaunchpadParticipationInfo,
  nullLaunchpadSummaryInfo,
} from "./model";
import { LaunchpadProjectSummaryModel } from "@models/launchpad";

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

  getLaunchpadSummary = async (): Promise<LaunchpadProjectSummaryModel> => {
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

    const data: LaunchpadProjectSummaryModel = response.data.data;

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

  getLaunchpadProjectDetails = async (projectID: string): Promise<LaunchpadProjectDetailsInfo> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const encodedProjectId = encodeURIComponent(projectID);

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

  getLaunchpadParticipationInfos = async (projectID: string, address: string): Promise<LaunchpadParticipationInfo> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const encodedProjectId = encodeURIComponent(projectID);

    const response = await this.networkClient
      .get<APIResponse<GetLaunchpadParticipationInfosResponse>>({
        url: `launchpad/projects/${encodedProjectId}/participation/${address}`,
      })
      .catch(e => {
        console.error("Launchpad: Failed to fetch GetLaunchpadParticipationInfos", e);
        return null;
      });

    if (!response?.data?.data) {
      return nullLaunchpadParticipationInfo;
    }

    const data: LaunchpadParticipationInfo = response.data.data;

    return data;
  };

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

  async collectRewardBydepositId(depositID: string, caller: string): Promise<WalletResponse<{ hash: string }>> {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }
    const messages = makeCollectRewardBydepositIdMessage({ depositID, caller });
    const sendTransactionParams = generateSendTransactionParams({ messages, gasFee: DEFAULT_GAS_FEE, memo: "" });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  }

  async collectRewardByDepositIds(depositIDs: string[], caller: string): Promise<WalletResponse<{ hash: string }>> {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    const messages = makeCollectRewardByDepositIdsMessage({ depositIDs, caller });

    const sendTransactionParams = generateSendTransactionParams({ messages, gasFee: DEFAULT_GAS_FEE, memo: "" });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  }

  collectRewardWithDepositBydepositId(depositID: string, caller: string): Promise<WalletResponse<{ hash: string }>> {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    const messages = makeCollectRewardWithDepositBydepositIDMessage({ depositID, caller });

    const sendTransactionParams = generateSendTransactionParams({ messages, gasFee: DEFAULT_GAS_FEE, memo: "" });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  }

  collectRewardWithDepositByDepositIds(
    endedPoolDepositIDs: string[],
    activePoolDepositIDs: string[],
    caller: string,
  ): Promise<WalletResponse<{ hash: string }>> {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    const endedPoolRewardMessages =
      endedPoolDepositIDs.length > 0
        ? makeCollectRewardWithDepositByDepositIdsMessage({ depositIDs: endedPoolDepositIDs, caller })
        : [];

    const activePoolRewardMessages =
      activePoolDepositIDs.length > 0
        ? makeCollectRewardByDepositIdsMessage({ depositIDs: activePoolDepositIDs, caller })
        : [];

    const messages = [...endedPoolRewardMessages, ...activePoolRewardMessages];

    const sendTransactionParams = generateSendTransactionParams({ messages, gasFee: DEFAULT_GAS_FEE, memo: "" });

    return withTransactionGuard(this.walletClient, sendTransactionParams, updatedSendTransactionParams => {
      return this.walletClient!.sendTransaction(updatedSendTransactionParams || sendTransactionParams);
    });
  }
}
