import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { GNOT_TOKEN, GNS_TOKEN } from "@common/values/token-constant";
import { GetRoutesResponse } from "@repositories/swap-router/response/get-routes-response";
import { useGetRoutes } from "./use-get-routes";

const mockGetRoutes = jest.fn();
jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ swapRouterRepository: { getRoutes: mockGetRoutes } }),
}));

const route = { quote: 100, amountIn: 1n, amountOut: 2n, pools: [] };
const success: GetRoutesResponse = {
  status: "SUCCESS",
  estimatedRoutes: [route],
  amount: "2",
  originAmount: 1,
};

it.each([
  { response: success, expected: success },
  ...(["NO_LIQUIDITY", "INVALID_PARAMS"] as const).map(status => ({
    // External responses may still include quote fields on failure.
    response: { ...success, status },
    expected: { status },
  })),
  {
    response: { ...success, estimatedRoutes: [{ ...route, quote: 50 }] },
    expected: { status: "NO_LIQUIDITY" },
  },
  { response: { ...success, estimatedRoutes: [] }, expected: { status: "NO_LIQUIDITY" } },
])(
  "preserves status and exposes quotes only for complete successful routes: $response.status",
  async ({ response, expected }) => {
    mockGetRoutes.mockResolvedValue(response);
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, cacheTime: 0 } } });
    const wrapper = ({ children }: React.PropsWithChildren) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
    const { result, unmount } = renderHook(
      () =>
        useGetRoutes({
          inputToken: GNOT_TOKEN,
          outputToken: { ...GNS_TOKEN, path: "gno.land/r/demo/gns" },
          tokenAmount: 1,
          exactType: "EXACT_IN",
        }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(expected);
    unmount();
    client.clear();
  },
);

it("rejects invalid routing response combinations at compile time", () => {
  // @ts-expect-error Failure responses cannot carry routes.
  const failed: GetRoutesResponse = { status: "NO_LIQUIDITY", estimatedRoutes: [route] };
  // @ts-expect-error Success responses require quote data.
  const incomplete: GetRoutesResponse = { status: "SUCCESS" };
  expect([failed, incomplete]).toHaveLength(2);
});
