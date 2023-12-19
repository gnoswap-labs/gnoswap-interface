import BigNumber from "bignumber.js";
import { Queue } from "../common";
import { sum } from "../common/array.util";
import { SwapSimulator } from "../swap-simulator";
import {
  CandidatePoolsSelections,
  Pool,
} from "../swap-simulator/swap-simulator.types";
import { EstimatedRoute, Route, RouteWithQuote } from "./swap-router.types";
import { makeRouteKey } from "./utility/route.util";
import { MAX_UINT64 } from "../constants";

export const TOP_N = 10;
export const TOP_N_DIRECT_SWAPS = 2;
export const TOP_N_TOKEN_IN_OUT = 2;
export const TOP_N_SECOND_HOP = 1;
export const TOP_N_WITH_EACH_BASE_TOKEN = 3;
export const TOP_N_WITH_BASE_TOKEN = 3;

export class SwapRouter {
  private _pools: Pool[];

  constructor(pools: Pool[]) {
    this._pools = pools;
  }

  public get pools() {
    return this._pools;
  }

  public setPools(pools: Pool[]) {
    this._pools = pools;
  }

  public filteredCandidatePools(
    pools: Pool[],
    inputTokenPath: string,
    outputTokenPath: string,
  ): CandidatePoolsSelections {
    const availPools = pools.filter(pool => pool.liquidity > 0);
    const topN = 10;

    const topByBaseWithTokenIn = availPools
      .filter(
        p => p.tokenAPath === inputTokenPath || p.tokenBPath === inputTokenPath,
      )
      .sort((p1, p2) => {
        const priceOfP1 =
          p1.tokenAPath === inputTokenPath ? p1.price : 1 / p1.price;
        const priceOfP2 =
          p2.tokenAPath === inputTokenPath ? p2.price : 1 / p2.price;
        return priceOfP2 - priceOfP1;
      })
      .filter((_, index) => index < TOP_N_WITH_EACH_BASE_TOKEN);

    const topByBaseWithTokenOut = availPools
      .filter(
        p =>
          p.tokenAPath === outputTokenPath || p.tokenBPath === outputTokenPath,
      )
      .sort((p1, p2) => {
        const priceOfP1 =
          p1.tokenAPath === outputTokenPath ? 1 / p1.price : p1.price;
        const priceOfP2 =
          p2.tokenAPath === outputTokenPath ? 1 / p2.price : p2.price;
        return priceOfP2 - priceOfP1;
      })
      .filter((_, index) => index < TOP_N_WITH_EACH_BASE_TOKEN);

    const topByDirectSwapPool = availPools
      .filter(
        p =>
          [inputTokenPath, outputTokenPath].includes(p.tokenAPath) ||
          [inputTokenPath, outputTokenPath].includes(p.tokenBPath),
      )
      .filter((_, index) => index < TOP_N_DIRECT_SWAPS);

    const topByTVL = availPools
      .sort((p1, p2) => Number(p2.liquidity - p1.liquidity))
      .filter((_, index) => index < TOP_N);

    return {
      topByBaseWithTokenIn,
      topByBaseWithTokenOut,
      topByDirectSwapPool,
      topByTVL,
    };
  }

