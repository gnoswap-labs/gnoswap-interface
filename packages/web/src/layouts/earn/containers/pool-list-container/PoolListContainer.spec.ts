import { readFileSync } from "fs";
import path from "path";

describe("PoolListContainer loading gate", () => {
  it("renders the pool table from the pool query fetch state instead of the global init gate", () => {
    const source = readFileSync(path.join(__dirname, "PoolListContainer.tsx"), { encoding: "utf8" });

    expect(source).not.toContain("useLoading");
    expect(source).toContain("isFetchedPools");
    expect(source).toContain("isFetched={isFetchedPools}");
  });
});
