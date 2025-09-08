import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { GetLaunchpadProjectsRequestParameters } from "./request";
import { LaunchpadProjectSummaryModel } from "@models/launchpad";
import { LaunchpadProjectsInfo, LaunchpadProjectDetailsInfo, LaunchpadParticipationInfo } from "./model";

export interface LaunchpadRepository {
  getLaunchpadSummary(): Promise<LaunchpadProjectSummaryModel>;

  getLaunchpadProjects(params: GetLaunchpadProjectsRequestParameters): Promise<LaunchpadProjectsInfo>;

  getLaunchpadProjectDetails(projectId: string): Promise<LaunchpadProjectDetailsInfo>;

  getLaunchpadParticipationInfos(projectId: string, address: string): Promise<LaunchpadParticipationInfo>;

  depositLaunchpadPoolBy(
    projectPoolId: string,
    gnsTokenAmount: bigint,
    caller: string,
    referrerAddress: string | null,
  ): Promise<WalletResponse<{ hash: string }>>;

  collectRewardByProjectId(
    projectId: string,
    caller: string,
    referrerAddress: string | null,
  ): Promise<WalletResponse<{ hash: string }>>;

  collectRewardByDepositId(
    depositId: string,
    caller: string,
    referrerAddress: string | null,
  ): Promise<WalletResponse<{ hash: string }>>;

  collectRewardWithDepositByProjectId(
    projectId: string,
    caller: string,
    referrerAddress: string | null,
  ): Promise<WalletResponse<{ hash: string }>>;

  collectRewardWithDepositByDepositId(
    depositId: string,
    caller: string,
    referrerAddress: string | null,
  ): Promise<WalletResponse<{ hash: string }>>;
}
