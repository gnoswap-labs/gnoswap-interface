import { OnchainAccountRequest, OnchainRequest } from "./request";
import { TvlResponse } from "./response";
import { OnchainActivityResponse } from "./response/onchain-response";
import { DashboardTokenResponse } from "./response/token-response";
import { IVolumeResponse } from "./response/volume-response";

export interface DashboardRepository {
  getDashboardTvl: () => Promise<TvlResponse>;
  getDashboardVolume: () => Promise<IVolumeResponse>;
  getDashboardToken: () => Promise<DashboardTokenResponse>;
  getDashboardOnchainActivity: (
    req: OnchainRequest,
  ) => Promise<OnchainActivityResponse>;  
  getAccountOnchainActivity: (
    req: OnchainAccountRequest,
  ) => Promise<OnchainActivityResponse>;
}
