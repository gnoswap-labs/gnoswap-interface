import { StakingPeriodType } from "@constants/option.constant";

export interface PoolStakingTierSummaryModel {
  period: StakingPeriodType;
  stakedUsd: number;
  positionCount: number;
  stakedRatio: number;
}

export interface PoolStakingSummaryModel {
  totalStakedUsd: number;
  totalPositionCount: number;
  tiers: PoolStakingTierSummaryModel[];
}
