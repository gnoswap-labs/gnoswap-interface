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
jest.mock("./use-order-form-common", () => ({
  getOrderButtonText: (_: string, __: unknown, placeOrderText: string) => placeOrderText,
  useOrderFormCommon: () => ({
    connected: true,
    isSwitchNetwork: false,
    switchNetwork: jest.fn(),
    copied: false,
    copyUrl: jest.fn(),
    getUsdPrice: () => null,
    tokenABalance: "1000",
    tokenBBalance: "1000",
    isSameToken: false,
    formatUsd: () => "-",
    formatRate: () => ({ text: "-", usd: "-" }),
    formatNetworkFee: () => ({ text: "-", usd: "-" }),
  }),
}));
let mockLimitConfig: { maxSlippageBps?: number } | undefined;
jest.mock("@query/order", () => ({
  useGetLimitConfig: () => ({ data: mockLimitConfig, isLoading: false }),
  useEstimateOrderNetworkFee: () => ({ data: undefined }),
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
    jest.mocked(useGetRoutes).mockImplementation(request => {
      if (!request?.inputToken || !request.outputToken || !request.tokenAmount) {
        return { data: undefined } as ReturnType<typeof useGetRoutes>;
      }
      const price = TOKEN_VALUE[request.inputToken.path] / TOKEN_VALUE[request.outputToken.path];
      const amount = BigNumber(request.tokenAmount).multipliedBy(price).shiftedBy(6).toFixed(0);
      return { data: { status: "SUCCESS", amount } } as unknown as ReturnType<typeof useGetRoutes>;
    });
  });

  it.each([
    ["changeTokenB", (handler: ReturnType<typeof useLimitOrderHandler>) => handler.changeTokenB(tokenC)],
    ["changeTokenA", (handler: ReturnType<typeof useLimitOrderHandler>) => handler.changeTokenA(tokenD)],
  ])("drops an edited Buy amount on %s so Buy follows Sell at the new price", async (_, changeToken) => {
    const { result } = renderHook(() => useLimitOrderHandler(), { wrapper });

    act(() => result.current.changeTokenA(tokenA));
    act(() => result.current.changeTokenB(tokenB));
    await waitFor(() => expect(result.current.limitPrice).toBe("10"));

    act(() => result.current.changeBuyAmount("100"));
    expect(result.current.sellAmount).toBe("10");
    expect(result.current.buyAmount).toBe("100");

    act(() => changeToken(result.current));
    await waitFor(() => expect(["20", "40"]).toContain(result.current.limitPrice));

    const expectedBuy = BigNumber(result.current.sellAmount).multipliedBy(result.current.limitPrice);
    expect(BigNumber(result.current.buyAmount).isEqualTo(expectedBuy)).toBe(true);
  });

  it("keeps a cleared limit price empty until the user types a new one", async () => {
    const { result } = renderHook(() => useLimitOrderHandler(), { wrapper });

    act(() => result.current.changeTokenA(tokenA));
    act(() => result.current.changeTokenB(tokenB));
    await waitFor(() => expect(result.current.limitPrice).toBe("10"));

    act(() => result.current.changeLimitPrice(""));
    // Give the seeding effect a chance to run again.
    await act(async () => Promise.resolve());
    expect(result.current.limitPrice).toBe("");

    act(() => result.current.changeLimitPrice("12"));
    expect(result.current.limitPrice).toBe("12");
  });

  it("seeds the market price again for a new pair", async () => {
    const { result } = renderHook(() => useLimitOrderHandler(), { wrapper });

    act(() => result.current.changeTokenA(tokenA));
    act(() => result.current.changeTokenB(tokenB));
    await waitFor(() => expect(result.current.limitPrice).toBe("10"));

    act(() => result.current.changeLimitPrice(""));
    act(() => result.current.changeTokenB(tokenC));
    await waitFor(() => expect(result.current.limitPrice).toBe("20"));
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
        wrapper: ({ children }: { children: React.ReactNode }) => <JotaiProvider store={store}>{children}</JotaiProvider>,
      });

    const priceAtoB = async (store: ReturnType<typeof createStore>, price: string) => {
      const first = renderInStore(store);
      act(() => first.result.current.changeTokenA(tokenA));
      act(() => first.result.current.changeTokenB(tokenB));
      await waitFor(() => expect(first.result.current.limitPrice).toBe("10"));
      act(() => first.result.current.changeLimitPrice(price));
      act(() => first.result.current.changeSellAmount("10"));
      first.unmount();
    };

    it("is reseeded from the market price when another mode changed the pair", async () => {
      const store = createStore();
      await priceAtoB(store, "10");

      // Swap or DCA changes the shared output token to C (A/C market price 20).
      store.set(SwapState.swap, prev => ({ ...prev, tokenB: tokenC }));
      const { result } = renderInStore(store);

      await waitFor(() => expect(result.current.limitPrice).toBe("20"));
      expect(result.current.buyAmount).toBe("200");
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
    });
  });
});
