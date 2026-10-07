import BigNumber from "bignumber.js";

import { rawToDisplayAmount } from "./number-utils";

interface ProposalVariables {
  pkgPath: string;
  func: string;
  param: string;
}

interface GovernanceVotingAmounts {
  yesVotingWeight: string;
  noVotingWeight: string;
  quorumAmount: string;
}

const queryMethodSeparator = "*GOV*";
const queryArgumentSeparator = "*EXE*";

export const makeDisplayPackagePath = (packagePath: string): string => {
  return packagePath.replace("gno.land/r/gnoswap", "");
};

export const makeProposalVariablesQuery = (variables: ProposalVariables[]): string => {
  function makeMethodQuery(variable: ProposalVariables): string {
    const params = variable.param
      .split(",")
      .map(p => p.trim())
      .join(",");

    return [variable.pkgPath, variable.func, params].join(queryArgumentSeparator);
  }

  const methodQueries = variables.map(makeMethodQuery);
  return methodQueries.join(queryMethodSeparator);
};

export const isQuorumReached = ({
  yesVotingWeight,
  noVotingWeight,
  quorumAmount,
}: GovernanceVotingAmounts): boolean => {
  const yesVotingWeightValue = BigNumber(yesVotingWeight || 0);
  const noVotingWeightValue = BigNumber(noVotingWeight || 0);
  const quorumAmountValue = BigNumber(quorumAmount || 0);

  if (yesVotingWeightValue.isNaN() || noVotingWeightValue.isNaN() || quorumAmountValue.isNaN()) {
    return false;
  }

  return yesVotingWeightValue.plus(noVotingWeightValue).isGreaterThanOrEqualTo(quorumAmountValue);
};

export const DEFAULT_PROPOSAL_CREATION_THRESHOLD = 1000 as const;

export function getProposalCreationThreshold(
  proposalCreationThreshold: number | string | null | undefined,
  xGnsDecimals: number,
): number {
  if (proposalCreationThreshold == null) {
    return DEFAULT_PROPOSAL_CREATION_THRESHOLD;
  }

  return rawToDisplayAmount(proposalCreationThreshold, xGnsDecimals) || DEFAULT_PROPOSAL_CREATION_THRESHOLD;
}
