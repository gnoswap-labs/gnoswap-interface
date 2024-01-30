import BigNumber from "bignumber.js";
import _ from "lodash";
import { AlphaRouterConfig } from "../alpha-router";
import { ChainId, Currency, CurrencyAmount, Token, TradeType } from "../core";
import { V3RouteWithValidQuote } from "../entities";
import {
  CandidatePoolsBySelectionCriteria,
  V3CandidatePools,
} from "../functions/get-candidate-pools";
import { IGasModel } from "../gas-models";
import { ITokenProvider } from "../providers";
import { V3Route } from "../router";
import { Protocol } from "../router-sdk";
import { Pair, Pool } from "../v3-sdk";

import { GetQuotesResult, GetRoutesResult } from "./model/results";

/**
 * Interface for a Quoter.
 * Defines the base dependencies, helper methods and interface for how to fetch quotes.
 *
 * @abstract
 * @template CandidatePools
 * @template Route
 */
export abstract class BaseQuoter<
  CandidatePools extends V3CandidatePools,
  Route extends V3Route
> {
  protected chainId: ChainId;
  protected protocol: Protocol;
  protected tokenProvider: ITokenProvider;

  constructor(
    chainId: ChainId,
    protocol: Protocol,
    tokenProvider: ITokenProvider,
  ) {
    this.tokenProvider = tokenProvider;
    this.chainId = chainId;
    this.protocol = protocol;
  }

  /**
   * Protected method in charge of fetching the routes for the tokenIn/tokenOut pair.
   *
   * @protected
   * @abstract
   * @param tokenIn The token that the user wants to provide
   * @param tokenOut The token that the usaw wants to receive
   * @param candidatePools the candidate pools that are used to generate the routes
   * @param tradeType The type of quote the user wants. He could want to provide exactly X tokenIn or receive exactly X tokenOut
   * @param routingConfig
   * @returns Promise<GetRoutesResult<Route>>
   */
  protected abstract getRoutes(
    tokenIn: Token,
    tokenOut: Token,
    candidatePools: CandidatePools,
    tradeType: TradeType,
    routingConfig: AlphaRouterConfig,
  ): Promise<GetRoutesResult<Route>>;

  /**
   * Public method that will fetch quotes for the combination of every route and every amount.
   *
   * @param routes the list of route that can be used to fetch a quote.
   * @param amounts the list of amounts to query for EACH route.
   * @param percents the percentage of each amount.
   * @param quoteToken
   * @param tradeType
   * @param routingConfig
   * @param candidatePools the candidate pools that were used to generate the routes
   * @param gasModel the gasModel to be used for estimating gas cost
   * @param gasPriceWei instead of passing gasModel, gasPriceWei is used to generate a gasModel
   * @returns Promise<GetQuotesResult<Route>>
   */
  abstract getQuotes(
    routes: Route[],
    amount: CurrencyAmount,
    amounts: CurrencyAmount[],
    percents: number[],
    quoteToken: Token,
    tradeType: TradeType,
    routingConfig: AlphaRouterConfig,
    candidatePools?: CandidatePoolsBySelectionCriteria,
    gasModel?: IGasModel<V3RouteWithValidQuote>,
    gasPriceWei?: BigNumber,
  ): Promise<GetQuotesResult>;

  /**
   * Public method which would first get the routes and then get the quotes.
   *
   * @param tokenIn The token that the user wants to provide
   * @param tokenOut The token that the usaw wants to receive
   * @param amounts the list of amounts to query for EACH route.
   * @param percents the percentage of each amount.
   * @param quoteToken
   * @param candidatePools
   * @param tradeType
   * @param routingConfig
   * @param gasModel the gasModel to be used for estimating gas cost
   * @param gasPriceWei instead of passing gasModel, gasPriceWei is used to generate a gasModel
   */
  public getRoutesThenQuotes(
    tokenIn: Token,
    tokenOut: Token,
    amount: CurrencyAmount,
    amounts: CurrencyAmount[],
    percents: number[],
    quoteToken: Token,
    candidatePools: CandidatePools,
    tradeType: TradeType,
    routingConfig: AlphaRouterConfig,
    gasModel: IGasModel<V3RouteWithValidQuote>,
  ): Promise<GetQuotesResult> {
    return this.getRoutes(
      tokenIn,
      tokenOut,
      candidatePools,
      tradeType,
      routingConfig,
    ).then(routesResult => {
      if (routesResult.routes.length == 1) {
        percents = [100];
        amounts = [amount];
      }

      return this.getQuotes(
        routesResult.routes,
        amount,
        amounts,
        percents,
        quoteToken,
        tradeType,
        routingConfig,
        routesResult.candidatePools,
        gasModel,
      );
    });
  }

  protected async applyTokenValidatorToPools<T extends Pool | Pair>(
    pools: T[],
    isInvalidFn: (token: Currency) => boolean,
  ): Promise<T[]> {
    const poolsFiltered = _.filter(pools, (pool: T) => {
      const token0Invalid = isInvalidFn(pool.token0);
      const token1Invalid = isInvalidFn(pool.token1);

      return !token0Invalid && !token1Invalid;
    });

    return poolsFiltered;
  }
}
