import type { GovernanceAPRHistory } from "../model/governance-summary-info";

export interface GetGovernanceSummaryResponse {
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
