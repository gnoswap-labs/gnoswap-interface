import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";

import { TokenModel } from "@models/token/token-model";

import { useGetRoutes } from "./use-get-routes";

const getRoutes = jest.fn(async () => ({
  estimatedRoutes: [{ quote: 100, amountIn: 0n, amountOut: 0n, pools: [] }],
  originAmount: 0,
  amount: "1",
}));

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ swapRouterRepository: { getRoutes } }),
}));

const createToken = (symbol: string): TokenModel => ({
  path: `gno.land/r/demo/${symbol.toLowerCase()}`,
  type: "GRC20",
  chainId: "dev.gnoswap",
  name: symbol,
  symbol,
  displaySymbol: symbol,
  decimals: 6,
  logoURI: "",
  createdAt: "2026-05-19T00:00:00Z",
  priceID: `gno.land/r/demo/${symbol.toLowerCase()}`,
});

describe("useGetRoutes", () => {
  it("passes the amount string through without converting it to a number", async () => {
    // On-chain USDC balance (raw 62667447936264477) that exceeds Number.MAX_SAFE_INTEGER
    const amount = "62667447936.264477";
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(
      () =>
        useGetRoutes({
          inputToken: createToken("USDC"),
          outputToken: createToken("ATOM"),
          exactType: "EXACT_IN",
          tokenAmount: amount,
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getRoutes).toHaveBeenCalledWith(expect.objectContaining({ tokenAmount: amount }));
  });
});
