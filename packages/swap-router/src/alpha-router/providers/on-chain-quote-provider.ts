import { GnoProvider } from "@gnolang/gno-js-client";
import BigNumber from "bignumber.js";
import _ from "lodash";
import { ChainId, Currency, CurrencyAmount, Token } from "../core";
import { V3Route } from "../router";
import { ProviderConfig } from "./provider";
import {
  evaluateExpressionToNumber,
  makeABCIParams,
  makeRoutesQuery,
} from "./utils/gno-rpc-parser";

/**
 * An on chain quote for a swap.
 */
export type AmountQuote = {
  amount: CurrencyAmount;
  /**
   * Quotes can be null (e.g. pool did not have enough liquidity).
   */
  quote: BigNumber | null;
  /**
   * For each pool in the route, the sqrtPriceX96 after the swap.
   */
  sqrtPriceX96AfterList: BigNumber[] | null;
  /**
   * For each pool in the route, the number of ticks crossed.
   */
  initializedTicksCrossedList: number[] | null;
  /**
   * An estimate of the gas used by the swap. This is returned by the multicall
   * and is not necessarily accurate due to EIP-2929 causing gas costs to vary
   * depending on if the slot has already been loaded in the call.
   */
  gasEstimate: BigNumber | null;
};

export class BlockConflictError extends Error {
  public name = "BlockConflictError";
}

export class SuccessRateError extends Error {
  public name = "SuccessRateError";
}

export class ProviderBlockHeaderError extends Error {
  public name = "ProviderBlockHeaderError";
}

export class ProviderTimeoutError extends Error {
  public name = "ProviderTimeoutError";
}

/**
 * This error typically means that the gas used by the multicall has
 * exceeded the total call gas limit set by the node provider.
 *
 * This can be resolved by modifying BatchParams to request fewer
 * quotes per call, or to set a lower gas limit per quote.
 *
 * @export
 * @class ProviderGasError
 */
export class ProviderGasError extends Error {
  public name = "ProviderGasError";
}

/**
 * The V3 route and a list of quotes for that route.
 */
export type RouteWithQuotes<TRoute extends V3Route> = [TRoute, AmountQuote[]];

/**
 * Provider for getting on chain quotes using routes containing V3 pools or V2 pools.
 *
 * @export
 * @interface IOnChainQuoteProvider
 */
export interface IOnChainQuoteProvider {
  /**
   * For every route, gets an exactIn quotes for every amount provided.
   * @notice While passing in exactIn V2Routes is supported, we recommend using the V2QuoteProvider to compute off chain quotes for V2 whenever possible
   *
   * @param amountIns The amounts to get quotes for.
   * @param routes The routes to get quotes for.
   * @param [providerConfig] The provider config.
   * @returns For each route returns a RouteWithQuotes object that contains all the quotes.
   * @returns The blockNumber used when generating the quotes.
   */
  getQuotesManyExactIn<TRoute extends V3Route>(
    inputToken: Currency,
    outputToken: Currency,
    amountIns: CurrencyAmount,
    routes: TRoute[],
    percents: number[],
    providerConfig?: ProviderConfig,
  ): Promise<{
    routesWithQuotes: RouteWithQuotes<TRoute>[];
    blockNumber: BigNumber;
  }>;

  /**
   * For every route, gets ane exactOut quote for every amount provided.
   * @notice This does not support quotes for MixedRoutes (routes with both V3 and V2 pools/pairs) or pure V2 routes
   *
   * @param amountOuts The amounts to get quotes for.
   * @param routes The routes to get quotes for.
   * @param [providerConfig] The provider config.
   * @returns For each route returns a RouteWithQuotes object that contains all the quotes.
   * @returns The blockNumber used when generating the quotes.
   */
  getQuotesManyExactOut<TRoute extends V3Route>(
    inputToken: Currency,
    outputToken: Currency,
    amountOuts: CurrencyAmount,
    routes: TRoute[],
    percents: number[],
    providerConfig?: ProviderConfig,
  ): Promise<{
    routesWithQuotes: RouteWithQuotes<TRoute>[];
    blockNumber: BigNumber;
  }>;
}

/**
 * The parameters for the multicalls we make.
 *
 * It is important to ensure that (gasLimitPerCall * multicallChunk) < providers gas limit per call.
 *
 * On chain quotes can consume a lot of gas (if the swap is so large that it swaps through a large
 * number of ticks), so there is a risk of exceeded gas limits in these multicalls.
 */
