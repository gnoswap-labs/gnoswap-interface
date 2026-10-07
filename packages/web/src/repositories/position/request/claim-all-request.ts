export interface ClaimAllRequest {
  swapFeeTokenPaths: string[];

  hasGnotStakingReward: boolean;

  positionsWithSwapFee: string[];

  positionsWithStakingReward: string[];

  recipient: string;

  gasFee?: string;

  gasUsed?: string;
}
