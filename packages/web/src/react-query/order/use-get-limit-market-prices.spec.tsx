import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";

import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { LimitMarketPricePair } from "@repositories/order/request";
import { LimitPoolMarketPrice } from "@repositories/order/response";
import { getLimitMarketPricePairKey } from "@utils/limit-market-price-utils";

import { useGetLimitMarketPrices } from "./use-get-limit-market-prices";

const mockGetLimitMarketPrices = jest.fn();

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ orderRepository: { getLimitMarketPrices: mockGetLimitMarketPrices } }),
}));

const price: LimitPoolMarketPrice = {
  outputPerInput: "0.00000000000000000041",
  poolPath: "pool/a:b",
  updatedBlockHeight: 123,
  updatedBlockTime: 456,
};

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, wrapper };
};

describe("useGetLimitMarketPrices", () => {
  beforeEach(() => mockGetLimitMarketPrices.mockReset());
  afterEach(() => jest.useRealTimers());

  it("deduplicates native aliases, keeps reverse directions separate and retains precise rates", async () => {
    const a = "gno.land/r/demo/a";
    mockGetLimitMarketPrices.mockImplementation(async ({ pairs }: { pairs: LimitMarketPricePair[] }) => ({
      items: pairs.map(pair => ({ ...pair, price })),
    }));
    const { wrapper } = createWrapper();
    const { result } = renderHook(
      () =>
        useGetLimitMarketPrices([
          { tokenIn: "ugnot", tokenOut: a },
          { tokenIn: WRAPPED_GNOT_PATH, tokenOut: a },
          { tokenIn: a, tokenOut: WRAPPED_GNOT_PATH },
        ]),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockGetLimitMarketPrices).toHaveBeenCalledTimes(1);
    expect(mockGetLimitMarketPrices.mock.calls[0][0].pairs).toEqual([
      { tokenIn: a, tokenOut: WRAPPED_GNOT_PATH },
      { tokenIn: WRAPPED_GNOT_PATH, tokenOut: a },
    ]);
    expect(Object.keys(result.current.data ?? {})).toHaveLength(2);
    expect(Object.values(result.current.data ?? {}).map(value => value?.outputPerInput)).toEqual([
      "0.00000000000000000041",
      "0.00000000000000000041",
    ]);
  });

  it("splits more than 100 unique pairs and maps results by returned direction rather than position", async () => {
    const pairs = Array.from({ length: 101 }, (_, index) => ({
      tokenIn: `gno.land/r/demo/in-${index}`,
      tokenOut: `gno.land/r/demo/out-${index}`,
    }));
    mockGetLimitMarketPrices.mockImplementation(async ({ pairs: requestPairs }: { pairs: LimitMarketPricePair[] }) => ({
      items: [...requestPairs].reverse().map(pair => ({ ...pair, price })),
    }));
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useGetLimitMarketPrices(pairs), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockGetLimitMarketPrices).toHaveBeenCalledTimes(2);
    expect(mockGetLimitMarketPrices.mock.calls.map(([request]) => request.pairs.length)).toEqual([100, 1]);
    expect(result.current.data?.[getLimitMarketPricePairKey(pairs[100])]).toEqual(price);
    expect(Object.values(result.current.data ?? {})).toHaveLength(101);
  });
  it("refreshes market prices every ten seconds", async () => {
    jest.useFakeTimers();
    mockGetLimitMarketPrices.mockResolvedValue({ items: [{ tokenIn: "a", tokenOut: "b", price }] });
    const { wrapper } = createWrapper();
    renderHook(() => useGetLimitMarketPrices([{ tokenIn: "a", tokenOut: "b" }]), { wrapper });

    await act(async () => {
      await Promise.resolve();
    });
    expect(mockGetLimitMarketPrices).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(9_999));
    expect(mockGetLimitMarketPrices).toHaveBeenCalledTimes(1);

    await act(async () => {
      jest.advanceTimersByTime(1);
      await Promise.resolve();
    });
    expect(mockGetLimitMarketPrices).toHaveBeenCalledTimes(2);
  });

  it("does no request for an empty pair set and represents omitted or unrelated results as null", async () => {
    mockGetLimitMarketPrices.mockResolvedValue({
      items: [{ tokenIn: "unrequested", tokenOut: "pair", price }],
    });
    const { wrapper } = createWrapper();
    const { result, rerender } = renderHook(({ pairs }) => useGetLimitMarketPrices(pairs), {
      wrapper,
      initialProps: { pairs: [] as LimitMarketPricePair[] },
    });

    expect(mockGetLimitMarketPrices).not.toHaveBeenCalled();
    rerender({ pairs: [{ tokenIn: "known", tokenOut: "pair" }] });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.[getLimitMarketPricePairKey({ tokenIn: "known", tokenOut: "pair" })]).toBeNull();
  });

  it("propagates repository failures", async () => {
    const failure = new Error("market price unavailable");
    mockGetLimitMarketPrices.mockRejectedValue(failure);
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useGetLimitMarketPrices([{ tokenIn: "a", tokenOut: "b" }]), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(failure);
  });
});
