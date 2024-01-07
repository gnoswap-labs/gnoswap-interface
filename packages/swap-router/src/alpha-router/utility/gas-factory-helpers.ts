import BigNumber from "bignumber.js";
import JSBI from "jsbi";
import _ from "lodash";
import { ChainId, CurrencyAmount, Token, TradeType } from "../core";
import { V3RouteWithValidQuote } from "../entities";
import {
  GasModelProviderConfig,
  getQuoteThroughNativePool,
  usdGasTokensByChain,
} from "../gas-models";
import { IV3PoolProvider } from "../providers";
import { IPortionProvider } from "../providers/portion-provider";
import { SwapOptions, SwapRoute } from "../router";
import { Protocol } from "../router-sdk";
import { FeeAmount, Pool } from "../v3-sdk";
import { WRAPPED_NATIVE_CURRENCY } from "./chains";
import { buildTrade } from "./trade-helpers";

export async function getHighestLiquidityV3NativePool(
  token: Token,
  poolProvider: IV3PoolProvider,
  providerConfig?: GasModelProviderConfig,
): Promise<Pool | null> {
  const nativeCurrency = WRAPPED_NATIVE_CURRENCY[token.chainId as ChainId]!;

  const nativePools = _([
    FeeAmount.HIGH,
    FeeAmount.MEDIUM,
    FeeAmount.LOW,
    FeeAmount.LOWEST,
  ])
    .map<[Token, Token, FeeAmount]>(feeAmount => {
      return [nativeCurrency, token, feeAmount];
    })
    .value();

  const poolAccessor = await poolProvider.getPools();

  const pools = _([
    FeeAmount.HIGH,
    FeeAmount.MEDIUM,
    FeeAmount.LOW,
    FeeAmount.LOWEST,
  ])
    .map(feeAmount => {
      return poolAccessor.getPool(nativeCurrency, token, feeAmount);
    })
    .compact()
    .value();

  if (pools.length == 0) {
    return null;
  }

  const maxPool = pools.reduce((prev, current) => {
    return JSBI.greaterThan(prev.liquidity, current.liquidity) ? prev : current;
  });

  return maxPool;
}

export async function getHighestLiquidityV3USDPool(
  chainId: ChainId,
  poolProvider: IV3PoolProvider,
  providerConfig?: GasModelProviderConfig,
): Promise<Pool> {
  const usdTokens = usdGasTokensByChain[chainId];
  const wrappedCurrency = WRAPPED_NATIVE_CURRENCY[chainId]!;

  if (!usdTokens) {
    throw new Error(
      `Could not find a USD token for computing gas costs on ${chainId}`,
    );
  }

  const usdPools = _([
    FeeAmount.HIGH,
    FeeAmount.MEDIUM,
    FeeAmount.LOW,
    FeeAmount.LOWEST,
  ])
    .flatMap(feeAmount => {
      return _.map<Token, [Token, Token, FeeAmount]>(usdTokens, usdToken => [
        wrappedCurrency,
        usdToken,
        feeAmount,
      ]);
    })
    .value();

  const poolAccessor = await poolProvider.getPools();

  const pools = _([
    FeeAmount.HIGH,
    FeeAmount.MEDIUM,
    FeeAmount.LOW,
    FeeAmount.LOWEST,
  ])
    .flatMap(feeAmount => {
      const pools = [];

      for (const usdToken of usdTokens) {
        const pool = poolAccessor.getPool(wrappedCurrency, usdToken, feeAmount);
        if (pool) {
          pools.push(pool);
        }
      }

      return pools;
    })
    .compact()
    .value();

  if (pools.length == 0) {
    const message = `Could not find a USD/${wrappedCurrency.symbol} pool for computing gas costs.`;
    throw new Error(message);
  }

  const maxPool = pools.reduce((prev, current) => {
    return JSBI.greaterThan(prev.liquidity, current.liquidity) ? prev : current;
  });

  return maxPool;
}

export function getGasCostInNativeCurrency(
  nativeCurrency: Token,
  gasCostInWei: BigNumber,
) {
  // wrap fee to native currency
  const costNativeCurrency = CurrencyAmount.fromRawAmount(
    nativeCurrency,
    gasCostInWei.toString(),
  );
  return costNativeCurrency;
}

