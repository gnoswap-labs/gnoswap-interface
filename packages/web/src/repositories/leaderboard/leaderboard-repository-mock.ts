import { LeaderboardRepository } from "./leaderboard-repository";
import {
  GetLeadersRequest,
  GetLeaderByAddressRequest,
  UpdateLeaderByAddressRequest,
} from "./request";

import {
  GetLeadersResponse,
  GetLeaderByAddressResponse,
  UpdateLeaderByAddressResponse,
} from "./response";

export class LeaderboardRepositoryMock implements LeaderboardRepository {
  public getLeaders = async (
    request: GetLeadersRequest,
  ): Promise<GetLeadersResponse> => {
    console.log(`request.address : ${request}`);

    return {
      totalPage: 100,
      currentPage: 1,
      leaders: [
        {
          rank: 1,
          user: "g1j0q...8auvm",
          volume: "$100,241,421",
          position: "$241,421",
          staking: "$241,421",
          points: "4,802,250",
          swapPoint: "242,802,250000000000",
          positionPoint: "1,000,000",
          stakingPoint: "700,000",
          referralPoint: "300,000",
        },
        {
          rank: 2,
          user: "g1j0q...8auvm",
          volume: "$100,241,421",
          position: "$241,421",
          staking: "$241,421",
          points: "4,802,250",
          swapPoint: "242,802,250250000000000",
          positionPoint: "1,000,000",
          stakingPoint: "700,000",
          referralPoint: "300,000",
        },
        {
          rank: 3,
          user: "g1j0q...8auvm",
          volume: "$100,241,421",
          position: "$241,421",
          staking: "$241,421",
          points: "4,802,250",
          swapPoint: "242,802,250",
          positionPoint: "1,000,000",
          stakingPoint: "700,000",
          referralPoint: "300,000",
        },
        {
          rank: 4,
          user: "g1j0q...8auvm",
          volume: "$100,241,421",
          position: "$241,421",
          staking: "$241,421",
          points: "4,802,250",
          swapPoint: "242,802,250",
          positionPoint: "1,000,000",
          stakingPoint: "700,000",
          referralPoint: "300,000",
        },
        {
          rank: 5,
          user: "g1j0q...8auvm",
          volume: "$100,241,421",
          position: "$241,421",
          staking: "$241,421",
          points: "4,802,250",
          swapPoint: "242,802,250",
          positionPoint: "1,000,000",
          stakingPoint: "700,000",
          referralPoint: "300,000",
        },
        {
          rank: 6,
          user: "g1j0q...8auvm",
          volume: "$100,241,421",
          position: "$241,421",
          staking: "$241,421",
          points: "4,802,250",
          swapPoint: "242,802,250",
          positionPoint: "1,000,000",
          stakingPoint: "700,000",
          referralPoint: "300,000",
        },
        {
          rank: 7,
          user: "g1j0q...8auvm",
          volume: "$100,241,421",
          position: "$241,421",
          staking: "$241,421",
          points: "4,802,250",
          swapPoint: "242,802,250",
          positionPoint: "1,000,000",
          stakingPoint: "700,000",
          referralPoint: "300,000",
        },
        {
          rank: 8,
          user: "g1j0q...8auvm",
          volume: "$100,241,421",
          position: "$241,421",
          staking: "$241,421",
          points: "4,802,250",
          swapPoint: "242,802,250",
          positionPoint: "1,000,000",
          stakingPoint: "700,000",
          referralPoint: "300,000",
        },
        {
          rank: 9,
          user: "g1j0q...8auvm",
          volume: "$100,241,421",
          position: "$241,421",
          staking: "$241,421",
          points: "4,802,250",
          swapPoint: "242,802,250",
          positionPoint: "1,000,000",
          stakingPoint: "700,000",
          referralPoint: "300,000",
        },
        {
          rank: 10,
          user: "g1j0q...8auvm",
          volume: "$100,241,421",
          position: "$241,421",
          staking: "$241,421",
          points: "4,802,250",
          swapPoint: "242,802,250",
          positionPoint: "1,000,000",
          stakingPoint: "700,000",
          referralPoint: "300,000",
        },
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
        user: "g1j0q...8auvm",
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
}
