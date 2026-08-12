import { getYAxisInfo } from "./chart-y-axis";

describe("getYAxisInfo", () => {
  it("keeps sub-unit chart labels to three significant digits", () => {
    expect(getYAxisInfo(["0.1"], 0.1)).toEqual({
      labels: ["0.08", "0.088", "0.096", "0.104", "0.112", "0.12"],
      minValue: "0.08",
      maxValue: "0.12",
    });
  });

  it("returns a stable zero range for zero-only data", () => {
    expect(getYAxisInfo(["0"], 0)).toEqual({
      labels: ["0", "0", "0", "0", "0", "0"],
      minValue: "0",
      maxValue: "0",
    });
  });
});
