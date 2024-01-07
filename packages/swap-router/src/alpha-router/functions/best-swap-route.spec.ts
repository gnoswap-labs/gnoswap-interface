import BigNumber from "bignumber.js";
import _ from "lodash";
import sinon from "sinon";
import { ChainId, CurrencyAmount, Fraction, TradeType } from "../core";
import { RouteWithValidQuote, V3RouteWithValidQuote } from "../entities";
import { IGasModel } from "../gas-models";
import { TokenProvider, V3PoolProvider } from "../providers";
import {
  IPortionProvider,
  PortionProvider,
} from "../providers/portion-provider";
import { V3Route } from "../router";
import { computeAllV3Routes } from "./compute-all-routes";
import { MOCK_POOLS } from "../test-utils/mock-pool";
import { BAR_DEV, BAZ_DEV, FOO_DEV, GNOT_DEV } from "../test-utils/mock-token";
import { Pool } from "../v3-sdk";
import { getV3CandidatePools } from "./get-candidate-pools";
import { getBestSwapRoute } from "./best-swap-route";
import { DEFAULT_ROUTING_CONFIG_BY_CHAIN } from "../config";

const mockPools = MOCK_POOLS;

const ROUTING_CONFIG = DEFAULT_ROUTING_CONFIG_BY_CHAIN(ChainId.DEV_GNOSWAP);

