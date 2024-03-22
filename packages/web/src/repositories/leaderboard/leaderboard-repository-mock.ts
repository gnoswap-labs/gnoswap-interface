import { generateAddress } from "@common/utils/test-util";
import dayjs from "dayjs";
import { LeaderboardRepository } from "./leaderboard-repository";
import {
  GetLeadersRequest,
  GetLeaderByAddressRequest,
  UpdateLeaderByAddressRequest,
  GetNextUpdateTimeRequest,
} from "./request";

import {
  GetLeadersResponse,
  GetLeaderByAddressResponse,
  UpdateLeaderByAddressResponse,
  GetNextUpdateTimeResponse,
} from "./response";

export class LeaderboardRepositoryMock implements LeaderboardRepository {
  public getLeaders = async (
    request: GetLeadersRequest,
  ): Promise<GetLeadersResponse> => {
    console.log(`request.page : ${request.page}`);

    let index = request.page === 0 ? 1 : request.page * 10;
    const leader = () => {
      const address = generateAddress();
      return {
        rank: index++,

        hide: false,

        address: address,

        swapVolume: 100241421,
        positionValue: 241421,
        stakingValue: 241421,
        pointSum: 4802250,
        swapFeePoint: 242802250000000000,
        poolRewardPoint: 1000000,
        stakingRewardPoint: 700000,
        referralRewardPoint: 300000,
      };
    };

    return {
      totalPage: 10,
      currentPage: request.page,
      leaders: Array(request.size)
        .fill(0)
        .map(() => leader()),
    };
  };

  public getLeaderByAddress = async (
    request: GetLeaderByAddressRequest,
  ): Promise<GetLeaderByAddressResponse> => {
    console.log(`request.address : ${request.address}`);

    return {
      leader: {
        rank: 1,

        hide: false,

        address: request.address,

        swapVolume: 100241421,
        positionValue: 241421,
        stakingValue: 241421,
        pointSum: 4802250,
        swapFeePoint: 242802250000000000,
        poolRewardPoint: 1000000,
        stakingRewardPoint: 700000,
        referralRewardPoint: 300000,
      },
    };
  };

  public updateLeaderByAddress = async (
    request: UpdateLeaderByAddressRequest,
  ): Promise<UpdateLeaderByAddressResponse> => {
    console.log(`request.address : ${request.address}`);

    return {
      address: request.address,
      hide: !request.hide,
    };
  };

  public getNextUpdateTime = async (
    request: GetNextUpdateTimeRequest,
  ): Promise<GetNextUpdateTimeResponse> => {
    console.log(`request : ${request}`);

    return {
      nextUpdateTime: dayjs(new Date(Date.now() + 1000 * 60 * 10)).format(
        "YYYY-MM-DD HH:mm:ss",
      ),
    };
  };
}
