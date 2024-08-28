export interface GovernanceSummaryInfo {
  totalDeligated: number;
  DeligatedRatio: number;
  apy: number;
  communityPool: number;
}

export const nullGovernanceSummaryInfo: GovernanceSummaryInfo = {
  totalDeligated: 0,
  DeligatedRatio: 0,
  apy: 0,
  communityPool: 0,
};