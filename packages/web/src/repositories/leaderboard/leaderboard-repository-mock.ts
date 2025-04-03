import dayjs from "dayjs";

import { generateAddress } from "@test/generate-utils";

import { LeaderboardRepository } from "./leaderboard-repository";
import { GetNextUpdateTimeRequest, UpdateLeaderboardHiddenStateRequest } from "./request";
import { GetLeaderboardResponse, GetNextUpdateTimeResponse, UpdateLeaderboardHiddenStateResponse } from "./response";
import { GetLeaderboardByAddressResponse } from "./response/get-leaderboard-by-address-response";
import { LeaderboardVisibilityStatus } from "./response/common/types";

export class LeaderboardRepositoryMock implements LeaderboardRepository {
  public getLeaderboard = async (): Promise<GetLeaderboardResponse> => {
    const generateUser = (index: number) => {
      const accountAddress = generateAddress();
      const hiddenYn = Math.random() > 0.8 ? LeaderboardVisibilityStatus.VISIBLE : LeaderboardVisibilityStatus.HIDDEN;
      const randomPoint = () => Math.floor(Math.random() * 1000000).toString();
      const randomUsd = () => Math.floor(Math.random() * 10000).toString();

      return {
        accountAddress,
        accountName: `User ${index}`,
        governanceRewardsPoint: randomPoint(),
        governanceRewardsUsd: randomUsd(),
        hiddenYn,
        paidSwapFeePoint: randomPoint(),
        providedLiquidityFeePoint: randomPoint(),
        providedLiquidityFeeUsd: randomUsd(),
        rank: index,
        referralPoint: randomPoint(),
        referrerAddress: Math.random() > 0.5 ? generateAddress() : "",
        stakingRewardsPoint: randomPoint(),
        stakingRewardsUsd: randomUsd(),
        swapFeeUsd: randomUsd(),
        totalPoint: (Math.floor(Math.random() * 10000000) + 1000000).toString(),
      };
    };

    const users = Array(100)
      .fill(0)
      .map((_, index) => generateUser(index + 1));

    users.sort((a, b) => parseInt(b.totalPoint) - parseInt(a.totalPoint));

    users.forEach((user, index) => {
      user.rank = index + 1;
    });

    return {
      lastUpdatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      pageInfo: {
        currentPage: 0,
        totalItems: users.length,
        totalPages: 1,
      },
      users,
    };
  };

  public getLeaderboardByAddress = async (address: string): Promise<GetLeaderboardByAddressResponse | null> => {
    if (!address) return null;

    const randomRank = Math.floor(Math.random() * 100) + 1;
    const randomPoint = () => Math.floor(Math.random() * 1000000).toString();
    const randomUsd = () => Math.floor(Math.random() * 10000).toString();

    return {
      user: {
        accountAddress: address,
        accountName: `User ${address.substring(0, 8)}`,
        governanceRewardsPoint: randomPoint(),
        governanceRewardsUsd: randomUsd(),
        hiddenYn: LeaderboardVisibilityStatus.VISIBLE,
        paidSwapFeePoint: randomPoint(),
        providedLiquidityFeePoint: randomPoint(),
        providedLiquidityFeeUsd: randomUsd(),
        rank: randomRank,
        referralPoint: randomPoint(),
        referrerAddress: "",
        stakingRewardsPoint: randomPoint(),
        stakingRewardsUsd: randomUsd(),
        swapFeeUsd: randomUsd(),
        totalPoint: (Math.floor(Math.random() * 10000000) + 1000000).toString(),
      },
    };
  };

  public updateLeaderboardHiddenState = async (
    request: UpdateLeaderboardHiddenStateRequest,
  ): Promise<UpdateLeaderboardHiddenStateResponse> => {
    console.log(`Update leaderboard hidden state - Address: ${request.address}, Hidden: ${request.request.hidden}`);

    return {
      success: true,
    };
  };

  public getNextUpdateTime = async (request: GetNextUpdateTimeRequest): Promise<GetNextUpdateTimeResponse> => {
    console.log(`request : ${request}`);

    return {
      nextUpdateTime: dayjs(new Date(Date.now() + 1000 * 60 * 10)).format("YYYY-MM-DD HH:mm:ss"),
    };
  };
}
