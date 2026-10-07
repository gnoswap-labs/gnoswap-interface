import { readFileSync } from "fs";
import path from "path";

describe("MyPositionCard range graph deferral", () => {
  it("keeps range graph data fetching behind the View my range toggle", () => {
    const source = readFileSync(path.join(__dirname, "MyPositionCard.tsx"), { encoding: "utf8" });

    expect(source).toContain("const MyPositionRangeGraph");
    expect(source).toContain("{viewMyRange && (");
    expect(source.indexOf("usePoolLiquiditySegmentsByPath(")).toBeLessThan(source.indexOf("const MyPositionCard"));
  });
});
