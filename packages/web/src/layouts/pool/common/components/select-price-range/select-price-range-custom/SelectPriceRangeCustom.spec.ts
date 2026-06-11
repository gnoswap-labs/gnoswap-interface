import { readFileSync } from "fs";
import path from "path";

describe("SelectPriceRangeCustom pair changes", () => {
  it("clears create-pool starting price input when the token pair changes", () => {
    const source = readFileSync(path.join(__dirname, "SelectPriceRangeCustom.tsx"), { encoding: "utf8" });

    expect(source).toContain("setStartingPriceValue(\"\");");
    expect(source).toContain("tokenPairKey");
    expect(source).toContain("[tokenPairKey]");
  });
});

describe("SelectPriceRangeCustom create-pool range basis", () => {
  it("initializes ranges from the displayed current price, not the sorted pool start price", () => {
    const source = readFileSync(path.join(__dirname, "SelectPriceRangeCustom.tsx"), { encoding: "utf8" });

    expect(source).toContain("const currentPrice = selectPool.currentPrice;");
    expect(source).not.toContain(
      "const currentPrice = selectPool.isCreate ? selectPool.startPrice : selectPool.currentPrice;",
    );
  });
});