describe("get best swap route", () => {
  let mockV3GasModel: sinon.SinonStubbedInstance<IGasModel<
    V3RouteWithValidQuote
  >>;
  let mockV3PoolProvider: V3PoolProvider;
  let portionProvider: IPortionProvider;

  beforeEach(() => {
    mockV3GasModel = {
      estimateGasCost: sinon.stub(),
    };
    mockV3GasModel.estimateGasCost.callsFake(r => {
      return {
        gasEstimate: BigNumber(10000),
        gasCostInToken: CurrencyAmount.fromRawAmount(r.quoteToken, 0),
        gasCostInUSD: CurrencyAmount.fromRawAmount(GNOT_DEV, 0),
      };
    });

    mockV3PoolProvider = new V3PoolProvider(ChainId.DEV_GNOSWAP);
    portionProvider = new PortionProvider();
  });

  const buildV3RouteWithValidQuote = (
    route: V3Route,
    tradeType: TradeType,
    amount: CurrencyAmount,
    quote: number,
    percent: number,
  ): V3RouteWithValidQuote => {
    const quoteToken =
      tradeType == TradeType.EXACT_OUTPUT ? route.output : route.input;
    return new V3RouteWithValidQuote({
      amount,
      rawQuote: BigNumber(quote),
      sqrtPriceX96AfterList: [BigNumber(1)],
      initializedTicksCrossedList: [1],
      quoterGasEstimate: BigNumber(100000),
      percent,
      route,
      gasModel: mockV3GasModel,
      quoteToken,
      tradeType,
      v3PoolProvider: mockV3PoolProvider,
    });
  };

  const buildV3RouteWithValidQuotes = (
    route: V3Route,
    tradeType: TradeType,
    inputAmount: CurrencyAmount,
    quotes: number[],
    percents: number[],
  ) => {
    return _.map(percents, (p, i) =>
      buildV3RouteWithValidQuote(
        route,
        tradeType,
        inputAmount.multiply(new Fraction(p, 100)),
        quotes[i]!,
        p,
      ),
    );
  };

  test("succeeds to find 1 split best route", async () => {
    const tokenIn = BAZ_DEV;
    const tokenOut = BAR_DEV;
    const amount = CurrencyAmount.fromRawAmount(tokenIn, 10000);
    const { pools } = await getV3CandidatePools({
      tokenIn: tokenIn,
      tokenOut: tokenOut,
      routeType: TradeType.EXACT_INPUT,
      routingConfig: ROUTING_CONFIG,
      poolProvider: mockV3PoolProvider,
      tokenProvider: new TokenProvider(ChainId.DEV_GNOSWAP),
      chainId: ChainId.DEV_GNOSWAP,
    });
    const allRoutes = computeAllV3Routes(tokenIn, tokenOut, pools, 3);
    const percents = [25, 50, 75, 100];
    const routesWithQuotes: RouteWithValidQuote[] = allRoutes.flatMap(route => [
      ...buildV3RouteWithValidQuotes(
        route,
        TradeType.EXACT_INPUT,
        amount,
        percents,
        percents,
      ),
    ]);

    const swapRouteType = await getBestSwapRoute(
      amount,
      percents,
      routesWithQuotes,
      TradeType.EXACT_INPUT,
      ChainId.DEV_GNOSWAP,
      { ...ROUTING_CONFIG, distributionPercent: 5 },
      portionProvider,
    )!;

    const {
      quote,
      routes,
      quoteGasAdjusted,
      estimatedGasUsed,
      estimatedGasUsedUSD,
      estimatedGasUsedQuoteToken,
    } = swapRouteType!;

    expect(routes).toHaveLength(2);
    expect(quote.quotient.toString()).toBe("60");
    expect(quote.equalTo(quoteGasAdjusted)).toBeTruthy();
    expect(estimatedGasUsed.eq(BigNumber(10000))).toBeTruthy();
  });

  // test("succeeds to find 2 split best route", async () => {
  //   const amount = CurrencyAmount.fromRawAmount(USDC, 100000);
  //   const percents = [25, 50, 75, 100];

  //   const routesWithQuotes: RouteWithValidQuote[] = [
  //     ...buildV3RouteWithValidQuotes(
  //       v3Route1,
  //       TradeType.EXACT_INPUT,
  //       amount,
  //       [10, 20, 30, 40],
  //       percents,
  //     ),
  //     ...buildV3RouteWithValidQuotes(
  //       v3Route2,
  //       TradeType.EXACT_INPUT,
  //       amount,
  //       [8, 19, 28, 38],
  //       percents,
  //     ),
  //     ...buildV2RouteWithValidQuotes(
  //       v2Route3,
  //       TradeType.EXACT_INPUT,
  //       amount,
  //       [14, 19, 23, 30],
  //       percents,
  //     ),
  //   ];

  //   const swapRouteType = await getBestSwapRoute(
  //     amount,
  //     percents,
  //     routesWithQuotes,
  //     TradeType.EXACT_INPUT,
  //     ChainId.MAINNET,
  //     { ...mockRoutingConfig, distributionPercent: 25 },
  //     portionProvider,
  //   )!;

  //   const {
  //     quote,
  //     routes,
  //     quoteGasAdjusted,
  //     estimatedGasUsed,
  //     estimatedGasUsedUSD,
  //     estimatedGasUsedQuoteToken,
  //   } = swapRouteType!;

  //   expect(quote.quotient.toString()).toBe("44");
  //   expect(quote.equalTo(quoteGasAdjusted)).toBeTruthy();
  //   expect(estimatedGasUsed.eq(BigNumber.from(20000))).toBeTruthy();
  //   expect(
  //     estimatedGasUsedUSD.equalTo(CurrencyAmount.fromRawAmount(USDC, 0)),
  //   ).toBeTruthy();
  //   expect(
  //     estimatedGasUsedQuoteToken.equalTo(
  //       CurrencyAmount.fromRawAmount(WRAPPED_NATIVE_CURRENCY[1]!, 0),
  //     ),
  //   ).toBeTruthy();
  //   expect(routes).toHaveLength(2);
  // });

  // test("succeeds to find 3 split best route", async () => {
  //   const amount = CurrencyAmount.fromRawAmount(USDC, 100000);
  //   const percents = [25, 50, 75, 100];

  //   const routesWithQuotes: RouteWithValidQuote[] = [
  //     ...buildV2RouteWithValidQuotes(
  //       v2Route1,
  //       TradeType.EXACT_INPUT,
  //       amount,
  //       [10, 50, 10, 10],
  //       percents,
  //     ),
  //     ...buildV3RouteWithValidQuotes(
  //       v3Route2,
  //       TradeType.EXACT_INPUT,
  //       amount,
  //       [25, 10, 10, 10],
  //       percents,
  //     ),
  //     ...buildV3RouteWithValidQuotes(
  //       v3Route3,
  //       TradeType.EXACT_INPUT,
  //       amount,
  //       [25, 10, 10, 10],
  //       percents,
  //     ),
  //   ];

  //   const swapRouteType = await getBestSwapRoute(
  //     amount,
  //     percents,
  //     routesWithQuotes,
  //     TradeType.EXACT_INPUT,
  //     ChainId.MAINNET,
  //     { ...mockRoutingConfig, distributionPercent: 25 },
  //     portionProvider,
  //   )!;

  //   const {
  //     quote,
  //     routes,
  //     quoteGasAdjusted,
  //     estimatedGasUsed,
  //     estimatedGasUsedUSD,
  //     estimatedGasUsedQuoteToken,
  //   } = swapRouteType!;

  //   expect(quote.quotient.toString()).toBe("100");
  //   expect(quote.equalTo(quoteGasAdjusted)).toBeTruthy();
  //   expect(estimatedGasUsed.eq(BigNumber.from(30000))).toBeTruthy();
  //   expect(
  //     estimatedGasUsedUSD.equalTo(CurrencyAmount.fromRawAmount(USDC, 0)),
  //   ).toBeTruthy();
  //   expect(
  //     estimatedGasUsedQuoteToken.equalTo(
  //       CurrencyAmount.fromRawAmount(WRAPPED_NATIVE_CURRENCY[1]!, 0),
  //     ),
  //   ).toBeTruthy();
  //   expect(routes).toHaveLength(3);
  // });

  // test("succeeds to find 4 split best route", async () => {
  //   const amount = CurrencyAmount.fromRawAmount(USDC, 100000);
  //   const percents = [25, 50, 75, 100];

  //   const routesWithQuotes: RouteWithValidQuote[] = [
  //     ...buildV2RouteWithValidQuotes(
  //       v2Route1,
  //       TradeType.EXACT_INPUT,
  //       amount,
  //       [30, 50, 52, 54],
  //       percents,
  //     ),
  //     ...buildV3RouteWithValidQuotes(
  //       v3Route2,
  //       TradeType.EXACT_INPUT,
  //       amount,
  //       [35, 35, 34, 50],
  //       percents,
  //     ),
  //     ...buildV3RouteWithValidQuotes(
  //       v3Route3,
  //       TradeType.EXACT_INPUT,
  //       amount,
  //       [35, 40, 42, 50],
  //       percents,
  //     ),
  //     ...buildV3RouteWithValidQuotes(
  //       v3Route4,
  //       TradeType.EXACT_INPUT,
  //       amount,
  //       [40, 42, 44, 56],
  //       percents,
  //     ),
  //   ];

  //   const swapRouteType = await getBestSwapRoute(
  //     amount,
  //     percents,
  //     routesWithQuotes,
  //     TradeType.EXACT_INPUT,
  //     ChainId.MAINNET,
  //     { ...mockRoutingConfig, distributionPercent: 25 },
  //     portionProvider,
  //   )!;

  //   const {
  //     quote,
  //     routes,
  //     quoteGasAdjusted,
  //     estimatedGasUsed,
  //     estimatedGasUsedUSD,
  //     estimatedGasUsedQuoteToken,
  //   } = swapRouteType!;

  //   expect(quote.quotient.toString()).toBe("140");
  //   expect(quote.equalTo(quoteGasAdjusted)).toBeTruthy();
  //   expect(estimatedGasUsed.eq(BigNumber.from(40000))).toBeTruthy();
  //   expect(
  //     estimatedGasUsedUSD.equalTo(CurrencyAmount.fromRawAmount(USDC, 0)),
  //   ).toBeTruthy();
  //   expect(
  //     estimatedGasUsedQuoteToken.equalTo(
  //       CurrencyAmount.fromRawAmount(WRAPPED_NATIVE_CURRENCY[1]!, 0),
  //     ),
  //   ).toBeTruthy();
  //   expect(routes).toHaveLength(4);
  // });

  // test("succeeds to find best route when routes on different protocols use same pool pairs", async () => {
  //   const amount = CurrencyAmount.fromRawAmount(USDC, 100000);
  //   const percents = [25, 50, 75, 100];

  //   // Check that even though the pools in these routes use the same tokens,
  //   // since they are on different protocols we are fine to route in them.
  //   const v2Route = new V2Route([USDC_WETH], USDC, WRAPPED_NATIVE_CURRENCY[1]!);
  //   const v3Route = new V3Route(
  //     [USDC_WETH_LOW],
  //     USDC,
  //     WRAPPED_NATIVE_CURRENCY[1]!,
  //   );

  //   const routesWithQuotes: RouteWithValidQuote[] = [
  //     ...buildV2RouteWithValidQuotes(
  //       v2Route,
  //       TradeType.EXACT_INPUT,
  //       amount,
  //       [10, 500, 10, 10],
  //       percents,
  //     ),
  //     ...buildV3RouteWithValidQuotes(
  //       v3Route,
  //       TradeType.EXACT_INPUT,
  //       amount,
  //       [10, 500, 10, 10],
  //       percents,
  //     ),
  //     ...buildV3RouteWithValidQuotes(
  //       v3Route3,
  //       TradeType.EXACT_INPUT,
  //       amount,
  //       [10, 10, 10, 900],
  //       percents,
  //     ),
  //   ];

  //   const swapRouteType = await getBestSwapRoute(
  //     amount,
  //     percents,
  //     routesWithQuotes,
  //     TradeType.EXACT_INPUT,
  //     ChainId.MAINNET,
  //     { ...mockRoutingConfig, distributionPercent: 25 },
  //     portionProvider,
  //   )!;

  //   const {
  //     quote,
  //     routes,
  //     quoteGasAdjusted,
  //     estimatedGasUsed,
  //     estimatedGasUsedUSD,
  //     estimatedGasUsedQuoteToken,
  //   } = swapRouteType!;

  //   expect(quote.quotient.toString()).toBe("1000");
  //   expect(quote.equalTo(quoteGasAdjusted)).toBeTruthy();
  //   expect(estimatedGasUsed.toString()).toEqual("20000");
  //   expect(
  //     estimatedGasUsedUSD.equalTo(CurrencyAmount.fromRawAmount(USDC, 0)),
  //   ).toBeTruthy();
  //   expect(
  //     estimatedGasUsedQuoteToken.equalTo(
  //       CurrencyAmount.fromRawAmount(WRAPPED_NATIVE_CURRENCY[1]!, 0),
  //     ),
  //   ).toBeTruthy();
  //   expect(routes).toHaveLength(2);
  // });

  // test("succeeds to find best split route with min splits", async () => {
  //   const amount = CurrencyAmount.fromRawAmount(USDC, 100000);
  //   const percents = [25, 50, 75, 100];

  //   // Should ignore the 50k 1 split route and find the 3 split route.
  //   const routesWithQuotes: V3RouteWithValidQuote[] = [
  //     ...buildV3RouteWithValidQuotes(
  //       v3Route1,
  //       TradeType.EXACT_INPUT,
  //       amount,
  //       [30, 1000, 52, 54],
  //       percents,
  //     ),
  //     ...buildV3RouteWithValidQuotes(
  //       v3Route2,
  //       TradeType.EXACT_INPUT,
  //       amount,
  //       [1000, 42, 34, 50],
  //       percents,
  //     ),
  //     ...buildV3RouteWithValidQuotes(
  //       v3Route3,
  //       TradeType.EXACT_INPUT,
  //       amount,
  //       [1000, 40, 42, 50],
  //       percents,
  //     ),
  //     ...buildV3RouteWithValidQuotes(
  //       v3Route4,
  //       TradeType.EXACT_INPUT,
  //       amount,
  //       [40, 42, 44, 56],
  //       percents,
  //     ),
  //   ];

  //   const swapRouteType = await getBestSwapRoute(
  //     amount,
  //     percents,
  //     routesWithQuotes,
  //     TradeType.EXACT_INPUT,
  //     ChainId.MAINNET,
  //     { ...mockRoutingConfig, distributionPercent: 25 },
  //     portionProvider,
  //   )!;

  //   const {
  //     quote,
  //     routes,
  //     quoteGasAdjusted,
  //     estimatedGasUsed,
  //     estimatedGasUsedUSD,
  //     estimatedGasUsedQuoteToken,
  //   } = swapRouteType!;

  //   expect(quote.quotient.toString()).toBe("3000");
  //   expect(quote.equalTo(quoteGasAdjusted)).toBeTruthy();
  //   expect(estimatedGasUsed.toString()).toBe("30000");
  //   expect(
  //     estimatedGasUsedUSD.equalTo(CurrencyAmount.fromRawAmount(USDC, 0)),
  //   ).toBeTruthy();
  //   expect(
  //     estimatedGasUsedQuoteToken.equalTo(
  //       CurrencyAmount.fromRawAmount(WRAPPED_NATIVE_CURRENCY[1]!, 0),
  //     ),
  //   ).toBeTruthy();
  //   expect(routes).toHaveLength(3);
  // });

  // test("succeeds to find best split route with max splits", async () => {
  //   const amount = CurrencyAmount.fromRawAmount(USDC, 100000);
  //   const percents = [25, 50, 75, 100];

  //   // Should ignore the 4 split route that returns 200k
  //   const routesWithQuotes: V3RouteWithValidQuote[] = [
  //     ...buildV3RouteWithValidQuotes(
  //       v3Route1,
  //       TradeType.EXACT_INPUT,
  //       amount,
  //       [50000, 10000, 52, 54],
  //       percents,
  //     ),
  //     ...buildV3RouteWithValidQuotes(
  //       v3Route2,
  //       TradeType.EXACT_INPUT,
  //       amount,
  //       [50000, 42, 34, 50],
  //       percents,
  //     ),
  //     ...buildV3RouteWithValidQuotes(
  //       v3Route3,
  //       TradeType.EXACT_INPUT,
  //       amount,
  //       [50000, 40, 42, 50],
  //       percents,
  //     ),
  //     ...buildV3RouteWithValidQuotes(
  //       v3Route4,
  //       TradeType.EXACT_INPUT,
  //       amount,
  //       [50000, 42, 44, 56],
  //       percents,
  //     ),
  //   ];

  //   const swapRouteType = await getBestSwapRoute(
  //     amount,
  //     percents,
  //     routesWithQuotes,
  //     TradeType.EXACT_INPUT,
  //     ChainId.MAINNET,
  //     {
  //       ...mockRoutingConfig,
  //       distributionPercent: 25,
  //       minSplits: 2,
  //       maxSplits: 3,
  //     },
  //     portionProvider,
  //   )!;

  //   const {
  //     quote,
  //     routes,
  //     quoteGasAdjusted,
  //     estimatedGasUsed,
  //     estimatedGasUsedUSD,
  //     estimatedGasUsedQuoteToken,
  //   } = swapRouteType!;

  //   expect(quote.quotient.toString()).toBe("110000");
  //   expect(quote.equalTo(quoteGasAdjusted)).toBeTruthy();
  //   expect(estimatedGasUsed.toString()).toBe("30000");
  //   expect(
  //     estimatedGasUsedUSD.equalTo(CurrencyAmount.fromRawAmount(USDC, 0)),
  //   ).toBeTruthy();
  //   expect(
  //     estimatedGasUsedQuoteToken.equalTo(
  //       CurrencyAmount.fromRawAmount(WRAPPED_NATIVE_CURRENCY[1]!, 0),
  //     ),
  //   ).toBeTruthy();
  //   expect(routes).toHaveLength(3);
  // });

  // test("succeeds to find best route accounting for gas with gas model giving usd estimate in USDC", async () => {
  //   // Set gas model so that each hop in route costs 10 gas.
  //   mockV3GasModel.estimateGasCost.callsFake(r => {
  //     const hops = r.route.pools.length;
  //     return {
  //       gasEstimate: BigNumber.from(10000).mul(hops),
  //       gasCostInToken: CurrencyAmount.fromRawAmount(
  //         r.quoteToken,
  //         JSBI.multiply(JSBI.BigInt(10), JSBI.BigInt(hops)),
  //       ),
  //       gasCostInUSD: CurrencyAmount.fromRawAmount(
  //         USDC,
  //         JSBI.multiply(JSBI.BigInt(10), JSBI.BigInt(hops)),
  //       ),
  //     };
  //   });

  //   const amount = CurrencyAmount.fromRawAmount(USDC, 100000);
  //   const percents = [25, 50, 75, 100];
  //   // Route 1 has 3 hops. Cost 30 gas.
  //   // Route 2 has 1 hop. Cost 10 gas.
  //   // Ignoring gas, 50% Route 1, 50% Route 2 is best swap.
  //   // Expect algorithm to pick 100% Route 2 instead after considering gas.
  //   const routesWithQuotes: V3RouteWithValidQuote[] = [
  //     ...buildV3RouteWithValidQuotes(
  //       v3Route1,
  //       TradeType.EXACT_INPUT,
  //       amount,
  //       [10, 50, 10, 10],
  //       percents,
  //     ),
  //     ...buildV3RouteWithValidQuotes(
  //       v3Route2,
  //       TradeType.EXACT_INPUT,
  //       amount,
  //       [10, 50, 10, 85],
  //       percents,
  //     ),
  //   ];

  //   const swapRouteType = await getBestSwapRoute(
  //     amount,
  //     percents,
  //     routesWithQuotes,
  //     TradeType.EXACT_INPUT,
  //     ChainId.MAINNET,
  //     { ...mockRoutingConfig, distributionPercent: 25 },
  //     portionProvider,
  //   )!;

  //   const {
  //     quote,
  //     routes,
  //     quoteGasAdjusted,
  //     estimatedGasUsed,
  //     estimatedGasUsedUSD,
  //     estimatedGasUsedQuoteToken,
  //   } = swapRouteType!;

  //   expect(quote.quotient.toString()).toBe("85");
  //   expect(quoteGasAdjusted.quotient.toString()).toBe("75");
  //   expect(estimatedGasUsed.eq(BigNumber.from(10000))).toBeTruthy();
  //   // Code will actually convert USDC gas estimates to DAI, hence an extra 12 decimals on the quotient.
  //   expect(estimatedGasUsedUSD.quotient.toString()).toEqual("10000000000000");
  //   expect(
  //     estimatedGasUsedQuoteToken.equalTo(
  //       CurrencyAmount.fromRawAmount(WRAPPED_NATIVE_CURRENCY[1]!, 10),
  //     ),
  //   ).toBeTruthy();
  //   expect(routes).toHaveLength(1);
  // });

  // test("succeeds to find best route accounting for gas with gas model giving usd estimate in DAI", async () => {
  //   // Set gas model so that each hop in route costs 10 gas.
  //   mockV3GasModel.estimateGasCost.callsFake(r => {
  //     const hops = r.route.pools.length;
  //     return {
  //       gasEstimate: BigNumber.from(10000).mul(hops),
  //       gasCostInToken: CurrencyAmount.fromRawAmount(
  //         r.quoteToken,
  //         JSBI.multiply(JSBI.BigInt(10), JSBI.BigInt(hops)),
  //       ),
  //       gasCostInUSD: CurrencyAmount.fromRawAmount(
  //         DAI_MAINNET,
  //         JSBI.multiply(JSBI.BigInt(10), JSBI.BigInt(hops)),
  //       ),
  //     };
  //   });

  //   const amount = CurrencyAmount.fromRawAmount(USDC, 100000);
  //   const percents = [25, 50, 75, 100];
  //   // Route 1 has 3 hops. Cost 30 gas.
  //   // Route 2 has 1 hop. Cost 10 gas.
  //   // Ignoring gas, 50% Route 1, 50% Route 2 is best swap.
  //   // Expect algorithm to pick 100% Route 2 instead after considering gas.
  //   const routesWithQuotes: V3RouteWithValidQuote[] = [
  //     ...buildV3RouteWithValidQuotes(
  //       v3Route1,
  //       TradeType.EXACT_INPUT,
  //       amount,
  //       [10, 50, 10, 10],
  //       percents,
  //     ),
  //     ...buildV3RouteWithValidQuotes(
  //       v3Route2,
  //       TradeType.EXACT_INPUT,
  //       amount,
  //       [10, 50, 10, 85],
  //       percents,
  //     ),
  //   ];

  //   const swapRouteType = await getBestSwapRoute(
  //     amount,
  //     percents,
  //     routesWithQuotes,
  //     TradeType.EXACT_INPUT,
  //     ChainId.MAINNET,
  //     { ...mockRoutingConfig, distributionPercent: 25 },
  //     portionProvider,
  //   )!;

  //   const {
  //     quote,
  //     routes,
  //     quoteGasAdjusted,
  //     estimatedGasUsed,
  //     estimatedGasUsedUSD,
  //     estimatedGasUsedQuoteToken,
  //   } = swapRouteType!;

  //   expect(quote.quotient.toString()).toBe("85");
  //   expect(quoteGasAdjusted.quotient.toString()).toBe("75");
  //   expect(estimatedGasUsed.eq(BigNumber.from(10000))).toBeTruthy();
  //   // Code will actually convert USDC gas estimates to DAI, hence an extra 12 decimals on the quotient.
  //   expect(estimatedGasUsedUSD.quotient.toString()).toEqual("10");
  //   expect(
  //     estimatedGasUsedQuoteToken.equalTo(
  //       CurrencyAmount.fromRawAmount(WRAPPED_NATIVE_CURRENCY[1]!, 10),
  //     ),
  //   ).toBeTruthy();
  //   expect(routes).toHaveLength(1);
  // });
});
