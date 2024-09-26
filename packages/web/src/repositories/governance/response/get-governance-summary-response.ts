export interface GetGovernanceSummaryResponse {
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
