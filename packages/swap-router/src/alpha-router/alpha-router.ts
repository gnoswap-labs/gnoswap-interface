import { buildTrade } from "./utility/trade-helpers";
import { getHighestLiquidityV3NativePool, getHighestLiquidityV3USDPool } from "./utility/gas-factory-helpers";
import { ChainId, Currency, CurrencyAmount, Fraction, Token, TradeType } from "./core";
import { GnoJSONRPCProvider, GnoProvider } from "@gnolang/gno-js-client";
import { CacheMode, IGasPriceProvider, IOnChainQuoteProvider, ITokenProvider, IV3PoolProvider, OnChainGasPriceProvider, OnChainQuoteProvider, TokenProvider, V3PoolProvider } from "./providers";
import { IPortionProvider, PortionProvider } from "./providers/portion-provider";
import { Protocol } from "./router-sdk";
import { IRouter, SwapOptions, SwapRoute } from "./router";
import { GetQuotesResult, V3Quoter } from "./quoters";
import { DEFAULT_ROUTING_CONFIG_BY_CHAIN } from "./config";
import { GasModelProviderConfig, IGasModel, LiquidityCalculationPools, V3HeuristicGasModelFactory } from "./gas-models";
import { NATIVE_OVERHEAD } from "./gas-models/v3/gas-costs";
import _ from "lodash";
import { BestSwapRoute, getBestSwapRoute } from "./functions/best-swap-route";
import { RouteWithValidQuote, V3RouteWithValidQuote } from "./entities";
import BigNumber from "bignumber.js";
import { CandidatePoolsBySelectionCriteria, getV3CandidatePools, V3CandidatePools } from "./functions/get-candidate-pools";
import { GNO_PROVIDER_RPC, WRAPPED_NATIVE_CURRENCY } from "./utility";

export type AlphaRouterParams = {
  /**
   * The chain id for this instance of the Alpha Router.
   */
  chainId: ChainId;
  /**
   * The Web3 provider for getting on-chain data.
   */
  provider?: GnoProvider;
  /**
   * The provider for getting data about V3 pools.
   */
  v3PoolProvider?: IV3PoolProvider;
  /**
   * The provider for getting V3 quotes.
   */
  onChainQuoteProvider?: IOnChainQuoteProvider;
  /**
   * The provider for getting data about Tokens.
   */
  tokenProvider?: ITokenProvider;
  /**
   * The provider for getting the current gas price to use when account for gas in the
   * algorithm.
   */
  gasPriceProvider?: IGasPriceProvider;

  portionProvider: IPortionProvider;
};

export class MapWithLowerCaseKey<V> extends Map<string, V> {
  override set(key: string, value: V): this {
    return super.set(key.toLowerCase(), value);
  }
}

export class LowerCaseStringArray extends Array<string> {
  constructor(...items: string[]) {
    // Convert all items to lowercase before calling the parent constructor
    super(...items.map((item) => item.toLowerCase()));
  }
}

/**
 * Determines the pools that the algorithm will consider when finding the optimal swap.
 *
 * All pools on each protocol are filtered based on the heuristics specified here to generate
 * the set of candidate pools. The Top N pools are taken by Total Value Locked (TVL).
 *
 * Higher values here result in more pools to explore which results in higher latency.
 */
