import { NetworkClient } from "@common/clients/network-client";
import { WalletClient } from "@common/clients/wallet-client";
import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { makeTransactionMessage } from "@common/clients/wallet-client/transaction-messages";
import { CommonError } from "@common/errors";
import { PACKAGE_LAUNCHPAD_PATH } from "@constants/environment.constant";
import { makeQueryParameter } from "@utils/network.utils";
import { LaunchpadRepository } from "./launchpad-repository";
import { GetLaunchpadProjectsRequestParameters } from "./request";
import {
  GetLaunchpadParticipationInfosResponse,
  GetLaunchpadProjectDetailsResponse,
  GetLaunchpadProjectsResponse,
  GetLaunchpadSummaryResponse,
} from "./response";

interface APIResponse<T> {
  data: T;
}

export class LaunchpadRepositoryImpl implements LaunchpadRepository {
  private networkClient: NetworkClient | null;
  private walletClient: WalletClient | null;

  constructor(
    networkClient: NetworkClient | null,
    walletClient: WalletClient | null,
  ) {
    this.networkClient = networkClient;
    this.walletClient = walletClient;
  }

  getLaunchpadSummary(): Promise<GetLaunchpadSummaryResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    return this.networkClient
      .get<APIResponse<GetLaunchpadSummaryResponse>>({
        url: "launchpad/summary",
      })
      .then(result => result.data?.data);
  }

  getLaunchpadProjects(
    params: GetLaunchpadProjectsRequestParameters,
  ): Promise<GetLaunchpadProjectsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const requestParams = makeQueryParameter({ ...params });

    return this.networkClient
      .get<APIResponse<GetLaunchpadProjectsResponse>>({
        url: `launchpad/projects${requestParams}`,
      })
      .then(result => result.data?.data);
  }

  getLaunchpadProjectDetails(
    projectId: string,
  ): Promise<GetLaunchpadProjectDetailsResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const encodedProjectId = encodeURIComponent(projectId);

    return this.networkClient
      .get<APIResponse<GetLaunchpadProjectDetailsResponse>>({
        url: `launchpad/projects/${encodedProjectId}`,
      })
      .then(result => result.data?.data);
  }

  getLaunchpadParticipationInfos(
    projectId: string,
    address: string,
  ): Promise<GetLaunchpadParticipationInfosResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const encodedProjectId = encodeURI(projectId);

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
  ): Promise<WalletResponse<{ hash: string }>> {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    const messages = [];
    messages.push(
      makeTransactionMessage({
        packagePath: PACKAGE_LAUNCHPAD_PATH,
        send: "",
        func: "CollectRewardByProjectId",
        args: [poolId, gnsTokenAmount.toString()],
        caller,
      }),
    );

    return this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });
  }

  async collectRewardByProjectId(
    projectId: string,
    caller: string,
  ): Promise<WalletResponse<{ hash: string }>> {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    const messages = [];
    messages.push(
      makeTransactionMessage({
        packagePath: PACKAGE_LAUNCHPAD_PATH,
        send: "",
        func: "CollectRewardByProjectId",
        args: [projectId],
        caller,
      }),
    );

    return this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });
  }

  async collectRewardByDepositId(
    depositId: string,
    caller: string,
  ): Promise<WalletResponse<{ hash: string }>> {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    const messages = [];
    messages.push(
      makeTransactionMessage({
        packagePath: PACKAGE_LAUNCHPAD_PATH,
        send: "",
        func: "CollectRewardByDepositId",
        args: [depositId],
        caller,
      }),
    );

    return this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });
  }

  collectRewardWithDepositByProjectId(
    projectId: string,
    caller: string,
  ): Promise<WalletResponse<{ hash: string }>> {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    const messages = [];
    messages.push(
      makeTransactionMessage({
        packagePath: PACKAGE_LAUNCHPAD_PATH,
        send: "",
        func: "CollectDepositGnsByProjectId",
        args: [projectId],
        caller,
      }),
      makeTransactionMessage({
        packagePath: PACKAGE_LAUNCHPAD_PATH,
        send: "",
        func: "CollectRewardByProjectId",
        args: [projectId],
        caller,
      }),
    );

    return this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });
  }

  collectRewardWithDepositByDepositId(
    depositId: string,
    caller: string,
  ): Promise<WalletResponse<{ hash: string }>> {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    const messages = [];
    messages.push(
      makeTransactionMessage({
        packagePath: PACKAGE_LAUNCHPAD_PATH,
        send: "",
        func: "CollectDepositGnsByDepositId",
        args: [depositId],
        caller,
      }),
      makeTransactionMessage({
        packagePath: PACKAGE_LAUNCHPAD_PATH,
        send: "",
        func: "CollectRewardByDepositId",
        args: [depositId],
        caller,
      }),
    );

    return this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });
  }
}
