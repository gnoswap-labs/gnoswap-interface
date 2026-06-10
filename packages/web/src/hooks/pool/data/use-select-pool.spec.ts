import { readFileSync } from "fs";
import path from "path";

describe("useSelectPool liquidity segment price", () => {
  it("keeps reversed display price out of liquidity segment normalization", () => {
    const source = readFileSync(path.join(__dirname, "use-select-pool.tsx"), { encoding: "utf8" });

    expect(source).toContain("const segmentCurrentPrice = useMemo");
    expect(source).toContain("return isReverse ? 1 / segmentCurrentPrice : segmentCurrentPrice;");
    expect(source).toContain("currentPrice: segmentCurrentPrice");
    expect(source).toContain("segmentCurrentPrice,\n      ],");
  });
});

describe("useSelectPool selected pool path", () => {
  it("keeps the calculated pool path available while create-pool starting price is empty", () => {
    const source = readFileSync(path.join(__dirname, "use-select-pool.tsx"), { encoding: "utf8" });

    expect(source).toContain("if (calculatedPoolPath) {\n      setLatestPoolPath(calculatedPoolPath);");
    expect(source).not.toContain("if (isCreate && startPrice === null) {\n      setLatestPoolPath(null);");
  });
});