export type ProtocolPoolSelection = {
  /**
   * The top N pools by TVL out of all pools on the protocol.
   */
  topN: number;
  /**
   * The top N pools by TVL of pools that consist of tokenIn and tokenOut.
   */
  topNDirectSwaps: number;
  /**
   * The top N pools by TVL of pools where one token is tokenIn and the
   * top N pools by TVL of pools where one token is tokenOut tokenOut.
   */
  topNTokenInOut: number;
  /**
   * Given the topNTokenInOut pools, gets the top N pools that involve the other token.
   * E.g. for a WETH -> USDC swap, if topNTokenInOut found WETH -> DAI and WETH -> USDT,
   * a value of 2 would find the top 2 pools that involve DAI and top 2 pools that involve USDT.
   */
  topNSecondHop: number;
  /**
   * Given the topNTokenInOut pools and a token address,
   * gets the top N pools that involve the other token.
   * If token address is not on the list, we default to topNSecondHop.
   * E.g. for a WETH -> USDC swap, if topNTokenInOut found WETH -> DAI and WETH -> USDT,
   * and there's a mapping USDT => 4, but no mapping for DAI
   * it would find the top 4 pools that involve USDT, and find the topNSecondHop pools that involve DAI
   */
  topNSecondHopForTokenAddress?: MapWithLowerCaseKey<number>;
  /**
   * List of token addresses to avoid using as a second hop.
   * There might be multiple reasons why we would like to avoid a specific token,
   *   but the specific reason that we are trying to solve is when the pool is not synced properly
   *   e.g. when the pool has a rebasing token that isn't syncing the pool on every rebase.
   */
  tokensToAvoidOnSecondHops?: LowerCaseStringArray;
  /**
   * The top N pools for token in and token out that involve a token from a list of
   * hardcoded 'base tokens'. These are standard tokens such as WETH, USDC, DAI, etc.
   * This is similar to how the legacy routing algorithm used by Uniswap would select
   * pools and is intended to make the new pool selection algorithm close to a superset
   * of the old algorithm.
   */
  topNWithEachBaseToken: number;
  /**
   * Given the topNWithEachBaseToken pools, takes the top N pools from the full list.
   * E.g. for a WETH -> USDC swap, if topNWithEachBaseToken found WETH -0.05-> DAI,
   * WETH -0.01-> DAI, WETH -0.05-> USDC, WETH -0.3-> USDC, a value of 2 would reduce
   * this set to the top 2 pools from that full list.
   */
  topNWithBaseToken: number;
};

export type AlphaRouterConfig = {
  /**
   * The block number to use for all on-chain data. If not provided, the router will
   * use the latest block returned by the provider.
   */
  blockNumber?: number | Promise<number>;
  /**
   * The protocols to consider when finding the optimal swap. If not provided all protocols
   * will be used.
   */
  protocols?: Protocol[];
  /**
   * Config for selecting which pools to consider routing via on V3.
   */
  v3PoolSelection: ProtocolPoolSelection;
  /**
   * For each route, the maximum number of hops to consider. More hops will increase latency of the algorithm.
   */
  maxSwapsPerPath: number;
  /**
   * The maximum number of splits in the returned route. A higher maximum will increase latency of the algorithm.
   */
  maxSplits: number;
  /**
   * The minimum number of splits in the returned route.
   * This parameters should always be set to 1. It is only included for testing purposes.
   */
  minSplits: number;
  /**
   * Forces the returned swap to route across all protocols.
   * This parameter should always be false. It is only included for testing purposes.
   */
  forceCrossProtocol: boolean;
  /**
   * The minimum percentage of the input token to use for each route in a split route.
   * All routes will have a multiple of this value. For example is distribution percentage is 5,
   * a potential return swap would be:
   *
   * 5% of input => Route 1
   * 55% of input => Route 2
   * 40% of input => Route 3
   */
  distributionPercent: number;
  /**
   * Flag to indicate whether to use the cached routes or not.
   * By default, the cached routes will be used.
   */
  useCachedRoutes?: boolean;
  /**
   * Flag to indicate whether to write to the cached routes or not.
   * By default, the cached routes will be written to.
   */
  writeToCachedRoutes?: boolean;
  /**
   * Flag to indicate whether to use the CachedRoutes in optimistic mode.
   * Optimistic mode means that we will allow blocksToLive greater than 1.
   */
  optimisticCachedRoutes?: boolean;
  /**
   * Debug param that helps to see the short-term latencies improvements without impacting the main path.
   */
  debugRouting?: boolean;
  /**
   * Flag that allow us to override the cache mode.
   */
  overwriteCacheMode?: CacheMode;
  /**
   * Flag for token properties provider to enable fetching fee-on-transfer tokens.
   */
  enableFeeOnTransferFeeFetching?: boolean;
  /**
   * Tenderly natively support save simulation failures if failed,
   * we need this as a pass-through flag to enable/disable this feature.
   */
  saveTenderlySimulationIfFailed?: boolean;
  /**
   * Include an additional response field specifying the swap gas estimation in terms of a specific gas token.
   * This requires a suitable Native/GasToken pool to exist on V3. If one does not exist this field will return null.
   */
  gasToken?: string;
};

