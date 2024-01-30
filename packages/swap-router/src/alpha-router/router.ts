import BigNumber from "bignumber.js";
import {
  BigintIsh,
  Currency,
  CurrencyAmount,
  Fraction,
  Percent,
  Token,
  TradeType,
} from "./core";
import { RouteWithValidQuote } from "./entities";
import { Protocol, Trade } from "./router-sdk";
import { Pool, Position, Route as V3RouteRaw } from "./v3-sdk";

export class V3Route extends V3RouteRaw<Token, Token> {
  protocol: Protocol.V3 = Protocol.V3;
}

export type SwapRoute = {
  /**
   * The quote for the swap.
   * For EXACT_IN swaps this will be an amount of token out.
   * For EXACT_OUT this will be an amount of token in.
   */
  quote: CurrencyAmount;
  /**
   * The quote adjusted for the estimated gas used by the swap.
   * This is computed by estimating the amount of gas used by the swap, converting
   * this estimate to be in terms of the quote token, and subtracting that from the quote.
   * i.e. quoteGasAdjusted = quote - estimatedGasUsedQuoteToken
   */
  quoteGasAdjusted: CurrencyAmount;
  /**
   * The quote adjusted for the estimated gas used by the swap as well as the portion amount, if applicable.
   * This is computed by estimating the amount of gas used by the swap, converting
   * this estimate to be in terms of the quote token, and subtracting that from the quote.
   * Then it uses the IPortionProvider.getPortionAdjustedQuote method to adjust the quote for the portion amount.
   * i.e. quoteGasAdjusted = quote - estimatedGasUsedQuoteToken - portionAmount
   */
  quoteGasAndPortionAdjusted?: CurrencyAmount;
  /**
   * The estimate of the gas used by the swap.
   */
  estimatedGasUsed: BigNumber;
  /**
   * The estimate of the gas used by the swap in terms of the quote token.
   */
  estimatedGasUsedQuoteToken: CurrencyAmount;
  /**
   * The estimate of the gas used by the swap in USD.
   */
  estimatedGasUsedUSD: CurrencyAmount;
  /**
   * The estimate of the gas used by the swap in terms of the gas token if specified.
   * will be undefined if no gas token is specified in the AlphaRouter config
   */
  estimatedGasUsedGasToken?: CurrencyAmount;
  /*
   * The gas price used when computing quoteGasAdjusted, estimatedGasUsedQuoteToken, etc.
   */
  gasPriceWei: BigNumber;
  /**
   * The Trade object representing the swap.
   */
  trade: Trade<Currency, Currency, TradeType>;
  /**
   * The routes of the swap.
   */
  route: RouteWithValidQuote[];
  /**
   * The block number used when computing the swap.
   */
  blockNumber: BigNumber;
  /**
   * Enum that is returned if simulation was requested
   * 0 if simulation was not attempted
   * 1 if simulation was attempted and failed
   * 2 if simulation was successful (simulated gas estimates are returned)
   */
  hitsCachedRoute?: boolean;
  /**
   * Portion amount either echoed from upstream routing-api for exact out or calculated from portionBips for exact in
   */
  portionAmount?: CurrencyAmount;
};

export type SwapToRatioRoute = SwapRoute & {
  optimalRatio: Fraction;
  postSwapTargetPool: Pool;
};

export enum SwapToRatioStatus {
  SUCCESS = 1,
  NO_ROUTE_FOUND = 2,
  NO_SWAP_NEEDED = 3,
}

export type SwapToRatioSuccess = {
  status: SwapToRatioStatus.SUCCESS;
  result: SwapToRatioRoute;
};

export type SwapToRatioFail = {
  status: SwapToRatioStatus.NO_ROUTE_FOUND;
  error: string;
};

export type SwapToRatioNoSwapNeeded = {
  status: SwapToRatioStatus.NO_SWAP_NEEDED;
};

export type SwapToRatioResponse =
  | SwapToRatioSuccess
  | SwapToRatioFail
  | SwapToRatioNoSwapNeeded;

export enum SwapType {
  UNIVERSAL_ROUTER,
  SWAP_ROUTER_02,
}

export declare type FlatFeeOptions = {
  amount: BigintIsh;
  recipient: string;
};

/**
 *
 * Options for producing the arguments to send calls to the router.
 */
export interface RouterSwapOptions {
  flatFee?: FlatFeeOptions;
  /**
   * How much the execution price is allowed to move unfavorably from the trade execution price.
   */
  slippageTolerance: Percent;
  /**
   * The account that should receive the output. If omitted, output is sent to msg.sender.
   */
  recipient?: string;
  /**
   * Optional information for taking a fee on output.
   */
  fee?: FeeOptions;
}

// Swap options for Universal Router and Permit2.
export type SwapOptionsUniversalRouter = RouterSwapOptions & {
  type: SwapType.UNIVERSAL_ROUTER;
  simulate?: { fromAddress: string };
};

// Swap options for router-sdk and SwapRouter02.
export type SwapOptionsSwapRouter02 = {
  type: SwapType.SWAP_ROUTER_02;
  recipient: string;
  slippageTolerance: Percent;
  deadline: number;
  simulate?: { fromAddress: string };
  inputTokenPermit?: {
    v: 0 | 1 | 27 | 28;
    r: string;
    s: string;
  } & (
    | {
        amount: string;
        deadline: string;
      }
    | {
        nonce: string;
        expiry: string;
      }
  );
};

export type SwapOptions = SwapOptionsUniversalRouter | SwapOptionsSwapRouter02;

/**
 * Provides functionality for finding optimal swap routes on the Uniswap protocol.
 *
 * @export
 * @abstract
 * @class IRouter
 */
export abstract class IRouter<RoutingConfig> {
  /**
   * Finds the optimal way to swap tokens, and returns the route as well as a quote for the swap.
   * Considers split routes, multi-hop swaps, and gas costs.
   *
   * @abstract
   * @param amount The amount specified by the user. For EXACT_IN swaps, this is the input token amount. For EXACT_OUT swaps, this is the output token.
   * @param quoteCurrency The currency of the token we are returning a quote for. For EXACT_IN swaps, this is the output token. For EXACT_OUT, this is the input token.
   * @param tradeType The type of the trade, either exact in or exact out.
   * @param [swapOptions] Optional config for executing the swap. If provided, calldata for executing the swap will also be returned.
   * @param [partialRoutingConfig] Optional config for finding the optimal route.
   * @returns The swap route.
   */
  abstract route(
    amount: CurrencyAmount,
    quoteCurrency: Currency,
    swapType: TradeType,
    swapOptions?: SwapOptions,
    partialRoutingConfig?: Partial<RoutingConfig>,
  ): Promise<SwapRoute | null>;
}

export abstract class ISwapToRatio<RoutingConfig> {
  abstract routeToRatio(
    token0Balance: CurrencyAmount,
    token1Balance: CurrencyAmount,
    position: Position,
    routingConfig?: RoutingConfig,
  ): Promise<SwapToRatioResponse>;
}

export interface FeeOptions {
  /**
   * The percent of the output that will be taken as a fee.
   */
  fee: Percent;
  /**
   * The recipient of the fee.
   */
  recipient: string;
}
