export interface GovernanceSummaryInfo {
  totalDelegated: number;
  delegatedRatio: number;
  apy: number;
  communityPool: number;
}

export const nullGovernanceSummaryInfo: GovernanceSummaryInfo = {
  totalDelegated: 0,
  delegatedRatio: 0,
  apy: 0,
  communityPool: 0,
};