export class AlphaRouter
  implements
    IRouter<AlphaRouterConfig>
{
  protected chainId: ChainId;
  protected provider: GnoProvider;
  protected v3PoolProvider: IV3PoolProvider;
  protected onChainQuoteProvider: IOnChainQuoteProvider;
  protected tokenProvider: ITokenProvider;
  protected gasPriceProvider: IGasPriceProvider;
  protected v3Quoter: V3Quoter;
  protected portionProvider: IPortionProvider;

  constructor({
    chainId,
    provider,
    onChainQuoteProvider,
    gasPriceProvider,
    portionProvider,
    v3PoolProvider,
  }: AlphaRouterParams) {
    this.chainId = chainId;
    this.provider = provider || new GnoJSONRPCProvider(GNO_PROVIDER_RPC[this.chainId]);
    this.portionProvider = portionProvider ?? new PortionProvider()

    if (onChainQuoteProvider) {
      this.onChainQuoteProvider = onChainQuoteProvider;
    } else {
      this.onChainQuoteProvider = new OnChainQuoteProvider(this.chainId, this.provider, "");
    }
    
    this.tokenProvider = new TokenProvider(this.chainId);

    this.gasPriceProvider =  gasPriceProvider ?? new OnChainGasPriceProvider();

    this.v3PoolProvider = v3PoolProvider ?? new V3PoolProvider(this.chainId);

    this.v3Quoter = new V3Quoter(
      this.chainId,
      this.v3PoolProvider,
      this.onChainQuoteProvider,
      this.tokenProvider
    );
  }

  /**
   * @inheritdoc IRouter
   */
  public async route(
    amount: CurrencyAmount,
    quoteCurrency: Currency,
    tradeType: TradeType,
    swapConfig?: SwapOptions,
    partialRoutingConfig: Partial<AlphaRouterConfig> = {}
  ): Promise<SwapRoute | null> {
    const originalAmount = amount;
    if (tradeType === TradeType.EXACT_OUTPUT) {
      const portionAmount = this.portionProvider.getPortionAmount(
        amount,
        tradeType,
        swapConfig
      );
      if (portionAmount && portionAmount.greaterThan(0)) {
        // In case of exact out swap, before we route, we need to make sure that the
        // token out amount accounts for flat portion, and token in amount after the best swap route contains the token in equivalent of portion.
        // In other words, in case a pool's LP fee bps is lower than the portion bps (0.01%/0.05% for v3), a pool can go insolvency.
        // This is because instead of the swapper being responsible for the portion,
        // the pool instead gets responsible for the portion.
        // The addition below avoids that situation.
        amount = amount.add(portionAmount);
      }
    }

    const { currencyIn, currencyOut } =
      this.determineCurrencyInOutFromTradeType(
        tradeType,
        amount,
        quoteCurrency
      );

    const tokenIn = currencyIn.wrapped;
    const tokenOut = currencyOut.wrapped;

    // Get a block number to specify in all our calls. Ensures data we fetch from chain is
    // from the same block.
    const blockNumber =
      partialRoutingConfig.blockNumber || 0;

    const routingConfig: AlphaRouterConfig = _.merge(
      DEFAULT_ROUTING_CONFIG_BY_CHAIN(this.chainId),
      partialRoutingConfig,
      { blockNumber }
    );

    const gasPriceWei = await this.getGasPriceWei(
      await blockNumber,
      await partialRoutingConfig.blockNumber
    );

    const quoteToken = quoteCurrency.wrapped;
    // const gasTokenAccessor = await this.tokenProvider.getTokens([routingConfig.gasToken!]);
    const gasToken = routingConfig.gasToken
      ? (
          await this.tokenProvider.getTokens([routingConfig.gasToken])
        ).getTokenByAddress(routingConfig.gasToken)
      : undefined;

    const providerConfig: GasModelProviderConfig = {
      ...routingConfig,
      blockNumber,
      additionalGasOverhead: NATIVE_OVERHEAD(
        this.chainId,
        amount.currency,
        quoteCurrency
      ),
      gasToken,
    };

    // Create a Set to sanitize the protocols input, a Set of undefined becomes an empty set,
    // Then create an Array from the values of that Set.
    const protocols: Protocol[] = Array.from(
      new Set(routingConfig.protocols).values()
    );


    const [v3GasModel] = await this.getGasModels(
      gasPriceWei,
      amount.currency.wrapped,
      quoteToken,
      providerConfig
    );

    let swapRouteFromChainPromise: Promise<BestSwapRoute | null> = this.getSwapRouteFromChain(
        amount,
        tokenIn,
        tokenOut,
        protocols,
        quoteToken,
        tradeType,
        routingConfig,
        v3GasModel,
        gasPriceWei,
        swapConfig
      );

    const [swapRouteFromChain] = await Promise.all([
      swapRouteFromChainPromise,
    ]);

    let swapRouteRaw: BestSwapRoute | null = swapRouteFromChain;

    if (!swapRouteRaw) {
      return null;
    }

    const {
      quote,
      quoteGasAdjusted,
      estimatedGasUsed,
      routes: routeAmounts,
      estimatedGasUsedQuoteToken,
      estimatedGasUsedUSD,
      estimatedGasUsedGasToken,
    } = swapRouteRaw;

    // Build Trade object that represents the optimal swap.

    const tokenOutAmount =
      tradeType === TradeType.EXACT_OUTPUT
        ? originalAmount // we need to pass in originalAmount instead of amount, because amount already added portionAmount in case of exact out swap
        : quote;
    const portionAmount = this.portionProvider.getPortionAmount(
      tokenOutAmount,
      tradeType,
      swapConfig
    );
    const portionQuoteAmount = this.portionProvider.getPortionQuoteAmount(
      tradeType,
      quote,
      amount, // we need to pass in amount instead of originalAmount here, because amount here needs to add the portion for exact out
      portionAmount
    );

    // we need to correct quote and quote gas adjusted for exact output when portion is part of the exact out swap
    const correctedQuote = this.portionProvider.getQuote(
      tradeType,
      quote,
      portionQuoteAmount
    );

    const correctedQuoteGasAdjusted = this.portionProvider.getQuoteGasAdjusted(
      tradeType,
      quoteGasAdjusted,
      portionQuoteAmount
    );
    const quoteGasAndPortionAdjusted =
      this.portionProvider.getQuoteGasAndPortionAdjusted(
        tradeType,
        quoteGasAdjusted,
        portionAmount
      );

    // Build Trade object that represents the optimal swap.
    const trade = buildTrade(
      currencyIn,
      currencyOut,
      tradeType,
      routeAmounts
    );

    const swapRoute: SwapRoute = {
      quote: correctedQuote,
      quoteGasAdjusted: correctedQuoteGasAdjusted,
      estimatedGasUsed,
      estimatedGasUsedQuoteToken,
      estimatedGasUsedUSD,
      estimatedGasUsedGasToken,
      gasPriceWei,
      route: routeAmounts,
      trade,
      blockNumber: BigNumber(await blockNumber),
      hitsCachedRoute: false,
      portionAmount: portionAmount,
      quoteGasAndPortionAdjusted: quoteGasAndPortionAdjusted,
    };


    return swapRoute;
  }

  private async getSwapRouteFromChain(
    amount: CurrencyAmount,
    tokenIn: Token,
    tokenOut: Token,
    protocols: Protocol[],
    quoteToken: Token,
    tradeType: TradeType,
    routingConfig: AlphaRouterConfig,
    v3GasModel: IGasModel<V3RouteWithValidQuote>,
    gasPriceWei: BigNumber,
    swapConfig?: SwapOptions
  ): Promise<BestSwapRoute | null> {
    // Generate our distribution of amounts, i.e. fractions of the input amount.
    // We will get quotes for fractions of the input amount for different routes, then
    // combine to generate split routes.
    const [percents, amounts] = this.getAmountDistribution(
      amount,
      routingConfig
    );

    const noProtocolsSpecified = protocols.length === 0;
    const v3ProtocolSpecified = protocols.includes(Protocol.V3);

    let v3CandidatePoolsPromise: Promise<V3CandidatePools | undefined> =
      Promise.resolve(undefined);
    if (
      v3ProtocolSpecified ||
      noProtocolsSpecified 
    ) {
      v3CandidatePoolsPromise = getV3CandidatePools({
        tokenIn,
        tokenOut,
        tokenProvider: this.tokenProvider,
        poolProvider: this.v3PoolProvider,
        routeType: tradeType,
        routingConfig,
        chainId: this.chainId,
      }).then((candidatePools) => {
        return candidatePools;
      });
    }

    const quotePromises: Promise<GetQuotesResult>[] = [];
    if (v3ProtocolSpecified || noProtocolsSpecified) {
      quotePromises.push(
        v3CandidatePoolsPromise.then((v3CandidatePools) =>
          this.v3Quoter
            .getRoutesThenQuotes(
              tokenIn,
              tokenOut,
              amount,
              amounts,
              percents,
              quoteToken,
              v3CandidatePools!,
              tradeType,
              routingConfig,
              v3GasModel
            )
            .then((result) => {
              return result;
            })
        )
      );
    }

    const getQuotesResults = await Promise.all(quotePromises);

    const allRoutesWithValidQuotes: RouteWithValidQuote[] = [];
    const allCandidatePools: CandidatePoolsBySelectionCriteria[] = [];
    getQuotesResults.forEach((getQuoteResult) => {
      allRoutesWithValidQuotes.push(...getQuoteResult.routesWithValidQuotes);
      if (getQuoteResult.candidatePools) {
        allCandidatePools.push(getQuoteResult.candidatePools);
      }
    });

    if (allRoutesWithValidQuotes.length === 0) {
      return null;
    }

    // Given all the quotes for all the amounts for all the routes, find the best combination.
    const bestSwapRoute = await getBestSwapRoute(
      amount,
      percents,
      allRoutesWithValidQuotes,
      tradeType,
      this.chainId,
      routingConfig,
      this.portionProvider,
      v3GasModel,
      swapConfig
    );

    return bestSwapRoute;
  }

  private tradeTypeStr(tradeType: TradeType): string {
    return tradeType === TradeType.EXACT_INPUT ? 'ExactIn' : 'ExactOut';
  }

  private tokenPairSymbolTradeTypeChainId(
    tokenIn: Token,
    tokenOut: Token,
    tradeType: TradeType
  ) {
    return `${tokenIn.symbol}/${tokenOut.symbol}/${this.tradeTypeStr(
      tradeType
    )}/${this.chainId}`;
  }

  private async getGasModels(
    gasPriceWei: BigNumber,
    amountToken: Token,
    quoteToken: Token,
    providerConfig?: GasModelProviderConfig
  ): Promise<
    [IGasModel<V3RouteWithValidQuote>]
  > {
    const usdPoolPromise = getHighestLiquidityV3USDPool(
      this.chainId,
      this.v3PoolProvider,
      providerConfig
    ).catch(() => null);
    const nativeCurrency = WRAPPED_NATIVE_CURRENCY[this.chainId];
    const nativeAndQuoteTokenV3PoolPromise = !quoteToken.equals(nativeCurrency)
      ? getHighestLiquidityV3NativePool(
          quoteToken,
          this.v3PoolProvider,
          providerConfig
        )
      : Promise.resolve(null);
    const nativeAndAmountTokenV3PoolPromise = !amountToken.equals(
      nativeCurrency
    )
      ? getHighestLiquidityV3NativePool(
          amountToken,
          this.v3PoolProvider,
          providerConfig
        )
      : Promise.resolve(null);

    // If a specific gas token is specified in the provider config
    // fetch the highest liq V3 pool with it and the native currency
    const nativeAndSpecifiedGasTokenV3PoolPromise =
      providerConfig?.gasToken &&
      !providerConfig?.gasToken.equals(nativeCurrency)
        ? getHighestLiquidityV3NativePool(
            providerConfig?.gasToken,
            this.v3PoolProvider,
            providerConfig
          )
        : Promise.resolve(null);

    const [
      usdPool,
      nativeAndQuoteTokenV3Pool,
      nativeAndAmountTokenV3Pool,
      nativeAndSpecifiedGasTokenV3Pool,
    ] = await Promise.all([
      usdPoolPromise,
      nativeAndQuoteTokenV3PoolPromise,
      nativeAndAmountTokenV3PoolPromise,
      nativeAndSpecifiedGasTokenV3PoolPromise,
    ]);

    const pools: LiquidityCalculationPools = {
      usdPool: usdPool,
      nativeAndQuoteTokenV3Pool: nativeAndQuoteTokenV3Pool,
      nativeAndAmountTokenV3Pool: nativeAndAmountTokenV3Pool,
      nativeAndSpecifiedGasTokenV3Pool: nativeAndSpecifiedGasTokenV3Pool,
    };

    const v3GasModelPromise = new V3HeuristicGasModelFactory().buildGasModel({
      chainId: this.chainId,
      gasPriceWei,
      pools,
      amountToken,
      quoteToken,
      providerConfig: providerConfig,
    });

    const [v3GasModel] = await Promise.all([
      v3GasModelPromise
    ]);
    return [v3GasModel];
  }

  private determineCurrencyInOutFromTradeType(
    tradeType: TradeType,
    amount: CurrencyAmount,
    quoteCurrency: Currency
  ) {
    if (tradeType === TradeType.EXACT_INPUT) {
      return {
        currencyIn: amount.currency,
        currencyOut: quoteCurrency,
      };
    } else {
      return {
        currencyIn: quoteCurrency,
        currencyOut: amount.currency,
      };
    }
  }

  private async getGasPriceWei(
    latestBlockNumber: number,
    requestBlockNumber?: number
  ): Promise<BigNumber> {
    // Track how long it takes to resolve this async call.
    const beforeGasTimestamp = Date.now();

    // Get an estimate of the gas price to use when estimating gas cost of different routes.
    const { gasPriceWei } = await this.gasPriceProvider.getGasPrice(
      latestBlockNumber,
      requestBlockNumber
    );

    return gasPriceWei;
  }

  // Note multiplications here can result in a loss of precision in the amounts (e.g. taking 50% of 101)
  // This is reconcilled at the end of the algorithm by adding any lost precision to one of
  // the splits in the route.
  private getAmountDistribution(
    amount: CurrencyAmount,
    routingConfig: AlphaRouterConfig
  ): [number[], CurrencyAmount[]] {
    const { distributionPercent } = routingConfig;
    const percents = [];
    const amounts = [];

    for (let i = 1; i <= 100 / distributionPercent; i++) {
      percents.push(i * distributionPercent);
      amounts.push(amount.multiply(new Fraction(i * distributionPercent, 100)));
    }

    return [percents, amounts];
  }
}

