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

    const { routes } = swapRouteType!;

    expect(Array.isArray(routes)).toBeTruthy();
  });
});
