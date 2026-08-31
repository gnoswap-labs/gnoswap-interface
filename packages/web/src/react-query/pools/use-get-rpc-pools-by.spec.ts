import { readFileSync } from "fs";
import path from "path";

describe("useGetRPCPoolsBy polling", () => {
  it("fetches fee-tier liquidity without idle refetch polling", () => {
    const source = readFileSync(path.join(__dirname, "use-get-rpc-pools-by.ts"), { encoding: "utf8" });

    expect(source).toContain("poolRepository.getPoolLiquidity(poolPath)");
    expect(source).toContain("staleTime: 1000 * 30");
    expect(source).not.toContain("refetchInterval");
  });
});
