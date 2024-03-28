import {
  GetLeadersRequest,
  GetLeaderByAddressRequest,
  UpdateLeaderByAddressRequest as UpdateLeaderByAddressRequest,
  GetNextUpdateTimeRequest,
} from "./request";
import {
  GetLeadersResponse,
  GetLeaderByAddressResponse,
  UpdateLeaderByAddressResponse as UpdateLeaderByAddressResponse,
  GetNextUpdateTimeResponse,
} from "./response";

export interface LeaderboardRepository {
  getLeaders: (request: GetLeadersRequest) => Promise<GetLeadersResponse>;

  getLeaderByAddress: (
    request: GetLeaderByAddressRequest,
  ) => Promise<GetLeaderByAddressResponse>;

  updateLeaderByAddress: (
    request: UpdateLeaderByAddressRequest,
  ) => Promise<UpdateLeaderByAddressResponse>;

  getNextUpdateTime: (
    request: GetNextUpdateTimeRequest,
  ) => Promise<GetNextUpdateTimeResponse>;
}
