import _ from "lodash";
import { AlphaRouterConfig } from "../alpha-router";
import { ChainId, Currency, CurrencyAmount, Token, TradeType } from "../core";
import { V3RouteWithValidQuote } from "../entities";
import { computeAllV3Routes } from "../functions/compute-all-routes";
import {
  CandidatePoolsBySelectionCriteria,
  V3CandidatePools,
} from "../functions/get-candidate-pools";
import { IGasModel } from "../gas-models";
import {
  IOnChainQuoteProvider,
  ITokenProvider,
  IV3PoolProvider,
} from "../providers";
import { V3Route } from "../router";
import { Protocol } from "../router-sdk";
import { BaseQuoter } from "./base-quoter";
import { GetQuotesResult, GetRoutesResult } from "./model";

export class V3Quoter extends BaseQuoter<V3CandidatePools, V3Route> {
  protected v3PoolProvider: IV3PoolProvider;
  protected onChainQuoteProvider: IOnChainQuoteProvider;

  constructor(
    chainId: ChainId,
    v3PoolProvider: IV3PoolProvider,
    onChainQuoteProvider: IOnChainQuoteProvider,
    tokenProvider: ITokenProvider,
  ) {
    super(chainId, Protocol.V3, tokenProvider);
    this.v3PoolProvider = v3PoolProvider;
    this.onChainQuoteProvider = onChainQuoteProvider;
  }

  protected async getRoutes(
    tokenIn: Token,
    tokenOut: Token,
    v3CandidatePools: V3CandidatePools,
    _tradeType: TradeType,
    routingConfig: AlphaRouterConfig,
  ): Promise<GetRoutesResult<V3Route>> {
    const { poolAccessor, candidatePools } = v3CandidatePools;
    const poolsRaw = poolAccessor.getAllPools();

    // Drop any pools that contain fee on transfer tokens (not supported by v3) or have issues with being transferred.
    // const pools = await this.applyTokenValidatorToPools(
    //   poolsRaw,
    //   (token: Currency): boolean => {
    //     return true;
    //   },
    // );
    const pools = poolsRaw;

    // Given all our candidate pools, compute all the possible ways to route from tokenIn to tokenOut.
    const { maxSwapsPerPath } = routingConfig;
    const routes = computeAllV3Routes(
      tokenIn,
      tokenOut,
      pools,
      maxSwapsPerPath,
    );

    return {
      routes,
      candidatePools,
    };
  }

  public async getQuotes(
    routes: V3Route[],
    amount: CurrencyAmount,
    amounts: CurrencyAmount[],
    percents: number[],
    quoteToken: Token,
    tradeType: TradeType,
    routingConfig: AlphaRouterConfig,
    candidatePools?: CandidatePoolsBySelectionCriteria,
    gasModel?: IGasModel<V3RouteWithValidQuote>,
  ): Promise<GetQuotesResult> {
    if (gasModel === undefined) {
      throw new Error(
        "GasModel for V3RouteWithValidQuote is required to getQuotes",
      );
    }

    if (routes.length == 0) {
      return { routesWithValidQuotes: [], candidatePools };
    }
    // For all our routes, and all the fractional amounts, fetch quotes on-chain.
    const quoteFn =
      tradeType == TradeType.EXACT_INPUT
        ? this.onChainQuoteProvider.getQuotesManyExactIn.bind(
            this.onChainQuoteProvider,
          )
        : this.onChainQuoteProvider.getQuotesManyExactOut.bind(
            this.onChainQuoteProvider,
          );

    const { routesWithQuotes } = await quoteFn<V3Route>(
      amount.currency,
      quoteToken,
      amount,
      routes,
      percents,
    );

    const routesWithValidQuotes = [];

    for (const routeWithQuote of routesWithQuotes) {
      const [route, quotes] = routeWithQuote;

      for (let i = 0; i < quotes.length; i++) {
        const percent = percents[i]!;
        const amountQuote = quotes[i]!;
        const {
          quote,
          amount,
          sqrtPriceX96AfterList,
          initializedTicksCrossedList,
          gasEstimate,
        } = amountQuote;

        if (
          !quote ||
          !sqrtPriceX96AfterList ||
          !initializedTicksCrossedList ||
          !gasEstimate
        ) {
          continue;
        }

        const routeWithValidQuote = new V3RouteWithValidQuote({
          route,
          rawQuote: quote,
          amount,
          percent,
          sqrtPriceX96AfterList,
          initializedTicksCrossedList,
          quoterGasEstimate: gasEstimate,
          gasModel,
          quoteToken,
          tradeType,
          v3PoolProvider: this.v3PoolProvider,
        });

        routesWithValidQuotes.push(routeWithValidQuote);
      }
    }

    return {
      routesWithValidQuotes,
      candidatePools,
    };
  }
}
