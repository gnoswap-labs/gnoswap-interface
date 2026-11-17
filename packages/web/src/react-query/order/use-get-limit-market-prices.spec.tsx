import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { LimitMarketPricePair } from "@repositories/order/request";
import { LimitMarketPriceResponse, LimitPoolMarketPrice } from "@repositories/order/response";
import { getLimitMarketPricePairKey } from "@utils/limit-market-price-utils";
import { useGetLimitMarketPrices } from "./use-get-limit-market-prices";

const mockGetLimitMarketPrice = jest.fn<Promise<LimitMarketPriceResponse>, [LimitMarketPricePair]>();
jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ orderRepository: { getLimitMarketPrice: mockGetLimitMarketPrice } }),
}));
const price: LimitPoolMarketPrice = {
  outputPerInput: "0.00000000000000000041",
  poolPath: "pool/a:b",
  updatedBlockHeight: 123,
  updatedBlockTime: 456,
};
const forward = { tokenIn: WRAPPED_GNOT_PATH, tokenOut: "gno.land/r/demo/a" };
const reverse = { tokenIn: forward.tokenOut, tokenOut: forward.tokenIn };
let client: QueryClient;
const createWrapper = () => {
  client = new QueryClient({ defaultOptions: { queries: { retry: false, refetchOnMount: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};
beforeEach(() => mockGetLimitMarketPrice.mockReset());
afterEach(() => {
  client.clear();
  jest.useRealTimers();
});

describe("useGetLimitMarketPrices individual GET cache", () => {
  it("deduplicates native aliases while preserving reverse directions and full rate precision", async () => {
    mockGetLimitMarketPrice.mockImplementation(async pair => ({ ...pair, price }));
    const { result } = renderHook(() => useGetLimitMarketPrices([{ ...forward, tokenIn: "ugnot" }, forward, reverse]), {
      wrapper: createWrapper(),
    });
    await waitFor(() =>
      expect(Object.values(result.current.data).map(item => item?.outputPerInput)).toEqual([
        price.outputPerInput,
        price.outputPerInput,
      ]),
    );
    expect(mockGetLimitMarketPrice).toHaveBeenCalledTimes(2);
    expect(mockGetLimitMarketPrice.mock.calls.map(([pair]) => pair)).toEqual(
      expect.arrayContaining([forward, reverse]),
    );
  });

  it("reuses unchanged and recently removed pairs when the visible pair set changes", async () => {
    mockGetLimitMarketPrice.mockImplementation(async pair => ({ ...pair, price }));
    const { result, rerender } = renderHook(
      ({ pairs }: { pairs: LimitMarketPricePair[] }) => useGetLimitMarketPrices(pairs),
      {
        wrapper: createWrapper(),
        initialProps: { pairs: [] as LimitMarketPricePair[] },
      },
    );
    expect(mockGetLimitMarketPrice).not.toHaveBeenCalled();
    rerender({ pairs: [forward] });
    await waitFor(() => expect(result.current.data[getLimitMarketPricePairKey(forward)]).toEqual(price));
    rerender({ pairs: [forward, reverse] });
    await waitFor(() => expect(result.current.data[getLimitMarketPricePairKey(reverse)]).toEqual(price));
    rerender({ pairs: [reverse] });
    expect(result.current.data[getLimitMarketPricePairKey(forward)]).toBeUndefined();
    rerender({ pairs: [forward, reverse] });
    expect(result.current.data[getLimitMarketPricePairKey(forward)]).toEqual(price);
    expect(mockGetLimitMarketPrice).toHaveBeenCalledTimes(2);
  });

  it("isolates an unavailable or failed pair without hiding another pair and recovers independently", async () => {
    let state: "success" | "null" | "error" = "success";
    mockGetLimitMarketPrice.mockImplementation(async pair => {
      if (pair.tokenIn === forward.tokenIn) {
        if (state === "error") throw new Error("pair unavailable");
        if (state === "null") return { ...pair, price: null };
      }
      return { ...pair, price };
    });
    const { result } = renderHook(() => useGetLimitMarketPrices([forward, reverse]), { wrapper: createWrapper() });
    const forwardKey = getLimitMarketPricePairKey(forward),
      reverseKey = getLimitMarketPricePairKey(reverse);
    await waitFor(() => expect(result.current.data[forwardKey]).toEqual(price));
    for (const next of ["null", "error"] as const) {
      state = next;
      await act(() => client.refetchQueries({ type: "active" }));
      await waitFor(() => expect(result.current.data[forwardKey]).toBeNull());
      expect(result.current.data[reverseKey]).toEqual(price);
    }
    state = "success";
    await act(() => client.refetchQueries({ type: "active" }));
    await waitFor(() => expect(result.current.data[forwardKey]).toEqual(price));
    expect(result.current.data[reverseKey]).toEqual(price);
  });

  it("refreshes a stale pair immediately when its page returns despite the app's mount defaults", async () => {
    jest.useFakeTimers();
    let currentPrice = price;
    mockGetLimitMarketPrice.mockImplementation(async pair => ({ ...pair, price: currentPrice }));
    const { result, rerender } = renderHook(({ pairs }) => useGetLimitMarketPrices(pairs), {
      wrapper: createWrapper(),
      initialProps: { pairs: [forward] },
    });
    const key = getLimitMarketPricePairKey(forward);
    await waitFor(() => expect(result.current.data[key]).toEqual(price));
    rerender({ pairs: [] });
    act(() => jest.advanceTimersByTime(10_001));
    expect(mockGetLimitMarketPrice).toHaveBeenCalledTimes(1);
    currentPrice = { ...price, outputPerInput: "0.2" };
    rerender({ pairs: [forward] });
    await waitFor(() => expect(result.current.data[key]?.outputPerInput).toBe("0.2"));
    expect(mockGetLimitMarketPrice).toHaveBeenCalledTimes(2);
  });
});
