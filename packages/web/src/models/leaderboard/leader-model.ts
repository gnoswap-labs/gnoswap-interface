export interface LeaderModel {
  rank: number;

  address: string;
  formattedAddress: string;
  mobileSpecificFormattedAddress: string;

  hide: boolean;

  swapVolume: string;
  positionValue: string;
  stakingValue: string;

  pointSum: string;
  swapFeePoint: string;
  poolRewardPoint: string;
  stakingRewardPoint: string;
  referralRewardPoint: string;
}
