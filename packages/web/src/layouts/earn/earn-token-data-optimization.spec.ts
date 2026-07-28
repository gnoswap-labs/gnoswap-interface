import { readFileSync } from "fs";
import path from "path";

const readSource = (relativePath: string) => readFileSync(path.join(__dirname, relativePath), { encoding: "utf8" });

describe("earn token data optimization", () => {
  const priceOnlyConsumers = [
    "containers/earn-my-position-container/EarnMyPositionContainer.tsx",
    "containers/incentivized-pool-card-list-container/IncentivizedPoolCardListContainer.tsx",
    "containers/pool-list-container/PoolListContainer.tsx",
    "components/pool-list/pool-list-table/pool-info/PoolInfo.tsx",
    "../../components/common/pool-graph/PoolGraph.tsx",
  ];

  it("keeps price-only consumers off the full token data hook", () => {
    for (const relativePath of priceOnlyConsumers) {
      const source = readSource(relativePath);

      expect(source).toContain("useGetAllTokenPrices");
      expect(source).not.toContain("useTokenData");
    }
  });
});
