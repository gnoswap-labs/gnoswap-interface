import { generateAddress } from "@common/utils/test-util";
import { formatAddress, numberToFormat } from "@utils/string-utils";
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
        address: address,
        formattedAddress: formatAddress(address, 8),
        mobileSpecificFormattedAddress: formatAddress(address, 4),
        volume: `$${numberToFormat(100241421)}`,
        position: `$${numberToFormat(241421)}`,
        staking: `$${numberToFormat(241421)}`,
        points: `${numberToFormat(4802250)}`,
        swapPoint: `${numberToFormat(242802250000000000)}`,
        positionPoint: `${numberToFormat(1000000)}`,
        stakingPoint: `${numberToFormat(700000)}`,
        referralPoint: `${numberToFormat(300000)}`,
      };
    };

    return {
      totalPage: 10,
      currentPage: request.page,
      leaders: [
        leader(),
        leader(),
        leader(),
        leader(),
        leader(),
        leader(),
        leader(),
        leader(),
        leader(),
        leader(),
      ],
    };
  };

  public getLeaderByAddress = async (
    request: GetLeaderByAddressRequest,
  ): Promise<GetLeaderByAddressResponse> => {
    console.log(`request.address : ${request.address}`);

    return {
      leader: {
        rank: 1,
        address: request.address,
        formattedAddress: formatAddress(request.address, 8),
        mobileSpecificFormattedAddress: formatAddress(request.address, 4),
        volume: `$${numberToFormat(100241421)}`,
        position: `$${numberToFormat(241421)}`,
        staking: `$${numberToFormat(241421)}`,
        points: `${numberToFormat(4802250)}`,
        swapPoint: `${numberToFormat(242802250000000000)}`,
        positionPoint: `${numberToFormat(1000000)}`,
        stakingPoint: `${numberToFormat(700000)}`,
        referralPoint: `${numberToFormat(300000)}`,
      },
    };
  };

  public updateLeaderByAddress = async (
    request: UpdateLeaderByAddressRequest,
  ): Promise<UpdateLeaderByAddressResponse> => {
    console.log(`request.address : ${request.address}`);

    return {};
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
