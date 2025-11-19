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

  collectRewardBydepositId(depositID: string, caller: string): Promise<WalletResponse<{ hash: string }>>;

  collectRewardByDepositIds(depositIDs: string[], caller: string): Promise<WalletResponse<{ hash: string }>>;

  collectRewardWithDepositBydepositId(depositID: string, caller: string): Promise<WalletResponse<{ hash: string }>>;

  collectRewardWithDepositByDepositIds(
    endedPoolDepositIDs: string[],
    activePoolDepositIDs: string[],
    caller: string,
  ): Promise<WalletResponse<{ hash: string }>>;
}
