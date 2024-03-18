import {
  GetLeadersRequest,
  GetLeaderByAddressRequest,
  UpdateLeaderByAddressRequest as UpdateLeaderByAddressRequest,
} from "./request";
import {
  GetLeadersResponse,
  GetLeaderByAddressResponse,
  UpdateLeaderByAddressResponse as UpdateLeaderByAddressResponse,
} from "./response";

export interface LeaderboardRepository {
  getLeaders: (request: GetLeadersRequest) => Promise<GetLeadersResponse>;

  getLeaderByAddress: (
    request: GetLeaderByAddressRequest,
  ) => Promise<GetLeaderByAddressResponse>;

  updateLeaderByAddress: (
    request: UpdateLeaderByAddressRequest,
  ) => Promise<UpdateLeaderByAddressResponse>;
}
