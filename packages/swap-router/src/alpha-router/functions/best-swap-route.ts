import BigNumber from "bignumber.js";
import JSBI from "jsbi";
import _ from "lodash";
import { FixedReverseHeap, Queue } from "mnemonist";
import { AlphaRouterConfig } from "../alpha-router";
import { ChainId, CurrencyAmount, TradeType } from "../core";
import { IGasModel, usdGasTokensByChain } from "../gas-models";
import { IPortionProvider } from "../providers/portion-provider";
import { SwapOptions } from "../router";

import {
  RouteWithValidQuote,
  V3RouteWithValidQuote,
} from "./../entities/route-with-valid-quote";

export type BestSwapRoute = {
  quote: CurrencyAmount;
  quoteGasAdjusted: CurrencyAmount;
  estimatedGasUsed: BigNumber;
  estimatedGasUsedUSD: CurrencyAmount;
  estimatedGasUsedQuoteToken: CurrencyAmount;
  estimatedGasUsedGasToken?: CurrencyAmount;
  routes: RouteWithValidQuote[];
};

export async function getBestSwapRoute(
  amount: CurrencyAmount,
  percents: number[],
  routesWithValidQuotes: RouteWithValidQuote[],
  routeType: TradeType,
  chainId: ChainId,
  routingConfig: AlphaRouterConfig,
  portionProvider: IPortionProvider,
  gasModel?: IGasModel<V3RouteWithValidQuote>,
  swapConfig?: SwapOptions,
): Promise<BestSwapRoute | null> {
  const now = Date.now();

  // Build a map of percentage of the input to list of valid quotes.
  // Quotes can be null for a variety of reasons (not enough liquidity etc), so we drop them here too.
  const percentToQuotes: { [percent: number]: RouteWithValidQuote[] } = {};
  for (const routeWithValidQuote of routesWithValidQuotes) {
    if (!percentToQuotes[routeWithValidQuote.percent]) {
      percentToQuotes[routeWithValidQuote.percent] = [];
    }
    percentToQuotes[routeWithValidQuote.percent]!.push(routeWithValidQuote);
  }

  // Given all the valid quotes for each percentage find the optimal route.
  const swapRoute = await getBestSwapRouteBy(
    routeType,
    percentToQuotes,
    percents,
    chainId,
    (rq: RouteWithValidQuote) => rq.quoteAdjustedForGas,
    routingConfig,
    portionProvider,
    gasModel,
    swapConfig,
  );

  // It is possible we were unable to find any valid route given the quotes.
  if (!swapRoute) {
    return null;
  }

  // Due to potential loss of precision when taking percentages of the input it is possible that the sum of the amounts of each
  // route of our optimal quote may not add up exactly to exactIn or exactOut.
  //
  // We check this here, and if there is a mismatch
  // add the missing amount to a random route. The missing amount size should be neglible so the quote should still be highly accurate.
  const { routes: routeAmounts } = swapRoute;
  const totalAmount = _.reduce(
    routeAmounts,
    (total, routeAmount) => total.add(routeAmount.amount),
    CurrencyAmount.fromRawAmount(routeAmounts[0]!.amount.currency, 0),
  );

  const missingAmount = amount.subtract(totalAmount);
  if (missingAmount.greaterThan(0)) {
    routeAmounts[routeAmounts.length - 1]!.amount = routeAmounts[
      routeAmounts.length - 1
    ]!.amount.add(missingAmount);
  }

  return swapRoute;
}

