import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor } from "@testing-library/react";
import { createStore, Provider as JotaiProvider, useAtomValue } from "jotai";
import React from "react";

import { GNOT_TOKEN } from "@common/values/token-constant";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import type { TokenModel } from "@models/token/token-model";
import type { GetLimitMarketPricesRequest, LimitMarketPricePair } from "@repositories/order/request";
import type { LimitMarketPricesResponse } from "@repositories/order/response";
import { SwapState } from "@states/index";
import { getSwapTokenPath } from "@utils/swap-route-utils";

import {
  LimitMarketPriceProvider,
  useLimitMarketPrices,
  useRegisterLimitMarketPricePairs,
} from "./LimitMarketPriceProvider";

let mockQuery: Record<string, string> = {};
const mockGetLimitMarketPrices = jest.fn<Promise<LimitMarketPricesResponse>, [GetLimitMarketPricesRequest]>();

jest.mock("@hooks/common/use-custom-router", () => ({ __esModule: true, default: () => ({ query: mockQuery }) }));
jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ orderRepository: { getLimitMarketPrices: mockGetLimitMarketPrices } }),
}));
jest.mock("@constants/order.constant", () => ({ ENABLED_SWAP_CARD_TYPES: ["swap", "dca", "limit"] }));

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
const tokenC = token("C");
const pair = (tokenIn: TokenModel, tokenOut: TokenModel): LimitMarketPricePair => ({
  tokenIn: tokenIn.path,
  tokenOut: tokenOut.path,
});

/** Pool spot rates by directed pair, in output tokens per input token. No pool prices C → B. */
const RATES: Record<string, string> = {
  [`${tokenA.path}>${tokenB.path}`]: "10",
  [`${tokenB.path}>${tokenA.path}`]: "0.1",
  [`${tokenA.path}>${tokenC.path}`]: "20",
  [`${WRAPPED_GNOT_PATH}>${tokenA.path}`]: "0.5",
};

/** The market price API's answer to a request. */
const answer = ({ pairs }: GetLimitMarketPricesRequest): LimitMarketPricesResponse => ({
  items: pairs.map(({ tokenIn, tokenOut }) => {
    const outputPerInput = RATES[`${tokenIn}>${tokenOut}`];
    const pool = { poolPath: `${tokenIn}:${tokenOut}:3000`, updatedBlockHeight: 1, updatedBlockTime: 1 };
    return { tokenIn, tokenOut, price: outputPerInput ? { ...pool, outputPerInput } : null };
  }),
});

/** Reads the Limit form's pair, as the Limit form does. */
const FormPrice: React.FC = () => {
  const { getPrice } = useLimitMarketPrices();
  const { tokenA, tokenB } = useAtomValue(SwapState.swap);
  const price = getPrice(
    tokenA && tokenB ? { tokenIn: getSwapTokenPath(tokenA), tokenOut: getSwapTokenPath(tokenB) } : null,
  );
  return <output aria-label="form market price">{price ?? "-"}</output>;
};

/** A page of orders on screen, as the order list shows it. */
const OrderPage: React.FC<{ pairs: LimitMarketPricePair[] }> = ({ pairs }) => {
  useRegisterLimitMarketPricePairs(pairs);
  const { getPrice } = useLimitMarketPrices();
  return (
    <ul>
      {pairs.map((orderPair, index) => (
        <li key={index}>{getPrice(orderPair) ?? "-"}</li>
      ))}
    </ul>
  );
};

let client: QueryClient;

/** The Limit form on `formTokens`, with the given page of orders under it. */
const setup = (formTokens: [TokenModel, TokenModel]) => {
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const store = createStore();
  store.set(SwapState.swap, prev => ({ ...prev, tokenA: formTokens[0], tokenB: formTokens[1] }));
  const view = (orders?: LimitMarketPricePair[]) => (
    <QueryClientProvider client={client}>
      <JotaiProvider store={store}>
        <LimitMarketPriceProvider>
          <FormPrice />
          {orders && <OrderPage pairs={orders} />}
        </LimitMarketPriceProvider>
      </JotaiProvider>
    </QueryClientProvider>
  );
  const { rerender } = render(view());
  return { store, rerender: (orders?: LimitMarketPricePair[]) => rerender(view(orders)) };
};

const formPrice = () => screen.getByLabelText("form market price").textContent;
const orderPrices = () => screen.queryAllByRole("listitem").map(item => item.textContent);
const lastRequestedPairs = () => mockGetLimitMarketPrices.mock.calls.at(-1)?.[0].pairs;

beforeEach(() => {
  mockQuery = { type: "limit" };
  mockGetLimitMarketPrices.mockReset().mockImplementation(async request => answer(request));
});

afterEach(() => {
  jest.useRealTimers();
  client.clear();
});

