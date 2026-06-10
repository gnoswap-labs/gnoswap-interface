import { readFileSync } from "fs";
import path from "path";

const readSource = (relativePath: string) =>
  readFileSync(path.join(__dirname, relativePath), {
    encoding: "utf8",
  });

describe("liquidity chart tooltip Figma field alignment", () => {
  it("keeps only Figma-approved available fields in the pool graph tooltip", () => {
    const source = readSource("PoolGraphTooltip.tsx");

    expect(source).not.toContain("business:currentPrice");
    expect(source).toContain("common:price");
    expect(source).toContain("Total liquidity");
    expect(source).toContain("pool-liquidity-content");
    expect(source).toContain("Your liquidity");
    expect(source).not.toContain(">Share<");
    expect(source).not.toContain("share-amount");
    expect(source).not.toContain("positionAmt");
    expect(source).not.toContain("priceRange");
  });

  it("keeps only Figma-approved available fields in the selection graph tooltip", () => {
    const source = readFileSync(path.join(__dirname, "../../pool-selection-graph/PoolSelectionGraphBinTooltip.tsx"), {
      encoding: "utf8",
    });

    expect(source).toContain("common:price");
    expect(source).not.toContain("Total liquidity");
    expect(source).not.toContain("positionAmt");
    expect(source).not.toContain("priceRange");
    expect(source).not.toContain("business:currentPrice");
  });
});
