import { GetLeaderboardRequest, UpdateLeaderboardHiddenStateRequest } from "./request";
import { GetNextUpdateTimeResponse, GetLeaderboardResponse, UpdateLeaderboardHiddenStateResponse } from "./response";
import { GetLeaderboardByAddressResponse } from "./response/get-leaderboard-by-address-response";

export interface LeaderboardRepository {
  getLeaderboard: (request: GetLeaderboardRequest) => Promise<GetLeaderboardResponse>;

  getLeaderboardByAddress: (address: string) => Promise<GetLeaderboardByAddressResponse | null>;

  updateLeaderboardHiddenState: (
    request: UpdateLeaderboardHiddenStateRequest,
  ) => Promise<UpdateLeaderboardHiddenStateResponse>;

  getNextUpdateTime: () => Promise<GetNextUpdateTimeResponse>;
}