  public findCandidateRoutesBy(
    pools: Pool[],
    inputTokenPath: string,
    outputTokenPath: string,
    routeSize = 3,
  ): Route[] {
    function getPoolTokenPaths(pool: Pool) {
      return [pool.tokenAPath, pool.tokenBPath];
    }

    function getOtherTokenPath(pool: Pool, tokenPath: string) {
      return pool.tokenAPath === tokenPath ? pool.tokenBPath : pool.tokenAPath;
    }

    const routes: Route[] = [];

    const {
      topByBaseWithTokenIn,
      topByBaseWithTokenOut,
      topByDirectSwapPool,
      topByTVL,
    } = this.filteredCandidatePools(pools, inputTokenPath, outputTokenPath);

    const candidatePools = [
      ...topByBaseWithTokenIn,
      ...topByBaseWithTokenOut,
      ...topByDirectSwapPool,
      ...topByTVL,
    ];

    // Pool list of tokens
    const tokenPoolsMap = candidatePools.reduce<{ [key in string]: Pool[] }>(
      (result, current) => {
        const tokenAPath = current.tokenAPath;
        const tokenBPath = current.tokenBPath;
        if (Array.isArray(result[tokenAPath])) {
          result[tokenAPath].push(current);
        } else {
          result[tokenAPath] = [current];
        }
        if (Array.isArray(result[tokenBPath])) {
          result[tokenBPath].push(current);
        } else {
          result[tokenBPath] = [current];
        }
        return result;
      },
      {},
    );

    // Queue for BFS search
    const routeQueue = new Queue<{
      lastTokenPath: string;
      route: Route;
    }>();

    // Initialize queue
    const initialPools = tokenPoolsMap[inputTokenPath];
    initialPools.forEach(pool =>
      routeQueue.enqueue({
        lastTokenPath: getOtherTokenPath(pool, inputTokenPath),
        route: { pools: [pool] },
      }),
    );

    // Exit the loop when the queue is empty
    while (routeQueue.arr.length !== 0) {
      const queueItems = routeQueue.arr;

      for (let index = 0; index < queueItems.length; index++) {
        const current = routeQueue.dequeue();
        if (
          !current ||
          current.route.pools.length === 0 ||
          current.route.pools.length > routeSize
        ) {
          continue;
        }

        // Adding route when it's the output token
        if (current.lastTokenPath === outputTokenPath) {
          routes.push({ pools: current.route.pools });
          continue;
        }

        // Token paths in route
        const tokenPathsOfRoute = current.route.pools
          .flatMap(getPoolTokenPaths)
          .filter(path => current.lastTokenPath !== path);
        const nextPools = tokenPoolsMap[current.lastTokenPath].filter(
          ({ tokenAPath, tokenBPath }) =>
            !tokenPathsOfRoute.includes(tokenAPath) &&
            !tokenPathsOfRoute.includes(tokenBPath),
        );

        // Add a queue item
        for (const nextPool of nextPools) {
          const nextLastTokenPath = getOtherTokenPath(
            nextPool,
            current.lastTokenPath,
          );
          const nextPools = [...current.route.pools, nextPool];

          routeQueue.enqueue({
            lastTokenPath: nextLastTokenPath,
            route: { pools: nextPools },
          });
        }
      }
    }

    function getResultPriceRate(pools: Pool[]) {
      let input = inputTokenPath;
      let price = 1;
      pools.forEach(pool => {
        const ordered = pool.tokenAPath === input;
        price *= ordered ? pool.price : 1 / pool.price;
        input = ordered ? pool.tokenBPath : pool.tokenAPath;
      });
      return price;
    }

    function getResultMinLiquidity(pools: Pool[]) {
      let minLiquidity: bigint = MAX_UINT64;
      pools.forEach(pool => {
        if (pool.liquidity < minLiquidity) {
          minLiquidity = pool.liquidity;
        }
      });
      return minLiquidity;
    }

    const sortedRoutes = routes
      .filter(route => getResultMinLiquidity(route.pools) > 0)
      .sort((route1, route2) => {
        const route1Rate = getResultPriceRate(route1.pools);
        const route2Rate = getResultPriceRate(route2.pools);
        const route1Liuquidity = getResultMinLiquidity(route1.pools);
        const route2Liquidity = getResultMinLiquidity(route2.pools);

        if (route1Liuquidity < route2Liquidity) {
          if (route1Rate < route2Rate) {
            return 1;
          }
          if (route2.pools.length < route1.pools.length) {
            return 1;
          }
          return 0;
        }
        return -1;
      });

    const poolPathSet = new Set<string>([]);
    const uniqueSortedRoutes = sortedRoutes.filter(route1 => {
      const exists =
        route1.pools.findIndex(pool => poolPathSet.has(pool.poolPath)) > -1;
      route1.pools.forEach(pool => poolPathSet.add(pool.poolPath));
      return !exists;
    });
    return uniqueSortedRoutes;
  }

