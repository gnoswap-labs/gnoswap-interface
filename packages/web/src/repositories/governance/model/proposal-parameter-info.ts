export interface ParameterFunctionInfo {
  funcName: string;
  paramNum: number;
  pkgPath: string;
}

export interface ParameterPackageInfo {
  pkgName: string;
  pkgPath: string;
}

export interface ProposalParameterInfo {
  proposalCreationThreshold: string;
  functions: ParameterFunctionInfo[];
  packages: ParameterPackageInfo[];
}

// null objects
export const nullFunctionInfo: ParameterFunctionInfo = {
  funcName: "",
  paramNum: 0,
  pkgPath: "",
};

export const nullPackageInfo: ParameterPackageInfo = {
  pkgName: "",
  pkgPath: "",
};

export const nullProposalParameterInfo: ProposalParameterInfo = {
  proposalCreationThreshold: "0",
  functions: [],
  packages: [],
};
