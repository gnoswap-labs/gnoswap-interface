import { ActivityResponse } from "@repositories/activity/responses/activity-responses";

import { OnchainAccountRequest, OnchainRequest } from "./request";
import {
  DashboardTokenResponse,
  GovernanceOverviewResponse,
  IVolumeResponse,
  TvlResponse,
} from "./response";

export interface DashboardRepository {
  getDashboardTvl: () => Promise<TvlResponse>;
  getDashboardVolume: () => Promise<IVolumeResponse>;
  getDashboardToken: () => Promise<DashboardTokenResponse>;
  getDashboardGovernanceOverview: () => Promise<GovernanceOverviewResponse>;
  getDashboardOnchainActivity: (
    req: OnchainRequest,
  ) => Promise<ActivityResponse>;
  getAccountOnchainActivity: (
    req: OnchainAccountRequest,
  ) => Promise<ActivityResponse>;
}
