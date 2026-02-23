import { renderHook } from "@testing-library/react";

import { usePositionsRewards } from "@hooks/pool/data/use-positions-rewards";
import { PoolPositionModel } from "@models/position/pool-position-model";

jest.mock("@hooks/token/data/use-token-data", () => ({
  useTokenData: () => ({
    tokens: [],
    tokenPrices: {
      "token-a": { usd: 1 },
      "token-b": { usd: 2 },
    },
  }),
}));

jest.mock("@hooks/token/data/use-gnot-wugnot", () => ({
  useGnotToGnot: () => ({
    getGnotPath: (token: { symbol: string; name: string; logoURI?: string }) => token,
  }),
}));

describe("usePositionsRewards", () => {
  it("formats tokenB amount using tokenB decimals", () => {
    const positions = [
      {
        pool: {
          tokenA: {
            path: "token-a",
            priceID: "token-a",
            decimals: 2,
            symbol: "TA",
            name: "TokenA",
          },
          tokenB: {
            path: "token-b",
            priceID: "token-b",
            decimals: 6,
            symbol: "TB",
            name: "TokenB",
          },
        },
        tokenABalance: "1.23",
        tokenBBalance: "1.234567",
        rewards: [],
      },
    ] as unknown as PoolPositionModel[];

    const { result } = renderHook(() => usePositionsRewards({ positions }));

    expect(result.current.pooledTokenInfos[1].amount).toBe("1.234567");
  });
});
