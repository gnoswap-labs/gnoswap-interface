import { buildGasInfo, getGasUsed } from "./build-gas-info";

describe("buildGasInfo", () => {
  it("returns error gas info when result is null", () => {
    expect(buildGasInfo(null, 1)).toEqual({
      status: "error",
      simulateErrorMessage: "",
    });
  });

  it("returns error gas info when simulation returns an error message", () => {
    expect(
      buildGasInfo(
        {
          gasUsed: 123,
          errorMessage: "simulation failed",
        },
        1,
      ),
    ).toEqual({
      status: "error",
      simulateErrorMessage: "simulation failed",
    });
  });

  it("returns success gas info with adjusted gas values when simulation succeeds", () => {
    expect(
      buildGasInfo(
        {
          gasUsed: 100,
          errorMessage: null,
        },
        2,
      ),
    ).toEqual({
      status: "success",
      gasFee: 220,
      gasUsed: 110,
      gasWanted: 110,
      gasPrice: 2,
    });
  });
});

describe("getGasUsed", () => {
  it("returns 0 for null gas info", () => {
    expect(getGasUsed(null)).toBe(0);
  });

  it("returns 0 for error gas info", () => {
    expect(
      getGasUsed({
        status: "error",
        simulateErrorMessage: "simulation failed",
      }),
    ).toBe(0);
  });

  it("returns gasUsed for success gas info", () => {
    expect(
      getGasUsed({
        status: "success",
        gasFee: 220,
        gasUsed: 110,
        gasWanted: 110,
        gasPrice: 2,
      }),
    ).toBe(110);
  });
});
