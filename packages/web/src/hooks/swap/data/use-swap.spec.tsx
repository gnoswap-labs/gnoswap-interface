import { act, renderHook } from "@testing-library/react";

import { TokenModel } from "@models/token/token-model";

import { useSwap } from "./use-swap";

const useGetRoutesMock = jest.fn();
const sendExactInSwapRoute = jest.fn(async () => ({ code: 0, data: null, status: "success", type: "" }));

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ swapRouterRepository: { sendExactInSwapRoute } }),
}));
jest.mock("@hooks/common/use-referral", () => ({
  useReferral: () => ({ getNextReferralAddress: () => null }),
}));
jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({ account: { address: "g1user" } }),
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
});
