import { act, renderHook } from "@testing-library/react";

import { TokenModel } from "@models/token/token-model";

import { useSwap } from "./use-swap";

const useGetRoutesMock = jest.fn();
const sendExactInSwapRoute = jest.fn(async () => ({ code: 0, data: null, status: "success", type: "" }));
const sendExactOutSwapRoute = jest.fn(async () => ({ code: 0, data: null, status: "success", type: "" }));
const getRoutes = jest.fn();
const makeExactInSwapRouteMessages = jest.fn(async () => [{ caller: "g1user" }]);

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({
    swapRouterRepository: { sendExactInSwapRoute, sendExactOutSwapRoute, getRoutes, makeExactInSwapRouteMessages },
  }),
}));
jest.mock("@hooks/common/use-referral", () => ({
  useReferral: () => ({ getNextReferralAddress: () => null }),
}));
jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({ account: { address: "g1user" } }),
}));
jest.mock("@hooks/token/data/use-token-data", () => ({
  useTokenData: () => ({ tokens: [], isFetched: true }),
}));
jest.mock("@query/router", () => ({
  useGetRoutes: (...args: unknown[]) => useGetRoutesMock(...args),
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

// On-chain USDC balance (raw 62667447936264477) that exceeds Number.MAX_SAFE_INTEGER
const LARGE_AMOUNT = "62667447936.264477";

describe("useSwap amount precision", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useGetRoutesMock.mockReset();
    useGetRoutesMock.mockReturnValue({
      data: {
        estimatedRoutes: [{ quote: 100, amountIn: 0n, amountOut: 0n, pools: [] }],
        originAmount: 0,
        amount: "1000000",
        status: "SUCCESS",
      },
      isLoading: false,
      isRefetching: false,
      error: null,
    });
    sendExactInSwapRoute.mockClear();
    sendExactOutSwapRoute.mockClear();
    getRoutes.mockReset();
    getRoutes.mockResolvedValue({
      estimatedRoutes: [{ quote: 100, amountIn: 0n, amountOut: 0n, pools: [] }],
      originAmount: 0,
      amount: "2000000",
      status: "SUCCESS",
    });
    makeExactInSwapRouteMessages.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("forwards the exact amount string to the route lookup and the swap transaction", async () => {
    const { result } = renderHook(() =>
      useSwap({ tokenA: createToken("USDC"), tokenB: createToken("ATOM"), direction: "EXACT_IN", slippage: 0.5 }),
    );

    act(() => {
      result.current.updateSwapAmount(LARGE_AMOUNT);
    });
    act(() => {
      jest.advanceTimersByTime(1_000);
    });

    const lastRouteRequest = useGetRoutesMock.mock.calls[useGetRoutesMock.mock.calls.length - 1][0];
    expect(lastRouteRequest.tokenAmount).toBe(LARGE_AMOUNT);
    expect(typeof lastRouteRequest.tokenAmount).toBe("string");

    await act(async () => {
      await result.current.swap(result.current.estimatedRoutes || [], LARGE_AMOUNT);
    });

    expect(sendExactInSwapRoute).toHaveBeenCalledWith(
      expect.objectContaining({
        tokenAmount: LARGE_AMOUNT,
        tokenAmountLimit: "0.995",
      }),
    );
  });

  it("rounds the exact-out maximum input up at an atomic-unit boundary", async () => {
    // Estimated input of 1 raw unit (0.000001) with 0.5% slippage must allow 2 raw units
    useGetRoutesMock.mockReturnValue({
      data: {
        estimatedRoutes: [{ quote: 100, amountIn: 0n, amountOut: 0n, pools: [] }],
        originAmount: 0,
        amount: "1",
        status: "SUCCESS",
      },
      isLoading: false,
      isRefetching: false,
      error: null,
    });

    const { result } = renderHook(() =>
      useSwap({ tokenA: createToken("USDC"), tokenB: createToken("ATOM"), direction: "EXACT_OUT", slippage: 0.5 }),
    );

    act(() => {
      result.current.updateSwapAmount("1");
    });
    act(() => {
      jest.advanceTimersByTime(1_000);
    });

    expect(result.current.estimatedAmount).toBe("0.000001");
    expect(result.current.tokenAmountLimit).toBe("0.000002");

    await act(async () => {
      await result.current.swap(result.current.estimatedRoutes || [], "1");
    });

    expect(sendExactOutSwapRoute).toHaveBeenCalledWith(
      expect.objectContaining({ tokenAmount: "1", tokenAmountLimit: "0.000002" }),
    );
  });

  it("builds the max-amount messages from routes looked up for that amount", async () => {
    const { result } = renderHook(() =>
      useSwap({ tokenA: createToken("USDC"), tokenB: createToken("ATOM"), direction: "EXACT_IN", slippage: 0.5 }),
    );

    // 1.5 USDC in raw units, the shape the reserve estimate hands over.
    const messages = await result.current.makeMaxAmountMessages("1500000");

    // Routes are looked up for the candidate amount rather than the current input.
    expect(getRoutes).toHaveBeenCalledWith(expect.objectContaining({ exactType: "EXACT_IN", tokenAmount: "1.5" }));
    expect(makeExactInSwapRouteMessages).toHaveBeenCalledWith(
      expect.objectContaining({ tokenAmount: "1.5", tokenAmountLimit: "1.99" }),
    );
    expect(messages).toHaveLength(1);
  });

  it("builds no max-amount messages when the amount has no route", async () => {
    getRoutes.mockResolvedValue({ estimatedRoutes: [], originAmount: 0, amount: "0", status: "NO_LIQUIDITY" });

    const { result } = renderHook(() =>
      useSwap({ tokenA: createToken("USDC"), tokenB: createToken("ATOM"), direction: "EXACT_IN", slippage: 0.5 }),
    );

    await expect(result.current.makeMaxAmountMessages("1500000")).resolves.toEqual([]);
    expect(makeExactInSwapRouteMessages).not.toHaveBeenCalled();
  });
});
