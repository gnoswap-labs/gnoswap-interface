import { INCENTIVE_TYPE } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";

export interface PoolStakingModel {
  incentiveId: string | null;
  incentiveType: INCENTIVE_TYPE;
  tier: string;
  poolPath: string;
  rewardToken: TokenModel;
  incentivizedAmount: string;
  remainingAmount: string;
  startTimestamp: string;
  endTimestamp: string;
  unvestedAmount: string;
  claimablePenaltyAmount: string;
  createdBlockHeight: string;
}

export interface ExtendedPoolStakingModel extends PoolStakingModel {
  depositGnsAmount: string;
}