describe("LimitMarketPriceProvider", () => {
  it("prices the form pair and the orders on screen in one request, once per directed pair", async () => {
    const { rerender } = setup([tokenA, tokenB]);
    await waitFor(() => expect(formPrice()).toBe("10"));

    // The form's own pair, its reverse, and one native GNOT pair asked for by its native and wrapped paths.
    rerender([
      pair(tokenA, tokenB),
      pair(tokenB, tokenA),
      { tokenIn: GNOT_TOKEN.path, tokenOut: tokenA.path },
      { tokenIn: WRAPPED_GNOT_PATH, tokenOut: tokenA.path },
    ]);
    await waitFor(() => expect(orderPrices()).toEqual(["10", "0.1", "0.5", "0.5"]));

    expect(formPrice()).toBe("10");
    expect(mockGetLimitMarketPrices).toHaveBeenCalledTimes(2);
    expect(lastRequestedPairs()).toHaveLength(3);
    expect(lastRequestedPairs()).toEqual(
      expect.arrayContaining([
        pair(tokenA, tokenB),
        pair(tokenB, tokenA),
        { tokenIn: WRAPPED_GNOT_PATH, tokenOut: tokenA.path },
      ]),
    );
  });

  it("asks only for the page on screen, dropping the previous page's orders", async () => {
    const { rerender } = setup([tokenA, tokenB]);
    rerender([pair(tokenB, tokenA)]);
    await waitFor(() => expect(orderPrices()).toEqual(["0.1"]));

    rerender([pair(tokenA, tokenC)]);
    await waitFor(() => expect(orderPrices()).toEqual(["20"]));
    expect(lastRequestedPairs()).toEqual([pair(tokenA, tokenB), pair(tokenA, tokenC)]);

    // The list closes.
    rerender();
    await waitFor(() => expect(lastRequestedPairs()).toEqual([pair(tokenA, tokenB)]));
  });

  it("never shows another pair's price while a switched form pair loads", async () => {
    const answers: (() => void)[] = [];
    mockGetLimitMarketPrices.mockImplementation(request => {
      const { promise, resolve } = Promise.withResolvers<LimitMarketPricesResponse>();
      answers.push(() => resolve(answer(request)));
      return promise;
    });
    const { store } = setup([tokenA, tokenB]);
    act(() => store.set(SwapState.swap, prev => ({ ...prev, tokenB: tokenC })));
    expect(answers).toHaveLength(2);

    // A → B answers after the form moved on to A → C.
    await act(async () => answers[0]());
    const notified = Promise.withResolvers<void>();
    setTimeout(notified.resolve, 0);
    await act(() => notified.promise);
    expect(formPrice()).toBe("-");
    await act(async () => answers[1]());
    await waitFor(() => expect(formPrice()).toBe("20"));

    // An answered pair's price is not lent to the next pair either while that one loads.
    act(() => store.set(SwapState.swap, prev => ({ ...prev, tokenA: tokenB })));
    expect(formPrice()).toBe("-");
  });

  it("shows no price for a pair no pool prices or while the API fails, and recovers on the next answer", async () => {
    const { rerender } = setup([tokenA, tokenB]);
    rerender([pair(tokenC, tokenB), pair(tokenB, tokenA)]);
    await waitFor(() => expect(orderPrices()).toEqual(["-", "0.1"]));
    expect(formPrice()).toBe("10");

    mockGetLimitMarketPrices.mockRejectedValue(new Error("market price API unavailable"));
    await act(() => client.refetchQueries({ type: "active" }));
    await waitFor(() => expect(formPrice()).toBe("-"));
    expect(orderPrices()).toEqual(["-", "-"]);

    mockGetLimitMarketPrices.mockImplementation(async request => answer(request));
    await act(() => client.refetchQueries({ type: "active" }));
    await waitFor(() => expect(formPrice()).toBe("10"));
    expect(orderPrices()).toEqual(["-", "0.1"]);
  });

  it("asks for prices, and refreshes them every 10 seconds, only while the Limit card is open", async () => {
    jest.useFakeTimers();
    /** Lets the requests in flight settle around `ms` of fake time. */
    const advance = async (ms: number) => {
      await act(async () => undefined);
      act(() => jest.advanceTimersByTime(ms));
      await act(async () => undefined);
    };
    mockQuery = { type: "dca" };
    const { rerender } = setup([tokenA, tokenB]);
    await advance(30_000);
    expect(mockGetLimitMarketPrices).not.toHaveBeenCalled();

    mockQuery = { type: "limit" };
    rerender();
    await advance(0);
    expect(mockGetLimitMarketPrices).toHaveBeenCalledTimes(1);
    await advance(10_000);
    expect(mockGetLimitMarketPrices).toHaveBeenCalledTimes(2);

    mockQuery = { type: "swap" };
    rerender();
    await advance(30_000);
    expect(mockGetLimitMarketPrices).toHaveBeenCalledTimes(2);
  });
});
