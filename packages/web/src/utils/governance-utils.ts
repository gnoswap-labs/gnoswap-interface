interface ProposalVariables {
  pkgPath: string;
  func: string;
  param: string;
}

const queryMethodSeparator = "*GOV*";
const queryArgumentSeparator = "*EXE*";

export const makeProposalVariablesQuery = (
  variables: ProposalVariables[],
): string => {
  function makeMethodQuery(variable: ProposalVariables): string {
    return [variable.pkgPath, variable.func, variable.param].join(
      queryArgumentSeparator,
    );
  }

  const methodQueries = variables.map(makeMethodQuery);
  return methodQueries.join(queryMethodSeparator);
};
