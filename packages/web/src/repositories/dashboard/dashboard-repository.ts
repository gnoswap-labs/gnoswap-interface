import { TvlResponse } from "./response";
import { DashboardTokenResponse } from "./response/token-response";
import { VolumeResponse } from "./response/volume-response";

export interface DashboardRepository {
  getDashboardTvl: () => Promise<TvlResponse>;
  getDashboardVolume: () => Promise<VolumeResponse>;
  getDashboardToken: () => Promise<DashboardTokenResponse>;
}
