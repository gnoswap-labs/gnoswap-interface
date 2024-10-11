import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { GetLaunchpadProjectsRequestParameters } from "./request";
import {
  GetLaunchpadParticipationInfosResponse,
  GetLaunchpadProjectDetailsResponse,
  GetLaunchpadProjectsResponse,
  GetLaunchpadSummaryResponse,
} from "./response";

export interface LaunchpadRepository {
  getLaunchpadSummary(): Promise<GetLaunchpadSummaryResponse>;

  getLaunchpadProjects(
    params: GetLaunchpadProjectsRequestParameters,
  ): Promise<GetLaunchpadProjectsResponse>;

  getLaunchpadProjectDetails(
    projectId: string,
  ): Promise<GetLaunchpadProjectDetailsResponse>;

  getLaunchpadParticipationInfos(
    projectId: string,
    address: string,
  ): Promise<GetLaunchpadParticipationInfosResponse>;

  depositLaunchpadPoolBy(
    projectPoolId: string,
    gnsTokenAmount: bigint,
    caller: string,
  ): Promise<WalletResponse<{ hash: string }>>;

  collectRewardByProjectId(
    projectId: string,
    caller: string,
  ): Promise<WalletResponse<{ hash: string }>>;

  collectRewardByDepositId(
    depositId: string,
    caller: string,
  ): Promise<WalletResponse<{ hash: string }>>;

  collectRewardWithDepositByProjectId(
    projectId: string,
    caller: string,
  ): Promise<WalletResponse<{ hash: string }>>;

  collectRewardWithDepositByDepositId(
    depositId: string,
    caller: string,
  ): Promise<WalletResponse<{ hash: string }>>;
}
