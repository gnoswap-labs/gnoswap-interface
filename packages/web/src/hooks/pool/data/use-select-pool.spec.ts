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

  it("keeps liquidity RPC off idle refetch polling while refreshing sqrt price on add pages", () => {
    const source = readFileSync(path.join(__dirname, "use-select-pool.tsx"), { encoding: "utf8" });
    const addPagePollingMatches = source.match(/refetchInterval: shouldRefetch \? 5_000 : false/g) ?? [];

    expect(addPagePollingMatches).toHaveLength(2);
    expect(source).toContain("useGetPoolLiquidity(calculatedPoolPath, {\n    enabled: !!calculatedPoolPath && !isCreate,\n  });");
    expect(source).toContain(
      "useGetPoolSqrtPriceX96(calculatedPoolPath, {\n" +
        "    enabled: !!calculatedPoolPath && !isCreate,\n" +
        "    refetchInterval: shouldRefetch ? 5_000 : false,\n" +
        "  });",
    );
  });

  it("exposes manual pool data refetch for transaction success paths", () => {
    const source = readFileSync(path.join(__dirname, "use-select-pool.tsx"), { encoding: "utf8" });

    expect(source).toContain("refetchPoolData: () => Promise<void>;");
    expect(source).toContain("const refetchPoolData = useCallback(async () => {");
    expect(source).toContain("Promise.allSettled([refetchPoolFromDb(), refetchLiquidity(), refetchSqrtPriceX96()])");
    expect(source).toContain("refetchPoolData,");
  });
});
