export interface PoolStakingTierSummaryResponse {
  warmupPercent: number;
  stakedUsd: string;
  stakedCount: number;
}

export interface PoolStakingSummaryResponse {
  poolPath: string;
  totalStakedUsd: string;
  totalStakedCount: number;
  tiers: PoolStakingTierSummaryResponse[];
}
