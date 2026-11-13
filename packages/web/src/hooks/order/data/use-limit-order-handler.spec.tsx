import type { UseQueryResult } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import BigNumber from "bignumber.js";
import { createStore, Provider as JotaiProvider } from "jotai";
import React from "react";

import type { LimitOrderSummary } from "@models/order/order-summary";
import type { TokenModel } from "@models/token/token-model";
import { useGetRoutes } from "@query/router";
import type { GetRoutesResponse } from "@repositories/swap-router/response/get-routes-response";
import { CommonState, SwapState } from "@states/index";

import { useLimitOrderHandler } from "./use-limit-order-handler";

jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
jest.mock("@hooks/common/use-debounce", () => ({ __esModule: true, default: <T,>(value: T) => value }));
jest.mock("@hooks/common/use-gnoswap-context", () => ({ useGnoswapContext: () => ({ orderRepository: {} }) }));
jest.mock("@hooks/wallet/ui/use-connect-wallet-modal", () => ({
  useConnectWalletModal: () => ({ openModal: jest.fn() }),
}));
jest.mock("@components/order/confirm-limit-order-modal/ConfirmLimitOrderModal", () => ({
  __esModule: true,
  default: () => null,
}));
let mockRenderConfirmModal: (() => JSX.Element) | undefined;
jest.mock("../ui/use-confirm-order-modal", () => ({
  useConfirmOrderModal: (renderContent: () => JSX.Element) => {
    mockRenderConfirmModal = renderContent;
    return { openModal: jest.fn(), closeModal: jest.fn() };
  },
}));
jest.mock("./use-order-transaction", () => ({ useOrderTransaction: () => ({ submit: jest.fn() }) }));
const mockGetUsdPrice = jest.fn<string | null, [TokenModel | null]>(() => null);
let mockFundingBalance = "1000";
jest.mock("./use-order-form-common", () => ({
  getOrderButtonText: (_: string, __: unknown, placeOrderText: string) => placeOrderText,
  useOrderFormCommon: () => ({
    connected: true,
    isSwitchNetwork: false,
    switchNetwork: jest.fn(),
    copied: false,
    copyUrl: jest.fn(),
    getUsdPrice: (token: TokenModel | null) => mockGetUsdPrice(token),
    tokenABalance: mockFundingBalance,
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
    mockLimitConfig = undefined;
    mockFundingBalance = "1000";
    mockRenderConfirmModal = undefined;
    mockGetUsdPrice.mockReset().mockReturnValue(null);
    jest.mocked(useGetRoutes).mockImplementation(request => {
      if (!request?.inputToken || !request.outputToken || !request.tokenAmount) {
        return { data: undefined } as ReturnType<typeof useGetRoutes>;
      }
      const price = TOKEN_VALUE[request.inputToken.path] / TOKEN_VALUE[request.outputToken.path];
      const exactOut = request.exactType === "EXACT_OUT";
      const quoted = exactOut
        ? BigNumber(request.tokenAmount).dividedBy(price)
        : BigNumber(request.tokenAmount).multipliedBy(price);
      const amount = quoted
        .shiftedBy((exactOut ? request.inputToken : request.outputToken).decimals)
        .toFixed(0, exactOut ? BigNumber.ROUND_CEIL : BigNumber.ROUND_FLOOR);
      return { data: { status: "SUCCESS", amount } } as unknown as UseQueryResult<GetRoutesResponse, Error>;
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

  it("keeps the base asset while Buy reverses funding, applies a discount, and calculates the submitted output", async () => {
    mockGetUsdPrice.mockImplementation(token => (token?.path === tokenB.path ? "2" : "99"));
    const { result } = renderHook(() => useLimitOrderHandler(), { wrapper });
    act(() => result.current.changeTokenA(tokenA));
    act(() => result.current.changeTokenB(tokenB));
    await waitFor(() => expect(result.current.limitPrice).toBe("11"));
    act(() => result.current.changeSellAmount("3"));

    act(() => result.current.changeOrderSide("buy"));
    expect(result.current.tokenA).toEqual(tokenB);
    expect(result.current.tokenB).toEqual(tokenA);
    expect(result.current.sellAmount).toBe("");
    expect(result.current.marketPrice).toBe("10");
    expect(result.current.limitPrice).toBe("9");

    act(() => result.current.applyPreset(-5));
    expect(result.current.limitPrice).toBe("9.5");
    act(() => result.current.changeLimitPrice("6."));
    expect(result.current.limitPrice).toBe("6.");
    act(() => result.current.changeSellAmount("18"));
    expect(result.current.buyAmount).toBe("3");
    expect(result.current.limitPriceUsd).toBe("$12");
    const summary = (mockRenderConfirmModal?.() as React.ReactElement).props.summary as LimitOrderSummary;
    expect(summary).toMatchObject({ tokenIn: tokenB, tokenOut: tokenA, sellAmount: "18", buyAmount: "3" });

    act(() => result.current.changeOrderSide("sell"));
    expect(result.current.tokenA).toEqual(tokenA);
    expect(result.current.tokenB).toEqual(tokenB);
    expect(result.current.sellAmount).toBe("");
    expect(result.current.limitPrice).toBe("11");
  });

  it("computes the Buy market price directly from the quoted amounts before rounding", async () => {
    jest.mocked(useGetRoutes).mockImplementation(request => {
      if (!request?.inputToken || !request.outputToken || !request.tokenAmount) {
        return { data: undefined } as UseQueryResult<GetRoutesResponse, Error>;
      }
      const price = request.inputToken.path === tokenB.path ? 6 : 1 / 6;
      const exactOut = request.exactType === "EXACT_OUT";
      const quoted = exactOut
        ? BigNumber(request.tokenAmount).multipliedBy(price)
        : BigNumber(request.tokenAmount).dividedBy(price);
      return {
        data: {
          status: "SUCCESS",
          amount: quoted
            .shiftedBy((exactOut ? request.inputToken : request.outputToken).decimals)
            .toFixed(0, exactOut ? BigNumber.ROUND_CEIL : BigNumber.ROUND_FLOOR),
        },
      } as unknown as UseQueryResult<GetRoutesResponse, Error>;
    });
    const { result } = renderHook(() => useLimitOrderHandler(), { wrapper });
    act(() => {
      result.current.changeTokenA(tokenB);
      result.current.changeTokenB(tokenA);
      result.current.restoreOrderSide("buy");
      result.current.changeSellAmount("18");
    });

    // The quote is exactly 18 B -> 3 A. Inverting a pre-rounded 0.166666 B/A gives 6.00002 instead.
    await waitFor(() => expect(result.current.marketPrice).toBe("6"));
    expect(result.current.limitPrice).toBe("5.4");
    act(() => result.current.changeLimitPrice("6"));
    expect(result.current.buyAmount).toBe("3");
    const summary = (mockRenderConfirmModal?.() as React.ReactElement).props.summary as LimitOrderSummary;
    expect(summary.limitPriceDeviation).toBe(0);
  });

  it("restores a Buy link without reversing its input/output tokens again", async () => {
    const { result } = renderHook(() => useLimitOrderHandler(), { wrapper });
    act(() => {
      result.current.changeTokenA(tokenB);
      result.current.changeTokenB(tokenA);
      result.current.restoreOrderSide("buy");
      result.current.setLimitPrice("6");
      result.current.changeSellAmount("18");
    });
    await waitFor(() => expect(result.current.buyAmount).toBe("3"));
    expect(result.current.tokenA).toEqual(tokenB);
    expect(result.current.tokenB).toEqual(tokenA);
    expect(result.current.limitPrice).toBe("6");
  });

  describe("quantity-first Buy orders", () => {
    const renderBuy = async (outputToken: TokenModel = tokenA) => {
      const hook = renderHook(() => useLimitOrderHandler(), { wrapper });
      act(() => {
        hook.result.current.changeTokenA(tokenB);
        hook.result.current.changeTokenB(outputToken);
        hook.result.current.restoreOrderSide("buy");
        hook.result.current.setLimitPrice("6");
      });
      await waitFor(() => expect(hook.result.current.orderSide).toBe("buy"));
      return hook;
    };

    it("keeps the purchased quantity fixed while editing, clearing, or stepping the price", async () => {
      const { result } = await renderBuy();
      act(() => result.current.changeBuyAmount("3."));
      expect(result.current.buyAmount).toBe("3.");
      expect(result.current.sellAmount).toBe("18");
      expect(result.current.marketPrice).toBe("10");

      act(() => result.current.changeLimitPrice("7.5"));
      expect(result.current.buyAmount).toBe("3.");
      expect(result.current.sellAmount).toBe("22.5");
      act(() => result.current.stepPrice(1));
      expect(result.current.buyAmount).toBe("3.");
      expect(result.current.sellAmount).toBe("22.5225");

      act(() => result.current.changeLimitPrice(""));
      expect(result.current.buyAmount).toBe("3.");
      expect(result.current.sellAmount).toBe("");
      expect(result.current.buttonState).toBe("ENTER_AMOUNT");
      act(() => result.current.changeLimitPrice("6"));
      const summary = (mockRenderConfirmModal?.() as React.ReactElement).props.summary as LimitOrderSummary;
      expect(summary).toMatchObject({
        tokenIn: tokenB,
        tokenOut: tokenA,
        sellAmount: "18",
        buyAmount: "3",
        limitPrice: "1 A = 6 B",
      });
    });

    it.each([
      { quantity: "3", price: "6", balance: "10", funding: "18", state: "INSUFFICIENT_BALANCE" },
      { quantity: "100", price: "0.01", balance: "2", funding: "1", state: "PLACE_ORDER" },
    ])("checks the $funding funding cost against $balance, not the $quantity purchased units", async row => {
      mockFundingBalance = row.balance;
      const { result } = await renderBuy();
      act(() => {
        result.current.changeLimitPrice(row.price);
        result.current.changeBuyAmount(row.quantity);
      });
      expect(result.current.sellAmount).toBe(row.funding);
      expect(result.current.buttonState).toBe(row.state);
    });

    it("preserves 18 purchased decimals while funding rounds down at its own precision", async () => {
      const { result } = await renderBuy({ ...tokenA, decimals: 18 });
      act(() => result.current.changeBuyAmount("1.123456789123456789"));
      expect(result.current.buyAmount).toBe("1.123456789123456789");
      expect(result.current.sellAmount).toBe("6.74074");
      const summary = (mockRenderConfirmModal?.() as React.ReactElement).props.summary as LimitOrderSummary;
      expect(summary.buyAmount).toBe("1.123456789123456789");
      expect(summary.sellAmount).toBe("6.74074");
    });

    it("blocks a positive purchased quantity whose funding rounds to zero", async () => {
      const { result } = await renderBuy({ ...tokenA, decimals: 18 });
      act(() => result.current.changeBuyAmount("0.000000000000000001"));
      expect(result.current.buyAmount).toBe("0.000000000000000001");
      expect(result.current.sellAmount).toBe("0");
      expect(result.current.buttonState).toBe("AMOUNT_TOO_LOW");
    });

    it("keeps funding Max within its budget and lets a typed Buy quantity replace it", async () => {
      mockFundingBalance = "20";
      const { result } = await renderBuy();
      act(() => result.current.changeSellAmount("20"));
      expect(result.current.buyAmount).toBe("3.333333");
      expect(result.current.sellAmount).toBe("19.999998");
      expect(result.current.buttonState).toBe("PLACE_ORDER");
      act(() => result.current.changeLimitPrice("8"));
      expect(result.current.buyAmount).toBe("2.5");
      expect(result.current.sellAmount).toBe("20");

      act(() => result.current.changeBuyAmount("3"));
      expect(result.current.sellAmount).toBe("24");
      expect(result.current.buttonState).toBe("INSUFFICIENT_BALANCE");
      act(() => result.current.changeLimitPrice("6"));
      expect(result.current.sellAmount).toBe("18");
      expect(result.current.buyAmount).toBe("3");
      act(() => result.current.changeBuyAmount(""));
      expect(result.current.buyAmount).toBe("");
      expect(result.current.sellAmount).toBe("");
      expect(result.current.buttonState).toBe("ENTER_AMOUNT");
    });
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

  it("caps the Limit tolerance to the configured realm maximum", () => {
    mockLimitConfig = { maxSlippageBps: 250 };
    const { result } = renderHook(() => useLimitOrderHandler(), { wrapper });
    act(() => result.current.changeSlippage(30));

    expect(result.current.slippage).toBe(2.5);
    expect(result.current.maxSlippage).toBe(2.5);
  });

  it("keeps Limit tolerance and minimum received independent of Swap across tab remounts", () => {
    const store = createStore();
    store.set(CommonState.slippage, 5);
    const storeWrapper = ({ children }: { children: React.ReactNode }) => (
      <JotaiProvider store={store}>{children}</JotaiProvider>
    );
    const { result, unmount } = renderHook(() => useLimitOrderHandler(), { wrapper: storeWrapper });
    act(() => {
      result.current.changeTokenA(tokenA);
      result.current.changeTokenB(tokenB);
      result.current.changeSellAmount("10");
    });
    act(() => result.current.changeLimitPrice("2"));
    expect(result.current.slippage).toBe(0.5);
    expect(result.current.minimumReceived).toBe("19.9");

    act(() => store.set(CommonState.slippage, 10));
    expect(result.current.minimumReceived).toBe("19.9");
    act(() => result.current.changeSlippage(1));
    expect(result.current.slippage).toBe(1);
    expect(result.current.minimumReceived).toBe("19.8");
    expect(store.get(CommonState.slippage)).toBe(10);

    unmount();
    const remounted = renderHook(() => useLimitOrderHandler(), { wrapper: storeWrapper });
    expect(remounted.result.current.slippage).toBe(1);
    expect(remounted.result.current.minimumReceived).toBe("19.8");
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

  describe("the confirmation summary", () => {
    /** What the confirm modal is given, from the latest render. */
    const summary = () => (mockRenderConfirmModal?.() as React.ReactElement).props.summary as LimitOrderSummary;

    const renderWithPair = async () => {
      const hook = renderHook(() => useLimitOrderHandler(), { wrapper });
      act(() => hook.result.current.changeTokenA(tokenA));
      act(() => hook.result.current.changeTokenB(tokenB));
      // The +10% preset on a market price of 10.
      await waitFor(() => expect(hook.result.current.limitPrice).toBe("11"));
      return hook;
    };

    it("reports how far the limit price sits from the quoted market price", async () => {
      const { result } = await renderWithPair();
      expect(summary().limitPriceDeviation).toBe(0.1);

      act(() => result.current.changeLimitPrice("9.5"));
      expect(summary().limitPriceDeviation).toBe(-0.05);

      act(() => result.current.applyPreset(0));
      expect(summary().limitPriceDeviation).toBe(0);

      act(() => result.current.changeLimitPrice("12.5"));
      expect(summary().limitPriceDeviation).toBe(0.25);
    });

    it("keeps the Buy confirmation price and deviation in the form's base-token direction", async () => {
      const { result } = await renderWithPair();
      act(() => result.current.changeOrderSide("buy"));
      act(() => {
        result.current.changeLimitPrice("6");
        result.current.changeSellAmount("18");
      });

      expect(summary()).toMatchObject({
        tokenIn: tokenB,
        tokenOut: tokenA,
        sellAmount: "18",
        buyAmount: "3",
        limitPrice: "1 A = 6 B",
        limitPriceDeviation: -0.4,
      });
    });

    it("compares with the market price quoted for the amount being sold", async () => {
      jest.mocked(useGetRoutes).mockImplementation(request => {
        if (!request?.inputToken || !request.outputToken || !request.tokenAmount) {
          return { data: undefined } as ReturnType<typeof useGetRoutes>;
        }
        const rate = BigNumber(request.tokenAmount).isGreaterThan(10) ? "8" : "10";
        const amount = BigNumber(request.tokenAmount).multipliedBy(rate).shiftedBy(6).toFixed(0);
        return { data: { status: "SUCCESS", amount } } as unknown as ReturnType<typeof useGetRoutes>;
      });
      const { result } = await renderWithPair();
      act(() => result.current.changeLimitPrice("12"));
      expect(summary().limitPriceDeviation).toBe(0.2);

      // A larger order is quoted at a worse price, which moves the reference.
      act(() => result.current.changeSellAmount("20"));
      await waitFor(() => expect(result.current.marketPrice).toBe("8"));
      expect(summary().limitPriceDeviation).toBe(0.5);
    });

    it.each([
      ["has no quote yet", undefined],
      ["has no liquidity", { status: "NO_LIQUIDITY" }],
    ])("has no deviation while the router %s", (_, data) => {
      jest.mocked(useGetRoutes).mockImplementation(() => ({ data }) as unknown as ReturnType<typeof useGetRoutes>);
      const { result } = renderHook(() => useLimitOrderHandler(), { wrapper });
      act(() => result.current.changeTokenA(tokenA));
      act(() => result.current.changeTokenB(tokenB));
      act(() => result.current.changeLimitPrice("12"));

      expect(result.current.marketPrice).toBeNull();
      expect(summary().limitPriceDeviation).toBeNull();
    });
  });
});
