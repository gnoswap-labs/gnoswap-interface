import { readFileSync } from "fs";
import path from "path";

describe("SelectPriceRangeCustom pair changes", () => {
  it("clears create-pool starting price input when the token pair changes", () => {
    const source = readFileSync(path.join(__dirname, "SelectPriceRangeCustom.tsx"), { encoding: "utf8" });

    expect(source).toContain("setStartingPriceValue(\"\");");
    expect(source).toContain("[tokenA.path, tokenB.path]");
  });
});
