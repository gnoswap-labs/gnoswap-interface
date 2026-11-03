import { act, renderHook } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";
import { ERROR_VALUE } from "@common/errors/adena";
import { QUERY_KEY } from "@query/query-keys";
import { createStore, Provider } from "jotai";
import { ReactNode } from "react";

import { TokenModel } from "@models/token/token-model";
import { SwapState } from "@states/index";

import { useSwapHandler } from "./use-swap-handler";

const mockGetRoutes = jest.fn();
const mockUpdateBalances = jest.fn();
const mockQueryClient = new QueryClient({ defaultOptions: { queries: { retry: false, cacheTime: Infinity } } });
const mockSendSwap = jest.fn();
const mockEnqueueEvent = jest.fn();
const mockPrice = { usd: 1, priceGradeType: "NONE" };
const mockTokenA: TokenModel = {
  type: "GRC20",
  chainId: "dev.gnoswap",
  createdAt: "2023-12-08T03:57:43Z",
  name: "GNOT",
  path: "gno.land/r/demo/gnot",
  decimals: 6,
  symbol: "GNOT",
  displaySymbol: "GNOT",
  logoURI: "",
  priceID: "gno.land/r/demo/gnot",
};
const mockTokenB: TokenModel = {
  ...mockTokenA,
  name: "GNS",
  path: "gno.land/r/demo/gns",
  symbol: "GNS",
  displaySymbol: "GNS",
  priceID: "gno.land/r/demo/gns",
};
const mockWrappedBubble: TokenModel = {
  ...mockTokenA,
  name: "BUBBLE (wrapped)",
  path: "gno.land/r/g1leu8d2vsplhehcfkjg50mwgdpxdkt8tztu95wr/wbubble.BUBBLE",
  symbol: "BUBBLE",
  displaySymbol: "wBUBBLE",
  priceID: "gno.land/r/g1leu8d2vsplhehcfkjg50mwgdpxdkt8tztu95wr/wbubble.BUBBLE",
};
const mockOriginBubble: TokenModel = {
  ...mockWrappedBubble,
  name: "BUBBLE",
  path: "gno.land/r/g1leu8d2vsplhehcfkjg50mwgdpxdkt8tztu95wr/bubble",
  displaySymbol: "BUBBLE",
};
const mockTokenPrices = {
  [mockTokenA.path]: mockPrice,
  [mockTokenB.path]: mockPrice,
  [mockWrappedBubble.path]: mockPrice,
};
let mockDisplayBalanceStringMap: Record<string, string> = {
  [mockTokenA.path]: "1000000000000",
  [mockTokenB.path]: "1000000000000",
  [mockWrappedBubble.path]: "1000000000000",
};
let mockSwapExtensionBalanceErrors: Record<string, Error | null> = {};
let mockSwapExtensionBalanceLoading: Record<string, boolean> = {};
let mockTokens: TokenModel[] = [mockTokenA, mockTokenB, mockWrappedBubble];

jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));
jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQueryClient: () => mockQueryClient,
}));
jest.mock("@query/router", () => ({
  useGetRoutes: (...args: unknown[]) => mockGetRoutes(...args),
  useGetSwapFee: () => ({ data: 15 }),
}));
jest.mock("@hooks/common/use-custom-router", () => () => ({ query: { path: "gns" }, pathname: "/token" }));
jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({
    swapRouterRepository: { sendExactInSwapRoute: mockSendSwap, sendExactOutSwapRoute: mockSendSwap },
  }),
}));
jest.mock("@hooks/common/use-referral", () => ({
  useReferral: () => ({ getNextReferralAddress: () => null, removeReferrerFromLocalStorage: jest.fn() }),
}));
jest.mock("@hooks/common/use-prevent-scroll", () => ({ usePreventScroll: jest.fn() }));
jest.mock("@hooks/common/use-broadcast-handler", () => ({
  useBroadcastHandler: () => ({
    broadcastLoading: jest.fn(),
    broadcastSuccess: jest.fn(),
    broadcastError: jest.fn(),
    broadcastRejected: jest.fn(),
  }),
}));
jest.mock("@hooks/common/use-message", () => ({ useMessage: () => ({ getMessage: jest.fn() }) }));
jest.mock("@hooks/common/use-slippage", () => ({
  useSlippage: () => ({ slippage: 0.5, changeSlippage: jest.fn() }),
}));
jest.mock("@hooks/common/use-transaction-confirm-modal", () => ({
  useTransactionConfirmModal: () => ({ openModal: jest.fn() }),
}));
jest.mock("@hooks/common/use-transaction-event-store", () => ({
  useTransactionEventStore: () => ({ enqueueEvent: mockEnqueueEvent }),
}));
jest.mock("@hooks/wallet/ui/use-connect-wallet-modal", () => ({
  useConnectWalletModal: () => ({ openModal: jest.fn() }),
}));
jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({ connected: true, isSwitchNetwork: false, account: { address: "g1user" } }),
}));
jest.mock("@hooks/token/data/use-token-data", () => ({
  useTokenData: () => ({
    tokens: mockTokens,
    tokenPrices: mockTokenPrices,
    displayBalanceStringMap: mockDisplayBalanceStringMap,
    swapExtensionBalanceErrors: mockSwapExtensionBalanceErrors,
    swapExtensionBalanceLoading: mockSwapExtensionBalanceLoading,
    isFetched: true,
    updateBalances: mockUpdateBalances,
    refetchGrc20Balances: jest.fn(),
    getTokenUSDPrice: () => 1,
  }),
}));

