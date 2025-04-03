import {
  UpdateLeaderByAddressRequest as UpdateLeaderByAddressRequest,
  GetNextUpdateTimeRequest,
  GetLeaderboardRequest,
  UpdateLeaderboardHiddenStateRequest,
} from "./request";
import {
  UpdateLeaderByAddressResponse as UpdateLeaderByAddressResponse,
  GetNextUpdateTimeResponse,
  GetLeaderboardResponse,
  UpdateLeaderboardHiddenStateResponse,
} from "./response";
import { GetLeaderboardByAddressResponse } from "./response/get-leaderboard-by-address-response";

export interface LeaderboardRepository {
  getLeaderboard: (request: GetLeaderboardRequest) => Promise<GetLeaderboardResponse>;

  getLeaderboardByAddress: (address: string) => Promise<GetLeaderboardByAddressResponse | null>;

  updateLeaderboardHiddenState: (
    request: UpdateLeaderboardHiddenStateRequest,
  ) => Promise<UpdateLeaderboardHiddenStateResponse>;

  updateLeaderByAddress?: (request: UpdateLeaderByAddressRequest) => Promise<UpdateLeaderByAddressResponse>;

  getNextUpdateTime?: (request: GetNextUpdateTimeRequest) => Promise<GetNextUpdateTimeResponse>;
}
