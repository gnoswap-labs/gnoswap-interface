import { act, renderHook } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { ReactNode } from "react";

import { TokenModel } from "@models/token/token-model";
import { SwapState } from "@states/index";

import { useSwapHandler } from "./use-swap-handler";

const mockGetRoutes = jest.fn();
const mockUpdateBalances = jest.fn();
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

jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));
jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQueryClient: () => ({ removeQueries: jest.fn() }),
}));
jest.mock("@query/router", () => ({
  useGetRoutes: (...args: unknown[]) => mockGetRoutes(...args),
  useGetSwapFee: () => ({ data: 15 }),
}));
jest.mock("@hooks/common/use-custom-router", () => () => ({ query: { path: "gns" }, pathname: "/token" }));
jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ swapRouterRepository: {} }),
}));
jest.mock("@hooks/common/use-referral", () => ({
  useReferral: () => ({ getNextReferralAddress: () => null, removeReferrerFromLocalStorage: jest.fn() }),
}));
jest.mock("@hooks/common/use-prevent-scroll", () => ({ usePreventScroll: jest.fn() }));
jest.mock("@hooks/common/use-broadcast-handler", () => ({ useBroadcastHandler: () => ({}) }));
jest.mock("@hooks/common/use-message", () => ({ useMessage: () => ({ getMessage: jest.fn() }) }));
jest.mock("@hooks/common/use-slippage", () => ({
  useSlippage: () => ({ slippage: 0.5, changeSlippage: jest.fn() }),
}));
jest.mock("@hooks/common/use-transaction-confirm-modal", () => ({
  useTransactionConfirmModal: () => ({ openModal: jest.fn() }),
}));
jest.mock("@hooks/common/use-transaction-event-store", () => ({
  useTransactionEventStore: () => ({ enqueueEvent: jest.fn() }),
}));
jest.mock("@hooks/wallet/ui/use-connect-wallet-modal", () => ({
  useConnectWalletModal: () => ({ openModal: jest.fn() }),
}));
jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({ connected: true, isSwitchNetwork: false, account: { address: "g1user" } }),
}));
jest.mock("@hooks/token/data/use-token-data", () => ({
  useTokenData: () => ({
    tokens: [mockTokenA, mockTokenB, mockWrappedBubble],
    tokenPrices: mockTokenPrices,
    displayBalanceStringMap: mockDisplayBalanceStringMap,
    swapExtensionBalanceErrors: mockSwapExtensionBalanceErrors,
    isLoadingSwapExtensionBalances: false,
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
    mockGetRoutes.mockReturnValue({ data: undefined, error: null, isLoading: false, isRefetching: false });
    mockDisplayBalanceStringMap = {
      [mockTokenA.path]: "1000000000000",
      [mockTokenB.path]: "1000000000000",
      [mockWrappedBubble.path]: "1000000000000",
    };
    mockSwapExtensionBalanceErrors = {};
  });

  afterEach(() => jest.useRealTimers());

  it("changes only the selected side when choosing a wrapped extension token", () => {
    const { result, unmount } = renderSwapHandler("EXACT_IN", mockTokenA, null);

    act(() => result.current.changeTokenA(mockWrappedBubble));

    expect(result.current.tokenA).toBe(mockWrappedBubble);
    expect(result.current.tokenB).toBeNull();
    unmount();
  });

  it("blocks a swap when the selected input token has no reported balance", () => {
    mockDisplayBalanceStringMap = {
      [mockTokenA.path]: "1000000000000",
      [mockTokenB.path]: "1000000000000",
    };
    mockGetRoutes.mockReturnValue({ data: oldQuote, error: null, isLoading: false, isRefetching: false });
    const { result, unmount } = renderSwapHandler("EXACT_IN", mockWrappedBubble, mockTokenA);

    act(() => result.current.changeTokenAAmount("1"));
    act(() => jest.advanceTimersByTime(1_000));

    expect(result.current.swapButtonText).toBe("common:btn.insuffiBal");
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
