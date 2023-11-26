import BigNumber from "bignumber.js";
import { Queue } from "../common";
import { SwapSimulator } from "../swap-simulator";
import { Pool } from "../swap-simulator/swap-simulator.types";
import { EstimatedRoute, Route } from "./swap-router.types";
import { makeRouteKey } from "./utility/route.util";

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

  public findCandidateRoutesBy(
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

    // Pool list of tokens
    const tokenPoolsMap = this.pools.reduce<{ [key in string]: Pool[] }>(
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
    return routes;
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
    const routes = this.findCandidateRoutesBy(inputTokenPath, outputTokenPath);

    const filteredRoutes = routes
      .sort((route1, route2) => {
        if (route2.pools[0].sqrtPriceX96 - route1.pools[0].sqrtPriceX96 > 0) {
          if (route2.pools[0].liquidity - route1.pools[0].liquidity > 0) {
            return 1;
          }
          return -1;
        }
        return -1;
      })
      .filter((_, index) => index < hopSize);

    const simulator = new SwapSimulator();
    const routeMap = filteredRoutes.reduce<
      {
        [key in string]: {
          routeId: string;
          route: Route;
          amountIn: bigint;
          amountOut: bigint;
          quote: number;
        }[];
      }
    >((routeMap, route) => {
      const routeId = makeRouteKey(route);
      for (
        let ratio = distributionRatio;
        ratio <= 100;
        ratio += distributionRatio
      ) {
        let currentInputTokenPath = inputTokenPath;
        let currentOutputTokenPath = outputTokenPath;
        let currentAmount = BigInt(
          BigNumber(amount.toString()).multipliedBy(ratio).toFixed(0),
        );
        const amountIn = currentAmount;
        for (const pool of route.pools) {
          const { tokenAPath, tokenBPath } = pool;
          const zeroForOne = currentInputTokenPath === tokenAPath;
          currentOutputTokenPath = zeroForOne ? tokenAPath : tokenBPath;
          const { amountB } = simulator.swap(
            pool,
            currentAmount,
            exactType,
            zeroForOne,
          );
          currentInputTokenPath = currentOutputTokenPath;
          currentAmount = amountB;
        }
        if (!routeMap[routeId]) {
          routeMap[routeId] = [];
        }
        routeMap[routeId].push({
          routeId,
          route,
          amountIn,
          amountOut: currentAmount,
          quote: ratio,
        });
      }
      return routeMap;
    }, {});

    let currentQuote = 0;
    const estimatedRoutes: EstimatedRoute[] = [];
    for (let i = 0; i < filteredRoutes.length; i++) {
      const routeKey = makeRouteKey(filteredRoutes[i]);
      const routeQuotes = routeMap[routeKey].sort(
        (r1, r2) => r1.quote - r2.quote,
      );
      for (let j = i; j < filteredRoutes.length; j++) {
        let quote = 0;
        const nextRouteKey = makeRouteKey(filteredRoutes[j]);
        const limitRouteQuote = routeMap[nextRouteKey]
          .sort((r1, r2) => r2.quote - r1.quote)
          .find(next => {
            return routeQuotes.find(current => {
              if (current.quote > next.quote) {
                quote = current.quote;
                return false;
              }
              return true;
            });
          });
        currentQuote += quote;
        const currentRouteQuote = routeMap[routeKey].find(
          route => route.quote === quote,
        );
        if (currentRouteQuote && limitRouteQuote) {
          if (currentRouteQuote.quote >= currentQuote)
            estimatedRoutes.push({
              pools: currentRouteQuote.route.pools,
              amountIn: currentRouteQuote.amountIn,
              amountOut: currentRouteQuote.amountOut,
              quote:
                currentRouteQuote.quote >= currentQuote
                  ? currentQuote
                  : currentRouteQuote.quote,
            });
          break;
        }
      }

      if (i === filteredRoutes.length && currentQuote > 0) {
        const currentRouteQuote = routeMap[routeKey].find(
          route => route.quote === currentQuote,
        );
        if (currentRouteQuote) {
          estimatedRoutes.push({
            pools: currentRouteQuote.route.pools,
            amountIn: currentRouteQuote.amountIn,
            amountOut: currentRouteQuote.amountOut,
            quote: currentQuote,
          });
        }
      }
    }
    return estimatedRoutes;
  };
}
