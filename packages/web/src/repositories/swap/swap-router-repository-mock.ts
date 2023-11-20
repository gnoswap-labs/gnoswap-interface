import { SwapRouterRepository } from "./swap-router-repository";
import { EstimateRouteQuotesResponse } from "./response/estimate-route-quotes-response";
import { PoolModel } from "@models/pool/pool-model";
import { TokenModel } from "@models/token/token-model";
import { RouteModel } from "@models/swap/route-model";
import { Queue } from "@utils/common";

export class SwapRouterRepositoryMock implements SwapRouterRepository {
  public findAllRoutesBy = (
    inputToken: TokenModel,
    outputToken: TokenModel,
    pools: PoolModel[],
    routeSize = 3,
  ) => {
    function getPoolTokenPaths(pool: PoolModel) {
      return [pool.tokenA.path, pool.tokenB.path];
    }

    function getOtherToken(pool: PoolModel, tokenPath: string) {
      return pool.tokenA.path === tokenPath ? pool.tokenB : pool.tokenA;
    }

    const routes: RouteModel[] = [];
    const inputTokenPath = inputToken.path;
    const outputTokenPath = outputToken.path;

    // Pool list of tokens
    const tokenPoolsMap = pools.reduce<{ [key in string]: PoolModel[] }>(
      (result, current) => {
        const tokenAPath = current.tokenA.path;
        const tokenBPath = current.tokenB.path;
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
      lastToken: TokenModel;
      route: RouteModel;
    }>();

    // Initialize queue
    const initialPools = tokenPoolsMap[inputTokenPath];
    initialPools.forEach(pool =>
      routeQueue.enqueue({
        lastToken: getOtherToken(pool, inputTokenPath),
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
        if (current.lastToken.path === outputTokenPath) {
          routes.push({ pools: current.route.pools });
          continue;
        }

        // Token paths in route
        const tokenPathsOfRoute = current.route.pools
          .flatMap(getPoolTokenPaths)
          .filter(path => current.lastToken.path !== path);
        const nextPools = tokenPoolsMap[current.lastToken.path].filter(
          ({ tokenA, tokenB }) =>
            !tokenPathsOfRoute.includes(tokenA.path) &&
            !tokenPathsOfRoute.includes(tokenB.path),
        );

        // Add a queue item
        for (const nextPool of nextPools) {
          const nextLastToken = getOtherToken(nextPool, current.lastToken.path);
          const nextPools = [...current.route.pools, nextPool];

          routeQueue.enqueue({
            lastToken: nextLastToken,
            route: { pools: nextPools },
          });
        }
      }
    }
    return routes;
  };

  public estimateRouteQuotes = async (): Promise<
    EstimateRouteQuotesResponse
  > => {
    return { estimatedRoutes: [] };
  };
}
