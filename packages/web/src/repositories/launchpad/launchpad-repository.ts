import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { GetLaunchpadProjectsRequestParameters } from "./request";
import { LaunchpadProjectSummaryModel } from "@models/launchpad";
import { LaunchpadProjectsInfo, LaunchpadProjectDetailsInfo, LaunchpadParticipationInfo } from "./model";

export interface LaunchpadRepository {
  getLaunchpadSummary(): Promise<LaunchpadProjectSummaryModel>;

  getLaunchpadProjects(params: GetLaunchpadProjectsRequestParameters): Promise<LaunchpadProjectsInfo>;

  getLaunchpadProjectDetails(projectID: string): Promise<LaunchpadProjectDetailsInfo>;

  getLaunchpadParticipationInfos(projectID: string, address: string): Promise<LaunchpadParticipationInfo>;

  depositLaunchpadPoolBy(
    projectPoolID: string,
    gnsTokenAmount: bigint,
    caller: string,
    referrerAddress: string | null,
  ): Promise<WalletResponse<{ hash: string }>>;

  collectRewardByProjectId(
    projectID: string,
    caller: string,
    referrerAddress: string | null,
  ): Promise<WalletResponse<{ hash: string }>>;

  collectRewardByDepositId(
    depositId: string,
    caller: string,
    referrerAddress: string | null,
  ): Promise<WalletResponse<{ hash: string }>>;

  collectRewardWithDepositByProjectId(
    projectID: string,
    caller: string,
    referrerAddress: string | null,
  ): Promise<WalletResponse<{ hash: string }>>;

  collectRewardWithDepositByDepositId(
    depositId: string,
    caller: string,
    referrerAddress: string | null,
  ): Promise<WalletResponse<{ hash: string }>>;
}
