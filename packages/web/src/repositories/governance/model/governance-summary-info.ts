export interface GovernanceAPRHistory {
  date: string;
  apr: string;
  protocolFeeApr?: string;
  emissionApr?: string;
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
  protocolFeeApr?: string;
  emissionApr?: string;
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
  apy: "",
  communityPoolUsd: "0",
  aprHistory: [],
};
