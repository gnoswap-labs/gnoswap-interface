import { readFileSync } from "fs";
import path from "path";

describe("usePoolAddLiquidityConfirmModal pool refresh", () => {
  it("refreshes selected pool RPC data after add liquidity emits", () => {
    const source = readFileSync(path.join(__dirname, "use-pool-add-liquidity-confirm-modal.tsx"), {
      encoding: "utf8",
    });

    expect(source).toContain("const { poolPath: selectedPoolPath, refetchPoolData } = selectPool;");
    expect(source).toContain("await refetchPoolData();");
    expect(source).toContain("await delay(1000);\n              await handleRefreshData();");
    expect(source).toContain("onSuccess: handleRefreshData");
  });
});
