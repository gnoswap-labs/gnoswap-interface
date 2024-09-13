interface ProposalVariables {
  pkgPath: string;
  func: string;
  param: string;
}

const queryMethodSeparator = "*GOV*";
const queryArgumentSeparator = "*EXE*";

export const makeDisplayPackagePath = (packagePath: string): string => {
  return packagePath.replace("gno.land/", "");
};

export const makeProposalVariablesQuery = (
  variables: ProposalVariables[],
): string => {
  function makeMethodQuery(variable: ProposalVariables): string {
    const params = variable.param
      .split(",")
      .map(p => p.trim())
      .join(",");

    return [variable.pkgPath, variable.func, params].join(
      queryArgumentSeparator,
    );
  }

  const methodQueries = variables.map(makeMethodQuery);
  return methodQueries.join(queryMethodSeparator);
};
