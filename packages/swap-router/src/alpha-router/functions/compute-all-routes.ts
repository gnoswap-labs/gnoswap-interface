import { Token } from "../core";
import { V3Route } from "../router";
import { Pair, Pool } from "../v3-sdk";

export function computeAllV3Routes(
  tokenIn: Token,
  tokenOut: Token,
  pools: Pool[],
  maxHops: number,
): V3Route[] {
  return computeAllRoutes<Pool, V3Route>(
    tokenIn,
    tokenOut,
    (route: Pool[], tokenIn: Token, tokenOut: Token) => {
      return new V3Route(route, tokenIn, tokenOut);
    },
    pools,
    maxHops,
  );
}

export function computeAllRoutes<
  TPool extends Pair | Pool,
  TRoute extends V3Route
>(
  tokenIn: Token,
  tokenOut: Token,
  buildRoute: (route: TPool[], tokenIn: Token, tokenOut: Token) => TRoute,
  pools: TPool[],
  maxHops: number,
): TRoute[] {
  const poolsUsed = Array<boolean>(pools.length).fill(false);
  const routes: TRoute[] = [];

  const computeRoutes = (
    tokenIn: Token,
    tokenOut: Token,
    currentRoute: TPool[],
    poolsUsed: boolean[],
    tokensVisited: Set<string>,
    _previousTokenOut?: Token,
  ) => {
    if (currentRoute.length > maxHops) {
      return;
    }

    if (
      currentRoute.length > 0 &&
      currentRoute[currentRoute.length - 1]!.involvesToken(tokenOut)
    ) {
      routes.push(buildRoute([...currentRoute], tokenIn, tokenOut));
      return;
    }

    for (let i = 0; i < pools.length; i++) {
      if (poolsUsed[i]) {
        continue;
      }

      const curPool = pools[i]!;
      const previousTokenOut = _previousTokenOut ? _previousTokenOut : tokenIn;

      if (!curPool.involvesToken(previousTokenOut)) {
        continue;
      }

      const currentTokenOut = curPool.token0.equals(previousTokenOut)
        ? curPool.token1
        : curPool.token0;

      if (tokensVisited.has(currentTokenOut.address.toLowerCase())) {
        continue;
      }

      tokensVisited.add(currentTokenOut.address.toLowerCase());
      currentRoute.push(curPool);
      poolsUsed[i] = true;
      computeRoutes(
        tokenIn,
        tokenOut,
        currentRoute,
        poolsUsed,
        tokensVisited,
        currentTokenOut,
      );
      poolsUsed[i] = false;
      currentRoute.pop();
      tokensVisited.delete(currentTokenOut.address.toLowerCase());
    }
  };

  computeRoutes(
    tokenIn,
    tokenOut,
    [],
    poolsUsed,
    new Set([tokenIn.address.toLowerCase()]),
  );
  return routes;
}
