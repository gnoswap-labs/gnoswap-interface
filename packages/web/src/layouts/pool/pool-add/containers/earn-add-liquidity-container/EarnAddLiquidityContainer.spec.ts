import { readFileSync } from "fs";
import path from "path";

describe("EarnAddLiquidityContainer pair changes", () => {
  it("resets create-pool starting price when the token pair changes", () => {
    const source = readFileSync(path.join(__dirname, "EarnAddLiquidityContainer.tsx"), { encoding: "utf8" });

    expect(source).toContain("options: { resetStartPrice?: boolean } = {}");
    expect(source).toContain("startPrice: existPool || options.resetStartPrice ? null : prev.startPrice");
    expect(source).toContain("selectSwapFeeTier(\"FEE_3000\", { resetStartPrice: true });");
  });
});
