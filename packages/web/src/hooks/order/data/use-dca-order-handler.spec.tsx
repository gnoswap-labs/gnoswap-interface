import { act, render, renderHook } from "@testing-library/react";
import BigNumber from "bignumber.js";
import { Provider as JotaiProvider } from "jotai";
import React from "react";

import type { TokenModel } from "@models/token/token-model";
import { useGetPoolList } from "@query/pools";

import { useDcaOrderHandler } from "./use-dca-order-handler";

jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
jest.mock("@hooks/common/use-debounce", () => ({ __esModule: true, default: <T,>(value: T) => value }));
const mockSendCreateDcaOrder = jest.fn().mockResolvedValue({ code: 0 });
const mockState: {
  config: { maxExecutionCount?: number; minAmountPerExecution?: string; whitelistedPools?: string[] } | undefined;
  configError: boolean;
  refetchConfig: jest.Mock;
  scheduleCounts: number[];
  renderConfirm: (() => React.ReactNode) | null;
  confirmProps: { summary: { executionCount: number }; confirm: () => void } | null;
} = {
  config: undefined,
  configError: false,
  refetchConfig: jest.fn(),
  scheduleCounts: [],
  renderConfirm: null,
  confirmProps: null,
};

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({
    orderRepository: { sendCreateDcaOrder: mockSendCreateDcaOrder, makeCreateDcaOrderMessages: jest.fn() },
  }),
}));
jest.mock("@hooks/common/use-slippage", () => ({ useSlippage: () => ({ slippage: 0.5, changeSlippage: jest.fn() }) }));
jest.mock("@hooks/wallet/ui/use-connect-wallet-modal", () => ({
  useConnectWalletModal: () => ({ openModal: jest.fn() }),
}));
jest.mock("@components/order/confirm-dca-order-modal/ConfirmDcaOrderModal", () => ({
  __esModule: true,
  default: (props: NonNullable<typeof mockState.confirmProps>) => {
    mockState.confirmProps = props;
    return null;
  },
}));
jest.mock("../ui/use-confirm-order-modal", () => ({
  useConfirmOrderModal: (renderModal: () => React.ReactNode) => {
    mockState.renderConfirm = renderModal;
    return { openModal: jest.fn(), closeModal: jest.fn() };
  },
}));
jest.mock("./use-order-transaction", () => ({
  useOrderTransaction: () => ({ submit: ({ send }: { send: () => Promise<unknown> }) => send() }),
}));
jest.mock("./use-order-form-common", () => ({
  getOrderButtonText: (state: string, _: unknown, placeOrderText: string) =>
    state === "PLACE_ORDER" ? placeOrderText : state,
  useOrderFormCommon: () => ({
    connected: true,
    isSwitchNetwork: false,
    switchNetwork: jest.fn(),
    copied: false,
    copyUrl: jest.fn(),
    getUsdPrice: () => null,
    tokenABalance: "1000",
    isSameToken: false,
    formatUsd: () => "-",
    formatRate: () => ({ text: "-", usd: "-" }),
    formatNetworkFee: () => ({ text: "-", usd: "-" }),
  }),
}));
jest.mock("@query/order", () => ({
  useGetDcaConfig: () => ({
    data: mockState.config,
    isLoading: false,
    isError: mockState.configError,
    refetch: mockState.refetchConfig,
  }),
  useGetDcaSchedule: (request: { executionCount: number } | null) => {
    if (request) mockState.scheduleCounts.push(request.executionCount);
    const data = { slotOffset: 0, firstExecutionAt: 1, estimatedEndAt: 2 };
    return { data, isFetching: false, refetch: () => Promise.resolve({ data }) };
  },
  useEstimateOrderNetworkFee: () => ({ data: undefined, isFetching: false }),
}));
jest.mock("@query/pools", () => ({ useGetPoolList: jest.fn() }));
// The router always finds a (possibly multi-hop) route.
jest.mock("@query/router", () => ({
  useGetRoutes: (request: { tokenAmount: string } | null) => ({
    data: request ? { status: "SUCCESS", amount: BigNumber(request.tokenAmount).shiftedBy(6).toFixed(0) } : undefined,
  }),
}));

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
// A/B has a whitelisted pool; A/C is only reachable through B. An A/D pool exists
// but is not whitelisted, so it is not listed.
const whitelistedPools = [`${tokenA.path}:${tokenB.path}:3000`, `${tokenB.path}:${tokenC.path}:500`];
/** Serves the whitelist in the DCA config; `undefined` means no config is cached. */
const mockWhitelist = ({ data, isError }: { data?: string[]; isError: boolean }) => {
  mockState.config = data ? { whitelistedPools: data } : undefined;
  mockState.configError = isError;
};

const wrapper = ({ children }: { children: React.ReactNode }) => <JotaiProvider>{children}</JotaiProvider>;

const renderWithPair = (output: TokenModel) => {
  const { result } = renderHook(() => useDcaOrderHandler(), { wrapper });
  act(() => result.current.changeTokenA(tokenA));
  act(() => result.current.changeTokenB(output));
  act(() => result.current.changeSellAmount("10"));
  return result;
};

const mockPoolList = (value: { data?: { poolPath: string }[]; isError: boolean; refetch?: () => unknown }) =>
  jest
    .mocked(useGetPoolList)
    .mockReturnValue({ refetch: jest.fn(), ...value } as unknown as ReturnType<typeof useGetPoolList>);

