import { act, renderHook } from "@testing-library/react";
import BigNumber from "bignumber.js";
import { Provider as JotaiProvider } from "jotai";
import React from "react";

import type { TokenModel } from "@models/token/token-model";
import { useGetPoolList } from "@query/pools";

import { useDcaOrderHandler } from "./use-dca-order-handler";

jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
jest.mock("@hooks/common/use-debounce", () => ({ __esModule: true, default: <T,>(value: T) => value }));
jest.mock("@hooks/common/use-gnoswap-context", () => ({ useGnoswapContext: () => ({ orderRepository: {} }) }));
jest.mock("@hooks/common/use-slippage", () => ({ useSlippage: () => ({ slippage: 0.5, changeSlippage: jest.fn() }) }));
jest.mock("@hooks/wallet/ui/use-connect-wallet-modal", () => ({
  useConnectWalletModal: () => ({ openModal: jest.fn() }),
}));
jest.mock("@components/order/confirm-dca-order-modal/ConfirmDcaOrderModal", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("../ui/use-confirm-order-modal", () => ({
  useConfirmOrderModal: () => ({ openModal: jest.fn(), closeModal: jest.fn() }),
}));
jest.mock("./use-order-transaction", () => ({ useOrderTransaction: () => ({ submit: jest.fn() }) }));
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
  useGetDcaConfig: () => ({ data: undefined, isLoading: false }),
  useGetDcaSchedule: () => ({
    data: { slotOffset: 0, firstExecutionAt: 1, estimatedEndAt: 2 },
    isFetching: false,
    refetch: jest.fn(),
  }),
  useEstimateOrderNetworkFee: () => ({ data: undefined, isFetching: false }),
}));
// The router always finds a (possibly multi-hop) route.
jest.mock("@query/router", () => ({
  useGetRoutes: (request: { tokenAmount: string } | null) => ({
    data: request ? { status: "SUCCESS", amount: BigNumber(request.tokenAmount).shiftedBy(6).toFixed(0) } : undefined,
  }),
}));
jest.mock("@query/pools", () => ({ useGetPoolList: jest.fn() }));

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
// A/B has its own pool; A/C is only reachable through B.
const pools = [{ poolPath: `${tokenA.path}:${tokenB.path}:3000` }, { poolPath: `${tokenB.path}:${tokenC.path}:500` }];

const wrapper = ({ children }: { children: React.ReactNode }) => <JotaiProvider>{children}</JotaiProvider>;

const renderWithPair = (output: TokenModel) => {
  const { result } = renderHook(() => useDcaOrderHandler(), { wrapper });
  act(() => result.current.changeTokenA(tokenA));
  act(() => result.current.changeTokenB(output));
  act(() => result.current.changeSellAmount("10"));
  return result;
};

describe("useDcaOrderHandler direct pool requirement", () => {
  beforeEach(() => {
    jest.mocked(useGetPoolList).mockReturnValue({ data: pools, isError: false } as ReturnType<typeof useGetPoolList>);
  });

  it("allows Place Order for a pair with its own pool", () => {
    expect(renderWithPair(tokenB).current.buttonState).toBe("PLACE_ORDER");
  });

  it("blocks Place Order when the router only has a multi-hop route", () => {
    const result = renderWithPair(tokenC);
    expect(result.current.buttonState).toBe("NO_DIRECT_POOL");
    expect(result.current.buttonText).toBe("NO_DIRECT_POOL");
  });

  describe("when the pool list fails to load", () => {
    it("keeps blocking a multi-hop-only pair with a cached list", () => {
      jest.mocked(useGetPoolList).mockReturnValue({
        data: pools,
        isError: true,
        refetch: jest.fn(),
      } as unknown as ReturnType<typeof useGetPoolList>);

      expect(renderWithPair(tokenC).current.buttonState).toBe("NO_DIRECT_POOL");
      expect(renderWithPair(tokenB).current.buttonState).toBe("PLACE_ORDER");
    });

    it("blocks the order and retries the check without a cached list", () => {
      const refetch = jest.fn();
      jest.mocked(useGetPoolList).mockReturnValue({
        data: undefined,
        isError: true,
        refetch,
      } as unknown as ReturnType<typeof useGetPoolList>);

      const result = renderWithPair(tokenC);
      expect(result.current.buttonState).toBe("POOL_CHECK_FAILED");
      expect(result.current.buttonText).toBe("POOL_CHECK_FAILED");

      act(() => result.current.onClickButton());
      expect(refetch).toHaveBeenCalledTimes(1);
    });
  });
});
