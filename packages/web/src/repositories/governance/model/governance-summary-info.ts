export interface GovernanceAPRHistory {
  date: string;
  apr: string;
  estimated: boolean;
  asOf?: string;
}

export interface GovernanceSummaryInfo {
  delegationInfo: {
    totalDelegationAmount: string;
    governanceDelegationAmount: string;
    launchpadDelegationAmount: string;
  };
  delegatedRatio: string;
  apy: string;
  communityPoolUsd: string;
  aprHistory?: GovernanceAPRHistory[];
}

export const nullGovernanceSummaryInfo: GovernanceSummaryInfo = {
  delegationInfo: {
    totalDelegationAmount: "0",
    governanceDelegationAmount: "0",
    launchpadDelegationAmount: "0",
  },
  delegatedRatio: "0",
  apy: "0",
  communityPoolUsd: "0",
  aprHistory: [],
};