export async function calculateGasUsed(
  chainId: ChainId,
  route: SwapRoute,
  simulatedGasUsed: BigNumber,
  v3PoolProvider: IV3PoolProvider,
  providerConfig?: GasModelProviderConfig,
): Promise<{
  estimatedGasUsedUSD: CurrencyAmount;
  estimatedGasUsedQuoteToken: CurrencyAmount;
  estimatedGasUsedGasToken?: CurrencyAmount;
  quoteGasAdjusted: CurrencyAmount;
}> {
  const quoteToken = route.quote.currency.wrapped;
  const gasPriceWei = route.gasPriceWei;

  // add l2 to l1 fee and wrap fee to native currency
  const gasCostInWei = gasPriceWei.multipliedBy(simulatedGasUsed);
  const nativeCurrency = WRAPPED_NATIVE_CURRENCY[chainId];
  const costNativeCurrency = getGasCostInNativeCurrency(
    nativeCurrency,
    gasCostInWei,
  );

  const usdPool: Pool = await getHighestLiquidityV3USDPool(
    chainId,
    v3PoolProvider,
    providerConfig,
  );

  /** ------ MARK: USD logic  -------- */
  const gasCostUSD = getQuoteThroughNativePool(
    chainId,
    costNativeCurrency,
    usdPool,
  );

  /** ------ MARK: Conditional logic run if gasToken is specified  -------- */
  let gasCostInTermsOfGasToken: CurrencyAmount | undefined = undefined;
  if (providerConfig?.gasToken) {
    if (providerConfig.gasToken.equals(nativeCurrency)) {
      gasCostInTermsOfGasToken = costNativeCurrency;
    } else {
      const nativeAndSpecifiedGasTokenPool = await getHighestLiquidityV3NativePool(
        providerConfig.gasToken,
        v3PoolProvider,
        providerConfig,
      );
      if (nativeAndSpecifiedGasTokenPool) {
        gasCostInTermsOfGasToken = getQuoteThroughNativePool(
          chainId,
          costNativeCurrency,
          nativeAndSpecifiedGasTokenPool,
        );
      }
    }
  }

  /** ------ MARK: Main gas logic in terms of quote token -------- */
  let gasCostQuoteToken: CurrencyAmount = costNativeCurrency;

  // shortcut if quote token is native currency
  if (quoteToken.equals(nativeCurrency)) {
    gasCostQuoteToken = costNativeCurrency;
  }
  // get fee in terms of quote token
  else {
    const nativePools = await Promise.all([
      getHighestLiquidityV3NativePool(
        quoteToken,
        v3PoolProvider,
        providerConfig,
      ),
    ]);
    const nativePool = nativePools.find(pool => pool !== null);

    if (!nativePool) {
      gasCostQuoteToken = CurrencyAmount.fromRawAmount(quoteToken, 0);
    } else {
      gasCostQuoteToken = getQuoteThroughNativePool(
        chainId,
        costNativeCurrency,
        nativePool,
      );
    }
  }

  // Adjust quote for gas fees
  let quoteGasAdjusted;
  if (route.trade.tradeType == TradeType.EXACT_OUTPUT) {
    // Exact output - need more of tokenIn to get the desired amount of tokenOut
    quoteGasAdjusted = route.quote.add(gasCostQuoteToken);
  } else {
    // Exact input - can get less of tokenOut due to fees
    quoteGasAdjusted = route.quote.subtract(gasCostQuoteToken);
  }

  return {
    estimatedGasUsedUSD: gasCostUSD,
    estimatedGasUsedQuoteToken: gasCostQuoteToken,
    estimatedGasUsedGasToken: gasCostInTermsOfGasToken,
    quoteGasAdjusted: quoteGasAdjusted,
  };
}

export function initSwapRouteFromExisting(
  swapRoute: SwapRoute,
  v3PoolProvider: IV3PoolProvider,
  portionProvider: IPortionProvider,
  quoteGasAdjusted: CurrencyAmount,
  estimatedGasUsed: BigNumber,
  estimatedGasUsedQuoteToken: CurrencyAmount,
  estimatedGasUsedUSD: CurrencyAmount,
  swapOptions: SwapOptions,
  estimatedGasUsedGasToken?: CurrencyAmount,
): SwapRoute {
  const currencyIn = swapRoute.trade.inputAmount.currency;
  const currencyOut = swapRoute.trade.outputAmount.currency;
  const tradeType = swapRoute.trade.tradeType.valueOf()
    ? TradeType.EXACT_OUTPUT
    : TradeType.EXACT_INPUT;
  const routesWithValidQuote = swapRoute.route.map(route => {
    switch (route.protocol) {
      case Protocol.V3:
        return new V3RouteWithValidQuote({
          amount: CurrencyAmount.fromFractionalAmount(
            route.amount.currency,
            route.amount.numerator,
            route.amount.denominator,
          ),
          rawQuote: BigNumber(route.rawQuote),
          sqrtPriceX96AfterList: route.sqrtPriceX96AfterList.map(num =>
            BigNumber(num),
          ),
          initializedTicksCrossedList: [...route.initializedTicksCrossedList],
          quoterGasEstimate: BigNumber(route.gasEstimate),
          percent: route.percent,
          route: route.route,
          gasModel: route.gasModel,
          quoteToken: new Token(
            currencyIn.chainId,
            route.quoteToken.address,
            route.quoteToken.decimals,
            route.quoteToken.symbol,
            route.quoteToken.name,
          ),
          tradeType: tradeType,
          v3PoolProvider: v3PoolProvider,
        });
    }
  });
  const trade = buildTrade(
    currencyIn,
    currencyOut,
    tradeType,
    routesWithValidQuote,
  );

  const quoteGasAndPortionAdjusted = swapRoute.portionAmount
    ? portionProvider.getQuoteGasAndPortionAdjusted(
        swapRoute.trade.tradeType,
        quoteGasAdjusted,
        swapRoute.portionAmount,
      )
    : undefined;
  const routesWithValidQuotePortionAdjusted = portionProvider.getRouteWithQuotePortionAdjusted(
    swapRoute.trade.tradeType,
    routesWithValidQuote,
    swapOptions,
  );

  return {
    quote: swapRoute.quote,
    quoteGasAdjusted,
    quoteGasAndPortionAdjusted,
    estimatedGasUsed,
    estimatedGasUsedQuoteToken,
    estimatedGasUsedGasToken,
    estimatedGasUsedUSD,
    gasPriceWei: BigNumber(swapRoute.gasPriceWei),
    trade,
    route: routesWithValidQuotePortionAdjusted,
    blockNumber: BigNumber(swapRoute.blockNumber),
    portionAmount: swapRoute.portionAmount,
  };
}
