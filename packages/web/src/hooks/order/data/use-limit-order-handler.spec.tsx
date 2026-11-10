import { act, renderHook, waitFor } from "@testing-library/react";
import BigNumber from "bignumber.js";
import { createStore, Provider as JotaiProvider } from "jotai";
import React from "react";

import type { TokenModel } from "@models/token/token-model";
import { useGetRoutes } from "@query/router";
import { SwapState } from "@states/index";

import { useLimitOrderHandler } from "./use-limit-order-handler";

jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
jest.mock("@hooks/common/use-debounce", () => ({ __esModule: true, default: <T,>(value: T) => value }));
jest.mock("@hooks/common/use-gnoswap-context", () => ({ useGnoswapContext: () => ({ orderRepository: {} }) }));
let mockSlippage = 0.5;
jest.mock("@hooks/common/use-slippage", () => ({
  useSlippage: () => ({ slippage: mockSlippage, changeSlippage: jest.fn() }),
}));
jest.mock("@hooks/wallet/ui/use-connect-wallet-modal", () => ({
  useConnectWalletModal: () => ({ openModal: jest.fn() }),
}));
jest.mock("@components/order/confirm-limit-order-modal/ConfirmLimitOrderModal", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("../ui/use-confirm-order-modal", () => ({
  useConfirmOrderModal: () => ({ openModal: jest.fn(), closeModal: jest.fn() }),
}));
jest.mock("./use-order-transaction", () => ({ useOrderTransaction: () => ({ submit: jest.fn() }) }));
const mockGetUsdPrice = jest.fn<string | null, [TokenModel | null]>(() => null);
jest.mock("./use-order-form-common", () => ({
  getOrderButtonText: (_: string, __: unknown, placeOrderText: string) => placeOrderText,
  useOrderFormCommon: () => ({
    connected: true,
    isSwitchNetwork: false,
    switchNetwork: jest.fn(),
    copied: false,
    copyUrl: jest.fn(),
    getUsdPrice: (token: TokenModel | null) => mockGetUsdPrice(token),
    tokenABalance: "1000",
    tokenBBalance: "1000",
    isSameToken: false,
    formatUsd: (value: number | null) => (value === null ? "-" : `$${value}`),
    formatRate: () => ({ text: "-", usd: "-" }),
  }),
}));
let mockLimitConfig: { maxSlippageBps?: number } | undefined;
jest.mock("@query/order", () => ({
  useGetLimitConfig: () => ({ data: mockLimitConfig, isLoading: false }),
}));
jest.mock("@query/router", () => ({ useGetRoutes: jest.fn() }));

const makeToken = (symbol: string): TokenModel => ({
  type: "GRC20",
  chainId: "",
  createdAt: "",
  name: symbol,
  path: `gno.land/r/demo/${symbol.toLowerCase()}`,
  decimals: 6,
  symbol,
  displaySymbol: symbol,
  logoURI: "",
  priceID: `gno.land/r/demo/${symbol.toLowerCase()}`,
});

const tokenA = makeToken("A");
const tokenB = makeToken("B");
const tokenC = makeToken("C");
const tokenD = makeToken("D");
/** USD-like value of each token; the market price of a pair is `value(in) / value(out)`. A/B = 10, A/C = 20, D/B = 40. */
const TOKEN_VALUE: Record<string, number> = {
  [tokenA.path]: 10,
  [tokenB.path]: 1,
  [tokenC.path]: 0.5,
  [tokenD.path]: 40,
};

const wrapper = ({ children }: { children: React.ReactNode }) => <JotaiProvider>{children}</JotaiProvider>;

describe("useLimitOrderHandler", () => {
  beforeEach(() => {
    mockSlippage = 0.5;
    mockLimitConfig = undefined;
    mockGetUsdPrice.mockReset().mockReturnValue(null);
    jest.mocked(useGetRoutes).mockImplementation(request => {
      if (!request?.inputToken || !request.outputToken || !request.tokenAmount) {
        return { data: undefined } as ReturnType<typeof useGetRoutes>;
      }
      const price = TOKEN_VALUE[request.inputToken.path] / TOKEN_VALUE[request.outputToken.path];
      const amount = BigNumber(request.tokenAmount).multipliedBy(price).shiftedBy(6).toFixed(0);
      return { data: { status: "SUCCESS", amount } } as unknown as ReturnType<typeof useGetRoutes>;
    });
  });

  it("uses fresh amount-dependent router quotes for presets but preserves manually edited prices", async () => {
    let liveRate = "8";
    jest.mocked(useGetRoutes).mockImplementation(request => {
      if (!request?.inputToken || !request.outputToken || !request.tokenAmount) {
        return { data: undefined } as ReturnType<typeof useGetRoutes>;
      }
      const rate = BigNumber(request.tokenAmount).isGreaterThan(10) ? liveRate : "10";
      const amount = BigNumber(request.tokenAmount).multipliedBy(rate).shiftedBy(6).toFixed(0);
      return { data: { status: "SUCCESS", amount } } as unknown as ReturnType<typeof useGetRoutes>;
    });
    const { result, rerender } = renderHook(() => useLimitOrderHandler(), { wrapper });
    act(() => result.current.changeTokenA(tokenA));
    act(() => result.current.changeTokenB(tokenB));
    await waitFor(() => expect(result.current.limitPrice).toBe("11"));

    act(() => result.current.changeSellAmount("20"));
    await waitFor(() => expect(result.current.marketPrice).toBe("8"));
    await waitFor(() => expect(result.current.limitPrice).toBe("8.8"));
    expect(result.current.buyAmount).toBe("176");
    expect(result.current.selectedPreset).toBe(10);

    act(() => result.current.applyPreset(0));
    liveRate = "7";
    rerender();
    await waitFor(() => expect(result.current.limitPrice).toBe("7"));
    expect(result.current.buyAmount).toBe("140");
    expect(result.current.selectedPreset).toBe(0);

    act(() => result.current.applyPreset(5));
    act(() => result.current.changeSellAmount("30"));
    liveRate = "6";
    rerender();
    await waitFor(() => expect(result.current.limitPrice).toBe("6.3"));
    expect(result.current.buyAmount).toBe("189");
    expect(result.current.selectedPreset).toBe(5);

    // Even typing the exact preset price explicitly switches to a fixed price.
    act(() => result.current.changeLimitPrice("6.3"));
    liveRate = "5";
    act(() => result.current.changeSellAmount("40"));
    expect(result.current.marketPrice).toBe("5");
    expect(result.current.limitPrice).toBe("6.3");
    expect(result.current.buyAmount).toBe("252");
    expect(result.current.selectedPreset).toBeNull();

    act(() => result.current.applyPreset(10));
    act(() => result.current.stepPrice(1));
    liveRate = "4";
    act(() => result.current.changeSellAmount("50"));
    expect(result.current.marketPrice).toBe("4");
    expect(result.current.limitPrice).toBe("5.5055");
    expect(result.current.buyAmount).toBe("275.275");
    expect(result.current.selectedPreset).toBeNull();
  });

  it("updates the USD estimate with the output token price without changing the order ratio", async () => {
    mockGetUsdPrice.mockImplementation(token => (token?.path === tokenB.path ? "2" : "99"));
    const { result, rerender } = renderHook(() => useLimitOrderHandler(), { wrapper });
    act(() => result.current.changeTokenA(tokenA));
    act(() => result.current.changeTokenB(tokenB));
    await waitFor(() => expect(result.current.limitPrice).toBe("11"));
    act(() => result.current.changeLimitPrice("10"));
    act(() => result.current.changeSellAmount("3"));
    expect(result.current.limitPriceUsd).toBe("$20");
    expect(result.current.buyAmount).toBe("30");

    mockGetUsdPrice.mockReturnValue("1");
    rerender();
    expect(result.current.limitPriceUsd).toBe("$10");
    expect(result.current.limitPrice).toBe("10");
    expect(result.current.buyAmount).toBe("30");

    mockGetUsdPrice.mockReturnValue(null);
    rerender();
    expect(result.current.limitPriceUsd).toBe("-");
    act(() => result.current.changeLimitPrice(""));
    expect(result.current.limitPriceUsd).toBe("-");
  });

  it.each([
    ["changeTokenB", (handler: ReturnType<typeof useLimitOrderHandler>) => handler.changeTokenB(tokenC)],
    ["changeTokenA", (handler: ReturnType<typeof useLimitOrderHandler>) => handler.changeTokenA(tokenD)],
  ])("recalculates the estimated Buy amount on %s using the new pair's price", async (_, changeToken) => {
    const { result } = renderHook(() => useLimitOrderHandler(), { wrapper });

    act(() => result.current.changeTokenA(tokenA));
    act(() => result.current.changeTokenB(tokenB));
    await waitFor(() => expect(result.current.limitPrice).toBe("11"));

    act(() => result.current.changeSellAmount("10"));
    expect(result.current.sellAmount).toBe("10");
    expect(result.current.buyAmount).toBe("110");

    act(() => changeToken(result.current));
    await waitFor(() => expect(["22", "44"]).toContain(result.current.limitPrice));

    const expectedBuy = BigNumber(result.current.sellAmount).multipliedBy(result.current.limitPrice);
    expect(BigNumber(result.current.buyAmount).isEqualTo(expectedBuy)).toBe(true);
  });

  it("keeps a cleared limit price empty until the user types a new one", async () => {
    const { result } = renderHook(() => useLimitOrderHandler(), { wrapper });

    act(() => result.current.changeTokenA(tokenA));
    act(() => result.current.changeTokenB(tokenB));
    await waitFor(() => expect(result.current.limitPrice).toBe("11"));

    act(() => result.current.changeLimitPrice(""));
    // Give the seeding effect a chance to run again.
    await act(async () => Promise.resolve());
    expect(result.current.limitPrice).toBe("");

    act(() => result.current.changeLimitPrice("12"));
    expect(result.current.limitPrice).toBe("12");
  });

  it("seeds market +10% again for a new pair", async () => {
    const { result } = renderHook(() => useLimitOrderHandler(), { wrapper });

    act(() => result.current.changeTokenA(tokenA));
    act(() => result.current.changeTokenB(tokenB));
    await waitFor(() => expect(result.current.limitPrice).toBe("11"));

    act(() => result.current.changeLimitPrice(""));
    act(() => result.current.changeTokenB(tokenC));
    await waitFor(() => expect(result.current.limitPrice).toBe("22"));
  });

  it("shows the tolerance capped to the realm maximum, the one confirmed and sent", () => {
    mockSlippage = 30;
    mockLimitConfig = { maxSlippageBps: 1000 };
    const { result } = renderHook(() => useLimitOrderHandler(), { wrapper });

    expect(result.current.slippage).toBe(10);
    expect(result.current.maxSlippage).toBe(10);
  });

  describe("a price kept while the form is not mounted", () => {
    const renderInStore = (store: ReturnType<typeof createStore>) =>
      renderHook(() => useLimitOrderHandler(), {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <JotaiProvider store={store}>{children}</JotaiProvider>
        ),
      });

    const priceAtoB = async (store: ReturnType<typeof createStore>, price: string) => {
      const first = renderInStore(store);
      act(() => first.result.current.changeTokenA(tokenA));
      act(() => first.result.current.changeTokenB(tokenB));
      await waitFor(() => expect(first.result.current.limitPrice).toBe("11"));
      act(() => first.result.current.changeLimitPrice(price));
      act(() => first.result.current.changeSellAmount("10"));
      first.unmount();
    };

    it("keeps the chosen preset when returning to the same pair", async () => {
      const store = createStore();
      const first = renderInStore(store);
      act(() => first.result.current.changeTokenA(tokenA));
      act(() => first.result.current.changeTokenB(tokenB));
      await waitFor(() => expect(first.result.current.limitPrice).toBe("11"));
      act(() => first.result.current.applyPreset(5));
      first.unmount();

      const { result } = renderInStore(store);
      act(() => result.current.changeSellAmount("20"));
      await waitFor(() => expect(result.current.limitPrice).toBe("10.5"));
      expect(result.current.selectedPreset).toBe(5);
      expect(result.current.buyAmount).toBe("210");
    });

    it("is reseeded from the market price when another mode changed the pair", async () => {
      const store = createStore();
      await priceAtoB(store, "10");

      // Swap or DCA changes the shared output token to C (A/C market price 20).
      store.set(SwapState.swap, prev => ({ ...prev, tokenB: tokenC }));
      const { result } = renderInStore(store);

      await waitFor(() => expect(result.current.limitPrice).toBe("22"));
      expect(result.current.buyAmount).toBe("220");
    });

    it("is kept when the pair is unchanged", async () => {
      const store = createStore();
      await priceAtoB(store, "12");

      const { result } = renderInStore(store);
      await act(async () => Promise.resolve());

      expect(result.current.limitPrice).toBe("12");
      expect(result.current.buyAmount).toBe("120");
    });

    it("keeps a shared link's price for the pair the link restores", async () => {
      const store = createStore();
      await priceAtoB(store, "12");

      const { result } = renderInStore(store);
      act(() => {
        store.set(SwapState.swap, prev => ({ ...prev, tokenB: tokenC }));
        result.current.setLimitPrice("15");
      });
      await act(async () => Promise.resolve());

      expect(result.current.limitPrice).toBe("15");
      expect(result.current.selectedPreset).toBeNull();
      act(() => result.current.changeSellAmount("20"));
      expect(result.current.limitPrice).toBe("15");
      expect(result.current.buyAmount).toBe("300");
    });
  });

  describe("a positive amount below the token's precision", () => {
    it("does not reach Place Order when the raw amounts round down to 0", async () => {
      const { result } = renderHook(() => useLimitOrderHandler(), { wrapper });
      act(() => result.current.changeTokenA(tokenA));
      act(() => result.current.changeTokenB(tokenB));
      await waitFor(() => expect(result.current.limitPrice).toBe("11"));

      // A shared link restores amount=0.0000001&price=1 for 6-decimal tokens.
      act(() => {
        result.current.setLimitPrice("1");
        result.current.changeSellAmount("0.0000001");
      });
      await act(async () => Promise.resolve());

      expect(result.current.buttonState).not.toBe("PLACE_ORDER");
    });

    it("keeps only the digits the input token can hold", async () => {
      const { result } = renderHook(() => useLimitOrderHandler(), { wrapper });
      act(() => result.current.changeTokenA(tokenA));
      act(() => result.current.changeTokenB(tokenB));
      await waitFor(() => expect(result.current.limitPrice).toBe("11"));

      act(() => result.current.changeSellAmount("100.1234567"));
      await waitFor(() => expect(result.current.sellAmount).toBe("100.123456"));
      expect(result.current.buttonState).toBe("PLACE_ORDER");
    });
  });
});
