export interface Leader {
  rank: number;

  address: string;

  hide: boolean;

  swapVolume: number;
  positionValue: number;
  stakingValue: number;

  pointSum: number;
  swapFeePoint: number;
  poolRewardPoint: number;
  stakingRewardPoint: number;
  referralRewardPoint: number;
}