const oldQuote = {
  estimatedRoutes: [{ quote: 100, amountIn: 0n, amountOut: 0n, pools: [] }],
  originAmount: 0,
  amount: "1898308",
  status: "SUCCESS",
};

function renderSwapHandler(
  type: "EXACT_IN" | "EXACT_OUT" = "EXACT_IN",
  tokenA: TokenModel | null = mockTokenA,
  tokenB: TokenModel | null = mockTokenB,
) {
  const store = createStore();
  store.set(SwapState.swap, { tokenA, tokenB, type });
  const wrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>;
  return renderHook(() => useSwapHandler(), { wrapper });
}

describe("useSwapHandler quote consistency", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockGetRoutes.mockReset();
    mockUpdateBalances.mockClear();
    mockQueryClient.clear();
    mockSendSwap.mockReset();
    mockEnqueueEvent.mockReset();
    mockGetRoutes.mockReturnValue({ data: undefined, error: null, isLoading: false, isRefetching: false });
    mockDisplayBalanceStringMap = {
      [mockTokenA.path]: "1000000000000",
      [mockTokenB.path]: "1000000000000",
      [mockWrappedBubble.path]: "1000000000000",
    };
    mockSwapExtensionBalanceErrors = {};
    mockSwapExtensionBalanceLoading = {};
    mockTokens = [mockTokenA, mockTokenB, mockWrappedBubble];
  });

  afterEach(() => {
    mockQueryClient.clear();
    jest.useRealTimers();
  });

  it("changes only the selected side when choosing a wrapped extension token", () => {
    const { result, unmount } = renderSwapHandler("EXACT_IN", mockTokenA, null);

    act(() => result.current.changeTokenA(mockWrappedBubble));

    expect(result.current.tokenA).toBe(mockWrappedBubble);
    expect(result.current.tokenB).toBeNull();
    unmount();
  });

  it.each([
    ["upper", mockTokenA, null, "changeTokenA"],
    ["lower", null, mockTokenB, "changeTokenB"],
  ] as const)("ignores an %s origin selection until its wrapper is loaded", (_side, tokenA, tokenB, change) => {
    mockTokens = [mockTokenA, mockTokenB];
    const { result, unmount } = renderSwapHandler("EXACT_IN", tokenA, tokenB);

    act(() => result.current[change](mockOriginBubble));

    expect(result.current.tokenA).toBe(tokenA);
    expect(result.current.tokenB).toBe(tokenB);
    unmount();
  });

  it("pairs an origin token selection with its wrapper", () => {
    const { result, unmount } = renderSwapHandler("EXACT_IN", mockTokenA, null);

    act(() => result.current.changeTokenA(mockOriginBubble));

    expect(result.current.tokenA).toBe(mockOriginBubble);
    expect(result.current.tokenB).toBe(mockWrappedBubble);
    unmount();
  });

  it("keeps a lower origin selection in the lower slot", () => {
    const { result, unmount } = renderSwapHandler("EXACT_IN", mockWrappedBubble, mockTokenA);

    act(() => result.current.changeTokenB(mockOriginBubble));

    expect(result.current.tokenA).toBe(mockWrappedBubble);
    expect(result.current.tokenB).toBe(mockOriginBubble);
    unmount();
  });

  it("replaces an origin token before selecting an ordinary opposite token", () => {
    const { result, unmount } = renderSwapHandler("EXACT_IN", mockOriginBubble, mockWrappedBubble);

    act(() => result.current.changeTokenB(mockTokenB));

    expect(result.current.tokenA).toBe(mockWrappedBubble);
    expect(result.current.tokenB).toBe(mockTokenB);
    unmount();
  });

  it("keeps an unknown regular-token balance in the loading state", () => {
    mockDisplayBalanceStringMap = {
      [mockTokenB.path]: "1000000000000",
    };
    mockGetRoutes.mockReturnValue({ data: oldQuote, error: null, isLoading: false, isRefetching: false });
    const { result, unmount } = renderSwapHandler("EXACT_IN", mockTokenA, mockTokenB);

    act(() => result.current.changeTokenAAmount("1"));
    act(() => jest.advanceTimersByTime(1_000));

    expect(result.current.swapButtonText).toBe("Swap:swapButton.review");
    unmount();
  });

  it("ignores loading from an unrelated extension", () => {
    mockDisplayBalanceStringMap = {
      [mockOriginBubble.path]: "100",
      [mockWrappedBubble.path]: "100",
    };
    mockSwapExtensionBalanceLoading = {
      "gno.land/r/example/other-origin": true,
    };
    mockGetRoutes.mockReturnValue({ data: oldQuote, error: null, isLoading: false, isRefetching: false });
    const { result, unmount } = renderSwapHandler("EXACT_IN", mockOriginBubble, mockWrappedBubble);

    act(() => result.current.changeTokenAAmount("1"));
    act(() => jest.advanceTimersByTime(1_000));

    expect(result.current.swapButtonText).toBe("Swap:swapButton.wrap");
    unmount();
  });

  it("reports an unavailable origin balance separately from zero", () => {
    mockSwapExtensionBalanceErrors = {
      [mockOriginBubble.path]: new Error("Balance query failed"),
    };
    mockGetRoutes.mockReturnValue({ data: oldQuote, error: null, isLoading: false, isRefetching: false });
    const { result, unmount } = renderSwapHandler("EXACT_IN", mockOriginBubble, mockWrappedBubble);

    act(() => result.current.changeTokenAAmount("1"));
    act(() => jest.advanceTimersByTime(1_000));

    expect(result.current.swapButtonText).toBe("Swap:swapButton.balanceUnavailable");
    unmount();
  });

  it("uses a cached origin balance after a refetch error", () => {
    mockDisplayBalanceStringMap = {
      [mockOriginBubble.path]: "100",
      [mockWrappedBubble.path]: "100",
    };
    mockSwapExtensionBalanceErrors = {
      [mockOriginBubble.path]: new Error("Refetch failed"),
    };
    mockGetRoutes.mockReturnValue({ data: oldQuote, error: null, isLoading: false, isRefetching: false });
    const { result, unmount } = renderSwapHandler("EXACT_IN", mockOriginBubble, mockWrappedBubble);

    act(() => result.current.changeTokenAAmount("1"));
    act(() => jest.advanceTimersByTime(1_000));

    expect(result.current.swapButtonText).toBe("Swap:swapButton.wrap");
    unmount();
  });

  it("does not use the wrapped balance for a confirmed zero origin balance", () => {
    mockDisplayBalanceStringMap = {
      [mockOriginBubble.path]: "0",
      [mockWrappedBubble.path]: "100",
    };
    mockGetRoutes.mockReturnValue({ data: oldQuote, error: null, isLoading: false, isRefetching: false });
    const { result, unmount } = renderSwapHandler("EXACT_IN", mockOriginBubble, mockWrappedBubble);

    act(() => result.current.changeTokenAAmount("1"));
    act(() => jest.advanceTimersByTime(1_000));

    expect(result.current.swapButtonText).toBe("common:btn.insuffiBal");
    unmount();
  });

  it("replaces the prior quote with the new input's output", () => {
    mockGetRoutes.mockImplementation(({ tokenAmount }) => ({
      data: { ...oldQuote, amount: tokenAmount === "111" ? "200158845" : oldQuote.amount },
      error: null,
      isLoading: false,
      isRefetching: false,
    }));

    const { result, unmount } = renderSwapHandler();
    act(() => result.current.changeTokenAAmount("1"));
    act(() => jest.advanceTimersByTime(1_000));
    expect(result.current.swapTokenInfo.tokenBAmount).toBe("1.898308");

    act(() => result.current.changeTokenAAmount("111"));
    expect(result.current.swapTokenInfo.tokenAAmount).toBe("111");
    expect(result.current.swapTokenInfo.tokenBAmount).toBe("");
    act(() => jest.advanceTimersByTime(1_000));

    expect(result.current.swapTokenInfo.tokenBAmount).toBe("200.158845");
    expect(result.current.swapSummaryInfo?.guaranteedAmount.amount).toBeCloseTo(199.15805, 5);
    unmount();
  });

  it.each(["NO_LIQUIDITY", "ERROR"])("does not show the prior output after a new %s quote", outcome => {
    mockGetRoutes.mockImplementation(({ tokenAmount }) => {
      if (tokenAmount === "999999999999") {
        return outcome === "ERROR"
          ? { data: undefined, error: new Error("quote failed"), isLoading: false, isRefetching: false }
          : {
              data: { ...oldQuote, estimatedRoutes: [], amount: "0", status: "NO_LIQUIDITY" },
              error: null,
              isLoading: false,
              isRefetching: false,
            };
      }
      return { data: oldQuote, error: null, isLoading: false, isRefetching: false };
    });

    const { result, unmount } = renderSwapHandler();
    act(() => result.current.changeTokenAAmount("1"));
    act(() => jest.advanceTimersByTime(1_000));
    expect(result.current.swapTokenInfo.tokenBAmount).toBe("1.898308");

    act(() => result.current.changeTokenAAmount("999999999999"));
    expect(result.current.swapTokenInfo.tokenBAmount).toBe("");
    act(() => jest.advanceTimersByTime(1_000));

    expect(result.current.swapTokenInfo.tokenAAmount).toBe("999999999999");
    expect(result.current.swapTokenInfo.tokenBAmount).toBe("");
    expect(result.current.swapTokenInfo.tokenBUSD).toBeNull();
    expect(result.current.swapSummaryInfo?.swapRate).toBe(0);
    expect(result.current.swapSummaryInfo?.swapRateUSD).toBe(0);
    expect(result.current.isAvailSwap).toBe(false);
    unmount();
  });

  it("clears the previous exact-out input when the new output has no liquidity", () => {
    mockGetRoutes.mockImplementation(({ tokenAmount }) => ({
      data:
        tokenAmount === "999999999999"
          ? { ...oldQuote, estimatedRoutes: [], amount: "0", status: "NO_LIQUIDITY" }
          : oldQuote,
      error: null,
      isLoading: false,
      isRefetching: false,
    }));

    const { result, unmount } = renderSwapHandler("EXACT_OUT");
    act(() => result.current.changeTokenBAmount("1"));
    act(() => jest.advanceTimersByTime(1_000));
    expect(result.current.swapTokenInfo.tokenAAmount).toBe("1.898308");

    act(() => result.current.changeTokenBAmount("999999999999"));
    act(() => jest.advanceTimersByTime(1_000));
    expect(result.current.swapTokenInfo.tokenAAmount).toBe("");
    expect(result.current.swapSummaryInfo?.swapRate).toBe(0);
    expect(result.current.isAvailSwap).toBe(false);
    unmount();
  });
});

