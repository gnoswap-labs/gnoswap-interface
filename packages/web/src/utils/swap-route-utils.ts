import { EstimatedRoute } from "@gnoswap-labs/swap-router";

export function makeRoutesQuery(routes: EstimatedRoute[]) {
  const POOL_DIVIDER = "*POOL*";
  return routes
    .map(route => route.pools.map(pool => pool.poolPath).join(POOL_DIVIDER))
    .join(",");
}
