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