describe("useSwapHandler pool cache lifecycle", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockQueryClient.clear();
  });

  afterEach(() => {
    mockQueryClient.clear();
    jest.useRealTimers();
  });

  it.each(["EXACT_IN", "EXACT_OUT"] as const)(
    "invalidates submitted multi-hop and split routes for %s without touching unused pools",
    async type => {
      const paths = ["a:b:3000", "b:c:3000", "a:c:500"];
      const unusedPath = "a:b:500";
      const pool = (poolPath: string) => ({
        poolPath,
        tokenA: mockTokenA.path,
        tokenB: mockTokenB.path,
        fee: 3000,
        price: 1,
        tokenABalance: 100,
        tokenBBalance: 100,
      });
      const routes = [
        { quote: 50, amountIn: 1000000n, amountOut: 1000000n, pools: paths.slice(0, 2).map(pool) },
        { quote: 50, amountIn: 1000000n, amountOut: 1000000n, pools: [pool(paths[2]), pool(paths[0])] },
      ];
      mockGetRoutes.mockReturnValue({
        data: { ...oldQuote, estimatedRoutes: routes },
        error: null,
        isLoading: false,
        isRefetching: false,
      });
      mockEnqueueEvent.mockClear();
      const { promise, resolve: resolveSwap } = Promise.withResolvers<{ code: number; data: { hash: string } }>();
      mockSendSwap.mockReturnValue(promise);
      [...paths, unusedPath].forEach(path => mockQueryClient.setQueryData([QUERY_KEY.poolSqrtPriceX96, path], 100n));
      const { result, unmount } = renderSwapHandler(type);
      try {
        act(() => {
          if (type === "EXACT_IN") result.current.changeTokenAAmount("1");
          else result.current.changeTokenBAmount("1");
        });
        act(() => jest.advanceTimersByTime(1_000));
        act(() => result.current.executeSwap(result.current.swapTokenInfo, "1"));
        expect(mockQueryClient.getQueryState([QUERY_KEY.poolSqrtPriceX96, paths[0]])?.isInvalidated).toBe(false);
        // A newer quote must not change the pool snapshot belonging to this transaction.
        routes[0].pools = [pool(unusedPath)];
        await act(async () => resolveSwap({ code: 0, data: { hash: "swap-hash" } }));
        paths.forEach(path =>
          expect(mockQueryClient.getQueryState([QUERY_KEY.poolSqrtPriceX96, path])?.isInvalidated).toBe(true),
        );
        expect(mockQueryClient.getQueryState([QUERY_KEY.poolSqrtPriceX96, unusedPath])?.isInvalidated).toBe(false);

        const event = mockEnqueueEvent.mock.calls[0][0];
        paths.forEach(path => mockQueryClient.setQueryData([QUERY_KEY.poolSqrtPriceX96, path], 110n));
        await act(async () => event.onEmit("SUCCESS"));
        paths.forEach(path =>
          expect(mockQueryClient.getQueryState([QUERY_KEY.poolSqrtPriceX96, path])?.isInvalidated).toBe(true),
        );
      } finally {
        unmount();
      }
    },
  );

  it("does not invalidate pools for failed transactions but refreshes on later confirmed success", async () => {
    const path = "a:b:3000";
    mockGetRoutes.mockReturnValue({
      data: {
        ...oldQuote,
        estimatedRoutes: [
          {
            quote: 100,
            amountIn: 1000000n,
            amountOut: 1000000n,
            pools: [{ poolPath: path, tokenA: mockTokenA.path, tokenB: mockTokenB.path, fee: 3000, price: 1 }],
          },
        ],
      },
      error: null,
      isLoading: false,
      isRefetching: false,
    });
    mockEnqueueEvent.mockClear();
    mockSendSwap.mockResolvedValue({
      code: ERROR_VALUE.TRANSACTION_FAILED.status,
      type: ERROR_VALUE.TRANSACTION_FAILED.type,
      data: { hash: "pending-hash" },
    });
    const key = [QUERY_KEY.poolSqrtPriceX96, path];
    mockQueryClient.setQueryData(key, 100n);
    const { result, unmount } = renderSwapHandler();
    try {
      act(() => result.current.changeTokenAAmount("1"));
      act(() => jest.advanceTimersByTime(1_000));
      await act(async () => result.current.executeSwap(result.current.swapTokenInfo, "1"));
      const event = mockEnqueueEvent.mock.calls[0][0];
      await act(async () => {
        await event.onUpdate("FAILED");
        await event.onEmit("FAILED");
      });
      expect(mockQueryClient.getQueryState(key)?.isInvalidated).toBe(false);
      await act(async () => event.onUpdate("SUCCESS"));
      expect(mockQueryClient.getQueryState(key)?.isInvalidated).toBe(true);
    } finally {
      unmount();
    }
  });
});