export type BatchParams = {
  /**
   * The number of quotes to fetch in each multicall.
   */
  multicallChunk: number;
  /**
   * The maximum call to consume for each quote in the multicall.
   */
  gasLimitPerCall: number;
  /**
   * The minimum success rate for all quotes across all multicalls.
   * If we set our gasLimitPerCall too low it could result in a large number of
   * quotes failing due to out of gas. This parameters will fail the overall request
   * in this case.
   */
  quoteMinSuccessRate: number;
};

/**
 * The fallback values for gasLimit and multicallChunk if any failures occur.
 *
 */

export type FailureOverrides = {
  multicallChunk: number;
  gasLimitOverride: number;
};

export type BlockHeaderFailureOverridesDisabled = { enabled: false };
export type BlockHeaderFailureOverridesEnabled = {
  enabled: true;
  // Offset to apply in the case of a block header failure. e.g. -10 means rollback by 10 blocks.
  rollbackBlockOffset: number;
  // Number of batch failures due to block header before trying a rollback.
  attemptsBeforeRollback: number;
};
export type BlockHeaderFailureOverrides =
  | BlockHeaderFailureOverridesDisabled
  | BlockHeaderFailureOverridesEnabled;

/**
 * Config around what block number to query and how to handle failures due to block header errors.
 */
export type BlockNumberConfig = {
  // Applies an offset to the block number specified when fetching quotes. e.g. -10 means rollback by 10 blocks.
  // Useful for networks where the latest block may not be available on all nodes, causing frequent 'header not found' errors.
  baseBlockOffset: number;
  // Config for handling header not found errors.
  rollback: BlockHeaderFailureOverrides;
};

const DEFAULT_BATCH_RETRIES = 2;

/**
 * Computes on chain quotes for swaps. For pure V3 routes, quotes are computed on-chain using
 * the 'QuoterV2' smart contract. For exactIn mixed and V2 routes, quotes are computed using the 'MixedRouteQuoterV1' contract
 * This is because computing quotes off-chain would require fetching all the tick data for each pool, which is a lot of data.
 *
 * To minimize the number of requests for quotes we use a Multicall contract. Generally
 * the number of quotes to fetch exceeds the maximum we can fit in a single multicall
 * while staying under gas limits, so we also batch these quotes across multiple multicalls.
 *
 * The biggest challenge with the quote provider is dealing with various gas limits.
 * Each provider sets a limit on the amount of gas a call can consume (on Infura this
 * is approximately 10x the block max size), so we must ensure each multicall does not
 * exceed this limit. Additionally, each quote on V3 can consume a large number of gas if
 * the pool lacks liquidity and the swap would cause all the ticks to be traversed.
 *
 * To ensure we don't exceed the node's call limit, we limit the gas used by each quote to
 * a specific value, and we limit the number of quotes in each multicall request. Users of this
 * class should set BatchParams such that multicallChunk * gasLimitPerCall is less than their node
 * providers total gas limit per call.
 *
 * @export
 * @class OnChainQuoteProvider
 */

export class OnChainQuoteProvider implements IOnChainQuoteProvider {
  /**
   * Creates an instance of OnChainQuoteProvider.
   *
   * @param chainId The chain to get quotes for.
   * @param provider The web 3 provider.
   * @param multicall2Provider The multicall provider to use to get the quotes on-chain.
   * Only supports the Uniswap Multicall contract as it needs the gas limitting functionality.
   * @param retryOptions The retry options for each call to the multicall.
   * @param batchParams The parameters for each batched call to the multicall.
   * @param gasErrorFailureOverride The gas and chunk parameters to use when retrying a batch that failed due to out of gas.
   * @param successRateFailureOverrides The parameters for retries when we fail to get quotes.
   * @param blockNumberConfig Parameters for adjusting which block we get quotes from, and how to handle block header not found errors.
   * @param [quoterAddressOverride] Overrides the address of the quoter contract to use.
   */
  constructor(
    protected chainId: ChainId,
    protected provider: GnoProvider,
    private swapEndpoint: string,
  ) {}

