import BigNumber from "bignumber.js";

import { EstimatedRoute } from "@models/swap/swap-route-info";

export function makeRoutesQuery(routes: EstimatedRoute[], fromPath: string) {
  const POOL_DIVIDER = "*POOL*";
  return routes
    .map(route => {
      let currentFromPath = fromPath;
      return route.pools
        .map(pool => {
          const { tokenA, tokenB, fee } = pool;
          const ordered = currentFromPath === tokenA;
          const inputTokenPath = ordered ? tokenA : tokenB;
          const outputTokenPath = ordered ? tokenB : tokenA;
          currentFromPath = outputTokenPath;
          return `${inputTokenPath}:${outputTokenPath}:${fee}`;
        })
        .join(POOL_DIVIDER);
    })
    .join(",");
}

export const calculateTotalAmountOut = (routes: EstimatedRoute[]): number => {
  return routes
    .reduce((acc, route) => {
      return acc.plus(new BigNumber(route.amountOut.toString()));
    }, new BigNumber(0))
    .toNumber();
};
