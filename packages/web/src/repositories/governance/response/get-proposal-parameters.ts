import { ParameterFunctionInfo, ParameterPackageInfo } from "../model";

export interface GetProposalParameters {
  proposalCreationThreshold: string;
  functions: ParameterFunctionInfo[];
  packages: ParameterPackageInfo[];
}