  public async getQuotesManyExactIn<TRoute extends V3Route>(
    inputToken: Currency,
    outputToken: Currency,
    amountIns: CurrencyAmount,
    routes: TRoute[],
    percents: number[],
    providerConfig?: ProviderConfig,
  ): Promise<{
    routesWithQuotes: RouteWithQuotes<TRoute>[];
    blockNumber: BigNumber;
  }> {
    return this.getQuotesManyData(
      inputToken,
      outputToken,
      amountIns,
      routes,
      "quoteExactInput",
      percents,
      providerConfig,
    );
  }

  public async getQuotesManyExactOut<TRoute extends V3Route>(
    inputToken: Currency,
    outputToken: Currency,
    amountOuts: CurrencyAmount,
    routes: TRoute[],
    percents: number[],
    providerConfig?: ProviderConfig,
  ): Promise<{
    routesWithQuotes: RouteWithQuotes<TRoute>[];
    blockNumber: BigNumber;
  }> {
    return this.getQuotesManyData(
      inputToken,
      outputToken,
      amountOuts,
      routes,
      "quoteExactOutput",
      percents,
      providerConfig,
    );
  }

  private async getQuotesManyData<TRoute extends V3Route>(
    inputToken: Currency,
    outputToken: Currency,
    amount: CurrencyAmount,
    routes: TRoute[],
    functionName: "quoteExactInput" | "quoteExactOutput",
    percents: number[],
    _providerConfig?: ProviderConfig,
  ): Promise<{
    routesWithQuotes: RouteWithQuotes<TRoute>[];
    blockNumber: BigNumber;
  }> {
    const callEstimateSwapRoutePromise = async (
      inputToken: Currency,
      outputToken: Currency,
      amountRaw: string,
      exactType: "EXACT_IN" | "EXACT_OUT",
      route: TRoute,
      percent: number,
    ): Promise<AmountQuote> => {
      const routesQuery = makeRoutesQuery([route], inputToken.address || "");
      const adjustAmountRaw = BigNumber(amountRaw)
        .multipliedBy(percent)
        .dividedBy(100)
        .toFixed(0);

      const url = this.swapEndpoint;
      const params = [
        "routeArr=" + routesQuery,
        "swapType=" + exactType,
        "amountSpecified=" + adjustAmountRaw,
      ];
      const paramStr = params.join("&");

      if (url === "") {
        return {
          amount: CurrencyAmount.fromRawAmount(inputToken, amountRaw),
          quote: BigNumber(0),
          sqrtPriceX96AfterList: [BigNumber(1)],
          initializedTicksCrossedList: [1],
          gasEstimate: BigNumber(1),
        };
      }

      const result = await fetch(url + "?" + paramStr)
        .then(async response => {
          const json = await response.json();
          if (json.error === undefined || json.error === true) {
            return 0;
          }
          return BigNumber(json["resultAmount"] || 0).toNumber();
        })
        .catch(e => {
          console.log("err: ", e);
          return 0;
        });

      return {
        amount: CurrencyAmount.fromRawAmount(inputToken, amountRaw),
        quote: BigNumber(result),
        sqrtPriceX96AfterList: [BigNumber(1)],
        initializedTicksCrossedList: [1],
        gasEstimate: BigNumber(1),
      };
    };

    const callRouteResultsPromise = async (
      inputToken: Currency,
      outputToken: Currency,
      amountRaw: string,
      exactType: "EXACT_IN" | "EXACT_OUT",
      route: TRoute,
      percents: number[],
    ): Promise<RouteWithQuotes<TRoute>> => {
      const amountQuotesPromise = _.map(percents, async percent =>
        callEstimateSwapRoutePromise(
          inputToken,
          outputToken,
          amountRaw,
          exactType,
          route,
          percent,
        ),
      );
      const routeWithQuotes = await Promise.all(amountQuotesPromise).then<
        RouteWithQuotes<TRoute>
      >(amountQuotes => [route, amountQuotes]);
      return routeWithQuotes;
    };

    const routesWithQuotes: RouteWithQuotes<TRoute>[] = await Promise.all(
      routes.map(route =>
        callRouteResultsPromise(
          inputToken,
          outputToken,
          amount.toFixed(),
          functionName === "quoteExactInput" ? "EXACT_IN" : "EXACT_OUT",
          route,
          percents,
        ),
      ),
    );

    return { routesWithQuotes, blockNumber: BigNumber(0) };
  }
}
