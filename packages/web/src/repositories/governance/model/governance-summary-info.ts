/**
 * @deprecated
 */
export interface GovernanceSummaryInfo {
  totalDelegated: number;
  delegatedRatio: number;
  apy: number;
  communityPool: number;
  creationThreshold: number;
  changeParamOptions: {
    packages: {
      pkgName: string;
      pkgPath: string;
    }[];
    functions: {
      pkgPath: string;
      funcName: string;
      paramNum: number;
    }[];
  };
  governanceDelegated: string;
  launchpadDelegated: string;
}

export interface GovernanceSummaryInfo2 {
  delegationInfo: {
    totalDelegationAmount: string;
    governanceDelegationAmount: string;
    launchpadDelegationAmount: string;
  };
  delegatedRatio: string;
  apy: string;
  communityPoolUsd: string;
}

export const nullGovernanceSummaryInfo: GovernanceSummaryInfo = {
  totalDelegated: 0,
  delegatedRatio: 0,
  apy: 0,
  communityPool: 0,
  creationThreshold: 1000,
  changeParamOptions: {
    packages: [],
    functions: [],
  },
  governanceDelegated: "0",
  launchpadDelegated: "0",
};

export const nullGovernanceSummaryInfo2: GovernanceSummaryInfo2 = {
  delegationInfo: {
    totalDelegationAmount: "0",
    governanceDelegationAmount: "0",
    launchpadDelegationAmount: "0",
  },
  delegatedRatio: "0",
  apy: "0",
  communityPoolUsd: "0",
};
