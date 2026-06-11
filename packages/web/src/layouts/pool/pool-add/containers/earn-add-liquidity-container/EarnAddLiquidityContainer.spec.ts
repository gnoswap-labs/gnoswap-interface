import { readFileSync } from "fs";
import path from "path";

describe("EarnAddLiquidityContainer pair changes", () => {
  it("resets create-pool starting price when the token pair changes", () => {
    const source = readFileSync(path.join(__dirname, "EarnAddLiquidityContainer.tsx"), { encoding: "utf8" });

    expect(source).toContain("options: { resetStartPrice?: boolean } = {}");
    expect(source).toContain("startPrice: existPool || options.resetStartPrice ? null : prev.startPrice");
    expect(source).toMatch(/selectSwapFeeTier\("FEE_3000", { resetStartPrice: true }\);/);
  });

  it("clears form values and range selection when either selected token changes", () => {
    const source = readFileSync(path.join(__dirname, "EarnAddLiquidityContainer.tsx"), { encoding: "utf8" });

    expect(source).toContain("const resetPoolAddForm = useCallback(() => {");
    expect(source).toMatch(/tokenAAmountInput\.changeAmount\(""\);/);
    expect(source).toMatch(/tokenBAmountInput\.changeAmount\(""\);/);
    expect(source).toContain("setCreateOption({ isCreate: false, startPrice: null });");
    expect(source).toContain("selectPool.resetRange();");
    expect(source).toMatch(/if \(!isSameToken\(token\.path, tokenA\?\.path \|\| ""\)\) {\n\s+resetPoolAddForm\(\);/);
    expect(source).toMatch(/if \(!isSameToken\(token\.path, tokenB\?\.path \|\| ""\)\) {\n\s+resetPoolAddForm\(\);/);
  });
});
