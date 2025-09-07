import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { GetLaunchpadProjectsRequestParameters } from "./request";
import { LaunchpadSummaryInfo, LaunchpadProjectsInfo, LaunchpadProjectDetailsInfo } from "./model";
import { GetLaunchpadParticipationInfosResponse } from "./response";

export interface LaunchpadRepository {
  getLaunchpadSummary(): Promise<LaunchpadSummaryInfo>;

  getLaunchpadProjects(params: GetLaunchpadProjectsRequestParameters): Promise<LaunchpadProjectsInfo>;

  getLaunchpadProjectDetails(projectId: string): Promise<LaunchpadProjectDetailsInfo>;

  getLaunchpadParticipationInfos(projectId: string, address: string): Promise<GetLaunchpadParticipationInfosResponse>;

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
