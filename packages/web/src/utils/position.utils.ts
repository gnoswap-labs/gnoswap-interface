import { PoolPositionModel } from "@models/position/pool-position-model";
import { makeDisplayTokenAmount } from "./token-utils";

export const convertPositionToDisplayFormat = (position: PoolPositionModel): PoolPositionModel => {
  return {
    ...position,
    tokenABalance: String(makeDisplayTokenAmount(position.pool.tokenA, position.tokenABalance || 0)),
    tokenBBalance: String(makeDisplayTokenAmount(position.pool.tokenB, position.tokenBBalance || 0)),

    claimedRewards: position.claimedRewards.map(reward => {
      return {
        ...reward,
        claimedAmount: String(makeDisplayTokenAmount(reward.rewardToken, reward.claimedAmount || 0) ?? 0),
      };
    }),
    rewards: position.rewards.map(reward => {
      const rewardToken = reward.rewardToken;

      return {
        ...reward,
        accuReward1D: String(makeDisplayTokenAmount(rewardToken, reward.accuReward1D || 0) ?? 0),
        claimableAmount: String(makeDisplayTokenAmount(rewardToken, reward.claimableAmount || 0) ?? 0),
        totalAmount: String(makeDisplayTokenAmount(rewardToken, reward.totalAmount || 0) ?? 0),
      };
    }),
  };
};