export async function getBestSwapRouteBy(
  routeType: TradeType,
  percentToQuotes: { [percent: number]: RouteWithValidQuote[] },
  percents: number[],
  chainId: ChainId,
  by: (routeQuote: RouteWithValidQuote) => CurrencyAmount,
  routingConfig: AlphaRouterConfig,
  portionProvider: IPortionProvider,
  gasModel?: IGasModel<V3RouteWithValidQuote>,
  swapConfig?: SwapOptions,
): Promise<BestSwapRoute | undefined> {
  // Build a map of percentage to sorted list of quotes, with the biggest quote being first in the list.
  const percentToSortedQuotes = _.mapValues(
    percentToQuotes,
    (routeQuotes: RouteWithValidQuote[]) => {
      return routeQuotes.sort((routeQuoteA, routeQuoteB) => {
        if (
          !routeQuoteA.quote.greaterThan(0) ||
          !routeQuoteB.quote.greaterThan(0)
        ) {
          return 0;
        }
        if (routeType == TradeType.EXACT_INPUT) {
          return routeQuoteA.quote.greaterThan(routeQuoteB.quote) ? -1 : 1;
        } else {
          return routeQuoteA.quote.lessThan(routeQuoteB.quote) ? -1 : 1;
        }
      });
    },
  );

  const quoteCompFn =
    routeType == TradeType.EXACT_INPUT
      ? (a: CurrencyAmount, b: CurrencyAmount) => a.greaterThan(b)
      : (a: CurrencyAmount, b: CurrencyAmount) => a.lessThan(b);

  const sumFn = (currencyAmounts: CurrencyAmount[]): CurrencyAmount => {
    let sum = currencyAmounts[0]!;
    for (let i = 1; i < currencyAmounts.length; i++) {
      sum = sum.add(currencyAmounts[i]!);
    }
    return sum;
  };

  let bestQuote: CurrencyAmount | undefined;
  let bestSwap: RouteWithValidQuote[] | undefined;

  // Min-heap for tracking the 5 best swaps given some number of splits.
  const bestSwapsPerSplit = new FixedReverseHeap<{
    quote: CurrencyAmount;
    routes: RouteWithValidQuote[];
  }>(
    Array,
    (a, b) => {
      return quoteCompFn(a.quote, b.quote) ? -1 : 1;
    },
    3,
  );

  const { minSplits, maxSplits, forceCrossProtocol } = routingConfig;

  if (!percentToSortedQuotes[100] || minSplits > 1 || forceCrossProtocol) {
    console.log(
      {
        percentToSortedQuotes: _.mapValues(
          percentToSortedQuotes,
          p => p.length,
        ),
      },
      "Did not find a valid route without any splits. Continuing search anyway.",
    );
  } else {
    bestQuote = percentToSortedQuotes[100][0]!.quote;
    bestSwap = [percentToSortedQuotes[100][0]!];

    for (const routeWithQuote of percentToSortedQuotes[100].slice(0, 5)) {
      bestSwapsPerSplit.push({
        quote: routeWithQuote.quote,
        routes: [routeWithQuote],
      });
    }
  }

  // We do a BFS. Each additional node in a path represents us adding an additional split to the route.
  const queue = new Queue<{
    percentIndex: number;
    curRoutes: RouteWithValidQuote[];
    remainingPercent: number;
    special: boolean;
  }>();

  // First we seed BFS queue with the best quotes for each percentage.
  // i.e. [best quote when sending 10% of amount, best quote when sending 20% of amount, ...]
  // We will explore the various combinations from each node.
  for (let i = percents.length; i >= 0; i--) {
    const percent = percents[i]!;

    if (!percentToSortedQuotes[percent]) {
      continue;
    }

    queue.enqueue({
      curRoutes: [percentToSortedQuotes[percent]![0]!],
      percentIndex: i,
      remainingPercent: 100 - percent,
      special: false,
    });

    if (
      !percentToSortedQuotes[percent] ||
      !percentToSortedQuotes[percent]![1]
    ) {
      continue;
    }

    queue.enqueue({
      curRoutes: [percentToSortedQuotes[percent]![1]!],
      percentIndex: i,
      remainingPercent: 100 - percent,
      special: true,
    });
  }

  let splits = 1;
  let startedSplit = Date.now();

  while (queue.size > 0) {
    startedSplit = Date.now();
    bestSwapsPerSplit.clear();

    // Size of the queue at this point is the number of potential routes we are investigating for the given number of splits.
    let layer = queue.size;
    splits++;

    // If we didn't improve our quote by adding another split, very unlikely to improve it by splitting more after that.
    if (splits >= 3 && bestSwap && bestSwap.length < splits - 1) {
      break;
    }

    if (splits > maxSplits) {
      break;
    }

    while (layer > 0) {
      layer--;

      const {
        remainingPercent,
        curRoutes,
        percentIndex,
        special,
      } = queue.dequeue()!;

      // For all other percentages, add a new potential route.
      // E.g. if our current aggregated route if missing 50%, we will create new nodes and add to the queue for:
      // 50% + new 10% route, 50% + new 20% route, etc.
      for (let i = percentIndex; i >= 0; i--) {
        const percentA = percents[i]!;

        if (percentA > remainingPercent) {
          continue;
        }

        // At some point the amount * percentage is so small that the quoter is unable to get
        // a quote. In this case there could be no quotes for that percentage.
        if (!percentToSortedQuotes[percentA]) {
          continue;
        }

        const candidateRoutesA = percentToSortedQuotes[percentA]!;

        // Find the best route in the complimentary percentage that doesn't re-use a pool already
        // used in the current route. Re-using pools is not allowed as each swap through a pool changes its liquidity,
        // so it would make the quotes inaccurate.
        const routeWithQuoteA = findFirstRouteNotUsingUsedPools(
          curRoutes,
          candidateRoutesA,
          forceCrossProtocol,
        );

        if (!routeWithQuoteA || !routeWithQuoteA.quote.greaterThan(0)) {
          continue;
        }

        const remainingPercentNew = remainingPercent - percentA;
        const curRoutesNew = [...curRoutes, routeWithQuoteA];

        // If we've found a route combination that uses all 100%, and it has at least minSplits, update our best route.
        if (remainingPercentNew == 0 && splits >= minSplits) {
          const quotesNew = _.map(curRoutesNew, r => r.quote);
          const quoteNew = sumFn(quotesNew);

          let gasCostL1QuoteToken = CurrencyAmount.fromRawAmount(
            quoteNew.currency,
            0,
          );

          const quoteAfterL1Adjust =
            routeType == TradeType.EXACT_INPUT
              ? quoteNew.subtract(gasCostL1QuoteToken)
              : quoteNew.add(gasCostL1QuoteToken);

          bestSwapsPerSplit.push({
            quote: quoteAfterL1Adjust,
            routes: curRoutesNew,
          });

          if (!bestQuote || quoteCompFn(quoteAfterL1Adjust, bestQuote)) {
            bestQuote = quoteAfterL1Adjust;
            bestSwap = curRoutesNew;
          }
        } else {
          queue.enqueue({
            curRoutes: curRoutesNew,
            remainingPercent: remainingPercentNew,
            percentIndex: i,
            special,
          });
        }
      }
    }
  }

  if (!bestSwap) {
    return undefined;
  }

  const postSplitNow = Date.now();

  let quoteGasAdjusted = sumFn(
    _.map(
      bestSwap,
      routeWithValidQuote => routeWithValidQuote.quoteAdjustedForGas,
    ),
  );

  // this calculates the base gas used
  // if on L1, its the estimated gas used based on hops and ticks across all the routes
  // if on L2, its the gas used on the L2 based on hops and ticks across all the routes
  const estimatedGasUsed = _(bestSwap)
    .map(routeWithValidQuote => routeWithValidQuote.gasEstimate)
    .reduce(
      (sum, routeWithValidQuote) => sum.plus(routeWithValidQuote),
      BigNumber(0),
    );

  if (!usdGasTokensByChain[chainId] || !usdGasTokensByChain[chainId]![0]) {
    // Each route can use a different stablecoin to account its gas costs.
    // They should all be pegged, and this is just an estimate, so we do a merge
    // to an arbitrary stable.
    throw new Error(
      `Could not find a USD token for computing gas costs on ${chainId}`,
    );
  }
  const usdToken = usdGasTokensByChain[chainId]![0]!;
  const usdTokenDecimals = usdToken.decimals;

  // For each gas estimate, normalize decimals to that of the chosen usd token.
  const estimatedGasUsedUSDs = _(bestSwap)
    .map(routeWithValidQuote => {
      // TODO: will error if gasToken has decimals greater than usdToken
      const decimalsDiff =
        usdTokenDecimals - routeWithValidQuote.gasCostInUSD.currency.decimals;

      if (decimalsDiff == 0) {
        return CurrencyAmount.fromRawAmount(
          usdToken,
          routeWithValidQuote.gasCostInUSD.quotient,
        );
      }

      return CurrencyAmount.fromRawAmount(
        usdToken,
        JSBI.multiply(
          routeWithValidQuote.gasCostInUSD.quotient,
          JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimalsDiff)),
        ),
      );
    })
    .value();

  let estimatedGasUsedUSD = sumFn(estimatedGasUsedUSDs);

  const estimatedGasUsedQuoteToken = sumFn(
    _.map(bestSwap, routeWithValidQuote => routeWithValidQuote.gasCostInToken),
  );

  let estimatedGasUsedGasToken: CurrencyAmount | undefined;
  if (routingConfig.gasToken) {
    // sum the gas costs in the gas token across all routes
    // if there is a route with undefined gasCostInGasToken, throw an error
    if (
      bestSwap.some(
        routeWithValidQuote =>
          routeWithValidQuote.gasCostInGasToken === undefined,
      )
    ) {
      throw new Error("Can't compute estimatedGasUsedGasToken");
    }
    estimatedGasUsedGasToken = sumFn(
      _.map(
        bestSwap,
        // ok to type cast here because we throw above if any are not defined
        routeWithValidQuote =>
          routeWithValidQuote.gasCostInGasToken as CurrencyAmount,
      ),
    );
  }

  const quote = sumFn(
    _.map(bestSwap, routeWithValidQuote => routeWithValidQuote.quote),
  );

  const routeWithQuotes = bestSwap.sort((routeAmountA, routeAmountB) =>
    routeAmountB.amount.greaterThan(routeAmountA.amount) ? 1 : -1,
  );

  return {
    quote,
    quoteGasAdjusted,
    estimatedGasUsed,
    estimatedGasUsedUSD,
    estimatedGasUsedQuoteToken,
    estimatedGasUsedGasToken,
    routes: portionProvider.getRouteWithQuotePortionAdjusted(
      routeType,
      routeWithQuotes,
      swapConfig,
    ),
  };
}

