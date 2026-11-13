import { act, renderHook } from "@testing-library/react";
import BigNumber from "bignumber.js";
import { Provider as JotaiProvider } from "jotai";
import React from "react";

import type { TokenModel } from "@models/token/token-model";

import { useDcaOrderHandler } from "./use-dca-order-handler";
import { useLimitOrderHandler } from "./use-limit-order-handler";

const mockMakeCreateDcaOrderMessages = jest.fn().mockResolvedValue([{ func: "CreateOrder" }]);
const mockMakeCreateLimitOrderMessages = jest.fn().mockResolvedValue([{ func: "CreateOrder" }]);

jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
jest.mock("@hooks/common/use-debounce", () => ({ __esModule: true, default: <T,>(value: T) => value }));
jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({
    orderRepository: {
      makeCreateDcaOrderMessages: mockMakeCreateDcaOrderMessages,
      makeCreateLimitOrderMessages: mockMakeCreateLimitOrderMessages,
    },
  }),
}));
jest.mock("@hooks/wallet/ui/use-connect-wallet-modal", () => ({
  useConnectWalletModal: () => ({ openModal: jest.fn() }),
}));
jest.mock("@components/order/confirm-dca-order-modal/ConfirmDcaOrderModal", () => ({
  __esModule: true,
  default: () => null,
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
  }),
}));
jest.mock("@query/order", () => ({
  useGetDcaConfig: () => ({ data: { whitelistedPools: [] }, isLoading: false, isError: false, refetch: jest.fn() }),
  useGetDcaPair: () => ({ data: undefined, isError: false, refetch: jest.fn() }),
  useGetDcaSchedule: () => ({
    data: { slotOffset: 120, firstExecutionAt: 1, estimatedEndAt: 2 },
    isFetching: false,
    refetch: jest.fn(),
  }),
  useGetLimitConfig: () => ({ data: undefined, isLoading: false }),
}));
jest.mock("@query/pools", () => ({ useGetPoolList: () => ({ data: undefined, isError: false, refetch: jest.fn() }) }));
// One input unit buys two output units.
jest.mock("@query/router", () => ({
  useGetRoutes: (request: { tokenAmount: string; exactType: "EXACT_IN" | "EXACT_OUT" } | null) => ({
    data: request
      ? {
          status: "SUCCESS",
          amount: (request.exactType === "EXACT_OUT"
            ? BigNumber(request.tokenAmount).dividedBy(2)
            : BigNumber(request.tokenAmount).multipliedBy(2)
          )
            .shiftedBy(6)
            .toFixed(0),
        }
      : undefined,
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
const wrapper = ({ children }: { children: React.ReactNode }) => <JotaiProvider>{children}</JotaiProvider>;

describe("order Max amount messages", () => {
  beforeEach(() => {
    mockMakeCreateDcaOrderMessages.mockClear();
    mockMakeCreateLimitOrderMessages.mockClear();
  });

  it("builds the DCA CreateOrder for a candidate deposit split over the current count", async () => {
    const { result } = renderHook(() => useDcaOrderHandler(), { wrapper });
    act(() => result.current.changeTokenA(tokenA));
    act(() => result.current.changeTokenB(tokenB));
    act(() => result.current.setExecutionCountInput("4"));
    // The mocked schedule's slot 120 belongs to a Day interval, not the default Minute.
    act(() => result.current.changeInterval(86400));

    // Max is pressed before any amount is typed.
    await expect(result.current.makeMaxAmountMessages("9000003")).resolves.toEqual([{ func: "CreateOrder" }]);
    expect(mockMakeCreateDcaOrderMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        inputToken: tokenA,
        outputToken: tokenB,
        slotOffset: 120,
        amountPerExecution: "2250000",
        executionCount: 4,
      }),
    );
    // The scheduled group and slot are part of what the estimate was priced for.
    expect(result.current.maxAmountDependsOn).toEqual([tokenB.path, result.current.interval, 4, undefined, 120]);

    // A deposit too small to give each execution a unit builds nothing.
    await expect(result.current.makeMaxAmountMessages("3")).resolves.toEqual([]);
  });

  it("builds the Limit CreateOrder for a candidate making amount at the current price", async () => {
    const { result } = renderHook(() => useLimitOrderHandler(), { wrapper });
    act(() => result.current.changeTokenA(tokenA));
    act(() => result.current.changeTokenB(tokenB));
    act(() => result.current.changeLimitPrice("3"));

    await expect(result.current.makeMaxAmountMessages("5000000")).resolves.toEqual([{ func: "CreateOrder" }]);
    expect(mockMakeCreateLimitOrderMessages).toHaveBeenCalledWith(
      expect.objectContaining({ tokenIn: tokenA, tokenOut: tokenB, makingAmount: "5000000", takingAmount: "15000000" }),
    );
    expect(result.current.maxAmountDependsOn[0]).toBe(tokenB.path);
    expect(result.current.maxAmountDependsOn[1]).toBe("3");
  });

  it("simulates a Buy Max with the same affordable raw amounts that will be submitted", async () => {
    const { result } = renderHook(() => useLimitOrderHandler(), { wrapper });
    act(() => {
      result.current.changeTokenA(tokenA);
      result.current.changeTokenB(tokenB);
      result.current.restoreOrderSide("buy");
      result.current.changeLimitPrice("3");
    });
    await result.current.makeMaxAmountMessages("5000000");
    expect(mockMakeCreateLimitOrderMessages).toHaveBeenCalledWith(
      expect.objectContaining({
        tokenIn: tokenA,
        tokenOut: tokenB,
        baseToken: tokenB,
        makingAmount: "4999998",
        takingAmount: "1666666",
      }),
    );
    act(() => result.current.changeSellAmount("5"));
    expect(result.current.sellAmount).toBe("4.999998");
    expect(result.current.buyAmount).toBe("1.666666");
  });
});