describe("useDcaOrderHandler whitelisted pool requirement", () => {
  beforeEach(() => {
    mockWhitelist({ data: whitelistedPools, isError: false });
    mockPoolList({ data: undefined, isError: false });
  });

  it("does not read the pool list while the config reports the whitelist", () => {
    renderWithPair(tokenB);
    expect(jest.mocked(useGetPoolList).mock.calls.at(-1)?.[0]).toMatchObject({ enabled: false });
  });

  it("allows Place Order for a pair with a whitelisted pool", () => {
    expect(renderWithPair(tokenB).current.buttonState).toBe("PLACE_ORDER");
  });

  it("blocks Place Order when the router only has a multi-hop route", () => {
    const result = renderWithPair(tokenC);
    expect(result.current.buttonState).toBe("NO_WHITELISTED_POOL");
    expect(result.current.buttonText).toBe("NO_WHITELISTED_POOL");
  });

  it("blocks Place Order for a pair whose pools are not whitelisted", () => {
    expect(renderWithPair(tokenD).current.buttonState).toBe("NO_WHITELISTED_POOL");
  });

  it("enables Place Order once the keeper whitelists the pair", () => {
    mockWhitelist({ data: [], isError: false });
    const result = renderWithPair(tokenB);
    expect(result.current.buttonState).toBe("NO_WHITELISTED_POOL");

    mockWhitelist({ data: whitelistedPools, isError: false });
    act(() => result.current.changeSellAmount("11"));
    expect(result.current.buttonState).toBe("PLACE_ORDER");
  });

  describe("when the whitelist fails to load", () => {
    it("keeps answering the check from a cached list", () => {
      mockWhitelist({ data: whitelistedPools, isError: true });

      expect(renderWithPair(tokenC).current.buttonState).toBe("NO_WHITELISTED_POOL");
      expect(renderWithPair(tokenB).current.buttonState).toBe("PLACE_ORDER");
    });

    it("blocks the order and retries the check without a cached list", () => {
      mockWhitelist({ data: undefined, isError: true });
      const refetch = mockState.refetchConfig;
      refetch.mockClear();

      const result = renderWithPair(tokenC);
      expect(result.current.buttonState).toBe("POOL_CHECK_FAILED");
      expect(result.current.buttonText).toBe("POOL_CHECK_FAILED");

      act(() => result.current.onClickButton());
      expect(refetch).toHaveBeenCalledTimes(1);
    });
  });
});

describe("useDcaOrderHandler with an order-api from before the whitelist", () => {
  // A/B and A/D have pools of their own; A/C is only reachable through B.
  const pools = [
    { poolPath: `${tokenA.path}:${tokenB.path}:3000` },
    { poolPath: `${tokenA.path}:${tokenD.path}:500` },
    { poolPath: `${tokenB.path}:${tokenC.path}:500` },
  ];

  beforeEach(() => {
    mockState.config = { maxExecutionCount: 10, minAmountPerExecution: "1" };
    mockState.configError = false;
    mockPoolList({ data: pools, isError: false });
  });

  afterEach(() => {
    mockState.config = undefined;
  });

  it("falls back to requiring a pool of the pair's own", () => {
    expect(renderWithPair(tokenB).current.buttonState).toBe("PLACE_ORDER");
    expect(renderWithPair(tokenD).current.buttonState).toBe("PLACE_ORDER");
    expect(renderWithPair(tokenC).current.buttonState).toBe("NO_WHITELISTED_POOL");
    expect(jest.mocked(useGetPoolList).mock.calls.at(-1)?.[0]).toMatchObject({ enabled: true });
  });

  it("retries the pool list when it fails without a cached list", () => {
    const refetch = jest.fn();
    mockPoolList({ data: undefined, isError: true, refetch });

    const result = renderWithPair(tokenB);
    expect(result.current.buttonState).toBe("POOL_CHECK_FAILED");

    act(() => result.current.onClickButton());
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});

describe("useDcaOrderHandler execution count cap", () => {
  beforeEach(() => {
    mockState.configError = false;
    mockState.config = { maxExecutionCount: 10, minAmountPerExecution: "1", whitelistedPools };
    mockPoolList({ data: undefined, isError: false });
    mockState.scheduleCounts = [];
    mockState.renderConfirm = null;
    mockState.confirmProps = null;
    mockSendCreateDcaOrder.mockClear();
  });

  afterEach(() => {
    mockState.config = undefined;
  });

  it("never schedules, confirms or sends a restored count above the realm max", async () => {
    const result = renderWithPair(tokenB);

    // A shared link restores `count` straight into the state, without the input's blur clamp.
    act(() => result.current.setExecutionCountInput("11"));

    expect(result.current.executionCountInput).toBe("10");
    expect(result.current.buttonState).toBe("PLACE_ORDER");
    expect(Math.max(...mockState.scheduleCounts)).toBeLessThanOrEqual(10);

    render(<>{mockState.renderConfirm?.()}</>);
    expect(mockState.confirmProps?.summary.executionCount).toBe(10);

    await act(async () => {
      mockState.confirmProps?.confirm();
      await Promise.resolve();
    });
    expect(mockSendCreateDcaOrder).toHaveBeenCalledTimes(1);
    expect(mockSendCreateDcaOrder.mock.calls[0][0]).toMatchObject({ executionCount: 10 });
  });

  it("blocks a count above the sell-based cap as Amount Too Low", () => {
    const { result } = renderHook(() => useDcaOrderHandler(), { wrapper });
    act(() => result.current.changeTokenA(tokenA));
    act(() => result.current.changeTokenB(tokenB));
    // 0.000005 A is 5 raw units: with a 1-unit minimum at most 5 executions fit.
    act(() => result.current.changeSellAmount("0.000005"));
    act(() => result.current.setExecutionCountInput("8"));

    expect(result.current.maxExecutionCount).toBe(5);
    expect(result.current.buttonState).toBe("AMOUNT_TOO_LOW");
  });
});
