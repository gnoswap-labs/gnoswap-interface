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
};
