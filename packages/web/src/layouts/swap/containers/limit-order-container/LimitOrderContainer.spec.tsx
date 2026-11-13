import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createStore, Provider as JotaiProvider } from "jotai";
import type { ComponentProps } from "react";

import type { TokenModel } from "@models/token/token-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { OrderState, SwapState } from "@states/index";

import LimitOrderContainer from "./LimitOrderContainer";

let mockQuery: Record<string, string | string[] | undefined> = {};
let mockTokens: TokenModel[] = [];
let mockConfirmContent: (() => unknown) | undefined;
const mockSendCreateLimitOrder = jest.fn(() => Promise.resolve({}));
const mockSubmit = jest.fn(({ send }: { send: () => unknown }) => send());
const mockGetUsdPrice = jest.fn((_token: TokenModel | null): string | null => null);

jest.mock("@hooks/common/use-custom-router", () => ({
  __esModule: true,
  default: () => ({ query: mockQuery }),
}));
jest.mock("@query/token", () => ({ useGetTokens: () => ({ data: { tokens: mockTokens } }) }));
jest.mock("@hooks/common/use-debounce", () => ({ __esModule: true, default: <T,>(value: T) => value }));
jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ orderRepository: { sendCreateLimitOrder: mockSendCreateLimitOrder } }),
  useOptionalGnoswapContext: () => null,
}));
jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));
jest.mock("@hooks/wallet/ui/use-connect-wallet-modal", () => ({
  useConnectWalletModal: () => ({ openModal: jest.fn() }),
}));
jest.mock("@hooks/order/data/use-order-transaction", () => ({ useOrderTransaction: () => ({ submit: mockSubmit }) }));
jest.mock("@hooks/order/ui/use-confirm-order-modal", () => ({
  useConfirmOrderModal: (renderContent: () => unknown) => {
    mockConfirmContent = renderContent;
    return { openModal: jest.fn(), closeModal: jest.fn() };
  },
}));
jest.mock("@query/order", () => ({ useGetLimitConfig: () => ({ data: undefined, isLoading: false }) }));
jest.mock("@query/router", () => ({
  useGetRoutes: (
    request: { inputToken: TokenModel; outputToken: TokenModel; tokenAmount: string } | null,
    _options: unknown,
  ) => ({
    data: request ? { status: "SUCCESS", amount: `${Number(request.tokenAmount) * 100_000}` } : undefined,
  }),
}));
jest.mock("@hooks/order/data/use-order-form-common", () => ({
  getOrderButtonText: (_state: string, _t: unknown, text: string) => text,
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
    formatRate: (value: string | null) => ({ text: value ?? "-", usd: "-" }),
  }),
}));

const token = (symbol: string): TokenModel => ({
  type: "GRC20",
  chainId: "",
  createdAt: "",
  name: symbol,
  path: `gno.land/r/demo/${symbol.toLowerCase()}`,
  decimals: 6,
  symbol,
  displaySymbol: symbol,
  logoURI: "",
  priceID: symbol,
});
const tokenA = token("A");
const tokenB = token("B");
const renderContainer = (store: NonNullable<ComponentProps<typeof JotaiProvider>["store"]>) =>
  render(
    <JotaiProvider store={store}>
      <GnoswapThemeProvider>
        <LimitOrderContainer swapType="limit" changeSwapType={jest.fn()} />
      </GnoswapThemeProvider>
    </JotaiProvider>,
  );

beforeEach(() => {
  mockQuery = {};
  mockTokens = [tokenA, tokenB];
  mockGetUsdPrice.mockReset();
  mockConfirmContent = undefined;
  mockSendCreateLimitOrder.mockClear();
  mockSubmit.mockClear();
});

describe("LimitOrderContainer query restoration", () => {
  it("keeps a Buy form's side, pair-bound manual price, and amount on a same-store remount without side in the query", async () => {
    const store = createStore();
    mockQuery = { from: tokenB.path, to: tokenA.path, side: "buy", amount: "18", price: "6" };

    const first = renderContainer(store);
    await waitFor(() => expect(screen.getByDisplayValue("18")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByDisplayValue("3")).toBeInTheDocument());
    expect(screen.getByDisplayValue("6")).toBeInTheDocument();
    expect(store.get(OrderState.limitOrderSide)).toBe("buy");
    expect(store.get(SwapState.swap).tokenA?.path).toBe(tokenB.path);
    expect(store.get(SwapState.swap).tokenB?.path).toBe(tokenA.path);

    first.unmount();
    mockQuery = { from: tokenB.path, to: tokenA.path };
    renderContainer(store);

    await waitFor(() => expect(store.get(OrderState.limitOrderSide)).toBe("buy"));
    expect(store.get(SwapState.swap).tokenA?.path).toBe(tokenB.path);
    expect(store.get(SwapState.swap).tokenB?.path).toBe(tokenA.path);
    expect(screen.getByDisplayValue("18")).toBeInTheDocument();
    expect(screen.getByDisplayValue("3")).toBeInTheDocument();
    expect(screen.getByDisplayValue("6")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Swap:dca.placeOrder" }));
    const confirmation = mockConfirmContent?.() as { props: { confirm: () => void } };
    act(() => confirmation.props.confirm());
    await waitFor(() =>
      expect(mockSendCreateLimitOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          tokenIn: tokenB,
          tokenOut: tokenA,
          baseToken: tokenA,
          makingAmount: "18000000",
          takingAmount: "3000000",
        }),
      ),
    );
  });

  it("leaves a fresh legacy link without side at the existing Sell default", async () => {
    const store = createStore();
    mockQuery = { from: tokenB.path, to: tokenA.path, amount: "18", price: "6" };

    renderContainer(store);

    await waitFor(() => expect(screen.getByDisplayValue("18")).toBeInTheDocument());
    expect(store.get(OrderState.limitOrderSide)).toBe("sell");
    expect(screen.getByDisplayValue("6")).toBeInTheDocument();
    expect(screen.getByDisplayValue("108")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Swap:dca.placeOrder" }));
    const confirmation = mockConfirmContent?.() as { props: { confirm: () => void } };
    act(() => confirmation.props.confirm());
    await waitFor(() =>
      expect(mockSendCreateLimitOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          tokenIn: tokenB,
          tokenOut: tokenA,
          baseToken: tokenB,
          makingAmount: "18000000",
          takingAmount: "108000000",
        }),
      ),
    );
  });
});
