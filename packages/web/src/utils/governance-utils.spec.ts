import { isQuorumReached, makeProposalVariablesQuery } from "./governance-utils";

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

    expect(query).toBe("pkg1*EXE*func1*EXE*arg1,arg2*GOV*pkg2*EXE*func2*EXE*arg1,arg2,arg3");
  });
});

describe("isQuorumReached", () => {
  test("returns true when summed vote weights reach quorum amount", () => {
    const result = isQuorumReached({
      yesVotingWeight: "1000000000",
      noVotingWeight: "578900000",
      quorumAmount: "1578900000",
    });

    expect(result).toBe(true);
  });

  test("adds integer strings numerically instead of concatenating them", () => {
    const result = isQuorumReached({
      yesVotingWeight: "1",
      noVotingWeight: "57",
      quorumAmount: "58",
    });

    expect(result).toBe(true);
  });

  test("returns false when summed vote weights are below quorum amount", () => {
    const result = isQuorumReached({
      yesVotingWeight: "1000000000",
      noVotingWeight: "578899999",
      quorumAmount: "1578900000",
    });

    expect(result).toBe(false);
  });
});