  public estimateSwapRoute = (
    inputTokenPath: string,
    outputTokenPath: string,
    amount: bigint,
    exactType: "EXACT_IN" | "EXACT_OUT",
    distributionRatio: number = 5,
    hopSize: number = 7,
  ): EstimatedRoute[] => {
    if (100 % distributionRatio !== 0) {
      throw new Error("Not divided distributionRatio");
    }
    const routes = this.findCandidateRoutesBy(
      this.pools,
      inputTokenPath,
      outputTokenPath,
    );
    const filteredRoutes = routes.filter((_, index) => index < hopSize);

    const simulator = new SwapSimulator();

    /**
     * Store the results of the swap route by input token amount.
     */
    const routeWithQuotes: { [key in string]: RouteWithQuote[] } = {};
    for (const route of filteredRoutes) {
      const routeKey = makeRouteKey(route);
      for (let ratio = 100; ratio >= 0; ratio -= distributionRatio) {
        try {
          let currentInputTokenPath = inputTokenPath;
          let currentAmount = BigInt(
            BigNumber(amount.toString())
              .multipliedBy(ratio / 100.0)
              .toFixed(0),
          );
          const amountIn = currentAmount;
          for (const pool of route.pools) {
            const { tokenAPath, tokenBPath } = pool;
            const zeroForOne = currentInputTokenPath === tokenAPath;
            const { amountA, amountB } = simulator.swap(
              pool,
              currentInputTokenPath,
              currentAmount,
              exactType,
            );
            currentInputTokenPath = zeroForOne ? tokenBPath : tokenAPath;
            const changedAmountA = zeroForOne ? amountA : amountB;
            const changedAmountB = zeroForOne ? amountB : amountA;
            if (exactType === "EXACT_IN") {
              currentAmount =
                changedAmountB >= 0 ? changedAmountB : changedAmountB * -1n;
            } else {
              currentAmount =
                changedAmountA >= 0 ? changedAmountA : changedAmountA * -1n;
            }
          }
          const amountRatio =
            exactType === "EXACT_IN"
              ? Number(currentAmount) / Number(amountIn)
              : Number(amountIn) / Number(currentAmount);
          if (!routeWithQuotes[routeKey]) {
            routeWithQuotes[routeKey] = [];
          }
          routeWithQuotes[routeKey].push({
            routeKey,
            route,
            amountIn,
            amountOut: currentAmount,
            quote: ratio,
            amountRatio,
          });
        } catch {}
      }
    }

    type QuoteMap = {
      [key in string]: {
        quote: number;
        amountOut: bigint;
      };
    };
    const quoteMap = Object.keys(routeWithQuotes).reduce<QuoteMap>(
      (accum, key) => {
        const item = routeWithQuotes[key].find((_, index) => index === 0);
        if (item) {
          accum[key] = {
            quote: item.quote,
            amountOut: item.amountOut,
          };
        }
        return accum;
      },
      {},
    );

    /**
     * From the sum of the maximum percentages for each path,
     * find the maximum sum of 100% while sequentially reducing the percentages.
     */
    let quoteSum = sum(Object.values(quoteMap).map(({ quote }) => quote));
    while (quoteSum > 100) {
      let decreaseTargetKey: string | null = null;
      let sumAmount: bigint | null = null;

      for (const routeKey of Object.keys(quoteMap)) {
        if (quoteMap[routeKey].quote <= 0) {
          continue;
        }
        const nextRoute = routeWithQuotes[routeKey].find(
          route => route.quote === quoteMap[routeKey].quote - distributionRatio,
        );
        if (!nextRoute) {
          continue;
        }

        const currentSumOfAmmountOut = Object.entries(quoteMap).reduce(
          (accum, [key, value]) => {
            return key === routeKey
              ? accum + nextRoute.amountOut
              : accum + value.amountOut;
          },
          0n,
        );
        if (sumAmount === null) {
          decreaseTargetKey = nextRoute.routeKey;
          sumAmount = currentSumOfAmmountOut;
        } else {
          if (exactType === "EXACT_IN" && sumAmount < currentSumOfAmmountOut) {
            decreaseTargetKey = nextRoute.routeKey;
            sumAmount = currentSumOfAmmountOut;
          }
          if (exactType === "EXACT_OUT" && sumAmount > currentSumOfAmmountOut) {
            decreaseTargetKey = nextRoute.routeKey;
            sumAmount = currentSumOfAmmountOut;
          }
        }
      }

      if (decreaseTargetKey && quoteMap[decreaseTargetKey]) {
        const changedQuote =
          quoteMap[decreaseTargetKey].quote - distributionRatio;
        const amountOut = routeWithQuotes[decreaseTargetKey].find(
          route =>
            route.routeKey === decreaseTargetKey &&
            route.quote === changedQuote,
        )?.amountOut;
        quoteMap[decreaseTargetKey] = {
          quote: changedQuote > 0 ? changedQuote : 0,
          amountOut: amountOut ?? 0n,
        };
      }
      quoteSum = sum(Object.values(quoteMap).map(({ quote }) => quote));
    }

    /**
     * Process the result of the calculated swap path.
     */
    const estimatedRoutes: EstimatedRoute[] = [];
    Object.entries(quoteMap)
      .filter(([, value]) => value.quote > 0)
      .forEach(([routeKey, value]) => {
        const route = routeWithQuotes[routeKey].find(
          route => route.quote === value.quote,
        );
        if (route) {
          estimatedRoutes.push({
            routeKey: route.routeKey,
            pools: route.route.pools,
            quote: route.quote,
            amountIn: route.amountIn,
            amountOut: route.amountOut,
          });
        }
      });

    return estimatedRoutes.sort(
      (route1, route2) => route2.quote - route1.quote,
    );
  };
}