// We do not allow pools to be re-used across split routes, as swapping through a pool changes the pools state.
// Given a list of used routes, this function finds the first route in the list of candidate routes that does not re-use an already used pool.
const findFirstRouteNotUsingUsedPools = (
  usedRoutes: RouteWithValidQuote[],
  candidateRouteQuotes: RouteWithValidQuote[],
  forceCrossProtocol: boolean,
): RouteWithValidQuote | null => {
  const poolAddressSet = new Set();
  const usedPoolAddresses = _(usedRoutes)
    .flatMap(r => r.poolAddresses)
    .value();

  for (const poolAddress of usedPoolAddresses) {
    poolAddressSet.add(poolAddress);
  }

  const protocolsSet = new Set();
  const usedProtocols = _(usedRoutes)
    .flatMap(r => r.protocol)
    .uniq()
    .value();

  for (const protocol of usedProtocols) {
    protocolsSet.add(protocol);
  }

  for (const routeQuote of candidateRouteQuotes) {
    const { poolAddresses, protocol } = routeQuote;

    if (poolAddresses.some(poolAddress => poolAddressSet.has(poolAddress))) {
      continue;
    }

    // This code is just for debugging. Allows us to force a cross-protocol split route by skipping
    // consideration of routes that come from the same protocol as a used route.
    const needToForce = forceCrossProtocol && protocolsSet.size == 1;
    if (needToForce && protocolsSet.has(protocol)) {
      continue;
    }

    return routeQuote;
  }

  return null;
};
