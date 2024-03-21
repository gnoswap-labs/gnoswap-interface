import { generateAddress } from "@common/utils/test-util";
import { formatAddress } from "@utils/string-utils";
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
    console.log(`request.address : ${request}`);

    let index = 1;
    const leader = () => {
      const address = generateAddress();
      return {
        rank: index++,
        address: address,
        formattedAddress: formatAddress(address, 8),
        mobileSpecificFormattedAddress: formatAddress(address, 4),
        volume: "$100,241,421",
        position: "$241,421",
        staking: "$241,421",
        points: "4,802,250",
        swapPoint: "242,802,250000000000",
        positionPoint: "1,000,000",
        stakingPoint: "700,000",
        referralPoint: "300,000",
      };
    };

    return {
      totalPage: 100,
      currentPage: 1,
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
        volume: "$100,241,421",
        position: "$241,421",
        staking: "$241,421",
        points: "4,802,250",
        swapPoint: "242,802,250000000000",
        positionPoint: "1,000,000",
        stakingPoint: "700,000",
        referralPoint: "300,000",
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
    console.log(`request.address : ${request}`);

    return { seconds: 6151 }; //
  };
}
