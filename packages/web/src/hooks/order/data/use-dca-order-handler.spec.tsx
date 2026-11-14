import { act, render, renderHook } from "@testing-library/react";
import BigNumber from "bignumber.js";
import { Provider as JotaiProvider } from "jotai";
import React from "react";

import type { TokenModel } from "@models/token/token-model";
import { useGetPoolList } from "@query/pools";

import { useDcaOrderHandler } from "./use-dca-order-handler";

jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
// Debounce is skipped unless a test opts into the real one.
jest.mock("@hooks/common/use-debounce", () => {
  const actual = jest.requireActual("@hooks/common/use-debounce");
  return {
    __esModule: true,
    default: <T,>(value: T, delay: number) => (mockState.realDebounce ? actual.default(value, delay) : value),
  };
});
const mockSendCreateDcaOrder = jest.fn().mockResolvedValue({ code: 0 });
const mockMakeCreateDcaOrderMessages = jest.fn().mockResolvedValue([]);
const mockState: {
  config:
    | {
        maxExecutionCount?: number;
        minAmountPerExecution?: string;
        whitelistedPools?: string[];
        halted?: { execute: boolean };
        executionFeeBps?: number;
      }
    | undefined;
  configError: boolean;
  refetchConfig: jest.Mock;
  /** Settings the pair endpoint serves for any direction; `undefined` while loading. */
  pair: { minAmountPerExecution: string; priceLimit: object | null; supported: boolean } | undefined;
  pairError: boolean;
  refetchPair: jest.Mock;
  scheduleCounts: number[];
  scheduleIntervals: number[];
  realDebounce: boolean;
  /** Answers the schedule refetch made right before sending; resolves at once by default. */
  refetchSchedule: (() => Promise<unknown>) | null;
  balance: string;
  modalOpened: boolean;
  closeModal: jest.Mock;
  renderConfirm: (() => React.ReactNode) | null;
  confirmProps: { summary: { executionCount: number }; isLoading?: boolean; confirm: () => void } | null;
} = {
  config: undefined,
  configError: false,
  refetchConfig: jest.fn(),
  pair: undefined,
  pairError: false,
  refetchPair: jest.fn(),
  scheduleCounts: [],
  scheduleIntervals: [],
  realDebounce: false,
  refetchSchedule: null,
  balance: "1000",
  modalOpened: false,
  closeModal: jest.fn(),
  renderConfirm: null,
  confirmProps: null,
};

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({
    orderRepository: { sendCreateDcaOrder: mockSendCreateDcaOrder, makeCreateDcaOrderMessages: mockMakeCreateDcaOrderMessages },
  }),
}));
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
    return { opened: mockState.modalOpened, openModal: jest.fn(), closeModal: mockState.closeModal };
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
    tokenABalance: mockState.balance,
    isSameToken: false,
    formatUsd: () => "-",
    formatRate: (rate: string | null) => ({ text: rate ?? "-", usd: "-" }),
  }),
}));
jest.mock("@query/order", () => ({
  useGetDcaConfig: () => ({
    data: mockState.config,
    isLoading: false,
    isError: mockState.configError,
    refetch: mockState.refetchConfig,
  }),
  useGetDcaPair: (request: { inputToken: string; outputToken: string } | null) => ({
    data: request ? mockState.pair : undefined,
    isError: mockState.pairError,
    refetch: mockState.refetchPair,
  }),
  useGetDcaSchedule: (request: { executionCount: number; interval: number } | null) => {
    if (request) mockState.scheduleCounts.push(request.executionCount);
    if (request) mockState.scheduleIntervals.push(request.interval);
    // A slot in [0, interval) of the requested interval.
    const data = { slotOffset: request?.interval === 86400 ? 3600 : 0, firstExecutionAt: 1, estimatedEndAt: 2 };
    return { data, isFetching: false, refetch: mockState.refetchSchedule ?? (() => Promise.resolve({ data })) };
  },
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

const PRICE_LIMIT = { minOutputPerInputX128: "340282366920938463463374607431768211456", updatedAt: 1 };
/** A direction with a whitelisted pool and a price limit, and the 1-unit global minimum. */
const SUPPORTED_PAIR = { minAmountPerExecution: "1", priceLimit: PRICE_LIMIT, supported: true };

beforeEach(() => {
  mockState.pair = SUPPORTED_PAIR;
  mockState.pairError = false;
  mockState.refetchPair = jest.fn();
});

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

describe("useDcaOrderHandler confirmation", () => {
  beforeEach(() => {
    mockState.configError = false;
    mockState.config = { maxExecutionCount: 10, minAmountPerExecution: "1", whitelistedPools };
    mockPoolList({ data: undefined, isError: false });
    mockState.balance = "1000";
    mockState.modalOpened = true;
    mockState.closeModal = jest.fn();
    mockState.refetchSchedule = null;
    mockState.confirmProps = null;
    mockSendCreateDcaOrder.mockClear();
  });

  afterEach(() => {
    mockState.config = undefined;
    mockState.balance = "1000";
    mockState.modalOpened = false;
    mockState.refetchSchedule = null;
  });

  /** A 10 A / 2 round order (5 A per round) with its confirmation open. */
  const openConfirmation = () => {
    const hook = renderHook(() => useDcaOrderHandler(), { wrapper });
    act(() => hook.result.current.changeTokenA(tokenA));
    act(() => hook.result.current.changeTokenB(tokenB));
    act(() => hook.result.current.changeSellAmount("10"));
    act(() => hook.result.current.setExecutionCountInput("2"));
    expect(hook.result.current.buttonState).toBe("PLACE_ORDER");
    return hook;
  };

  const confirm = async () => {
    render(<>{mockState.renderConfirm?.()}</>);
    await act(async () => {
      mockState.confirmProps?.confirm();
      await Promise.resolve();
    });
  };

  it("sends a valid order", async () => {
    openConfirmation();
    await confirm();
    expect(mockSendCreateDcaOrder).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["the balance drops", "INSUFFICIENT_BALANCE", () => (mockState.balance = "0")],
    [
      "execution is halted",
      "ORDER_PAUSED",
      () => (mockState.config = { ...mockState.config, halted: { execute: true } }),
    ],
    [
      "the per-round minimum rises above the round amount",
      "AMOUNT_TOO_LOW",
      () => (mockState.config = { ...mockState.config, minAmountPerExecution: "6000000" }),
    ],
  ])("closes the confirmation and sends nothing once %s", async (_, state, change) => {
    const { result, rerender } = openConfirmation();

    change();
    rerender();
    expect(result.current.buttonState).toBe(state);
    expect(mockState.closeModal).toHaveBeenCalled();

    await confirm();
    expect(mockState.confirmProps?.isLoading).toBe(true);
    expect(mockSendCreateDcaOrder).not.toHaveBeenCalled();
  });

  it("sends nothing when the form turns invalid while the schedule refreshes", async () => {
    let resolveSchedule: (value: unknown) => void = () => undefined;
    mockState.refetchSchedule = () => new Promise(resolve => (resolveSchedule = resolve));
    const { rerender } = openConfirmation();

    await confirm();
    mockState.balance = "0";
    rerender();
    await act(async () => {
      resolveSchedule({ data: { slotOffset: 0, firstExecutionAt: 1, estimatedEndAt: 2 } });
      await Promise.resolve();
    });

    expect(mockSendCreateDcaOrder).not.toHaveBeenCalled();
  });
});

describe("useDcaOrderHandler schedule of the current form", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockState.realDebounce = true;
    mockState.configError = false;
    mockState.config = { maxExecutionCount: 10, minAmountPerExecution: "1", whitelistedPools };
    mockPoolList({ data: undefined, isError: false });
    mockState.scheduleIntervals = [];
    mockState.confirmProps = null;
    mockSendCreateDcaOrder.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
    mockState.realDebounce = false;
    mockState.config = undefined;
  });

  const confirm = async () => {
    render(<>{mockState.renderConfirm?.()}</>);
    await act(async () => {
      mockState.confirmProps?.confirm();
      await Promise.resolve();
    });
  };

  it("never confirms or sends a slot scheduled for the previous interval", async () => {
    const { result } = renderHook(() => useDcaOrderHandler(), { wrapper });
    act(() => result.current.changeTokenA(tokenA));
    act(() => result.current.changeTokenB(tokenB));
    act(() => result.current.changeSellAmount("10"));
    act(() => result.current.setExecutionCountInput("2"));
    act(() => result.current.changeInterval(86400));
    act(() => jest.advanceTimersByTime(300));
    expect(mockState.scheduleIntervals.at(-1)).toBe(86400);

    // Day's slot is 3600; switching to Minute leaves it attached until the debounce settles.
    act(() => result.current.changeInterval(60));
    expect(mockState.scheduleIntervals.at(-1)).toBe(86400);
    expect(result.current.buttonState).toBe("PLACE_ORDER");

    await confirm();
    expect(mockState.confirmProps?.isLoading).toBe(true);
    expect(mockSendCreateDcaOrder).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(300));
    await confirm();
    expect(mockSendCreateDcaOrder).toHaveBeenCalledTimes(1);
    expect(mockSendCreateDcaOrder.mock.calls[0][0]).toMatchObject({ interval: 60, slotOffset: 0 });
  });

  it("prices native Max only with the schedule of the current request", async () => {
    const { result } = renderHook(() => useDcaOrderHandler(), { wrapper });
    act(() => result.current.changeTokenA(tokenA));
    act(() => result.current.changeTokenB(tokenB));
    act(() => result.current.setExecutionCountInput("2"));
    act(() => result.current.changeInterval(86400));
    act(() => jest.advanceTimersByTime(300));
    expect(result.current.isMaxAmountReady).toBe(true);
    const daySubject = result.current.maxAmountDependsOn;

    // Minute is chosen; Day's slot 3600 stays attached until the debounce settles.
    act(() => result.current.changeInterval(60));
    expect(result.current.isMaxAmountReady).toBe(false);
    const makeMessages = mockMakeCreateDcaOrderMessages as jest.Mock;
    makeMessages.mockClear();
    await expect(result.current.makeMaxAmountMessages("10000000")).resolves.toEqual([]);
    expect(makeMessages).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(300));
    expect(result.current.isMaxAmountReady).toBe(true);
    // The slot is part of what the estimate was priced for.
    expect(result.current.maxAmountDependsOn).not.toEqual(daySubject);
    expect(result.current.maxAmountDependsOn).toContain(0);
    await result.current.makeMaxAmountMessages("10000000");
    expect(makeMessages).toHaveBeenCalledWith(expect.objectContaining({ interval: 60, slotOffset: 0 }));
  });
});

