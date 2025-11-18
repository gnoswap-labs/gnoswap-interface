import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { makeTransactionMessage } from "@common/clients/wallet-client/transaction-messages";
import { CommonError } from "@common/errors";
import { PACKAGE_LAUNCHPAD_PATH } from "@constants/environment.constant";
import { LaunchpadRepository } from "./launchpad-repository";
import {
  GetLaunchpadParticipationInfosResponse,
  GetLaunchpadProjectDetailsResponse,
  GetLaunchpadProjectsResponse,
  GetLaunchpadSummaryResponse,
} from "./response";

import { WalletClient } from "@common/clients/wallet-client";
import MockLaunchpadParticipationListResponse from "./mock/launchpad-participation-list.json";
import MockLaunchpadProjectListResponse from "./mock/launchpad-project-list.json";
import MockLaunchpadProjectModel from "./mock/launchpad-project.json";
import MockLaunchpadSummaryResponse from "./mock/launchpad-summary.json";

export class LaunchpadRepositoryMock implements LaunchpadRepository {
  private static LOADING_DURATION = 1_000;

  private walletClient: WalletClient | null;

  constructor(walletClient: WalletClient | null) {
    this.walletClient = walletClient;
  }

  getLaunchpadSummary(): Promise<GetLaunchpadSummaryResponse> {
    return new Promise(resolve =>
      setTimeout(resolve, LaunchpadRepositoryMock.LOADING_DURATION),
    ).then<GetLaunchpadSummaryResponse>(() => MockLaunchpadSummaryResponse.data);
  }

  getLaunchpadProjects(): Promise<GetLaunchpadProjectsResponse> {
    return new Promise(resolve =>
      setTimeout(resolve, LaunchpadRepositoryMock.LOADING_DURATION),
    ).then<GetLaunchpadProjectsResponse>(
      () => MockLaunchpadProjectListResponse.data as unknown as GetLaunchpadProjectsResponse,
    );
  }

  getLaunchpadProjectDetails(): Promise<GetLaunchpadProjectDetailsResponse> {
    return new Promise(resolve =>
      setTimeout(resolve, LaunchpadRepositoryMock.LOADING_DURATION),
    ).then<GetLaunchpadProjectDetailsResponse>(
      () => MockLaunchpadProjectModel.data as unknown as GetLaunchpadProjectDetailsResponse,
    );
  }

  getLaunchpadParticipationInfos(): Promise<GetLaunchpadParticipationInfosResponse> {
    return new Promise(resolve =>
      setTimeout(resolve, LaunchpadRepositoryMock.LOADING_DURATION),
    ).then<GetLaunchpadParticipationInfosResponse>(
      () => MockLaunchpadParticipationListResponse.data as unknown as GetLaunchpadParticipationInfosResponse,
    );
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

  async collectRewardBydepositId(depositID: string, caller: string): Promise<WalletResponse<{ hash: string }>> {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    const messages = [];
    messages.push(
      makeTransactionMessage({
        packagePath: PACKAGE_LAUNCHPAD_PATH,
        send: "",
        func: "CollectRewardByDepositId",
        args: [depositID],
        caller,
      }),
    );

    return this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });
  }

  async collectRewardByDepositIds(depositIDs: string[], caller: string): Promise<WalletResponse<{ hash: string }>> {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    const messages = depositIDs.map(depositID =>
      makeTransactionMessage({
        packagePath: PACKAGE_LAUNCHPAD_PATH,
        send: "",
        func: "CollectRewardByDepositId",
        args: [depositID],
        caller,
      }),
    );

    return this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });
  }

  async collectRewardWithDepositBydepositId(
    depositID: string,
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
        args: [depositID],
        caller,
      }),
      makeTransactionMessage({
        packagePath: PACKAGE_LAUNCHPAD_PATH,
        send: "",
        func: "CollectRewardByDepositId",
        args: [depositID],
        caller,
      }),
    );

    return this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });
  }

  async collectRewardWithDepositByDepositIds(
    endedPoolDepositIDs: string[],
    activePoolDepositIDs: string[],
    caller: string,
  ): Promise<WalletResponse<{ hash: string }>> {
    if (this.walletClient === null) {
      throw new CommonError("FAILED_INITIALIZE_WALLET");
    }

    const messages: ReturnType<typeof makeTransactionMessage>[] = [];

    endedPoolDepositIDs.forEach(depositID => {
      messages.push(
        makeTransactionMessage({
          packagePath: PACKAGE_LAUNCHPAD_PATH,
          send: "",
          func: "CollectDepositGnsByDepositId",
          args: [depositID],
          caller,
        }),
        makeTransactionMessage({
          packagePath: PACKAGE_LAUNCHPAD_PATH,
          send: "",
          func: "CollectRewardByDepositId",
          args: [depositID],
          caller,
        }),
      );
    });

    activePoolDepositIDs.forEach(depositID => {
      messages.push(
        makeTransactionMessage({
          packagePath: PACKAGE_LAUNCHPAD_PATH,
          send: "",
          func: "CollectRewardByDepositId",
          args: [depositID],
          caller,
        }),
      );
    });

    return this.walletClient.sendTransaction({
      messages,
      gasFee: 1,
      memo: "",
    });
  }
}
