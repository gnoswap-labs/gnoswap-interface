import { makeProposalVariablesQuery } from "./governance-utils";

describe("make proposal's variable query", () => {
  test("single variable", () => {
    const variables = [
      {
        pkgPath: "pkg1",
        func: "func1",
        param: "arg1,arg2",
      },
    ];

    const query = makeProposalVariablesQuery(variables);

    expect(query).toBe("pkg1*EXE*func1*EXE*arg1,arg2");
  });

  test("multiple variables", () => {
    const variables = [
      {
        pkgPath: "pkg1",
        func: "func1",
        param: "arg1,arg2",
      },
      {
        pkgPath: "pkg2",
        func: "func2",
        param: "arg1,arg2,arg3",
      },
    ];

    const query = makeProposalVariablesQuery(variables);

    expect(query).toBe(
      "pkg1*EXE*func1*EXE*arg1,arg2*GOV*pkg2*EXE*func2*EXE*arg1,arg2,arg3",
    );
  });
});