describe("useDcaOrderHandler execution fee", () => {
  afterEach(() => {
    mockState.config = undefined;
  });

  it("quotes the owner rate net of the execution fee and shows the fee", () => {
    mockState.configError = false;
    mockState.config = { whitelistedPools, executionFeeBps: 15 };
    mockPoolList({ data: undefined, isError: false });

    // The router returns 5 B for one 5 A execution; the realm keeps 0.15% of it.
    const result = renderWithPair(tokenB);
    act(() => result.current.setExecutionCountInput("2"));

    expect(result.current.summary).toMatchObject({ rate: "0.9985", executionFee: "0.15%" });
  });
});

describe("useDcaOrderHandler pair settings", () => {
  beforeEach(() => {
    mockState.configError = false;
    mockState.config = { maxExecutionCount: 10, minAmountPerExecution: "1", whitelistedPools };
    mockPoolList({ data: undefined, isError: false });
    mockState.refetchConfig = jest.fn();
    mockState.refetchSchedule = null;
    mockState.confirmProps = null;
    mockSendCreateDcaOrder.mockClear();
  });

  afterEach(() => {
    mockState.config = undefined;
  });

  const confirm = async () => {
    render(<>{mockState.renderConfirm?.()}</>);
    await act(async () => {
      mockState.confirmProps?.confirm();
      await Promise.resolve();
    });
  };

  /** 10 A over 2 rounds: 5 A (5,000,000 raw) per round. */
  const renderOrder = () => {
    const result = renderWithPair(tokenB);
    act(() => result.current.setExecutionCountInput("2"));
    return result;
  };

  it("applies the input token's minimum instead of the global one", () => {
    mockState.pair = { ...SUPPORTED_PAIR, minAmountPerExecution: "6000000" };
    const result = renderOrder();

    expect(result.current.buttonState).toBe("AMOUNT_TOO_LOW");
    expect(result.current.minTradingText).toBe("Swap:dca.minTrading");
    // floor(10,000,000 / 6,000,000) rounds fit the per-token minimum.
    expect(result.current.maxExecutionCount).toBe(1);
  });

  it("keeps the global minimum as the floor while the pair settings load, and sends nothing", async () => {
    mockState.pair = undefined;
    mockState.config = { ...mockState.config, minAmountPerExecution: "6000000" };
    expect(renderOrder().current.buttonState).toBe("AMOUNT_TOO_LOW");

    mockState.config = { ...mockState.config, minAmountPerExecution: "1" };
    const result = renderOrder();
    // No error flashes while loading, but the order waits for the pair settings.
    expect(result.current.buttonState).toBe("PLACE_ORDER");
    await confirm();
    expect(mockState.confirmProps?.isLoading).toBe(true);
    expect(mockSendCreateDcaOrder).not.toHaveBeenCalled();
  });

  it.each([
    ["has no price limit", { ...SUPPORTED_PAIR, priceLimit: null }],
    ["is not supported", { ...SUPPORTED_PAIR, supported: false }],
  ])("blocks a whitelisted pair whose direction %s", (_, pair) => {
    mockState.pair = pair;
    const result = renderOrder();
    expect(result.current.buttonState).toBe("NO_WHITELISTED_POOL");
    expect(result.current.buttonText).toBe("NO_WHITELISTED_POOL");
  });

  it("sends the order once the pair settings are known", async () => {
    renderOrder();
    await confirm();
    expect(mockSendCreateDcaOrder).toHaveBeenCalledTimes(1);
  });

  it("blocks the order and retries the pair settings when they fail without a cache", () => {
    mockState.pair = undefined;
    mockState.pairError = true;
    const result = renderOrder();

    expect(result.current.buttonState).toBe("POOL_CHECK_FAILED");
    act(() => result.current.onClickButton());
    expect(mockState.refetchPair).toHaveBeenCalledTimes(1);
    expect(mockState.refetchConfig).not.toHaveBeenCalled();
  });

  it("checks only the pool with an order-api from before the pair endpoint", () => {
    mockState.config = { maxExecutionCount: 10, minAmountPerExecution: "1" };
    mockPoolList({ data: [{ poolPath: `${tokenA.path}:${tokenB.path}:3000` }], isError: false });
    mockState.pair = undefined;
    mockState.pairError = true;

    expect(renderOrder().current.buttonState).toBe("PLACE_ORDER");
  });
});
