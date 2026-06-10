import { readFileSync } from "fs";
import path from "path";

describe("PoolInfoLazyChart graph loading", () => {
  it("keeps the PoolGraph bundle behind the chart visibility gate", () => {
    const source = readFileSync(path.join(__dirname, "PoolInfoLazyChart.tsx"), { encoding: "utf8" });

    expect(source).not.toContain("import PoolGraph from");
    expect(source).toContain("dynamic<PoolGraphProps>");
    expect(source).toContain("enabled: display");
  });
});
