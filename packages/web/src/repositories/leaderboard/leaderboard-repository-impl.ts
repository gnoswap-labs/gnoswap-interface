import { NetworkClient } from "@common/clients/network-client";
import { CommonError } from "@common/errors";
import { LeaderboardRepository } from "./leaderboard-repository";
import { GetLeaderboardRequest, UpdateLeaderboardHiddenStateRequest } from "./request";
import {
  GetLeaderboardByAddressResponse,
  GetLeaderboardResponse,
  nullLeaderboardInfo,
  UpdateLeaderboardHiddenStateResponse,
} from "./response";

export class LeaderboardRepositoryImpl implements LeaderboardRepository {
  private networkClient: NetworkClient | null;

  constructor(networkClient: NetworkClient | null) {
    this.networkClient = networkClient;
  }

  public getLeaderboard = async (request: GetLeaderboardRequest): Promise<GetLeaderboardResponse> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const queries = [
      request.keyword !== undefined ? `keyword=${request.keyword}` : "",
      request.limit !== undefined ? `limit=${request.limit}` : "",
      request.page !== undefined ? `page=${request.page}` : "",
    ];

    const response = await this.networkClient.get<{ data: GetLeaderboardResponse }>({
      url: `/leaderboard?${queries.filter(query => !!query).join("&")}`,
    });

    if (!response?.data?.data) {
      return nullLeaderboardInfo;
    }

    const data: GetLeaderboardResponse = response.data.data;
    return data;
  };

  public getLeaderboardByAddress = async (address: string): Promise<GetLeaderboardByAddressResponse | null> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const response = await this.networkClient.get<{ data: GetLeaderboardByAddressResponse }>({
      url: `/leaderboard/${address}`,
    });

    if (!response?.data?.data) {
      return null;
    }

    const data: GetLeaderboardByAddressResponse = response.data.data;
    return data;
  };

  public updateLeaderboardHiddenState = async (
    request: UpdateLeaderboardHiddenStateRequest,
  ): Promise<UpdateLeaderboardHiddenStateResponse> => {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER");
    }

    const response = await this.networkClient.put<{ hidden: boolean }, { data: { success: boolean } }>({
      url: `/leaderboard/${request.address}`,
      body: {
        hidden: request.request.hidden,
      },
    });

    if (!response?.data) {
      return {
        success: false,
      };
    }

    const data: UpdateLeaderboardHiddenStateResponse = response.data.data;
    return data;
  };

  public getNextUpdateTime = async () => {
    const now = new Date();

    const next = new Date(now);
    const nextMinute = Math.floor(now.getMinutes() / 10) * 10 + 10;
    next.setMinutes(nextMinute);
    next.setSeconds(0);
    next.setMilliseconds(0);

    return {
      nextUpdateTime: next.toISOString(),
    };
  };
}
