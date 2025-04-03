import {
  UpdateLeaderByAddressRequest as UpdateLeaderByAddressRequest,
  GetNextUpdateTimeRequest,
  GetLeaderboardRequest,
} from "./request";
import {
  UpdateLeaderByAddressResponse as UpdateLeaderByAddressResponse,
  GetNextUpdateTimeResponse,
  GetLeaderboardResponse,
} from "./response";
import { GetLeaderboardByAddressResponse } from "./response/get-leaderboard-by-address-response";

export interface LeaderboardRepository {
  getLeaderboard: (request: GetLeaderboardRequest) => Promise<GetLeaderboardResponse>;

  getLeaderboardByAddress: (address: string) => Promise<GetLeaderboardByAddressResponse | null>;

  updateLeaderByAddress?: (request: UpdateLeaderByAddressRequest) => Promise<UpdateLeaderByAddressResponse>;

  getNextUpdateTime?: (request: GetNextUpdateTimeRequest) => Promise<GetNextUpdateTimeResponse>;
}
