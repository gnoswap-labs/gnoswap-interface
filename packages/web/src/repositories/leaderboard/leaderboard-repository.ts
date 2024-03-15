import {
  GetLeadersRequest,
  GetMyLeaderRequest,
  HideMyLeaderRequest,
} from "./request";
import {
  GetLeadersResponse,
  GetMyLeaderResponse,
  HideMyLeaderResponse,
} from "./response";

export interface LeaderboardRepository {
  getLeaders: (request: GetLeadersRequest) => Promise<GetLeadersResponse>;

  getMyLeader: (request: GetMyLeaderRequest) => Promise<GetMyLeaderResponse>;

  HideMyLeader: (request: HideMyLeaderRequest) => Promise<HideMyLeaderResponse>;
}
